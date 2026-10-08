import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { query } from '../db/connection';
import { generateId } from '../utils/helpers';
import {
  RenderedEmail,
  applicationReceivedEmail,
  approvalEmail,
  rejectionEmail,
  documentRequestEmail,
  partnerActivatedEmail,
} from './emailTemplates';

dotenv.config();

interface MissingDoc {
  label: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  /** Set when the message was written to disk instead of being sent over SMTP. */
  previewPath?: string;
}

type EmailType = 'APPLICATION_RECEIVED' | 'APPROVAL' | 'REJECTION' | 'DOCUMENT_REQUEST' | 'ACTIVATED';

// ─── Delivery mode ─────────────────────────────────────────────────────────────
//
// EMAIL_MODE=smtp     -> always send via SMTP (failures are reported as FAILED)
// EMAIL_MODE=preview  -> never touch the network; write an .html/.txt preview to disk
// (unset)             -> "auto": SMTP when credentials look real, otherwise preview.
//                         In non-production, an SMTP failure also falls back to preview
//                         so local development and tests never break on email.

const PLACEHOLDER_PASSWORDS = new Set(['', 'dev_password', 'changeme', 'your_password', 'your_app_password', 'your_smtp_password']);

function smtpConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER) return false;
  return !PLACEHOLDER_PASSWORDS.has((SMTP_PASS || '').trim().toLowerCase());
}

export function getEmailMode(): 'smtp' | 'preview' {
  const forced = (process.env.EMAIL_MODE || '').toLowerCase();
  if (forced === 'smtp' || forced === 'preview') return forced;
  return smtpConfigured() ? 'smtp' : 'preview';
}

let transporter: Transporter | undefined;
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

function previewDir(): string {
  return path.resolve(process.env.EMAIL_PREVIEW_DIR || path.join(process.cwd(), 'email-previews'));
}

async function writePreview(emailType: EmailType, to: string, mail: RenderedEmail): Promise<string> {
  const dir = previewDir();
  await fs.promises.mkdir(dir, { recursive: true });
  const safeTo = to.replace(/[^a-zA-Z0-9@._-]/g, '_');
  const base = `${new Date().toISOString().replace(/[:.]/g, '-')}_${emailType}_${safeTo}`;
  const htmlPath = path.join(dir, `${base}.html`);
  await fs.promises.writeFile(htmlPath, mail.html, 'utf8');
  await fs.promises.writeFile(path.join(dir, `${base}.txt`), `To: ${to}\nSubject: ${mail.subject}\n\n${mail.text}\n`, 'utf8');
  return htmlPath;
}

// ─── Core send + audit log ─────────────────────────────────────────────────────

async function sendAndLog(params: {
  applicationId: string;
  to: string;
  mail: RenderedEmail;
  emailType: EmailType;
}): Promise<EmailResult> {
  const { applicationId, to, mail, emailType } = params;

  let status: 'SENT' | 'FAILED' | 'QUEUED' = 'SENT';
  let errorMessage: string | undefined;
  let previewPath: string | undefined;

  const sendViaPreview = async (note: string) => {
    previewPath = await writePreview(emailType, to, mail);
    status = 'QUEUED'; // not actually delivered
    errorMessage = `${note} Preview: ${previewPath}`;
    logger.info(`[email:preview] ${emailType} → ${to} | "${mail.subject}" | ${previewPath}`);
  };

  try {
    if (getEmailMode() === 'preview') {
      await sendViaPreview('Preview mode (SMTP not configured); email not delivered.');
    } else {
      try {
        await getTransporter().sendMail({
          from: process.env.EMAIL_FROM || 'Aashray Infotech <no-reply@aashrayinfotech.com>',
          to,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
        logger.info(`Email sent: ${emailType} → ${to}`);
      } catch (smtpErr) {
        if (process.env.NODE_ENV === 'production' || process.env.EMAIL_MODE === 'smtp') throw smtpErr;
        logger.warn(`SMTP failed in development (${(smtpErr as Error).message}); falling back to preview.`);
        await sendViaPreview(`SMTP failed (${(smtpErr as Error).message}); email not delivered.`);
      }
    }
  } catch (err) {
    status = 'FAILED';
    errorMessage = (err as Error).message;
    logger.error(`Email failed: ${emailType} → ${to}`, err);
  }

  // Audit trail — must never break the caller
  try {
    await query(
      `INSERT INTO email_logs (id, application_id, email_type, recipient, subject, status, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [generateId(), applicationId, emailType, to, mail.subject, status, errorMessage ? errorMessage.slice(0, 2000) : null]
    );
  } catch (logErr) {
    logger.error('Failed to write email log:', logErr);
  }

  // QUEUED (preview) counts as success for callers: the workflow must continue.
  return { success: status !== 'FAILED', error: status === 'FAILED' ? errorMessage : undefined, previewPath };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function sendApplicationReceivedEmail(p: {
  applicationId: string;
  companyName: string;
  email: string;
  credentials?: { loginEmail: string; password: string } | null;
}): Promise<EmailResult> {
  return sendAndLog({
    applicationId: p.applicationId,
    to: p.email,
    mail: applicationReceivedEmail(p),
    emailType: 'APPLICATION_RECEIVED',
  });
}

export function sendApprovalEmail(p: {
  applicationId: string;
  companyName: string;
  email: string;
  onboardingToken: string;
  missingDocs: MissingDoc[];
}): Promise<EmailResult> {
  return sendAndLog({ applicationId: p.applicationId, to: p.email, mail: approvalEmail(p), emailType: 'APPROVAL' });
}

export function sendRejectionEmail(p: {
  applicationId: string;
  companyName: string;
  email: string;
  reason?: string;
}): Promise<EmailResult> {
  return sendAndLog({ applicationId: p.applicationId, to: p.email, mail: rejectionEmail(p), emailType: 'REJECTION' });
}

export function sendDocumentRequestEmail(p: {
  applicationId: string;
  companyName: string;
  email: string;
  onboardingToken: string;
  missingDocs: MissingDoc[];
}): Promise<EmailResult> {
  return sendAndLog({
    applicationId: p.applicationId,
    to: p.email,
    mail: documentRequestEmail(p),
    emailType: 'DOCUMENT_REQUEST',
  });
}

export function sendPartnerActivatedEmail(p: {
  applicationId: string;
  companyName: string;
  email: string;
  partnerCode?: string | null;
}): Promise<EmailResult> {
  return sendAndLog({ applicationId: p.applicationId, to: p.email, mail: partnerActivatedEmail(p), emailType: 'ACTIVATED' });
}

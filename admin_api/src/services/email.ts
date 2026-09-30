import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { query } from '../db/connection';
import { generateId } from '../utils/helpers';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MissingDoc {
  label: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

// ─── Email Templates ───────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aashray Partner Portal</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0B2B55;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;">Aashray Infotech</p>
            <p style="margin:4px 0 0;font-size:13px;color:#aac4e8;">Partner Portal</p>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:36px 32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fc;padding:20px 32px;border-top:1px solid #e8ecf4;">
            <p style="margin:0;font-size:12px;color:#8c9cb8;">This is an automated message from Aashray Infotech Private Limited. Please do not reply to this email.</p>
            <p style="margin:8px 0 0;font-size:12px;color:#8c9cb8;">© ${new Date().getFullYear()} Aashray Infotech Private Limited. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#0B2B55;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;font-size:15px;margin:20px 0;">${text}</a>`;
}

// ─── Approval Email ────────────────────────────────────────────────────────────

export async function sendApprovalEmail(params: {
  applicationId: string;
  companyName: string;
  email: string;
  onboardingToken: string;
  missingDocs: MissingDoc[];
}): Promise<EmailResult> {
  const { applicationId, companyName, email, onboardingToken, missingDocs } = params;
  const onboardingUrl = `${process.env.FRONTEND_URL}/onboarding/${onboardingToken}`;
  const agreementUrl = process.env.AGREEMENT_URL || '#';

  const missingDocsSection = missingDocs.length > 0
    ? `
      <div style="background:#fff8e6;border:1px solid #f5c842;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;font-weight:bold;color:#7a5800;font-size:15px;">📄 Document Verification Required</p>
        <p style="margin:0 0 12px;color:#7a5800;">During your application, the following documents were not provided:</p>
        <ul style="margin:0;padding-left:20px;color:#7a5800;">
          ${missingDocs.map(d => `<li style="margin:6px 0;">${d.label}</li>`).join('')}
        </ul>
        <p style="margin:12px 0 0;color:#7a5800;">You will be able to upload these through your secure onboarding portal.</p>
      </div>`
    : `
      <div style="background:#e8f5e9;border:1px solid #81c784;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="margin:0;color:#2e7d32;font-weight:bold;">✅ Document Verification</p>
        <p style="margin:8px 0 0;color:#2e7d32;">Your documents were submitted with your original application. No additional uploads are currently required.</p>
      </div>`;

  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:26px;color:#0B2B55;">Congratulations, ${companyName}!</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#4a5568;">Your application to become an official Aashray partner has been <strong style="color:#1a7f4b;">approved</strong>.</p>
    <hr style="border:none;border-top:1px solid #e8ecf4;margin:24px 0;" />
    <h2 style="margin:0 0 12px;font-size:18px;color:#0B2B55;">Step 1 — Partnership Agreement</h2>
    <p style="color:#4a5568;margin:0 0 12px;">Before completing your onboarding, please review our Partnership Agreement carefully.</p>
    <p style="margin:0;">${button('Begin Partner Onboarding', onboardingUrl)}</p>
    ${missingDocsSection}
    <hr style="border:none;border-top:1px solid #e8ecf4;margin:24px 0;" />
    <p style="font-size:13px;color:#8c9cb8;">This onboarding link is valid for <strong>${process.env.ONBOARDING_TOKEN_EXPIRES_HOURS || 72} hours</strong>. If it expires, please contact us.</p>
    <p style="font-size:13px;color:#8c9cb8;">Your Application ID: <strong>${applicationId}</strong></p>
  `);

  return sendAndLog({
    applicationId,
    to: email,
    subject: `Your Aashray Partner Application Has Been Approved — ${companyName}`,
    html,
    emailType: 'APPROVAL',
  });
}

// ─── Rejection Email ───────────────────────────────────────────────────────────

export async function sendRejectionEmail(params: {
  applicationId: string;
  companyName: string;
  email: string;
  reason?: string;
}): Promise<EmailResult> {
  const { applicationId, companyName, email, reason } = params;
  const reasonSection = reason
    ? `<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:20px;margin:20px 0;"><p style="margin:0;color:#991b1b;font-weight:bold;">Reason</p><p style="margin:8px 0 0;color:#991b1b;">${reason}</p></div>`
    : '';

  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#0B2B55;">Application Decision — ${companyName}</h1>
    <p style="color:#4a5568;">After reviewing your partner application, we regret to inform you that we are unable to proceed at this time.</p>
    ${reasonSection}
    <p style="color:#4a5568;">If you have questions or believe this was made in error, please contact us at <a href="mailto:partners@aashrayinfotech.com" style="color:#0B2B55;">partners@aashrayinfotech.com</a>.</p>
    <p style="font-size:13px;color:#8c9cb8;">Application ID: <strong>${applicationId}</strong></p>
  `);

  return sendAndLog({
    applicationId,
    to: email,
    subject: `Update on Your Aashray Partner Application — ${companyName}`,
    html,
    emailType: 'REJECTION',
  });
}

// ─── Document Request Email ────────────────────────────────────────────────────

export async function sendDocumentRequestEmail(params: {
  applicationId: string;
  companyName: string;
  email: string;
  onboardingToken: string;
  missingDocs: MissingDoc[];
}): Promise<EmailResult> {
  const { applicationId, companyName, email, onboardingToken, missingDocs } = params;
  const onboardingUrl = `${process.env.FRONTEND_URL}/onboarding/${onboardingToken}`;

  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;color:#0B2B55;">Documents Required — ${companyName}</h1>
    <p style="color:#4a5568;">To proceed with your partner onboarding, the following documents are required:</p>
    <div style="background:#fff8e6;border:1px solid #f5c842;border-radius:8px;padding:20px;margin:20px 0;">
      <ul style="margin:0;padding-left:20px;color:#7a5800;">
        ${missingDocs.map(d => `<li style="margin:6px 0;">${d.label}</li>`).join('')}
      </ul>
    </div>
    <p style="margin:0;">${button('Upload Documents', onboardingUrl)}</p>
    <p style="font-size:13px;color:#8c9cb8;margin-top:24px;">Application ID: <strong>${applicationId}</strong></p>
  `);

  return sendAndLog({
    applicationId,
    to: email,
    subject: `Action Required: Documents Needed — Aashray Partner Portal`,
    html,
    emailType: 'DOCUMENT_REQUEST',
  });
}

// ─── Partner Activated Email ───────────────────────────────────────────────────

export async function sendPartnerActivatedEmail(params: {
  applicationId: string;
  companyName: string;
  email: string;
}): Promise<EmailResult> {
  const { applicationId, companyName, email } = params;

  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:26px;color:#0B2B55;">Welcome to the Aashray Partner Network!</h1>
    <div style="background:#e8f5e9;border:1px solid #81c784;border-radius:8px;padding:20px;margin:20px 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:#1a7f4b;">🎉 ${companyName} is now an active Aashray partner.</p>
    </div>
    <p style="color:#4a5568;">All your documents have been verified and your partner account is fully active. Our team will be in touch shortly with further details about the partnership programme.</p>
    <p style="color:#4a5568;">For any queries, contact <a href="mailto:partners@aashrayinfotech.com" style="color:#0B2B55;">partners@aashrayinfotech.com</a>.</p>
    <p style="font-size:13px;color:#8c9cb8;">Partner ID: <strong>${applicationId}</strong></p>
  `);

  return sendAndLog({
    applicationId,
    to: email,
    subject: `Welcome to Aashray — You're Now an Official Partner!`,
    html,
    emailType: 'ACTIVATED',
  });
}

// ─── Internal send + log ───────────────────────────────────────────────────────

async function sendAndLog(params: {
  applicationId: string;
  to: string;
  subject: string;
  html: string;
  emailType: string;
}): Promise<EmailResult> {
  const { applicationId, to, subject, html, emailType } = params;

  let status: 'SENT' | 'FAILED' = 'SENT';
  let errorMessage: string | undefined;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Aashray Infotech <no-reply@aashrayinfotech.com>',
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${emailType} → ${to}`);
  } catch (err) {
    status = 'FAILED';
    errorMessage = (err as Error).message;
    logger.error(`Email failed: ${emailType} → ${to}`, err);
  }

  // Log to DB (non-blocking — don't fail if logging fails)
  try {
    await query(
      `INSERT INTO email_logs (id, application_id, email_type, recipient, subject, status, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [generateId(), applicationId, emailType, to, subject, status, errorMessage || null]
    );
  } catch (logErr) {
    logger.error('Failed to write email log:', logErr);
  }

  return { success: status === 'SENT', error: errorMessage };
}

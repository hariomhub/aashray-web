/**
 * email-live-test.ts — Sends the real "application received + credentials" email using the .env
 * SMTP config (forced EMAIL_MODE=smtp, so failures are NOT hidden by the preview fallback).
 * Usage: npx ts-node src/db/email-live-test.ts [recipient@example.com]
 */
import dotenv from 'dotenv';
dotenv.config();
process.env.EMAIL_MODE = 'smtp';

import nodemailer from 'nodemailer';
import { applicationReceivedEmail } from '../services/emailTemplates';

async function main() {
  const to = process.argv[2] || process.env.SMTP_USER!;
  console.log(`SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} as ${process.env.SMTP_USER} (password ${process.env.SMTP_PASS ? 'set' : 'MISSING'})`);

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });

  try {
    await t.verify();
    console.log('✅ SMTP login OK');
  } catch (e) {
    console.log(`❌ SMTP login FAILED: ${(e as Error).message}`);
    process.exit(1);
  }

  const mail = applicationReceivedEmail({
    applicationId: 'TEST-0001',
    companyName: 'Test Company',
    credentials: { loginEmail: to, password: 'Demo1234Pass!7' },
  });
  const info = await t.sendMail({ from: process.env.EMAIL_FROM, to, subject: mail.subject, html: mail.html, text: mail.text });
  console.log(`✅ Email sent to ${to} (messageId ${info.messageId})`);
}

main().catch((e) => { console.error('❌ Send failed:', e.message); process.exit(1); });

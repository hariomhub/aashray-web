/**
 * services-test.ts — Verifies the hybrid storage and email preview fallback.
 * Needs the MySQL database (email_logs) but no Azure and no SMTP.
 */
process.env.STORAGE_MODE = 'local';
process.env.EMAIL_MODE = 'preview';
process.env.LOCAL_UPLOAD_DIR = require('path').join(require('os').tmpdir(), `aashray-uploads-${Date.now()}`);
process.env.EMAIL_PREVIEW_DIR = require('path').join(require('os').tmpdir(), `aashray-previews-${Date.now()}`);
process.env.FRONTEND_URL = 'https://example.test';

import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './connection';
import {
  uploadDocument, getDocumentUrl, deleteDocument, getStorageMode,
  verifyLocalSignature, resolveLocalPath,
} from '../services/storage';
import {
  getEmailMode, sendApplicationReceivedEmail, sendApprovalEmail, sendRejectionEmail,
  sendDocumentRequestEmail, sendPartnerActivatedEmail,
} from '../services/email';
import { rejectionEmail } from '../services/emailTemplates';

let passed = 0;
let failed = 0;
async function check(label: string, fn: () => Promise<void> | void) {
  try { await fn(); console.log(`  ✅ ${label}`); passed++; }
  catch (e) { console.log(`  ❌ ${label}\n       ${(e as Error).message}`); failed++; }
}
const must = (cond: unknown, msg: string) => { if (!cond) throw new Error(msg); };

async function main() {
  console.log('\n── Hybrid storage (local mode) ──');
  const appId = uuidv4();
  let key = '';

  await check('mode resolves to local', () => must(getStorageMode() === 'local', getStorageMode()));
  await check('upload writes file to disk', async () => {
    key = await uploadDocument(appId, 'GST_CERTIFICATE', 'my cert (1).pdf', Buffer.from('%PDF-test'), 'application/pdf');
    must(fs.existsSync(resolveLocalPath(key)), 'file missing');
    must(!/[ ()]/.test(key), 'key not sanitised');
  });
  await check('signed URL is valid', async () => {
    const u = new URL(await getDocumentUrl(key));
    must(u.pathname === '/api/files/local', u.pathname);
    must(verifyLocalSignature(u.searchParams.get('key')!, Number(u.searchParams.get('exp')), u.searchParams.get('sig')!), 'sig invalid');
  });
  await check('tampered signature / expired link rejected', async () => {
    const u = new URL(await getDocumentUrl(key));
    const exp = Number(u.searchParams.get('exp'));
    const sig = u.searchParams.get('sig')!;
    must(!verifyLocalSignature(key, exp, sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0')), 'tampered sig accepted');
    must(!verifyLocalSignature(key, exp + 1, sig), 'changed expiry accepted');
    must(!verifyLocalSignature(key, Date.now() - 1000, sig), 'expired accepted');
  });
  await check('path traversal blocked', () => {
    let blocked = false;
    try { resolveLocalPath('../../etc/passwd'); } catch { blocked = true; }
    must(blocked, 'traversal not blocked');
  });
  await check('missing document errors', async () => {
    let threw = false;
    try { await getDocumentUrl(`${appId}/none/x.pdf`); } catch { threw = true; }
    must(threw, 'no error');
  });
  await check('delete removes file', async () => {
    await deleteDocument(key);
    must(!fs.existsSync(resolveLocalPath(key)), 'still exists');
  });

  console.log('\n── Email preview fallback ──');
  // email_logs has an FK to partner_applications, so use a real row
  await pool.execute(
    `INSERT INTO partner_applications (id, company_name, website, company_email, company_phone, year_established,
       head_office_city, state, company_type, employee_range) VALUES (?, 'Test <b>Co</b>', 'https://t.test', 't@t.test', '+91 9999999999', 2020, 'Pune', 'Maharashtra', 'LLP', '1-10')`,
    [appId]
  );
  const base = { applicationId: appId, companyName: 'Test <b>Co</b>', email: 'partner@t.test' };
  await check('mode resolves to preview', () => must(getEmailMode() === 'preview', getEmailMode()));

  const sends: [string, () => Promise<{ success: boolean; previewPath?: string }>][] = [
    ['application received', () => sendApplicationReceivedEmail(base)],
    ['approval (with missing docs)', () => sendApprovalEmail({ ...base, onboardingToken: 'tok123', missingDocs: [{ label: 'GST Certificate' }] })],
    ['rejection (with reason)', () => sendRejectionEmail({ ...base, reason: 'Missing <script>alert(1)</script> GST' })],
    ['document request', () => sendDocumentRequestEmail({ ...base, onboardingToken: 'tok123', missingDocs: [{ label: 'PAN Card' }] })],
    ['partner activated', () => sendPartnerActivatedEmail({ ...base, partnerCode: 'AASH-001' })],
  ];
  for (const [name, fn] of sends) {
    await check(`${name}: succeeds and writes preview`, async () => {
      const r = await fn();
      must(r.success, 'success=false');
      must(r.previewPath && fs.existsSync(r.previewPath), 'preview not written');
      const html = fs.readFileSync(r.previewPath!, 'utf8');
      must(html.includes('<html') && html.includes('viewport'), 'not full responsive HTML');
      must(!html.includes('Test <b>Co</b>'), 'company name not HTML-escaped');
    });
  }
  await check('approval link uses FRONTEND_URL + token', async () => {
    const r = await sendApprovalEmail({ ...base, onboardingToken: 'tok123', missingDocs: [] });
    must(fs.readFileSync(r.previewPath!, 'utf8').includes('https://example.test/onboarding/tok123'), 'link missing');
  });
  await check('rejection reason is escaped (no script injection)', () => {
    const { html } = rejectionEmail({ applicationId: 'x', companyName: 'A', reason: '<script>alert(1)</script>' });
    must(!html.includes('<script>alert'), 'script not escaped');
  });
  await check('email_logs rows written as QUEUED (preview)', async () => {
    const [rows] = (await pool.execute(`SELECT status FROM email_logs WHERE application_id = ?`, [appId])) as [{ status: string }[], unknown];
    must(rows.length >= 5, `only ${rows.length} rows`);
    must(rows.every((r) => r.status === 'QUEUED'), 'unexpected status');
  });

  await pool.execute('DELETE FROM partner_applications WHERE id = ?', [appId]);
  fs.rmSync(process.env.LOCAL_UPLOAD_DIR!, { recursive: true, force: true });
  fs.rmSync(process.env.EMAIL_PREVIEW_DIR!, { recursive: true, force: true });
  await pool.end();

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });

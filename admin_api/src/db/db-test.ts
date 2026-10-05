/**
 * db-test.ts — Comprehensive End-to-End Database Integration Test
 *
 * Tests the entire Partner Data lifecycle & relational database integrity:
 *   1. Schema verification: All 9 tables exist in MySQL
 *   2. Column verification: Specific data fields match requirements
 *   3. Admin user insertion & authentication record
 *   4. Partner application submission (all form fields from NiyamSaathi partner form)
 *   5. Multiple partner contacts (Primary Contact & Authorized Signatory)
 *   6. Verification document uploads (GST, PAN, Incorporation)
 *   7. Partner banking details for commission payouts & settlements
 *   8. Partner onboarding workflow state machine & agreement signing
 *   9. Admin application review & approval
 *  10. Document verification workflow
 *  11. Bank account verification
 *  12. Partner activation (partner code, tier, commission rate)
 *  13. Transactional email & administrative audit logging
 *  14. Comprehensive 6-table relational JOIN query (admin portal view)
 *  15. Foreign key cascade integrity & clean teardown
 */

import { pool } from './connection';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const PASS = '  ✅';
const FAIL = '  ❌';

let passed = 0;
let failed = 0;

async function assert(label: string, fn: () => Promise<void>) {
  try {
    await fn();
    logger.info(`${PASS} ${label}`);
    passed++;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`${FAIL} ${label}\n       ${msg}`);
    failed++;
  }
}

async function runTests() {
  logger.info('\n══════════════════════════════════════════════════════════');
  logger.info('   Aashray Partner Portal Database — Integration Tests   ');
  logger.info('══════════════════════════════════════════════════════════\n');

  const conn = await pool.getConnection();

  // ─── Test Identifiers ───────────────────────────────────────────────────────
  const adminId        = uuidv4();
  const appId          = uuidv4();
  const contact1Id     = uuidv4();
  const contact2Id     = uuidv4();
  const docGstId       = uuidv4();
  const docPanId       = uuidv4();
  const docRegId       = uuidv4();
  const bankId         = uuidv4();
  const onboardingId   = uuidv4();
  const partnerId      = uuidv4();
  const emailLog1Id    = uuidv4();
  const emailLog2Id    = uuidv4();
  const auditLog1Id    = uuidv4();
  const auditLog2Id    = uuidv4();
  const onboardToken   = `onb_tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const partnerCode    = `AASH-PTN-${Date.now().toString().slice(-4)}`;

  try {

    // ── 1. Schema: all 9 tables present ──────────────────────────────────────
    const expectedTables = [
      'users',
      'partner_applications',
      'partner_contacts',
      'partner_documents',
      'partner_banking',
      'partner_onboarding',
      'partners',
      'email_logs',
      'audit_logs',
    ];

    for (const tbl of expectedTables) {
      await assert(`Table exists: ${tbl}`, async () => {
        const [rows] = await conn.execute(
          `SELECT table_name FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = ?`,
          [tbl]
        ) as [{ table_name: string }[], unknown];
        if (!rows.length) throw new Error(`Table '${tbl}' not found in database`);
      });
    }

    // ── 2. Column verification: check key form fields ─────────────────────────
    await assert('Columns verified: partner_applications contains all onboarding form fields', async () => {
      const [cols] = await conn.execute(
        `SELECT column_name FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'partner_applications'`
      ) as [{ COLUMN_NAME: string }[], unknown];
      const colNames = new Set(cols.map(c => c.COLUMN_NAME.toLowerCase()));

      const required = [
        'company_name', 'website', 'company_email', 'company_phone', 'year_established',
        'head_office_city', 'state', 'country', 'pincode', 'address_line1',
        'company_type', 'employee_range', 'turnover_range',
        'gstin', 'pan', 'registration_number', 'linkedin_url',
        'status', 'rejection_reason', 'submitted_at', 'reviewed_at', 'reviewed_by', 'ip_address'
      ];

      for (const field of required) {
        if (!colNames.has(field)) throw new Error(`Field '${field}' missing from partner_applications`);
      }
    });

    // ── 3. Insert admin user ──────────────────────────────────────────────────
    await assert('Insert admin user (users)', async () => {
      await conn.execute(
        `INSERT INTO users (id, name, email, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, ?, TRUE)`,
        [adminId, 'Suresh Verma', `admin_${Date.now()}@aashray.test`, '$2a$10$hashedTestPasswordHere', 'SUPER_ADMIN']
      );
    });

    // ── 4. Submit partner application (All Partner Form Fields) ───────────────
    await assert('Submit partner application with full form data (partner_applications)', async () => {
      await conn.execute(
        `INSERT INTO partner_applications
          (id, company_name, website, company_email, company_phone,
           year_established, head_office_city, state, country, pincode, address_line1,
           company_type, employee_range, turnover_range,
           gstin, pan, registration_number, linkedin_url, ip_address, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_REVIEW')`,
        [
          appId,
          'TechGuard Compliance Solutions Pvt Ltd',
          'https://techguard.co.in',
          'partner@techguard.co.in',
          '+91 98765 43210',
          2019,
          'Bengaluru',
          'Karnataka',
          'India',
          '560034',
          'Level 4, Prestige Tech Park, Marathahalli Ring Road',
          'Private Limited',
          '51-200',
          '10-25 Cr',
          '29AABCT1332L1ZV',
          'AABCT1332L',
          'U72200KA2019PTC125890',
          'https://linkedin.com/company/techguard-compliance',
          '49.206.12.98',
        ]
      );
    });

    // ── 5. Insert contacts (Primary Contact & Authorized Signatory) ───────────
    await assert('Insert primary contact (partner_contacts)', async () => {
      await conn.execute(
        `INSERT INTO partner_contacts
          (id, application_id, contact_type, full_name, designation, contact_email, contact_phone, is_primary)
         VALUES (?, ?, 'PRIMARY', ?, ?, ?, ?, TRUE)`,
        [contact1Id, appId, 'Ananya Sen', 'Chief Operating Officer', 'ananya.sen@techguard.co.in', '+91 98765 00001']
      );
    });

    await assert('Insert secondary contact: authorized signatory (partner_contacts)', async () => {
      await conn.execute(
        `INSERT INTO partner_contacts
          (id, application_id, contact_type, full_name, designation, contact_email, contact_phone, is_primary)
         VALUES (?, ?, 'AUTHORIZED_SIGNATORY', ?, ?, ?, ?, FALSE)`,
        [contact2Id, appId, 'Vikram Malhotra', 'Managing Director', 'vikram@techguard.co.in', '+91 98765 00002']
      );
    });

    // ── 6. Insert uploaded documents (GST, PAN, Incorporation Certificate) ────
    await assert('Insert partner documents: GST, PAN & Incorporation proof', async () => {
      // 1. GST
      await conn.execute(
        `INSERT INTO partner_documents
          (id, application_id, document_type, file_name, storage_key, mime_type, file_size_bytes, verification_status)
         VALUES (?, ?, 'GST_CERTIFICATE', 'gst_reg_cert.pdf', ?, 'application/pdf', 314572, 'SUBMITTED')`,
        [docGstId, appId, `${appId}/gst_reg_cert.pdf`]
      );
      // 2. PAN
      await conn.execute(
        `INSERT INTO partner_documents
          (id, application_id, document_type, file_name, storage_key, mime_type, file_size_bytes, verification_status)
         VALUES (?, ?, 'PAN_CARD', 'pan_card_techguard.jpg', ?, 'image/jpeg', 157286, 'SUBMITTED')`,
        [docPanId, appId, `${appId}/pan_card_techguard.jpg`]
      );
      // 3. Incorporation Certificate
      await conn.execute(
        `INSERT INTO partner_documents
          (id, application_id, document_type, file_name, storage_key, mime_type, file_size_bytes, verification_status)
         VALUES (?, ?, 'REGISTRATION_CERTIFICATE', 'mca_incorporation.pdf', ?, 'application/pdf', 838860, 'SUBMITTED')`,
        [docRegId, appId, `${appId}/mca_incorporation.pdf`]
      );
    });

    // ── 7. Insert Partner Banking details ─────────────────────────────────────
    await assert('Insert partner banking & payout details (partner_banking)', async () => {
      await conn.execute(
        `INSERT INTO partner_banking
          (id, application_id, beneficiary_name, account_number, ifsc_code, bank_name, branch_name, account_type, upi_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'CURRENT', ?)`,
        [
          bankId,
          appId,
          'TechGuard Compliance Solutions Pvt Ltd',
          '50200012345678',
          'HDFC0000123',
          'HDFC Bank Ltd',
          'Koramangala 5th Block, Bengaluru',
          'techguard@hdfcbank',
        ]
      );
    });

    // ── 8. Create onboarding record & accept agreement ────────────────────────
    await assert('Create onboarding workflow record (partner_onboarding)', async () => {
      await conn.execute(
        `INSERT INTO partner_onboarding
          (id, application_id, onboarding_token, token_expires_at, onboarding_status)
         VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 72 HOUR), 'AGREEMENT_PENDING')`,
        [onboardingId, appId, onboardToken]
      );
    });

    await assert('Accept partner partnership agreement digitally', async () => {
      await conn.execute(
        `UPDATE partner_onboarding
         SET agreement_accepted = TRUE,
             agreement_accepted_at = NOW(),
             agreement_version = '1.0',
             agreement_ip = '49.206.12.98',
             agreement_signature = 'Ananya Sen (Digital Signatory: SHA256-SIGN-OK)',
             onboarding_status = 'DOCUMENT_VERIFICATION'
         WHERE id = ?`,
        [onboardingId]
      );
    });

    // ── 9. Admin review & approval ───────────────────────────────────────────
    await assert('Admin approves application (partner_applications status update)', async () => {
      await conn.execute(
        `UPDATE partner_applications
         SET status = 'APPROVED', reviewed_at = NOW(), reviewed_by = ?
         WHERE id = ?`,
        [adminId, appId]
      );
    });

    // ── 10. Verify uploaded documents ────────────────────────────────────────
    await assert('Verify uploaded verification documents (VERIFIED)', async () => {
      await conn.execute(
        `UPDATE partner_documents
         SET verification_status = 'VERIFIED', verified_by = ?, verified_at = NOW()
         WHERE application_id = ?`,
        [adminId, appId]
      );
    });

    // ── 11. Verify partner banking details ───────────────────────────────────
    await assert('Verify partner bank account for settlements (partner_banking)', async () => {
      await conn.execute(
        `UPDATE partner_banking
         SET is_verified = TRUE, verified_by = ?, verified_at = NOW()
         WHERE id = ?`,
        [adminId, bankId]
      );
    });

    // ── 12. Activate partner with partner code & commission tier ─────────────
    await assert('Activate partner entity (partners: code, GOLD tier, 20% commission)', async () => {
      await conn.execute(
        `INSERT INTO partners
          (id, application_id, partner_code, partner_tier, commission_rate_pct, partner_status, activated_at, notes)
         VALUES (?, ?, ?, 'GOLD', 20.00, 'ACTIVE', NOW(), 'Fully verified enterprise compliance partner')`,
        [partnerId, appId, partnerCode]
      );

      await conn.execute(
        `UPDATE partner_onboarding SET onboarding_status = 'COMPLETED', completed_at = NOW() WHERE id = ?`,
        [onboardingId]
      );
    });

    // ── 13. Audit logs & email logs ──────────────────────────────────────────
    await assert('Log transactional notification emails (email_logs)', async () => {
      await conn.execute(
        `INSERT INTO email_logs (id, application_id, email_type, recipient, subject, status)
         VALUES (?, ?, 'APPLICATION_RECEIVED', 'partner@techguard.co.in', 'Your NiyamSaathi Partner Application has been received', 'SENT')`,
        [emailLog1Id, appId]
      );
      await conn.execute(
        `INSERT INTO email_logs (id, application_id, email_type, recipient, subject, status)
         VALUES (?, ?, 'ACTIVATED', 'ananya.sen@techguard.co.in', 'Welcome to Aashray Partner Network — Account Activated', 'SENT')`,
        [emailLog2Id, appId]
      );
    });

    await assert('Log administrative security & audit actions (audit_logs)', async () => {
      await conn.execute(
        `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address)
         VALUES (?, ?, 'APPROVE_APPLICATION', 'APPLICATION', ?, JSON_OBJECT('companyName', 'TechGuard Compliance Solutions Pvt Ltd'), '10.0.0.1')`,
        [auditLog1Id, adminId, appId]
      );
      await conn.execute(
        `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address)
         VALUES (?, ?, 'ACTIVATE_PARTNER', 'PARTNER', ?, JSON_OBJECT('partnerCode', ?, 'tier', 'GOLD'), '10.0.0.1')`,
        [auditLog2Id, adminId, partnerId, partnerCode]
      );
    });

    // ── 14. Relational Aggregate Query (Admin Dashboard Overview) ─────────────
    await assert('Execute full relational aggregate query across 6 tables', async () => {
      const [rows] = await conn.execute(
        `SELECT
           pa.id                      AS application_id,
           pa.company_name,
           pa.website,
           pa.company_email,
           pa.company_phone,
           pa.year_established,
           pa.head_office_city,
           pa.state,
           pa.country,
           pa.pincode,
           pa.company_type,
           pa.employee_range,
           pa.turnover_range,
           pa.gstin,
           pa.pan,
           pa.registration_number,
           pa.status                  AS app_status,
           pb.beneficiary_name,
           pb.account_number,
           pb.ifsc_code,
           pb.bank_name,
           pb.is_verified             AS bank_verified,
           po.onboarding_status,
           po.agreement_accepted,
           po.agreement_signature,
           p.partner_code,
           p.partner_tier,
           p.commission_rate_pct,
           p.partner_status,
           COUNT(DISTINCT pc.id)      AS total_contacts,
           COUNT(DISTINCT pd.id)      AS total_docs,
           COUNT(DISTINCT CASE WHEN pd.verification_status = 'VERIFIED' THEN pd.id ELSE NULL END) AS verified_docs
         FROM partner_applications pa
         LEFT JOIN partner_banking    pb ON pb.application_id = pa.id
         LEFT JOIN partner_onboarding po ON po.application_id = pa.id
         LEFT JOIN partners           p  ON p.application_id  = pa.id
         LEFT JOIN partner_contacts   pc ON pc.application_id = pa.id
         LEFT JOIN partner_documents  pd ON pd.application_id = pa.id
         WHERE pa.id = ?
         GROUP BY pa.id, pb.id, po.id, p.id`,
        [appId]
      ) as [Record<string, unknown>[], unknown];

      if (!rows.length) throw new Error('Aggregate query returned no rows');

      const data = rows[0];
      if (data.company_name !== 'TechGuard Compliance Solutions Pvt Ltd') throw new Error('Company name mismatch');
      if (data.pincode !== '560034') throw new Error('Pincode mismatch');
      if (data.app_status !== 'APPROVED') throw new Error('Application status should be APPROVED');
      if (data.bank_verified !== 1 && data.bank_verified !== true) throw new Error('Bank account should be verified');
      if (data.onboarding_status !== 'COMPLETED') throw new Error('Onboarding status should be COMPLETED');
      if (data.partner_status !== 'ACTIVE') throw new Error('Partner status should be ACTIVE');
      if (data.partner_tier !== 'GOLD') throw new Error('Partner tier should be GOLD');
      if (Number(data.total_contacts) !== 2) throw new Error(`Expected 2 contacts, got ${data.total_contacts}`);
      if (Number(data.total_docs) !== 3) throw new Error(`Expected 3 docs, got ${data.total_docs}`);
      if (Number(data.verified_docs) !== 3) throw new Error(`Expected 3 verified docs, got ${data.verified_docs}`);
    });

    // ── 15. Verify Cascade Delete Integrity ───────────────────────────────────
    await assert('Cascade delete integrity: deleting application removes all linked records', async () => {
      // Delete foreign dependencies not covered by cascade:
      await conn.execute('DELETE FROM audit_logs WHERE id IN (?, ?)', [auditLog1Id, auditLog2Id]);
      await conn.execute('DELETE FROM email_logs WHERE id IN (?, ?)', [emailLog1Id, emailLog2Id]);

      // Deleting application should CASCADE to:
      // partner_contacts, partner_documents, partner_banking, partner_onboarding, partners
      await conn.execute('DELETE FROM partner_applications WHERE id = ?', [appId]);

      // Check contacts removed
      const [contacts] = await conn.execute('SELECT id FROM partner_contacts WHERE application_id = ?', [appId]) as [{ id: string }[], unknown];
      if (contacts.length) throw new Error('Cascade failed: partner_contacts not deleted');

      // Check documents removed
      const [docs] = await conn.execute('SELECT id FROM partner_documents WHERE application_id = ?', [appId]) as [{ id: string }[], unknown];
      if (docs.length) throw new Error('Cascade failed: partner_documents not deleted');

      // Check banking removed
      const [banks] = await conn.execute('SELECT id FROM partner_banking WHERE application_id = ?', [appId]) as [{ id: string }[], unknown];
      if (banks.length) throw new Error('Cascade failed: partner_banking not deleted');

      // Check onboarding removed
      const [onboardings] = await conn.execute('SELECT id FROM partner_onboarding WHERE application_id = ?', [appId]) as [{ id: string }[], unknown];
      if (onboardings.length) throw new Error('Cascade failed: partner_onboarding not deleted');

      // Check partner removed
      const [partnerRows] = await conn.execute('SELECT id FROM partners WHERE application_id = ?', [appId]) as [{ id: string }[], unknown];
      if (partnerRows.length) throw new Error('Cascade failed: partners not deleted');

      // Delete test admin
      await conn.execute('DELETE FROM users WHERE id = ?', [adminId]);
    });

  } finally {
    conn.release();
    await pool.end();

    logger.info('\n══════════════════════════════════════════════════════════');
    logger.info(`  Integration Test Summary: ${passed} passed, ${failed} failed`);
    logger.info('══════════════════════════════════════════════════════════\n');

    if (failed > 0) process.exit(1);
  }
}

runTests().catch((err) => {
  logger.error('Unexpected fatal test error:', err);
  process.exit(1);
});

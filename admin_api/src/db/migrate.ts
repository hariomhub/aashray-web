import { pool } from './connection';
import logger from '../utils/logger';

/**
 * Database Schema — Aashray Partner Portal
 *
 * Tables (in dependency order):
 *  1. users                  — Admin/staff accounts
 *  2. partner_applications   — Core partner application (company info, demographics, legal/tax)
 *  3. partner_contacts       — Primary & authorized contact persons
 *  4. partner_documents      — Uploaded verification documents (GST, PAN, Incorporation, etc.)
 *  5. partner_banking        — Payout bank account details for revenue share settlement
 *  6. partner_onboarding     — Onboarding workflow state machine (token, agreement, status)
 *  7. partners               — Activated partner records (code, tier, commission rate)
 *  8. email_logs             — Outbound transactional email audit trail
 *  9. audit_logs             — Admin/system action audit trail
 */

interface TableDefinition {
  name: string;
  createSql: string;
}

const tableDefinitions: TableDefinition[] = [
  // ─── 1. Users (Admin / Staff) ─────────────────────────────────────────────
  {
    name: 'users',
    createSql: `CREATE TABLE IF NOT EXISTS users (
      id             VARCHAR(36)  NOT NULL PRIMARY KEY,
      name           VARCHAR(255) NOT NULL,
      email          VARCHAR(255) NOT NULL UNIQUE,
      password_hash  VARCHAR(255) NOT NULL,
      role           ENUM('SUPER_ADMIN', 'PARTNER_ADMIN', 'DOCUMENT_VERIFIER') NOT NULL DEFAULT 'PARTNER_ADMIN',
      is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
      last_login_at  DATETIME     NULL,
      created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_users_email (email),
      INDEX idx_users_role  (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 2. Partner Applications (All Partner Form Fields) ─────────────────────
  {
    name: 'partner_applications',
    createSql: `CREATE TABLE IF NOT EXISTS partner_applications (
      id                   VARCHAR(36)   NOT NULL PRIMARY KEY,

      -- Step 1: Company Basics
      company_name         VARCHAR(255)  NOT NULL,
      website              VARCHAR(512)  NOT NULL,
      company_email        VARCHAR(255)  NOT NULL,
      company_phone        VARCHAR(30)   NOT NULL,
      year_established     SMALLINT      NOT NULL,

      -- Step 2: Location & Demographics
      head_office_city     VARCHAR(100)  NOT NULL,
      state                VARCHAR(100)  NOT NULL,
      country              VARCHAR(100)  NOT NULL DEFAULT 'India',
      pincode              VARCHAR(10)   NULL,
      address_line1        VARCHAR(255)  NULL,

      -- Step 2: Business Demographics
      company_type         ENUM('Private Limited','Public Limited','LLP','Partnership','Sole Proprietorship','OPC','Other') NOT NULL,
      employee_range       ENUM('1-10','11-50','51-200','201-500','500+') NOT NULL,
      turnover_range       ENUM('< 1 Cr','1-10 Cr','10-25 Cr','25-100 Cr','100+ Cr') NULL,

      -- Step 3: Legal & Regulatory Identification
      gstin                VARCHAR(20)   NULL,
      pan                  VARCHAR(15)   NULL,
      registration_number  VARCHAR(50)   NULL,
      linkedin_url         VARCHAR(512)  NULL,
      interested_products  TEXT          NULL,

      -- Application Workflow Status & Metadata
      status               ENUM('PENDING_REVIEW','UNDER_REVIEW','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING_REVIEW',
      rejection_reason     TEXT          NULL,
      submitted_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reviewed_at          DATETIME      NULL,
      reviewed_by          VARCHAR(36)   NULL,
      ip_address           VARCHAR(45)   NULL,

      created_at           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY fk_app_reviewed_by (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,

      INDEX idx_app_status       (status),
      INDEX idx_app_submitted_at (submitted_at),
      INDEX idx_app_company      (company_name),
      INDEX idx_app_email        (company_email),
      INDEX idx_app_gstin        (gstin),
      INDEX idx_app_pan          (pan)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 3. Partner Contacts (Primary Contact & Authorized Signatories) ────────
  {
    name: 'partner_contacts',
    createSql: `CREATE TABLE IF NOT EXISTS partner_contacts (
      id               VARCHAR(36)  NOT NULL PRIMARY KEY,
      application_id   VARCHAR(36)  NOT NULL,

      contact_type     ENUM('PRIMARY','AUTHORIZED_SIGNATORY','TECHNICAL_LEAD','FINANCE_BILLING','OTHER') NOT NULL DEFAULT 'PRIMARY',
      full_name        VARCHAR(255) NOT NULL,
      designation      VARCHAR(100) NOT NULL,
      contact_email    VARCHAR(255) NOT NULL,
      contact_phone    VARCHAR(30)  NOT NULL,
      is_primary       BOOLEAN      NOT NULL DEFAULT TRUE,

      created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY fk_contact_application (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
      INDEX idx_contact_app   (application_id),
      INDEX idx_contact_email (contact_email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 4. Partner Documents (Verification & Uploaded Proofs) ─────────────────
  {
    name: 'partner_documents',
    createSql: `CREATE TABLE IF NOT EXISTS partner_documents (
      id                  VARCHAR(36)   NOT NULL PRIMARY KEY,
      application_id      VARCHAR(36)   NOT NULL,

      document_type       ENUM('GST_CERTIFICATE','PAN_CARD','REGISTRATION_CERTIFICATE','BANK_PROOF','SIGNED_AGREEMENT','OTHER') NOT NULL,
      file_name           VARCHAR(512)  NOT NULL,
      storage_key         VARCHAR(1024) NOT NULL,
      mime_type           VARCHAR(100)  NOT NULL,
      file_size_bytes     INT UNSIGNED  NOT NULL,
      uploaded_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

      verification_status ENUM('NOT_SUBMITTED','SUBMITTED','UNDER_REVIEW','VERIFIED','REJECTED') NOT NULL DEFAULT 'SUBMITTED',
      verified_at         DATETIME      NULL,
      verified_by         VARCHAR(36)   NULL,
      rejection_reason    TEXT          NULL,

      created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY fk_doc_application (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
      FOREIGN KEY fk_doc_verified_by (verified_by)    REFERENCES users(id) ON DELETE SET NULL,

      INDEX idx_doc_application_id      (application_id),
      INDEX idx_doc_document_type       (document_type),
      INDEX idx_doc_verification_status (verification_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 5. Partner Banking (Payout Bank Details) ──────────────────────────────
  {
    name: 'partner_banking',
    createSql: `CREATE TABLE IF NOT EXISTS partner_banking (
      id                VARCHAR(36)   NOT NULL PRIMARY KEY,
      application_id    VARCHAR(36)   NOT NULL UNIQUE,

      beneficiary_name  VARCHAR(255)  NOT NULL,
      account_number    VARCHAR(50)   NOT NULL,
      ifsc_code         VARCHAR(20)   NOT NULL,
      bank_name         VARCHAR(150)  NOT NULL,
      branch_name       VARCHAR(150)  NULL,
      account_type      ENUM('CURRENT','SAVINGS') NOT NULL DEFAULT 'CURRENT',
      upi_id            VARCHAR(100)  NULL,

      is_verified       BOOLEAN       NOT NULL DEFAULT FALSE,
      verified_at       DATETIME      NULL,
      verified_by       VARCHAR(36)   NULL,

      created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY fk_bank_application (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
      FOREIGN KEY fk_bank_verified_by (verified_by)    REFERENCES users(id) ON DELETE SET NULL,

      INDEX idx_bank_application_id (application_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 6. Partner Onboarding (Workflow State Machine) ────────────────────────
  {
    name: 'partner_onboarding',
    createSql: `CREATE TABLE IF NOT EXISTS partner_onboarding (
      id                      VARCHAR(36)   NOT NULL PRIMARY KEY,
      application_id          VARCHAR(36)   NOT NULL UNIQUE,

      onboarding_token        VARCHAR(255)  NOT NULL UNIQUE,
      token_expires_at        DATETIME      NOT NULL,

      agreement_version       VARCHAR(20)   NULL,
      agreement_accepted      BOOLEAN       NOT NULL DEFAULT FALSE,
      agreement_accepted_at   DATETIME      NULL,
      agreement_ip            VARCHAR(45)   NULL,
      agreement_signature     VARCHAR(255)  NULL,

      onboarding_status       ENUM('NOT_STARTED','AGREEMENT_PENDING','DOCUMENTS_PENDING','DOCUMENT_VERIFICATION','COMPLETED','EXPIRED')
                              NOT NULL DEFAULT 'NOT_STARTED',
      completed_at            DATETIME      NULL,

      created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY fk_onboarding_application (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,

      INDEX idx_onboarding_token  (onboarding_token),
      INDEX idx_onboarding_status (onboarding_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 7. Partners (Activated Partner Entity) ────────────────────────────────
  {
    name: 'partners',
    createSql: `CREATE TABLE IF NOT EXISTS partners (
      id                  VARCHAR(36)    NOT NULL PRIMARY KEY,
      application_id      VARCHAR(36)    NOT NULL UNIQUE,

      partner_code        VARCHAR(50)    NULL UNIQUE,
      partner_tier        ENUM('REGISTERED','SILVER','GOLD','PLATINUM') NOT NULL DEFAULT 'REGISTERED',
      commission_rate_pct DECIMAL(5,2)   NOT NULL DEFAULT 15.00,

      partner_status      ENUM('PENDING','ACTIVE','SUSPENDED','TERMINATED') NOT NULL DEFAULT 'PENDING',
      activated_at        DATETIME       NULL,
      suspended_at        DATETIME       NULL,
      suspended_by        VARCHAR(36)    NULL,
      notes               TEXT           NULL,

      created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY fk_partner_application  (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
      FOREIGN KEY fk_partner_suspended_by (suspended_by)   REFERENCES users(id) ON DELETE SET NULL,

      INDEX idx_partner_status (partner_status),
      INDEX idx_partner_code   (partner_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 8. Email Logs ─────────────────────────────────────────────────────────
  {
    name: 'email_logs',
    createSql: `CREATE TABLE IF NOT EXISTS email_logs (
      id             VARCHAR(36)   NOT NULL PRIMARY KEY,
      application_id VARCHAR(36)   NULL,

      email_type     ENUM('APPLICATION_RECEIVED','APPROVAL','REJECTION','DOCUMENT_REQUEST','ONBOARDING_REMINDER','ACTIVATED') NOT NULL,
      recipient      VARCHAR(255)  NOT NULL,
      subject        VARCHAR(512)  NOT NULL,
      sent_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status         ENUM('SENT','FAILED','QUEUED') NOT NULL DEFAULT 'SENT',
      error_message  TEXT          NULL,

      FOREIGN KEY fk_email_application (application_id) REFERENCES partner_applications(id) ON DELETE SET NULL,

      INDEX idx_email_application_id (application_id),
      INDEX idx_email_type           (email_type),
      INDEX idx_email_sent_at        (sent_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },

  // ─── 9. Audit Logs ─────────────────────────────────────────────────────────
  {
    name: 'audit_logs',
    createSql: `CREATE TABLE IF NOT EXISTS audit_logs (
      id             VARCHAR(36)   NOT NULL PRIMARY KEY,
      user_id        VARCHAR(36)   NULL,

      action         VARCHAR(100)  NOT NULL,
      resource_type  VARCHAR(50)   NOT NULL,
      resource_id    VARCHAR(36)   NULL,
      details        JSON          NULL,
      ip_address     VARCHAR(45)   NULL,

      created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY fk_audit_user (user_id) REFERENCES users(id) ON DELETE SET NULL,

      INDEX idx_audit_user_id    (user_id),
      INDEX idx_audit_action     (action),
      INDEX idx_audit_resource   (resource_type, resource_id),
      INDEX idx_audit_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  },
];

export async function migrate(options: { fresh?: boolean } = {}): Promise<void> {
  const isFresh = options.fresh ?? process.argv.includes('--fresh');
  logger.info(`Running database migrations... (mode: ${isFresh ? 'FRESH RESET' : 'SAFE MIGRATE'})`);

  const conn = await pool.getConnection();

  try {
    if (isFresh) {
      logger.info('Dropping existing tables in reverse dependency order...');
      await conn.query('SET FOREIGN_KEY_CHECKS = 0');
      const tableNames = [...tableDefinitions].reverse().map(t => t.name);
      for (const name of tableNames) {
        await conn.query(`DROP TABLE IF EXISTS ${name}`);
        logger.info(`  ✗ Dropped table: ${name}`);
      }
      await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    await conn.beginTransaction();

    for (const table of tableDefinitions) {
      await conn.execute(table.createSql);
      logger.info(`  ✓ Table ensured: ${table.name}`);
    }

    // Incremental column check for safe migration if not fresh
    if (!isFresh) {
      // 1. partner_applications: ensure pincode, address_line1, ip_address, created_at, updated_at
      const [appCols] = await conn.execute(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'partner_applications'`
      ) as [{ COLUMN_NAME: string }[], unknown];
      const appColSet = new Set(appCols.map(c => c.COLUMN_NAME.toLowerCase()));

      if (!appColSet.has('pincode')) {
        await conn.execute(`ALTER TABLE partner_applications ADD COLUMN pincode VARCHAR(10) NULL AFTER country`);
        logger.info(`  + Column added: partner_applications.pincode`);
      }
      if (!appColSet.has('address_line1')) {
        await conn.execute(`ALTER TABLE partner_applications ADD COLUMN address_line1 VARCHAR(255) NULL AFTER pincode`);
        logger.info(`  + Column added: partner_applications.address_line1`);
      }
      if (!appColSet.has('ip_address')) {
        await conn.execute(`ALTER TABLE partner_applications ADD COLUMN ip_address VARCHAR(45) NULL AFTER reviewed_by`);
        logger.info(`  + Column added: partner_applications.ip_address`);
      }
      if (!appColSet.has('interested_products')) {
        await conn.execute(`ALTER TABLE partner_applications ADD COLUMN interested_products TEXT NULL AFTER linkedin_url`);
        logger.info(`  + Column added: partner_applications.interested_products`);
      }
      if (!appColSet.has('created_at')) {
        await conn.execute(`ALTER TABLE partner_applications ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        logger.info(`  + Column added: partner_applications.created_at`);
      }
      if (!appColSet.has('updated_at')) {
        await conn.execute(`ALTER TABLE partner_applications ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        logger.info(`  + Column added: partner_applications.updated_at`);
      }

      // 2. partner_contacts: ensure contact_type, is_primary
      const [contactCols] = await conn.execute(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'partner_contacts'`
      ) as [{ COLUMN_NAME: string }[], unknown];
      const contactColSet = new Set(contactCols.map(c => c.COLUMN_NAME.toLowerCase()));

      if (!contactColSet.has('contact_type')) {
        await conn.execute(`ALTER TABLE partner_contacts ADD COLUMN contact_type ENUM('PRIMARY','AUTHORIZED_SIGNATORY','TECHNICAL_LEAD','FINANCE_BILLING','OTHER') NOT NULL DEFAULT 'PRIMARY' AFTER application_id`);
        logger.info(`  + Column added: partner_contacts.contact_type`);
      }
      if (!contactColSet.has('is_primary')) {
        await conn.execute(`ALTER TABLE partner_contacts ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT TRUE AFTER contact_phone`);
        logger.info(`  + Column added: partner_contacts.is_primary`);
      }

      // 3. partner_onboarding: ensure agreement_signature
      const [onboardCols] = await conn.execute(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'partner_onboarding'`
      ) as [{ COLUMN_NAME: string }[], unknown];
      const onboardColSet = new Set(onboardCols.map(c => c.COLUMN_NAME.toLowerCase()));

      if (!onboardColSet.has('agreement_signature')) {
        await conn.execute(`ALTER TABLE partner_onboarding ADD COLUMN agreement_signature VARCHAR(255) NULL AFTER agreement_ip`);
        logger.info(`  + Column added: partner_onboarding.agreement_signature`);
      }

      // 4. partners: ensure partner_code, partner_tier, commission_rate_pct
      const [partnerCols] = await conn.execute(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'partners'`
      ) as [{ COLUMN_NAME: string }[], unknown];
      const partnerColSet = new Set(partnerCols.map(c => c.COLUMN_NAME.toLowerCase()));

      if (!partnerColSet.has('partner_code')) {
        await conn.execute(`ALTER TABLE partners ADD COLUMN partner_code VARCHAR(50) NULL UNIQUE AFTER application_id`);
        logger.info(`  + Column added: partners.partner_code`);
      }
      if (!partnerColSet.has('partner_tier')) {
        await conn.execute(`ALTER TABLE partners ADD COLUMN partner_tier ENUM('REGISTERED','SILVER','GOLD','PLATINUM') NOT NULL DEFAULT 'REGISTERED' AFTER partner_code`);
        logger.info(`  + Column added: partners.partner_tier`);
      }
      if (!partnerColSet.has('commission_rate_pct')) {
        await conn.execute(`ALTER TABLE partners ADD COLUMN commission_rate_pct DECIMAL(5,2) NOT NULL DEFAULT 15.00 AFTER partner_tier`);
        logger.info(`  + Column added: partners.commission_rate_pct`);
      }
    }

    await conn.commit();
    logger.info(`✅ Migrations completed successfully (${tableDefinitions.length} tables verified)`);
  } catch (err) {
    await conn.rollback();
    logger.error('❌ Migration failed:', err);
    throw err;
  } finally {
    conn.release();
    if (require.main === module) {
      await pool.end();
    }
  }
}

// Auto-run if executed directly
if (require.main === module) {
  migrate().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}

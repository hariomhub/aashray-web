import { pool } from './connection';
import logger from '../utils/logger';

const migrations: string[] = [
  // ─── Users (Admin) ───────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS users (
    id             VARCHAR(36)  NOT NULL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           ENUM('SUPER_ADMIN', 'PARTNER_ADMIN', 'DOCUMENT_VERIFIER') NOT NULL DEFAULT 'PARTNER_ADMIN',
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at  DATETIME     NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ─── Partner Applications ─────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS partner_applications (
    id                   VARCHAR(36)   NOT NULL PRIMARY KEY,
    company_name         VARCHAR(255)  NOT NULL,
    website              VARCHAR(512)  NOT NULL,
    company_email        VARCHAR(255)  NOT NULL,
    company_phone        VARCHAR(30)   NOT NULL,
    year_established     SMALLINT      NOT NULL,
    head_office_city     VARCHAR(100)  NOT NULL,
    state                VARCHAR(100)  NOT NULL,
    country              VARCHAR(100)  NOT NULL DEFAULT 'India',
    company_type         ENUM('Private Limited','Public Limited','LLP','Partnership','Sole Proprietorship','OPC','Other') NOT NULL,
    employee_range       ENUM('1-10','11-50','51-200','201-500','500+') NOT NULL,
    turnover_range       ENUM('< 1 Cr','1-10 Cr','10-25 Cr','25-100 Cr','100+ Cr') NULL,
    gstin                VARCHAR(20)   NULL,
    pan                  VARCHAR(15)   NULL,
    registration_number  VARCHAR(50)   NULL,
    linkedin_url         VARCHAR(512)  NULL,
    status               ENUM('PENDING_REVIEW','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING_REVIEW',
    rejection_reason     TEXT          NULL,
    submitted_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at          DATETIME      NULL,
    reviewed_by          VARCHAR(36)   NULL,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status       (status),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_company      (company_name),
    INDEX idx_email        (company_email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ─── Partner Documents ────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS partner_documents (
    id                  VARCHAR(36)   NOT NULL PRIMARY KEY,
    application_id      VARCHAR(36)   NOT NULL,
    document_type       ENUM('GST_CERTIFICATE','PAN_CARD','REGISTRATION_CERTIFICATE','OTHER') NOT NULL,
    file_name           VARCHAR(512)  NOT NULL,
    storage_key         VARCHAR(1024) NOT NULL,
    mime_type           VARCHAR(100)  NOT NULL,
    file_size_bytes     INT           NOT NULL,
    uploaded_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_status ENUM('NOT_SUBMITTED','SUBMITTED','UNDER_REVIEW','VERIFIED','REJECTED') NOT NULL DEFAULT 'SUBMITTED',
    verified_at         DATETIME      NULL,
    verified_by         VARCHAR(36)   NULL,
    rejection_reason    TEXT          NULL,
    FOREIGN KEY (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by)    REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_application_id      (application_id),
    INDEX idx_document_type       (document_type),
    INDEX idx_verification_status (verification_status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ─── Partner Onboarding ───────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS partner_onboarding (
    id                      VARCHAR(36)   NOT NULL PRIMARY KEY,
    application_id          VARCHAR(36)   NOT NULL UNIQUE,
    onboarding_token        VARCHAR(255)  NOT NULL UNIQUE,
    token_expires_at        DATETIME      NOT NULL,
    agreement_version       VARCHAR(20)   NULL,
    agreement_accepted      BOOLEAN       NOT NULL DEFAULT FALSE,
    agreement_accepted_at   DATETIME      NULL,
    agreement_ip            VARCHAR(45)   NULL,
    onboarding_status       ENUM('NOT_STARTED','AGREEMENT_PENDING','DOCUMENTS_PENDING','DOCUMENT_VERIFICATION','COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    completed_at            DATETIME      NULL,
    created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
    INDEX idx_token         (onboarding_token),
    INDEX idx_status        (onboarding_status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ─── Partners (Activated) ─────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS partners (
    id             VARCHAR(36)  NOT NULL PRIMARY KEY,
    application_id VARCHAR(36)  NOT NULL UNIQUE,
    partner_status ENUM('PENDING','ACTIVE','SUSPENDED') NOT NULL DEFAULT 'PENDING',
    activated_at   DATETIME     NULL,
    suspended_at   DATETIME     NULL,
    suspended_by   VARCHAR(36)  NULL,
    notes          TEXT         NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES partner_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (suspended_by)   REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (partner_status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ─── Email Logs ───────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS email_logs (
    id             VARCHAR(36)   NOT NULL PRIMARY KEY,
    application_id VARCHAR(36)   NULL,
    email_type     ENUM('APPROVAL','REJECTION','DOCUMENT_REQUEST','ONBOARDING_REMINDER','ACTIVATED') NOT NULL,
    recipient      VARCHAR(255)  NOT NULL,
    subject        VARCHAR(512)  NOT NULL,
    sent_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status         ENUM('SENT','FAILED') NOT NULL DEFAULT 'SENT',
    error_message  TEXT          NULL,
    FOREIGN KEY (application_id) REFERENCES partner_applications(id) ON DELETE SET NULL,
    INDEX idx_application_id (application_id),
    INDEX idx_email_type     (email_type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ─── Audit Logs ───────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id             VARCHAR(36)   NOT NULL PRIMARY KEY,
    user_id        VARCHAR(36)   NULL,
    action         VARCHAR(100)  NOT NULL,
    resource_type  VARCHAR(50)   NOT NULL,
    resource_id    VARCHAR(36)   NULL,
    details        JSON          NULL,
    ip_address     VARCHAR(45)   NULL,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id       (user_id),
    INDEX idx_action        (action),
    INDEX idx_resource      (resource_type, resource_id),
    INDEX idx_created_at    (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

async function migrate(): Promise<void> {
  logger.info('Running database migrations...');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const sql of migrations) {
      await conn.execute(sql);
    }
    await conn.commit();
    logger.info(`✅ Migrations complete (${migrations.length} tables ensured)`);
  } catch (err) {
    await conn.rollback();
    logger.error('Migration failed:', err);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  logger.error(err);
  process.exit(1);
});

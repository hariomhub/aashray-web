import { Request, Response } from 'express';
import { query } from '../db/connection';
import { getDocumentUrl } from '../services/storage';
import { uploadDocument } from '../services/storage';
import { DOCUMENT_TYPE_MAP } from '../middleware/upload';
import { generateId } from '../utils/helpers';
import logger from '../utils/logger';

interface OnboardingRow {
  id: string;
  application_id: string;
  onboarding_token: string;
  token_expires_at: string;
  agreement_version: string | null;
  agreement_accepted: boolean;
  agreement_accepted_at: string | null;
  onboarding_status: string;
}

interface ApplicationRow {
  id: string;
  company_name: string;
  company_email: string;
  gstin: string | null;
  pan: string | null;
  registration_number: string | null;
  status: string;
}

interface DocumentRow {
  id: string;
  document_type: string;
  file_name: string;
  verification_status: string;
}

async function getValidOnboarding(token: string): Promise<{ onboarding: OnboardingRow; application: ApplicationRow } | null> {
  const rows = await query<OnboardingRow[]>(
    `SELECT po.* FROM partner_onboarding po
     WHERE po.onboarding_token = ? AND po.token_expires_at > NOW()`,
    [token]
  );

  if (!rows.length) return null;

  const apps = await query<ApplicationRow[]>(
    'SELECT * FROM partner_applications WHERE id = ?',
    [rows[0].application_id]
  );

  if (!apps.length) return null;

  return { onboarding: rows[0], application: apps[0] };
}

/**
 * GET /api/onboarding/:token
 * Fetch onboarding details by token (public, token-gated)
 */
export async function getOnboarding(req: Request, res: Response): Promise<void> {
  const result = await getValidOnboarding(req.params.token);
  if (!result) {
    res.status(404).json({ error: 'Invalid or expired onboarding link' });
    return;
  }

  const { onboarding, application } = result;

  const documents = await query<DocumentRow[]>(
    'SELECT document_type, file_name, verification_status FROM partner_documents WHERE application_id = ?',
    [application.id]
  );

  const submittedTypes = new Set(documents.map(d => d.document_type));

  res.json({
    companyName: application.company_name,
    onboardingStatus: onboarding.onboarding_status,
    agreementAccepted: onboarding.agreement_accepted,
    agreementVersion: onboarding.agreement_version,
    agreementUrl: process.env.AGREEMENT_URL,
    documents: {
      GST_CERTIFICATE: submittedTypes.has('GST_CERTIFICATE') ? 'SUBMITTED' : 'NOT_SUBMITTED',
      PAN_CARD: submittedTypes.has('PAN_CARD') ? 'SUBMITTED' : 'NOT_SUBMITTED',
      REGISTRATION_CERTIFICATE: submittedTypes.has('REGISTRATION_CERTIFICATE') ? 'SUBMITTED' : 'NOT_SUBMITTED',
    },
  });
}

/**
 * POST /api/onboarding/:token/accept-agreement
 */
export async function acceptAgreement(req: Request, res: Response): Promise<void> {
  const result = await getValidOnboarding(req.params.token);
  if (!result) {
    res.status(404).json({ error: 'Invalid or expired onboarding link' });
    return;
  }

  const { onboarding } = result;
  if (onboarding.agreement_accepted) {
    res.status(400).json({ error: 'Agreement already accepted' });
    return;
  }

  const agreementVersion = process.env.AGREEMENT_VERSION || '1.0';
  const clientIp = req.ip || req.socket.remoteAddress || '';

  await query(
    `UPDATE partner_onboarding
     SET agreement_accepted = TRUE, agreement_accepted_at = NOW(),
         agreement_version = ?, agreement_ip = ?,
         onboarding_status = 'DOCUMENTS_PENDING'
     WHERE id = ?`,
    [agreementVersion, clientIp, onboarding.id]
  );

  logger.info(`Agreement accepted for application ${onboarding.application_id} from IP ${clientIp}`);
  res.json({ message: 'Agreement accepted', nextStep: 'documents' });
}

/**
 * POST /api/onboarding/:token/documents
 * Upload missing documents during onboarding
 */
export async function uploadOnboardingDocuments(req: Request, res: Response): Promise<void> {
  const result = await getValidOnboarding(req.params.token);
  if (!result) {
    res.status(404).json({ error: 'Invalid or expired onboarding link' });
    return;
  }

  const { onboarding, application } = result;

  if (!onboarding.agreement_accepted) {
    res.status(400).json({ error: 'Please accept the agreement before uploading documents' });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (!files || Object.keys(files).length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  const uploaded: string[] = [];

  for (const fieldName of Object.keys(files)) {
    const fileArray = files[fieldName];
    const documentType = DOCUMENT_TYPE_MAP[fieldName];
    if (!documentType || !fileArray?.length) continue;

    const file = fileArray[0];
    const storageKey = await uploadDocument(
      application.id, documentType, file.originalname, file.buffer, file.mimetype
    );

    // Check for existing doc of this type
    const existing = await query<{ id: string }[]>(
      'SELECT id FROM partner_documents WHERE application_id = ? AND document_type = ?',
      [application.id, documentType]
    );

    if (existing.length) {
      await query(
        `UPDATE partner_documents
         SET file_name = ?, storage_key = ?, mime_type = ?, file_size_bytes = ?,
             verification_status = 'SUBMITTED', uploaded_at = NOW()
         WHERE id = ?`,
        [file.originalname, storageKey, file.mimetype, file.size, existing[0].id]
      );
    } else {
      await query(
        `INSERT INTO partner_documents
          (id, application_id, document_type, file_name, storage_key, mime_type, file_size_bytes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [generateId(), application.id, documentType, file.originalname, storageKey, file.mimetype, file.size]
      );
    }

    uploaded.push(documentType);
  }

  // Update onboarding status
  await query(
    `UPDATE partner_onboarding SET onboarding_status = 'DOCUMENT_VERIFICATION' WHERE id = ?`,
    [onboarding.id]
  );

  res.json({ message: 'Documents submitted for verification', uploaded });
}

/**
 * POST /api/onboarding/:token/complete
 * Mark onboarding as complete (if all docs are in)
 */
export async function completeOnboarding(req: Request, res: Response): Promise<void> {
  const result = await getValidOnboarding(req.params.token);
  if (!result) {
    res.status(404).json({ error: 'Invalid or expired onboarding link' });
    return;
  }

  const { onboarding } = result;

  if (!onboarding.agreement_accepted) {
    res.status(400).json({ error: 'Agreement not yet accepted' });
    return;
  }

  await query(
    `UPDATE partner_onboarding SET onboarding_status = 'DOCUMENT_VERIFICATION' WHERE id = ?`,
    [onboarding.id]
  );

  res.json({
    message: 'Onboarding complete. Your documents are under verification. We will contact you once your account is activated.',
    applicationId: onboarding.application_id,
  });
}

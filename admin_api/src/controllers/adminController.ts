import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';
import { auditLog } from '../middleware/auth';
import { generateId, generateOnboardingToken, getOnboardingTokenExpiry } from '../utils/helpers';
import { uploadDocument, getDocumentUrl } from '../services/storage';
import { sendApprovalEmail, sendRejectionEmail, sendDocumentRequestEmail, sendPartnerActivatedEmail } from '../services/email';
import logger from '../utils/logger';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'SUPER_ADMIN' | 'PARTNER_ADMIN' | 'DOCUMENT_VERIFIER';
  is_active: boolean;
}

interface ApplicationRow {
  id: string;
  company_name: string;
  company_email: string;
  website: string;
  company_phone: string;
  year_established: number;
  head_office_city: string;
  state: string;
  country: string;
  company_type: string;
  employee_range: string;
  turnover_range: string | null;
  gstin: string | null;
  pan: string | null;
  registration_number: string | null;
  linkedin_url: string | null;
  status: string;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  doc_count: number;
  submitted_doc_count: number;
}

interface DocumentRow {
  id: string;
  document_type: string;
  file_name: string;
  storage_key: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
  verification_status: string;
  verified_at: string | null;
  rejection_reason: string | null;
}

interface OnboardingRow {
  id: string;
  onboarding_token: string;
  onboarding_status: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function adminLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const users = await query<UserRow[]>(
    'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
    [email]
  );

  if (!users.length) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || '',
    { expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as `${number}${'s'|'m'|'h'|'d'}` }
  );

  await auditLog({ userId: user.id, action: 'LOGIN', resourceType: 'USER', resourceId: user.id, ip: req.ip });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

// ─── Applications List ────────────────────────────────────────────────────────

export async function listApplications(req: Request, res: Response): Promise<void> {
  const { status, page = '1', limit = '20', search } = req.query;
  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
  const offset = (pageNum - 1) * limitNum;

  let whereClause = '1=1';
  const params: unknown[] = [];

  if (status) {
    whereClause += ' AND pa.status = ?';
    params.push(status);
  }

  if (search) {
    whereClause += ' AND (pa.company_name LIKE ? OR pa.company_email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const applications = await query<ApplicationRow[]>(
    `SELECT pa.*,
       COUNT(pd.id) as doc_count,
       SUM(CASE WHEN pd.verification_status IN ('SUBMITTED','UNDER_REVIEW','VERIFIED') THEN 1 ELSE 0 END) as submitted_doc_count
     FROM partner_applications pa
     LEFT JOIN partner_documents pd ON pd.application_id = pa.id
     WHERE ${whereClause}
     GROUP BY pa.id
     ORDER BY pa.submitted_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  const [{ total }] = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM partner_applications pa WHERE ${whereClause}`,
    params
  );

  res.json({
    data: applications,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
}

// ─── Application Detail ───────────────────────────────────────────────────────

export async function getApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const apps = await query<ApplicationRow[]>(
    'SELECT * FROM partner_applications WHERE id = ?',
    [id]
  );

  if (!apps.length) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  const documents = await query<DocumentRow[]>(
    'SELECT * FROM partner_documents WHERE application_id = ? ORDER BY uploaded_at DESC',
    [id]
  );

  const onboarding = await query<OnboardingRow[]>(
    'SELECT onboarding_status, created_at, completed_at FROM partner_onboarding WHERE application_id = ?',
    [id]
  );

  res.json({
    application: apps[0],
    documents,
    onboarding: onboarding[0] || null,
  });
}

// ─── View Document (Admin) ────────────────────────────────────────────────────

export async function viewDocument(req: Request, res: Response): Promise<void> {
  const { docId } = req.params;

  const docs = await query<DocumentRow[]>(
    'SELECT * FROM partner_documents WHERE id = ?',
    [docId]
  );

  if (!docs.length) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }

  try {
    const url = await getDocumentUrl(docs[0].storage_key);
    await auditLog({
      userId: req.admin!.id,
      action: 'VIEW_DOCUMENT',
      resourceType: 'DOCUMENT',
      resourceId: docId,
      ip: req.ip,
    });
    res.json({ url, expiresInMinutes: parseInt(process.env.AZURE_SAS_EXPIRY_MINUTES || '15', 10) });
  } catch (err) {
    logger.error('Error generating document URL:', err);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
}

// ─── Verify Document ──────────────────────────────────────────────────────────

export async function verifyDocument(req: Request, res: Response): Promise<void> {
  const { docId } = req.params;
  const { status, rejection_reason } = req.body;

  const validStatuses = ['UNDER_REVIEW', 'VERIFIED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  await query(
    `UPDATE partner_documents
     SET verification_status = ?, verified_by = ?, verified_at = NOW(), rejection_reason = ?
     WHERE id = ?`,
    [status, req.admin!.id, rejection_reason || null, docId]
  );

  await auditLog({
    userId: req.admin!.id,
    action: `DOCUMENT_${status}`,
    resourceType: 'DOCUMENT',
    resourceId: docId,
    ip: req.ip,
  });

  res.json({ message: `Document marked as ${status}` });
}

// ─── Approve Application ──────────────────────────────────────────────────────

export async function approveApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const apps = await query<ApplicationRow[]>(
    'SELECT * FROM partner_applications WHERE id = ?',
    [id]
  );

  if (!apps.length) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  if (apps[0].status !== 'PENDING_REVIEW') {
    res.status(400).json({ error: `Application is already ${apps[0].status}` });
    return;
  }

  const app = apps[0];

  // 1. Update application status
  await query(
    `UPDATE partner_applications
     SET status = 'APPROVED', reviewed_at = NOW(), reviewed_by = ?
     WHERE id = ?`,
    [req.admin!.id, id]
  );

  // 2. Create onboarding record
  const token = generateOnboardingToken();
  const expiresAt = getOnboardingTokenExpiry();
  const onboardingId = generateId();

  await query(
    `INSERT INTO partner_onboarding
      (id, application_id, onboarding_token, token_expires_at, onboarding_status)
     VALUES (?, ?, ?, ?, 'NOT_STARTED')`,
    [onboardingId, id, token, expiresAt]
  );

  // 3. Determine missing documents
  const submittedDocs = await query<DocumentRow[]>(
    'SELECT document_type FROM partner_documents WHERE application_id = ?',
    [id]
  );
  const submittedTypes = new Set(submittedDocs.map(d => d.document_type));
  const missingDocs = [];
  if (!submittedTypes.has('GST_CERTIFICATE') && app.gstin) missingDocs.push({ label: 'GST Certificate' });
  if (!submittedTypes.has('PAN_CARD') && app.pan) missingDocs.push({ label: 'PAN Card' });
  if (!submittedTypes.has('REGISTRATION_CERTIFICATE') && app.registration_number) missingDocs.push({ label: 'Company Registration Certificate' });
  // If no GSTIN/PAN provided at all, still request
  if (!submittedTypes.has('GST_CERTIFICATE') && !app.gstin) missingDocs.push({ label: 'GST Certificate' });
  if (!submittedTypes.has('PAN_CARD') && !app.pan) missingDocs.push({ label: 'PAN Card' });

  // 4. Send approval email (backend-triggered, not frontend)
  await sendApprovalEmail({
    applicationId: id,
    companyName: app.company_name,
    email: app.company_email,
    onboardingToken: token,
    missingDocs,
  });

  await auditLog({
    userId: req.admin!.id,
    action: 'APPROVE_APPLICATION',
    resourceType: 'APPLICATION',
    resourceId: id,
    details: { missingDocsCount: missingDocs.length },
    ip: req.ip,
  });

  logger.info(`Application approved: ${id} by ${req.admin!.email}`);
  res.json({ message: 'Application approved and onboarding email sent', onboardingToken: token });
}

// ─── Reject Application ───────────────────────────────────────────────────────

export async function rejectApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { reason } = req.body;

  const apps = await query<ApplicationRow[]>(
    'SELECT * FROM partner_applications WHERE id = ?',
    [id]
  );

  if (!apps.length) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  if (apps[0].status !== 'PENDING_REVIEW') {
    res.status(400).json({ error: `Application is already ${apps[0].status}` });
    return;
  }

  await query(
    `UPDATE partner_applications
     SET status = 'REJECTED', rejection_reason = ?, reviewed_at = NOW(), reviewed_by = ?
     WHERE id = ?`,
    [reason || null, req.admin!.id, id]
  );

  await sendRejectionEmail({
    applicationId: id,
    companyName: apps[0].company_name,
    email: apps[0].company_email,
    reason,
  });

  await auditLog({
    userId: req.admin!.id,
    action: 'REJECT_APPLICATION',
    resourceType: 'APPLICATION',
    resourceId: id,
    ip: req.ip,
  });

  res.json({ message: 'Application rejected and notification email sent' });
}

// ─── Request Documents ────────────────────────────────────────────────────────

export async function requestDocuments(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { missing_docs } = req.body;

  const apps = await query<ApplicationRow[]>('SELECT * FROM partner_applications WHERE id = ?', [id]);
  if (!apps.length) { res.status(404).json({ error: 'Application not found' }); return; }

  const onboardings = await query<OnboardingRow[]>(
    'SELECT * FROM partner_onboarding WHERE application_id = ?', [id]
  );
  if (!onboardings.length) { res.status(400).json({ error: 'Application not yet approved' }); return; }

  await sendDocumentRequestEmail({
    applicationId: id,
    companyName: apps[0].company_name,
    email: apps[0].company_email,
    onboardingToken: onboardings[0].onboarding_token,
    missingDocs: missing_docs || [],
  });

  res.json({ message: 'Document request email sent' });
}

// ─── Update Application (patch status/notes) ──────────────────────────────────

export async function updateApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  // Only allow patching rejection_reason/notes safely
  const { rejection_reason } = req.body;

  await query(
    'UPDATE partner_applications SET rejection_reason = ? WHERE id = ?',
    [rejection_reason || null, id]
  );

  res.json({ message: 'Application updated' });
}

// ─── Activate Partner ─────────────────────────────────────────────────────────

export async function activatePartner(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const apps = await query<ApplicationRow[]>('SELECT * FROM partner_applications WHERE id = ?', [id]);
  if (!apps.length) { res.status(404).json({ error: 'Application not found' }); return; }

  // Check if already exists
  const existing = await query<{ id: string }[]>('SELECT id FROM partners WHERE application_id = ?', [id]);

  if (existing.length) {
    await query('UPDATE partners SET partner_status = \'ACTIVE\', activated_at = NOW() WHERE application_id = ?', [id]);
  } else {
    await query(
      'INSERT INTO partners (id, application_id, partner_status, activated_at) VALUES (?, ?, \'ACTIVE\', NOW())',
      [generateId(), id]
    );
  }

  // Update onboarding status
  await query(
    'UPDATE partner_onboarding SET onboarding_status = \'COMPLETED\', completed_at = NOW() WHERE application_id = ?',
    [id]
  );

  await sendPartnerActivatedEmail({
    applicationId: id,
    companyName: apps[0].company_name,
    email: apps[0].company_email,
  });

  await auditLog({
    userId: req.admin!.id,
    action: 'ACTIVATE_PARTNER',
    resourceType: 'APPLICATION',
    resourceId: id,
    ip: req.ip,
  });

  res.json({ message: 'Partner activated successfully' });
}

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { query } from '../db/connection';
import { uploadDocument } from '../services/storage';
import { generateId } from '../utils/helpers';
import { DOCUMENT_FIELDS, DOCUMENT_TYPE_MAP } from '../middleware/upload';
import logger from '../utils/logger';
import { sendApplicationReceivedEmail } from '../services/email';

interface PartnerApplicationRow {
  id: string;
  company_name: string;
  company_email: string;
  status: string;
  submitted_at: string;
}

interface DocumentRow {
  id: string;
  document_type: string;
  file_name: string;
  storage_key: string;
  verification_status: string;
}

/**
 * POST /api/partner-applications
 * Submit a new partner application (public endpoint)
 */
export async function submitApplication(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const {
    company_name, website, company_email, company_phone,
    year_established, head_office_city, state, country,
    pincode, address_line1,
    company_type, employee_range, turnover_range,
    gstin, pan, registration_number, linkedin_url, interested_products,
    contact_name, contact_designation, contact_email, contact_phone,
  } = req.body;

  const applicationId = generateId();
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || null;

  try {
    await query(
      `INSERT INTO partner_applications
        (id, company_name, website, company_email, company_phone, year_established,
         head_office_city, state, country, pincode, address_line1,
         company_type, employee_range, turnover_range,
         gstin, pan, registration_number, linkedin_url, interested_products, ip_address, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_REVIEW')`,
      [
        applicationId, company_name, website, company_email, company_phone,
        year_established, head_office_city, state, country || 'India',
        pincode || null, address_line1 || null,
        company_type, employee_range, turnover_range || null,
        gstin || null, pan || null, registration_number || null, linkedin_url || null, interested_products || null,
        clientIp,
      ]
    );

    // Save primary contact if provided
    if (contact_name) {
      await query(
        `INSERT INTO partner_contacts
          (id, application_id, contact_type, full_name, designation, contact_email, contact_phone, is_primary)
         VALUES (?, ?, 'PRIMARY', ?, ?, ?, ?, TRUE)`,
        [
          generateId(),
          applicationId,
          contact_name,
          contact_designation || 'Primary Representative',
          contact_email || company_email,
          contact_phone || company_phone,
        ]
      );
    }

    // Handle optional document uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files) {
      for (const fieldName of Object.keys(files)) {
        const fileArray = files[fieldName];
        const documentType = DOCUMENT_TYPE_MAP[fieldName];
        if (!documentType || !fileArray?.length) continue;

        const file = fileArray[0];
        const storageKey = await uploadDocument(
          applicationId,
          documentType,
          file.originalname,
          file.buffer,
          file.mimetype
        );

        await query(
          `INSERT INTO partner_documents
            (id, application_id, document_type, file_name, storage_key, mime_type, file_size_bytes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [generateId(), applicationId, documentType, file.originalname, storageKey, file.mimetype, file.size]
        );
      }
    }

    logger.info(`Partner application submitted: ${applicationId} (${company_name})`);

    // Fire-and-forget: a mail problem must never fail the submission
    void sendApplicationReceivedEmail({ applicationId, companyName: company_name, email: company_email }).catch((e) =>
      logger.error('Application-received email error:', e)
    );

    res.status(201).json({
      message: 'Application submitted successfully. We will review it and contact you shortly.',
      applicationId,
    });
  } catch (err) {
    logger.error('Error submitting application:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

/**
 * POST /api/partner-applications/:id/documents
 * Upload documents for an existing application (via onboarding link)
 */
export async function uploadApplicationDocuments(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const rows = await query<PartnerApplicationRow[]>(
    'SELECT id, status FROM partner_applications WHERE id = ?',
    [id]
  );

  if (!rows.length) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  if (!files || Object.keys(files).length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  const uploaded: string[] = [];

  try {
    for (const fieldName of Object.keys(files)) {
      const fileArray = files[fieldName];
      const documentType = DOCUMENT_TYPE_MAP[fieldName];
      if (!documentType || !fileArray?.length) continue;

      const file = fileArray[0];
      const storageKey = await uploadDocument(id, documentType, file.originalname, file.buffer, file.mimetype);

      // Upsert: replace existing doc of same type
      await query(
        `INSERT INTO partner_documents
          (id, application_id, document_type, file_name, storage_key, mime_type, file_size_bytes, verification_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
         ON DUPLICATE KEY UPDATE
          file_name = VALUES(file_name), storage_key = VALUES(storage_key),
          mime_type = VALUES(mime_type), file_size_bytes = VALUES(file_size_bytes),
          verification_status = 'SUBMITTED', uploaded_at = NOW()`,
        [generateId(), id, documentType, file.originalname, storageKey, file.mimetype, file.size]
      );

      uploaded.push(documentType);
    }

    res.json({ message: 'Documents uploaded successfully', uploaded });
  } catch (err) {
    logger.error('Error uploading documents:', err);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
}

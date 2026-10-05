import { Router } from 'express';
import { body } from 'express-validator';
import { submitApplication, uploadApplicationDocuments } from '../controllers/applicationController';
import { uploadMiddleware, DOCUMENT_FIELDS } from '../middleware/upload';

const router = Router();

// Validation rules for the partner application form
const applicationValidation = [
  body('company_name').trim().notEmpty().withMessage('Company name is required').isLength({ max: 255 }),
  body('website').trim().notEmpty().isURL().withMessage('Valid website URL is required'),
  body('company_email').trim().notEmpty().isEmail().withMessage('Valid company email is required').normalizeEmail(),
  body('company_phone').trim().notEmpty().matches(/^\+?[0-9\s\-()]{7,20}$/).withMessage('Valid phone number is required'),
  body('year_established').isInt({ min: 1800, max: new Date().getFullYear() }).withMessage('Valid year required'),
  body('head_office_city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('country').trim().optional().default('India'),
  body('company_type').isIn([
    'Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'OPC', 'Other'
  ]).withMessage('Invalid company type'),
  body('employee_range').isIn(['1-10', '11-50', '51-200', '201-500', '500+']).withMessage('Invalid employee range'),
  body('turnover_range').optional().isIn(['< 1 Cr', '1-10 Cr', '10-25 Cr', '25-100 Cr', '100+ Cr']),
  body('gstin').optional().trim().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GSTIN format'),
  body('pan').optional().trim().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN format'),
  body('registration_number').optional().trim().isLength({ max: 50 }),
  body('linkedin_url').optional().trim().isURL().withMessage('Invalid LinkedIn URL'),
  body('pincode').optional().trim().isLength({ max: 10 }),
  body('address_line1').optional().trim().isLength({ max: 255 }),
  body('contact_name').optional().trim().isLength({ max: 255 }),
  body('contact_designation').optional().trim().isLength({ max: 100 }),
  body('contact_email').optional().trim().isEmail().normalizeEmail(),
  body('contact_phone').optional().trim().matches(/^\+?[0-9\s\-()]{7,20}$/),
];

/**
 * POST /api/partner-applications
 * Public: Submit a new partner application (with optional document uploads)
 */
router.post(
  '/partner-applications',
  uploadMiddleware.fields(DOCUMENT_FIELDS),
  applicationValidation,
  submitApplication
);

/**
 * POST /api/partner-applications/:id/documents
 * Public (token-less): Upload additional docs for an existing application
 * In production, protect this via the onboarding token instead
 */
router.post(
  '/partner-applications/:id/documents',
  uploadMiddleware.fields(DOCUMENT_FIELDS),
  uploadApplicationDocuments
);

export default router;

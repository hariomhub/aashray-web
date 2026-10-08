import { Router } from 'express';
import { authenticateAdmin, requireApproverRole, requireSuperAdmin } from '../middleware/auth';
import {
  adminLogin,
  listApplications,
  getApplication,
  updateApplication,
  approveApplication,
  rejectApplication,
  requestDocuments,
  viewDocument,
  verifyDocument,
  activatePartner,
  listActivity,
} from '../controllers/adminController';

const router = Router();

// ─── Auth (Public) ─────────────────────────────────────────────────────────────
router.post('/login', adminLogin);

// All routes below require authentication
router.use(authenticateAdmin);

// ─── Partner Applications ──────────────────────────────────────────────────────

/** GET /api/admin/partner-applications?status=PENDING_REVIEW&page=1&limit=20&search= */
router.get('/partner-applications', listApplications);

/** GET /api/admin/partner-applications/:id */
router.get('/partner-applications/:id', getApplication);

/** PATCH /api/admin/partner-applications/:id */
router.patch('/partner-applications/:id', requireApproverRole, updateApplication);

/** POST /api/admin/partner-applications/:id/approve */
router.post('/partner-applications/:id/approve', requireApproverRole, approveApplication);

/** POST /api/admin/partner-applications/:id/reject */
router.post('/partner-applications/:id/reject', requireApproverRole, rejectApplication);

/** POST /api/admin/partner-applications/:id/request-documents */
router.post('/partner-applications/:id/request-documents', requireApproverRole, requestDocuments);

/** POST /api/admin/partner-applications/:id/activate */
router.post('/partner-applications/:id/activate', requireApproverRole, activatePartner);

// ─── Documents ────────────────────────────────────────────────────────────────

/** GET /api/admin/documents/:docId — Returns a short-lived SAS URL */
router.get('/documents/:docId', viewDocument);

/** PATCH /api/admin/documents/:docId/verify */
router.patch('/documents/:docId/verify', requireApproverRole, verifyDocument);

// ─── Activity ─────────────────────────────────────────────────────────────────

/** GET /api/admin/activity */
router.get('/activity', listActivity);

export default router;

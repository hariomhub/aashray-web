import { Router } from 'express';
import {
  getOnboarding,
  acceptAgreement,
  uploadOnboardingDocuments,
  completeOnboarding,
} from '../controllers/onboardingController';
import { uploadMiddleware, DOCUMENT_FIELDS } from '../middleware/upload';

const router = Router();

/** GET /api/onboarding/:token — Fetch onboarding state */
router.get('/:token', getOnboarding);

/** GET /api/onboarding/:token/agreement — Returns the agreement URL/PDF info */
router.get('/:token/agreement', (req, res) => {
  res.json({
    version: process.env.AGREEMENT_VERSION || '1.0',
    url: process.env.AGREEMENT_URL || null,
    title: 'Aashray Partner Agreement',
  });
});

/** POST /api/onboarding/:token/accept-agreement */
router.post('/:token/accept-agreement', acceptAgreement);

/** POST /api/onboarding/:token/documents — Upload remaining docs */
router.post(
  '/:token/documents',
  uploadMiddleware.fields(DOCUMENT_FIELDS),
  uploadOnboardingDocuments
);

/** POST /api/onboarding/:token/complete */
router.post('/:token/complete', completeOnboarding);

export default router;

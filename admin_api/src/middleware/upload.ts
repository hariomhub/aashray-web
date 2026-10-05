import multer from 'multer';
import { Request } from 'express';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const storage = multer.memoryStorage();

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, JPEG, PNG, and WEBP are allowed.`));
  }
}

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

/** Field names for document uploads */
export const DOCUMENT_FIELDS = [
  { name: 'gst_proof_document', maxCount: 1 },
  { name: 'pan_proof_document', maxCount: 1 },
  { name: 'registration_proof_document', maxCount: 1 },
];

export const DOCUMENT_TYPE_MAP: Record<string, string> = {
  gst_proof_document: 'GST_CERTIFICATE',
  pan_proof_document: 'PAN_CARD',
  registration_proof_document: 'REGISTRATION_CERTIFICATE',
};

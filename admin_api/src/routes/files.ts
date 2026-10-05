import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { getStorageMode, resolveLocalPath, verifyLocalSignature } from '../services/storage';

const router = Router();

/**
 * GET /api/files/local?key=...&exp=...&sig=...
 * Only active in local storage mode. The signature is issued by getDocumentUrl()
 * to authenticated admins, so no auth header is needed here.
 */
router.get('/local', (req, res) => {
  if (getStorageMode() !== 'local') {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const key = String(req.query.key || '');
  const exp = Number(req.query.exp);
  const sig = String(req.query.sig || '');

  if (!verifyLocalSignature(key, exp, sig)) {
    res.status(403).json({ error: 'Link is invalid or has expired' });
    return;
  }

  let filePath: string;
  try {
    filePath = resolveLocalPath(key);
  } catch {
    res.status(400).json({ error: 'Invalid key' });
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath).replace(/"/g, '')}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.sendFile(filePath);
});

export default router;

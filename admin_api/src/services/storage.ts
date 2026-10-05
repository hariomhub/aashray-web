import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

/**
 * Hybrid document storage.
 *
 *  - Azure mode: used when AZURE_STORAGE_CONNECTION_STRING is a real value
 *    (not empty, not the "AccountName=dev" placeholder) or STORAGE_MODE=azure.
 *  - Local mode: files are written to LOCAL_UPLOAD_DIR (default ./uploads) and served
 *    through a signed, short-lived URL handled by routes/files.ts.
 *
 * Force a mode with STORAGE_MODE=local | azure.
 * Env is read lazily so dotenv ordering never matters.
 */

export type StorageMode = 'azure' | 'local';

function cfg() {
  return {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    containerName: process.env.AZURE_STORAGE_CONTAINER || 'partner-documents',
    sasExpiryMinutes: parseInt(process.env.AZURE_SAS_EXPIRY_MINUTES || '15', 10),
    localDir: path.resolve(process.env.LOCAL_UPLOAD_DIR || path.join(process.cwd(), 'uploads')),
    publicApiUrl: (process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 4000}`).replace(/\/$/, ''),
    signingSecret: process.env.FILE_URL_SECRET || process.env.JWT_SECRET || 'dev-file-secret',
  };
}

function isPlaceholderConnectionString(cs: string): boolean {
  return !cs || /AccountName=(dev|youraccount)(;|$)/i.test(cs) || /AccountKey=(dev|yourkey)(;|$)/i.test(cs);
}

export function getStorageMode(): StorageMode {
  const forced = (process.env.STORAGE_MODE || '').toLowerCase();
  if (forced === 'local' || forced === 'azure') return forced;
  return isPlaceholderConnectionString(cfg().connectionString) ? 'local' : 'azure';
}

let blobServiceClient: BlobServiceClient | undefined;
function getClient(): BlobServiceClient {
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(cfg().connectionString);
  }
  return blobServiceClient;
}

function buildStorageKey(applicationId: string, documentType: string, fileName: string): string {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${applicationId}/${documentType}/${Date.now()}_${safeFileName}`;
}

/** Resolve a storage key to an absolute local path, refusing path traversal. */
export function resolveLocalPath(storageKey: string): string {
  const root = cfg().localDir;
  const full = path.resolve(root, storageKey);
  if (full !== root && !full.startsWith(root + path.sep)) {
    throw new Error('Invalid storage key');
  }
  return full;
}

function sign(storageKey: string, expires: number): string {
  return crypto.createHmac('sha256', cfg().signingSecret).update(`${storageKey}:${expires}`).digest('hex');
}

/** Verify a signed local download link. Used by the file-serving route. */
export function verifyLocalSignature(storageKey: string, expires: number, signature: string): boolean {
  if (!storageKey || !Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = Buffer.from(sign(storageKey, expires));
  const given = Buffer.from(signature || '');
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

/**
 * Upload a file buffer. Returns the storage key (NOT a public URL).
 */
export async function uploadDocument(
  applicationId: string,
  documentType: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const storageKey = buildStorageKey(applicationId, documentType, fileName);

  if (getStorageMode() === 'local') {
    const target = resolveLocalPath(storageKey);
    await fs.promises.mkdir(path.dirname(target), { recursive: true });
    await fs.promises.writeFile(target, buffer);
    logger.info(`[storage:local] Saved document: ${storageKey}`);
    return storageKey;
  }

  const containerClient = getClient().getContainerClient(cfg().containerName);
  await containerClient.createIfNotExists(); // private by default
  const blockBlobClient = containerClient.getBlockBlobClient(storageKey);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
    metadata: { applicationId, documentType, originalFileName: fileName.replace(/[^\x20-\x7E]/g, '_') },
  });
  logger.info(`[storage:azure] Uploaded document: ${storageKey}`);
  return storageKey;
}

/**
 * Short-lived URL for viewing a document.
 *  - azure: blob URL with a read-only SAS token
 *  - local: signed URL to /api/files/local
 */
export async function getDocumentUrl(storageKey: string): Promise<string> {
  const { sasExpiryMinutes, connectionString, containerName, publicApiUrl } = cfg();

  if (getStorageMode() === 'local') {
    const target = resolveLocalPath(storageKey);
    if (!fs.existsSync(target)) throw new Error(`Document not found: ${storageKey}`);
    const expires = Date.now() + sasExpiryMinutes * 60_000;
    const qs = new URLSearchParams({ key: storageKey, exp: String(expires), sig: sign(storageKey, expires) });
    return `${publicApiUrl}/api/files/local?${qs.toString()}`;
  }

  const blockBlobClient = getClient().getContainerClient(containerName).getBlockBlobClient(storageKey);
  if (!(await blockBlobClient.exists())) throw new Error(`Document not found: ${storageKey}`);

  const accountName = connectionString.match(/AccountName=([^;]+)/)?.[1];
  const accountKey = connectionString.match(/AccountKey=([^;]+)/)?.[1];
  if (!accountName || !accountKey) {
    // e.g. Azurite / SAS-only connection strings: return the plain blob URL
    return blockBlobClient.url;
  }

  const expiresOn = new Date(Date.now() + sasExpiryMinutes * 60_000);
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: storageKey,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(Date.now() - 60_000), // tolerate small clock skew
      expiresOn,
    },
    new StorageSharedKeyCredential(accountName, accountKey)
  ).toString();

  return `${blockBlobClient.url}?${sasToken}`;
}

/** Delete a document from storage. */
export async function deleteDocument(storageKey: string): Promise<void> {
  if (getStorageMode() === 'local') {
    await fs.promises.rm(resolveLocalPath(storageKey), { force: true });
    logger.info(`[storage:local] Deleted document: ${storageKey}`);
    return;
  }
  await getClient().getContainerClient(cfg().containerName).getBlockBlobClient(storageKey).deleteIfExists();
  logger.info(`[storage:azure] Deleted document: ${storageKey}`);
}

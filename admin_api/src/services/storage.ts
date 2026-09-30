import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import { Readable } from 'stream';
import logger from '../utils/logger';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER || 'partner-documents';
const sasExpiryMinutes = parseInt(process.env.AZURE_SAS_EXPIRY_MINUTES || '15', 10);

let blobServiceClient: BlobServiceClient;

function getClient(): BlobServiceClient {
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
}

/**
 * Upload a file buffer to Azure Blob Storage.
 * Returns the storage key (blob name) — NOT a public URL.
 */
export async function uploadDocument(
  applicationId: string,
  documentType: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const client = getClient();
  const containerClient = client.getContainerClient(containerName);

  // Ensure container exists (private access — no public URL)
  await containerClient.createIfNotExists({ access: undefined });

  const timestamp = Date.now();
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageKey = `${applicationId}/${documentType}/${timestamp}_${safeFileName}`;

  const blockBlobClient = containerClient.getBlockBlobClient(storageKey);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
    metadata: {
      applicationId,
      documentType,
      originalFileName: fileName,
    },
  });

  logger.info(`Uploaded document: ${storageKey}`);
  return storageKey;
}

/**
 * Generate a short-lived SAS URL for viewing/downloading a document.
 * Expires in AZURE_SAS_EXPIRY_MINUTES (default 15 min).
 */
export async function getDocumentUrl(storageKey: string): Promise<string> {
  const client = getClient();
  const containerClient = client.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(storageKey);

  // Check if blob exists
  const exists = await blockBlobClient.exists();
  if (!exists) {
    throw new Error(`Document not found: ${storageKey}`);
  }

  const startsOn = new Date();
  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + sasExpiryMinutes);

  // Parse account name and key from connection string
  const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
  const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

  if (!accountNameMatch || !accountKeyMatch) {
    // Fallback: return blob URL without SAS (useful for local dev with Azurite)
    return blockBlobClient.url;
  }

  const accountName = accountNameMatch[1];
  const accountKey = accountKeyMatch[1];

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: storageKey,
      permissions: BlobSASPermissions.parse('r'),
      startsOn,
      expiresOn,
    },
    sharedKeyCredential
  ).toString();

  return `${blockBlobClient.url}?${sasToken}`;
}

/**
 * Delete a document from storage.
 */
export async function deleteDocument(storageKey: string): Promise<void> {
  const client = getClient();
  const containerClient = client.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(storageKey);
  await blockBlobClient.deleteIfExists();
  logger.info(`Deleted document: ${storageKey}`);
}

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/** Generate a UUID v4 */
export function generateId(): string {
  return uuidv4();
}

/** Generate a cryptographically secure onboarding token */
export function generateOnboardingToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

/** Build a human-readable Application ID */
export function generateAppId(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APP-${year}-${random}`;
}

/** Get expiry date for onboarding token */
export function getOnboardingTokenExpiry(): Date {
  const hours = parseInt(process.env.ONBOARDING_TOKEN_EXPIRES_HOURS || '72', 10);
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}

/** Format bytes to readable size */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/** Redact sensitive text for logging */
export function redact(value: string | undefined | null, showFirst = 4): string {
  if (!value) return '[empty]';
  return value.substring(0, showFirst) + '***';
}

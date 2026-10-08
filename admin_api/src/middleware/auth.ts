import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';
import logger from '../utils/logger';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'PARTNER_ADMIN';
  /** Set for partner-applicant accounts: restricts access to that one application. */
  applicationId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

export function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || '') as AdminUser;
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Role guard: only SUPER_ADMIN and PARTNER_ADMIN can approve/reject */
export function requireApproverRole(req: Request, res: Response, next: NextFunction): void {
  if (!req.admin || req.admin.applicationId) {
    res.status(403).json({ error: 'Insufficient permissions' });
    return;
  }
  next();
}

/** Role guard: only SUPER_ADMIN can manage admin users */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.admin || req.admin.role !== 'SUPER_ADMIN') {
    res.status(403).json({ error: 'Insufficient permissions — super admin required' });
    return;
  }
  next();
}

/** Log admin action to audit_logs */
export async function auditLog(params: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
}): Promise<void> {
  try {
    const { v4: uuidv4 } = await import('uuid');
    await query(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        params.userId,
        params.action,
        params.resourceType,
        params.resourceId || null,
        params.details ? JSON.stringify(params.details) : null,
        params.ip || null,
      ]
    );
  } catch (err) {
    logger.error('Failed to write audit log:', err);
  }
}

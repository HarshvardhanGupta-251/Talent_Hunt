import { Request, Response, NextFunction } from 'express';
import { usersStore, activeSessions, StoredUser, auditLogsStore } from './db.js';
import { UserRole } from '../src/types.js';

export interface AuthenticatedRequest extends Request {
  user?: StoredUser;
}

// Extract authenticated user from Authorization header or cookies
export function getAuthenticatedUser(req: Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.cookies && req.cookies.eyewinn_token) {
    token = req.cookies.eyewinn_token;
  }

  if (!token) return null;

  const userId = activeSessions.get(token);
  if (!userId) return null;

  const user = usersStore.find((u) => u.id === userId && u.status === 'active');
  return user || null;
}

// Middleware: Require valid login
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  req.user = user;
  next();
}

// Middleware: Require ADMIN or SUPER_ADMIN role (server-side protection)
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    return res.status(403).json({ error: '403 Forbidden: Administrator privileges required.' });
  }
  req.user = user;
  next();
}

// Middleware: Require SUPER_ADMIN role
export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  if (user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: '403 Forbidden: Super Admin privileges required.' });
  }
  req.user = user;
  next();
}

// Audit logger helper
export function logAdminAction(admin: StoredUser, action: string, target: string, details?: string) {
  auditLogsStore.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    adminId: admin.id,
    adminName: admin.name,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
  });
}

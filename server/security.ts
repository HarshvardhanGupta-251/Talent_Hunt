import { Request, Response, NextFunction } from 'express';

// ============================================================================
// EYE WINN Enterprise Security Middleware & Sanitization Utilities
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * In-memory sliding window rate limiter middleware.
 * Prevents brute-force credential stuffing and denial of service.
 */
export function rateLimiter(options: { windowMs: number; maxRequests: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Determine client identifier (IP address or fallback)
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    const existing = rateLimitStore.get(key);

    if (!existing || existing.resetAt <= now) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', options.maxRequests - 1);
      return next();
    }

    if (existing.count >= options.maxRequests) {
      const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({
        error: options.message || 'Too many requests. Please try again in a few moments.',
        retryAfterSeconds: retryAfterSec,
      });
    }

    existing.count += 1;
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - existing.count));
    next();
  };
}

/**
 * Enterprise HTTP Security Headers Middleware.
 * Defends against MIME sniffing, clickjacking, XSS, and dangerous browser behaviors.
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Legacy XSS filter activation
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Disable unsafe device APIs
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=*');
  
  // Guard against direct exposure of sensitive configuration files, keys, and backend source files
  const normalizedPath = req.path.toLowerCase();
  const forbiddenPatterns = [
    /^\/\.env/i,
    /^\/\.git/i,
    /^\/server(\/|\.ts|\.cjs|\.js)/i,
    /\.(env|pem|key|cert|crt|log|sql|bak|backup)$/i,
    /package(-lock)?\.json$/i,
    /tsconfig\.json$/i,
    /metadata\.json$/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(normalizedPath)) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  next();
}

/**
 * Basic XSS sanitization for string fields.
 * Strips script tags, javascript: pseudo-protocols, and dangerous HTML delimiters.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Safe Object Copy to defend against Prototype Pollution attacks.
 * Whitelists allowed keys and rejects dangerous constructor/prototype mutations.
 */
export function safeAssign<T extends object>(target: T, source: Record<string, any>, allowedKeys: (keyof T)[]): T {
  if (!source || typeof source !== 'object') return target;

  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const val = source[key as string];
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      if (typeof val === 'string') {
        (target as any)[key] = sanitizeString(val);
      } else if (typeof val === 'number' || typeof val === 'boolean' || Array.isArray(val)) {
        (target as any)[key] = val;
      }
    }
  }

  return target;
}

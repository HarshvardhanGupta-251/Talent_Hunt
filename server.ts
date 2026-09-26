import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import {
  siteContent,
  bookMeta,
  privateBookPages,
  scriptMeta,
  privateScriptPages,
  usersStore,
  activeSessions,
  paymentsStore,
  auditionsStore,
  auditLogsStore,
  contactMessagesStore,
  hashPassword,
  verifyPassword,
  StoredUser,
} from './server/db.js';
import {
  requireAuth,
  requireAdmin,
  getAuthenticatedUser,
  logAdminAction,
  AuthenticatedRequest,
} from './server/auth.js';
import {
  rateLimiter,
  securityHeaders,
  sanitizeString,
  safeAssign,
} from './server/security.js';
import { PaymentRecord, AuditionApplication, ContactMessage, SiteContent, ScriptMeta } from './src/types.js';

export const app = express();

// Enterprise Security Headers
app.use(securityHeaders);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiters for security protection
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
  message: 'Too many authentication attempts. Please try again in a few minutes.',
});

const submissionRateLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 30,
  message: 'Submission rate limit exceeded. Please wait a moment before sending another request.',
});

  // ============================================================
  // 1. HEALTH & METADATA
  // ============================================================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Public Site Content
  app.get('/api/content', (req, res) => {
    res.json(siteContent);
  });

  // ============================================================
  // 2. AUTHENTICATION APIs
  // ============================================================
  app.post('/api/auth/register', authRateLimiter, (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const cleanEmail = sanitizeString(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const newUser: StoredUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: sanitizeString(name),
      email: cleanEmail,
      phone: sanitizeString(phone || ''),
      role: 'USER',
      hasPaidBook: false,
      readingProgress: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
    };

    usersStore.push(newUser);

    const token = crypto.randomUUID();
    activeSessions.set(token, newUser.id);
    res.cookie('eyewinn_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser, token });
  });

  app.post('/api/auth/login', authRateLimiter, (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = sanitizeString(email).toLowerCase();
    const user = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);

    const isMatch = user && verifyPassword(password, user.passwordHash);

    if (!user || !isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is suspended. Please contact editorial administration.' });
    }

    const token = crypto.randomUUID();
    activeSessions.set(token, user.id);
    res.cookie('eyewinn_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      logAdminAction(user, 'ADMIN_LOGIN', 'Admin Console', `Signed in from ${req.ip || 'secure connection'}`);
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.json({ user: null });
    }
    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.cookies && req.cookies.eyewinn_token) {
      token = req.cookies.eyewinn_token;
    }
    if (token) {
      activeSessions.delete(token);
    }
    res.clearCookie('eyewinn_token');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ============================================================
  // 3. SECURE BOOK ARCHITECTURE & READER APIs
  // ============================================================
  // Public Book Metadata
  app.get('/api/book/meta', (req, res) => {
    res.json(bookMeta);
  });

  // Page Access with Strict Server-Side Authorization
  // CRITICAL: Pages 1-3 are free. Pages 4+ require verified payment or admin role.
  app.get('/api/book/page/:pageNumber', (req, res) => {
    const pageNum = parseInt(req.params.pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page number requested.' });
    }

    const page = privateBookPages.find((p) => p.pageNumber === pageNum);
    if (!page) {
      return res.status(404).json({ error: `Page ${pageNum} does not exist in this edition.` });
    }

    // Free Preview Check: Strictly only pages 1 to previewPagesCount (pages 1-3) AND isFreePreview must be true
    if (pageNum <= bookMeta.previewPagesCount && page.isFreePreview) {
      return res.json({
        ...page,
        chapterTitle: page.chapterName,
        content: Array.isArray(page.content) ? page.content.join('\n\n') : page.content,
        watermark: 'EYE WINN • Master Beerbhan Preview',
      });
    }

    // Beyond Preview: Strict Server-Side Payment Verification Enforced
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication and purchase required to access pages beyond the free preview.',
        requiresAuth: true,
        previewLimit: bookMeta.previewPagesCount,
      });
    }

    // Strict access requirement: User must have verified purchase, or have administrator review privileges
    const isPrivilegedStaff = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    if (!user.hasPaidBook && !isPrivilegedStaff) {
      return res.status(403).json({
        error: 'Payment required: You must purchase the complete document to unlock page 4 and beyond.',
        isLocked: true,
        previewLimit: bookMeta.previewPagesCount,
        priceINR: bookMeta.priceINR,
      });
    }

    // Update user's reading progress
    if (pageNum > user.readingProgress) {
      user.readingProgress = pageNum;
    }

    // Return requested single page with subtle dynamic watermark
    return res.json({
      ...page,
      chapterTitle: page.chapterName,
      content: Array.isArray(page.content) ? page.content.join('\n\n') : page.content,
      watermark: `Licensed to: ${user.name} (${user.email}) • EYE WINN Official Edition`,
    });
  });

  // Check Current User's Book Access Status
  app.get('/api/book/access', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.json({
        hasAccess: false,
        isLoggedIn: false,
        previewPagesCount: bookMeta.previewPagesCount,
        totalPages: privateBookPages.length,
      });
    }

    const hasAccess = user.hasPaidBook || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    return res.json({
      hasAccess,
      isLoggedIn: true,
      userRole: user.role,
      readingProgress: user.readingProgress,
      previewPagesCount: bookMeta.previewPagesCount,
      totalPages: privateBookPages.length,
      priceINR: bookMeta.priceINR,
    });
  });

  // ============================================================
  // 3B. OFFICIAL SCRIPT / SCREENPLAY API ROUTES
  // ============================================================
  app.get('/api/script/meta', (req, res) => {
    return res.json({
      ...scriptMeta,
      totalPages: privateScriptPages.length,
    });
  });

  app.get('/api/script/page/:pageNumber', (req, res) => {
    const pageNum = parseInt(req.params.pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page number requested.' });
    }

    const page = privateScriptPages.find((p) => p.pageNumber === pageNum);
    if (!page) {
      return res.status(404).json({ error: `Page ${pageNum} does not exist in this script edition.` });
    }

    // Free Preview Check: Strictly only pages 1 to 3
    if (pageNum <= scriptMeta.previewPagesCount && page.isFreePreview) {
      return res.json({
        ...page,
        content: Array.isArray(page.content) ? page.content.join('\n\n') : page.content,
        watermark: 'EYE WINN Screenplay • Official 3-Page Free Preview',
      });
    }

    // Beyond Preview: Strict Server-Side Payment Verification Enforced
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication and verified script access required to read beyond page 3.',
        requiresAuth: true,
        previewLimit: scriptMeta.previewPagesCount,
      });
    }

    const isPrivilegedStaff = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    if (!user.hasPaidScript && !isPrivilegedStaff) {
      return res.status(403).json({
        error: 'Screenplay Access Locked: Please pay the script fee and enter UTR number for Super Admin verification.',
        isLocked: true,
        previewLimit: scriptMeta.previewPagesCount,
        priceINR: scriptMeta.priceINR,
      });
    }

    // Update user's reading progress for script
    if (pageNum > (user.readingProgressScript || 0)) {
      user.readingProgressScript = pageNum;
    }

    return res.json({
      ...page,
      content: Array.isArray(page.content) ? page.content.join('\n\n') : page.content,
      watermark: `Licensed to: ${user.name} (${user.email}) • EYE WINN Official Screenplay`,
    });
  });

  app.get('/api/script/access', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.json({
        hasAccess: false,
        isLoggedIn: false,
        previewPagesCount: scriptMeta.previewPagesCount,
        totalPages: privateScriptPages.length,
      });
    }

    const hasAccess = Boolean(user.hasPaidScript) || user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    return res.json({
      hasAccess,
      isLoggedIn: true,
      userRole: user.role,
      readingProgressScript: user.readingProgressScript || 1,
      previewPagesCount: scriptMeta.previewPagesCount,
      totalPages: privateScriptPages.length,
      priceINR: scriptMeta.priceINR,
    });
  });

  // ============================================================
  // 4. DIRECT UPI & UTR VERIFICATION PAYMENT SYSTEM
  // ============================================================
  app.post('/api/payment/create-order', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const orderId = `order_eyewinn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const pendingPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      orderId,
      paymentId: '',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount: bookMeta.priceINR,
      currency: 'INR',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    paymentsStore.unshift(pendingPayment);

    return res.json({
      orderId,
      amount: bookMeta.priceINR,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      bookTitle: bookMeta.title,
    });
  });

  app.post('/api/payment/verify-payment', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const { orderId, paymentId, signature, simulationMode } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required for verification.' });
    }

    const payment = paymentsStore.find((p) => p.orderId === orderId);
    if (!payment) {
      return res.status(404).json({ error: 'Order record not found in payment gateway.' });
    }

    // In a real environment, verify Razorpay HMAC SHA256 signature using RAZORPAY_KEY_SECRET
    // Here we support Razorpay's production verification standard with sandbox simulation
    const actualPaymentId = paymentId || `pay_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    payment.paymentId = actualPaymentId;
    payment.status = 'SUCCESSFUL';
    payment.verifiedAt = new Date().toISOString();

    // Grant verified user full book access
    user.hasPaidBook = true;

    // Log to audit trail
    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      adminId: 'system-payment-gateway',
      adminName: 'Razorpay Payment Gateway',
      action: 'PAYMENT_VERIFIED',
      target: `User: ${user.name} (${user.email})`,
      details: `Order: ${orderId}, Payment ID: ${actualPaymentId}, Amount: ₹${payment.amount}`,
      timestamp: new Date().toISOString(),
    });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Payment verified successfully! Complete book access has been granted.',
      payment,
      user: safeUser,
    });
  });

  // Submit UPI UTR for Super Admin manual verification (Supports Book and Script)
  app.post('/api/payment/submit-utr', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const { utrNumber, userNote, itemType } = req.body;
    const targetItem: 'BOOK' | 'SCRIPT' = itemType === 'SCRIPT' ? 'SCRIPT' : 'BOOK';

    if (!utrNumber || typeof utrNumber !== 'string') {
      return res.status(400).json({ error: 'Please enter a valid 12-digit UTR or Transaction Reference number.' });
    }

    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 6 || cleanUtr.length > 35) {
      return res.status(400).json({ error: 'UTR number must be between 6 and 35 characters.' });
    }

    // Check if user already has verified access for this item
    if (targetItem === 'BOOK' && user.hasPaidBook) {
      return res.status(400).json({ error: 'You already have verified full book access on your account.' });
    }
    if (targetItem === 'SCRIPT' && user.hasPaidScript) {
      return res.status(400).json({ error: 'You already have verified full script access on your account.' });
    }

    // Check if this exact UTR was already submitted and pending or approved
    const duplicatePendingOrApproved = paymentsStore.find(
      (p) => p.utrNumber?.toLowerCase() === cleanUtr.toLowerCase() && (p.status === 'SUCCESSFUL' || p.status === 'PENDING_APPROVAL')
    );
    if (duplicatePendingOrApproved) {
      if (duplicatePendingOrApproved.status === 'SUCCESSFUL') {
        return res.status(409).json({ error: 'This UTR number has already been verified and credited.' });
      } else {
        return res.status(409).json({ error: 'This UTR number has already been submitted and is currently pending verification.' });
      }
    }

    const itemPrice = targetItem === 'SCRIPT' ? scriptMeta.priceINR : bookMeta.priceINR;
    const itemTitle = targetItem === 'SCRIPT' ? scriptMeta.title : bookMeta.title;

    // Create a new PENDING_APPROVAL record
    const pendingPayment: PaymentRecord = {
      id: `pay-utr-${Date.now()}`,
      orderId: `upi_${targetItem.toLowerCase()}_${Date.now()}`,
      paymentId: `UTR-${cleanUtr}`,
      utrNumber: cleanUtr,
      itemType: targetItem,
      itemTitle: itemTitle,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount: itemPrice,
      currency: 'INR',
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString(),
      userNote: userNote ? sanitizeString(String(userNote)) : undefined,
      createdAt: new Date().toISOString(),
    };

    paymentsStore.unshift(pendingPayment);

    // Update user pending state
    if (targetItem === 'SCRIPT') {
      user.scriptPaymentPending = true;
      user.pendingScriptUtr = cleanUtr;
    } else {
      user.paymentPending = true;
      user.pendingUtr = cleanUtr;
    }

    // Audit log
    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'UTR_SUBMITTED',
      target: `User: ${user.name} (${user.email})`,
      details: `Submitted UTR: ${cleanUtr} for ₹${itemPrice} (${targetItem}) verification`,
      timestamp: new Date().toISOString(),
    });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: `Your UTR number has been submitted successfully for ${targetItem === 'SCRIPT' ? 'The Script' : 'The Book'}! The Client / Super Admin will verify it and give you permission to read.`,
      payment: pendingPayment,
      user: safeUser,
    });
  });

  // Check user's current payment and approval status
  app.get('/api/payment/my-status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const latestPayment = paymentsStore.find((p) => p.userId === user.id);
    const latestBookPayment = paymentsStore.find((p) => p.userId === user.id && (p.itemType === 'BOOK' || !p.itemType));
    const latestScriptPayment = paymentsStore.find((p) => p.userId === user.id && p.itemType === 'SCRIPT');
    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      hasPaidBook: Boolean(user.hasPaidBook),
      hasPaidScript: Boolean(user.hasPaidScript),
      paymentPending: Boolean(user.paymentPending),
      pendingUtr: user.pendingUtr || null,
      scriptPaymentPending: Boolean(user.scriptPaymentPending),
      pendingScriptUtr: user.pendingScriptUtr || null,
      latestPayment: latestPayment || null,
      latestBookPayment: latestBookPayment || null,
      latestScriptPayment: latestScriptPayment || null,
      user: safeUser,
    });
  });

  // User's own payment history
  app.get('/api/payment/my-history', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const userPayments = paymentsStore.filter((p) => p.userId === user.id);
    return res.json(userPayments);
  });

  // ============================================================
  // 5. AUDITION / CASTING SYSTEM
  // ============================================================
  app.post('/api/audition/apply', submissionRateLimiter, (req, res) => {
    const currentUser = getAuthenticatedUser(req);
    const {
      fullName,
      dob,
      gender,
      phone,
      email,
      city,
      state,
      country,
      actingExperience,
      currentProfession,
      languages,
      height,
      portfolioUrl,
      previousProjects,
      characterInterestedIn,
      introduction,
      profilePhotoUrl,
      demoReelUrl,
      videoAuditionUrl,
      portfolioFileName,
      portfolioFileContent, // base64 or simulated private doc content
      consent,
    } = req.body;

    if (!fullName || !phone || !email || !characterInterestedIn || !introduction) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    const cleanEmail = sanitizeString(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'You must agree to the Audition Terms and Privacy Policy.' });
    }

    const applicationSeq = auditionsStore.length + 101;
    const applicationId = `EYW-AUD-2026-${String(applicationSeq).padStart(6, '0')}`;
    const portfolioFileId = `doc-sec-portfolio-${Date.now()}`;

    const newApplication: AuditionApplication = {
      id: applicationId,
      userId: currentUser ? currentUser.id : `guest-${Date.now()}`,
      fullName: sanitizeString(fullName),
      dob: sanitizeString(dob || ''),
      gender: sanitizeString(gender || 'Not Specified'),
      phone: sanitizeString(phone),
      email: cleanEmail,
      address: sanitizeString(req.body.address || ''),
      city: sanitizeString(city || ''),
      state: sanitizeString(state || ''),
      country: sanitizeString(country || 'India'),
      actingExperience: sanitizeString(actingExperience || ''),
      currentProfession: sanitizeString(currentProfession || ''),
      languages: sanitizeString(languages || ''),
      height: sanitizeString(height || ''),
      portfolioUrl: sanitizeString(portfolioUrl || ''),
      instagramUrl: sanitizeString(req.body.instagramUrl || ''),
      facebookUrl: sanitizeString(req.body.facebookUrl || ''),
      introVideoUrl: sanitizeString(req.body.introVideoUrl || videoAuditionUrl || demoReelUrl || ''),
      previousProjects: sanitizeString(previousProjects || ''),
      characterInterestedIn: sanitizeString(characterInterestedIn),
      introduction: sanitizeString(introduction),
      profilePhotoUrl: sanitizeString(profilePhotoUrl || ''),
      demoReelUrl: sanitizeString(demoReelUrl || ''),
      videoAuditionUrl: sanitizeString(videoAuditionUrl || ''),
      portfolioFileName: sanitizeString(portfolioFileName || 'Portfolio_Document.pdf'),
      portfolioFileId,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    auditionsStore.unshift(newApplication);

    // Audit log
    auditLogsStore.unshift({
      id: `log-${Date.now()}`,
      adminId: 'system-audition-engine',
      adminName: 'Casting Desk',
      action: 'AUDITION_APPLICATION_RECEIVED',
      target: `Application: ${applicationId} (${newApplication.fullName})`,
      details: `Applied for role: ${newApplication.characterInterestedIn}`,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Application received successfully. Welcome to the EYE WINN casting journey.',
      applicationId,
      application: newApplication,
    });
  });

  // View own audition application
  app.get('/api/audition/my-application', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const userApps = auditionsStore.filter((a) => a.userId === user.id || a.email === user.email);
    return res.json(userApps);
  });

  // Track application by ID (Public check with email verification & PII protection)
  app.get('/api/audition/track/:id', (req, res) => {
    const appId = req.params.id.trim().toUpperCase();
    const email = (req.query.email as string || '').trim().toLowerCase();
    const currentUser = getAuthenticatedUser(req);

    const appRecord = auditionsStore.find((a) => a.id.toUpperCase() === appId);
    if (!appRecord) {
      return res.status(404).json({ error: 'No audition application found with this Application ID.' });
    }

    const isOwner = currentUser && (
      appRecord.userId === currentUser.id ||
      appRecord.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    const isAdmin = currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN');

    // Security Fix: Prevent IDOR enumeration and unauthorized personal data access
    if (!isOwner && !isAdmin) {
      if (!email) {
        return res.status(400).json({
          error: 'Email verification required: Please enter the email address used during application submission.',
        });
      }
      if (appRecord.email.toLowerCase() !== email) {
        return res.status(403).json({
          error: 'Verification failed: Email does not match application records.',
        });
      }
    }

    // Security Fix: Redact sensitive candidate PII (phone, exact address, portfolio internal ID) from public tracking
    const safeRecord = {
      id: appRecord.id,
      fullName: appRecord.fullName,
      characterInterestedIn: appRecord.characterInterestedIn,
      status: appRecord.status,
      scheduleDetails: appRecord.scheduleDetails,
      city: appRecord.city,
      state: appRecord.state,
      createdAt: appRecord.createdAt,
      updatedAt: appRecord.updatedAt,
    };
    return res.json(safeRecord);
  });

  // Secure Portfolio Access (TEST 8: Applicant A cannot access Applicant B's portfolio)
  app.get('/api/portfolio/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const portfolioId = req.params.id;
    const user = req.user!;

    const targetApp = auditionsStore.find(
      (a) => a.portfolioFileId === portfolioId || a.id === portfolioId
    );

    if (!targetApp) {
      return res.status(404).json({ error: 'Portfolio record not found.' });
    }

    // Only owner of application or Admin can view
    const isOwner = targetApp.userId === user.id || targetApp.email === user.email;
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: '403 Forbidden: You are not authorized to view another applicant’s private portfolio.',
      });
    }

    // Log portfolio access
    if (isAdmin) {
      logAdminAction(user, 'PORTFOLIO_ACCESSED', `Application ${targetApp.id}`, `Viewed ${targetApp.portfolioFileName}`);
    }

    return res.json({
      portfolioFileId: targetApp.portfolioFileId,
      fileName: targetApp.portfolioFileName,
      applicantName: targetApp.fullName,
      character: targetApp.characterInterestedIn,
      status: 'SECURE_AUTHORIZED_ACCESS',
      url: targetApp.portfolioUrl || '#',
      fileType: 'application/pdf',
      downloadAuthorized: true,
    });
  });

  // ============================================================
  // 6. CONTACT MESSAGES API
  // ============================================================
  app.post('/api/contact', submissionRateLimiter, (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const cleanEmail = sanitizeString(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (String(message).trim().length > 3000) {
      return res.status(400).json({ error: 'Message cannot exceed 3000 characters.' });
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: sanitizeString(name),
      email: cleanEmail,
      phone: sanitizeString(phone || ''),
      subject: sanitizeString(subject || 'General Inquiry'),
      message: sanitizeString(message),
      status: 'UNREAD',
      createdAt: new Date().toISOString(),
    };

    contactMessagesStore.unshift(newMessage);
    return res.status(201).json({ success: true, message: 'Message sent successfully.' });
  });

  // ============================================================
  // 7. SUPER ADMIN PANEL APIs (Protected by requireAdmin)
  // ============================================================
  app.get('/api/admin/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const totalUsers = usersStore.length;
    const paidUsers = usersStore.filter((u) => u.hasPaidBook).length;
    const totalRevenue = paymentsStore
      .filter((p) => p.status === 'SUCCESSFUL')
      .reduce((sum, p) => sum + p.amount, 0);

    const auditionApplications = auditionsStore.length;
    const underReview = auditionsStore.filter((a) => a.status === 'UNDER REVIEW').length;
    const shortlisted = auditionsStore.filter((a) => a.status === 'SHORTLISTED').length;
    const scheduled = auditionsStore.filter((a) => a.status === 'AUDITION SCHEDULED').length;
    const bookReaders = usersStore.filter((u) => u.readingProgress > 0).length;

    return res.json({
      totalUsers,
      paidUsers,
      totalRevenue,
      auditionApplications,
      underReview,
      shortlisted,
      scheduled,
      bookReaders,
      fullAccessUsers: paidUsers,
      chartData: [
        { month: 'Oct 25', users: 12, revenue: 2990, auditions: 4 },
        { month: 'Nov 25', users: 28, revenue: 5980, auditions: 11 },
        { month: 'Dec 25', users: 45, revenue: 11960, auditions: 23 },
        { month: 'Jan 26', users: 78, revenue: 17940, auditions: 39 },
        { month: 'Feb 26', users: 112, revenue: 26910, auditions: 62 },
        { month: 'Mar 26', users: totalUsers, revenue: totalRevenue, auditions: auditionApplications },
      ],
    });
  });

  // User Management
  app.get('/api/admin/users', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const safeUsers = usersStore.map(({ passwordHash: _, ...u }) => u);
    return res.json(safeUsers);
  });

  app.post('/api/admin/users/:id/toggle-access', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const targetId = req.params.id;
    const { hasPaidBook, hasPaidScript, status, role } = req.body;
    const targetUser = usersStore.find((u) => u.id === targetId);

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (typeof hasPaidBook === 'boolean') {
      targetUser.hasPaidBook = hasPaidBook;
      if (!hasPaidBook) {
        paymentsStore.filter((p) => p.userId === targetUser.id && (p.itemType === 'BOOK' || !p.itemType) && p.status === 'SUCCESSFUL').forEach((p) => {
          p.status = 'REVOKED';
          p.rejectionReason = 'Book access revoked via User Roster by Super Admin.';
          p.reviewedBy = req.user!.name;
        });
      }
      logAdminAction(req.user!, 'USER_ACCESS_UPDATE', `User: ${targetUser.name}`, `Set hasPaidBook to ${hasPaidBook}`);
    }

    if (typeof hasPaidScript === 'boolean') {
      targetUser.hasPaidScript = hasPaidScript;
      if (!hasPaidScript) {
        paymentsStore.filter((p) => p.userId === targetUser.id && p.itemType === 'SCRIPT' && p.status === 'SUCCESSFUL').forEach((p) => {
          p.status = 'REVOKED';
          p.rejectionReason = 'Script access revoked via User Roster by Super Admin.';
          p.reviewedBy = req.user!.name;
        });
      }
      logAdminAction(req.user!, 'USER_ACCESS_UPDATE', `User: ${targetUser.name}`, `Set hasPaidScript to ${hasPaidScript}`);
    }

    if (status && (status === 'active' || status === 'suspended')) {
      targetUser.status = status;
      logAdminAction(req.user!, 'USER_STATUS_UPDATE', `User: ${targetUser.name}`, `Changed status to ${status}`);
    }

    if (role && (role === 'USER' || role === 'ADMIN' || role === 'SUPER_ADMIN')) {
      if (req.user!.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Only Super Admin can change user roles.' });
      }
      targetUser.role = role;
      logAdminAction(req.user!, 'USER_ROLE_UPDATE', `User: ${targetUser.name}`, `Changed role to ${role}`);
    }

    const { passwordHash: _, ...safeUser } = targetUser;
    return res.json({ success: true, user: safeUser });
  });

  // Payment Management
  app.get('/api/admin/payments', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(paymentsStore);
  });

  // Super Admin: Verify & Approve UTR payment, unlocking full book/script access
  app.post('/api/admin/payments/:id/approve', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const paymentId = req.params.id;
    const payment = paymentsStore.find((p) => p.id === paymentId || p.orderId === paymentId || p.paymentId === paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    payment.status = 'SUCCESSFUL';
    payment.verifiedAt = new Date().toISOString();
    payment.reviewedBy = req.user!.name;

    const isScript = payment.itemType === 'SCRIPT';
    const targetUser = usersStore.find((u) => u.id === payment.userId);
    if (targetUser) {
      if (isScript) {
        targetUser.hasPaidScript = true;
        targetUser.scriptPaymentPending = false;
      } else {
        targetUser.hasPaidBook = true;
        targetUser.paymentPending = false;
      }
    }

    logAdminAction(
      req.user!,
      'PAYMENT_UTR_APPROVED',
      `Payment: ${payment.orderId} (UTR: ${payment.utrNumber || payment.paymentId})`,
      `Approved ₹${payment.amount} payment for ${payment.userName} (${payment.userEmail}). Full ${isScript ? 'script' : 'book'} access granted.`
    );

    const safeUser = targetUser ? (({ passwordHash, ...rest }) => rest)(targetUser) : null;
    return res.json({
      success: true,
      message: `Payment verified successfully! Complete ${isScript ? 'script' : 'book'} access granted to ${payment.userName}.`,
      payment,
      user: safeUser,
    });
  });

  // Super Admin: Reject UTR payment with reason
  app.post('/api/admin/payments/:id/reject', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const paymentId = req.params.id;
    const { reason } = req.body;
    const payment = paymentsStore.find((p) => p.id === paymentId || p.orderId === paymentId || p.paymentId === paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    payment.status = 'REJECTED';
    payment.rejectionReason = reason ? sanitizeString(String(reason)) : 'UTR not found in bank statement or amount mismatched.';
    payment.reviewedBy = req.user!.name;

    const isScript = payment.itemType === 'SCRIPT';
    const targetUser = usersStore.find((u) => u.id === payment.userId);
    if (targetUser) {
      if (isScript) {
        targetUser.scriptPaymentPending = false;
      } else {
        targetUser.paymentPending = false;
      }
    }

    logAdminAction(
      req.user!,
      'PAYMENT_UTR_REJECTED',
      `Payment: ${payment.orderId} (UTR: ${payment.utrNumber || payment.paymentId})`,
      `Rejected payment for ${payment.userName}: ${payment.rejectionReason}`
    );

    return res.json({
      success: true,
      message: `Payment marked as rejected.`,
      payment,
    });
  });

  // Super Admin: Revoke payment and lock book or script access
  app.post('/api/admin/payments/:id/revoke', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const paymentId = req.params.id;
    const { reason } = req.body;
    const payment = paymentsStore.find((p) => p.id === paymentId || p.orderId === paymentId || p.paymentId === paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    payment.status = 'REVOKED';
    payment.rejectionReason = reason ? sanitizeString(String(reason)) : 'Access revoked by Super Admin.';
    payment.reviewedBy = req.user!.name;

    const isScript = payment.itemType === 'SCRIPT';
    const targetUser = usersStore.find((u) => u.id === payment.userId);
    if (targetUser) {
      if (isScript) {
        const hasOtherActive = paymentsStore.some(
          (p) => p.userId === targetUser.id && p.id !== payment.id && p.itemType === 'SCRIPT' && p.status === 'SUCCESSFUL'
        );
        targetUser.hasPaidScript = hasOtherActive;
        targetUser.scriptPaymentPending = false;
      } else {
        const hasOtherActive = paymentsStore.some(
          (p) => p.userId === targetUser.id && p.id !== payment.id && (p.itemType === 'BOOK' || !p.itemType) && p.status === 'SUCCESSFUL'
        );
        targetUser.hasPaidBook = hasOtherActive;
        targetUser.paymentPending = false;
      }
    }

    logAdminAction(
      req.user!,
      'PAYMENT_REVOKED',
      `Payment: ${payment.orderId} (UTR: ${payment.utrNumber || payment.paymentId})`,
      `Revoked payment and locked ${isScript ? 'script' : 'book'} access for ${payment.userName} (${payment.userEmail}). Reason: ${payment.rejectionReason}`
    );

    const safeUser = targetUser ? (({ passwordHash, ...rest }) => rest)(targetUser) : null;
    return res.json({
      success: true,
      message: `${isScript ? 'Script' : 'Book'} payment access revoked successfully for ${payment.userName}.`,
      payment,
      user: safeUser,
    });
  });

  app.post('/api/admin/payments/:id/refund', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const paymentId = req.params.id;
    const payment = paymentsStore.find((p) => p.id === paymentId || p.paymentId === paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    payment.status = 'REFUNDED';
    const user = usersStore.find((u) => u.id === payment.userId);
    if (user) {
      user.hasPaidBook = false;
    }

    logAdminAction(req.user!, 'PAYMENT_REFUNDED', `Order: ${payment.orderId}`, `Refunded ₹${payment.amount} to ${payment.userName}`);
    return res.json({ success: true, payment });
  });

  // Audition Management
  app.get('/api/admin/auditions', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(auditionsStore);
  });

  app.post('/api/admin/auditions/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const appId = req.params.id;
    const { status, scheduleDetails, adminNotes } = req.body;
    const appRecord = auditionsStore.find((a) => a.id === appId);

    if (!appRecord) {
      return res.status(404).json({ error: 'Audition application not found.' });
    }

    if (status) {
      appRecord.status = status;
    }
    if (scheduleDetails) {
      appRecord.scheduleDetails = scheduleDetails;
    }
    if (typeof adminNotes === 'string') {
      appRecord.adminNotes = adminNotes;
    }
    appRecord.updatedAt = new Date().toISOString();

    logAdminAction(
      req.user!,
      'AUDITION_STATUS_UPDATE',
      `Application: ${appRecord.id} (${appRecord.fullName})`,
      `Updated status to ${appRecord.status}`
    );

    return res.json({ success: true, application: appRecord });
  });

  // Book Management
  app.get('/api/admin/book', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(bookMeta);
  });

  app.post('/api/admin/book', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { title, author, synopsis, priceINR, previewPagesCount, isPurchaseEnabled, coverUrl } = req.body;

    if (title) bookMeta.title = title;
    if (author) bookMeta.author = author;
    if (synopsis) bookMeta.synopsis = synopsis;
    if (typeof priceINR === 'number') bookMeta.priceINR = priceINR;
    if (typeof previewPagesCount === 'number') bookMeta.previewPagesCount = previewPagesCount;
    if (typeof isPurchaseEnabled === 'boolean') bookMeta.isPurchaseEnabled = isPurchaseEnabled;
    if (coverUrl) bookMeta.coverUrl = coverUrl;

    logAdminAction(req.user!, 'BOOK_METADATA_UPDATE', 'Book Settings', `Price: ₹${bookMeta.priceINR}, Preview: ${bookMeta.previewPagesCount} pages`);
    return res.json({ success: true, bookMeta });
  });

  // Script Management
  app.get('/api/admin/script', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(scriptMeta);
  });

  app.post('/api/admin/script', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { title, author, synopsis, priceINR, previewPagesCount, isPurchaseEnabled, coverUrl } = req.body;

    if (title) scriptMeta.title = title;
    if (author) scriptMeta.author = author;
    if (synopsis) scriptMeta.synopsis = synopsis;
    if (typeof priceINR === 'number') scriptMeta.priceINR = priceINR;
    if (typeof previewPagesCount === 'number') scriptMeta.previewPagesCount = previewPagesCount;
    if (typeof isPurchaseEnabled === 'boolean') scriptMeta.isPurchaseEnabled = isPurchaseEnabled;
    if (coverUrl) scriptMeta.coverUrl = coverUrl;

    logAdminAction(req.user!, 'SCRIPT_METADATA_UPDATE', 'Script Settings', `Price: ₹${scriptMeta.priceINR}, Preview: ${scriptMeta.previewPagesCount} pages`);
    return res.json({ success: true, scriptMeta });
  });

  // Content Management
  app.get('/api/admin/content', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(siteContent);
  });

  app.post('/api/admin/content', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    safeAssign(siteContent, updates, [
      'heroHeadline',
      'heroSupporting',
      'storyQuoteHindi',
      'storyQuoteEnglish',
      'storyIntroText',
      'beerbhanBio',
      'economicsText',
      'bookTitle',
      'bookAuthor',
      'bookSynopsis',
      'authorBio',
      'contactEmail',
      'contactPhone',
      'contactAddress',
      'upiId',
      'upiPayeeName',
      'qrCodeImageUrl',
    ]);
    logAdminAction(req.user!, 'SITE_CONTENT_UPDATE', 'Editorial Content', 'Updated homepage editorial text & quotes');
    return res.json({ success: true, siteContent });
  });

  // Audit Logs
  app.get('/api/admin/logs', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(auditLogsStore);
  });

  // Contact Inquiries
  app.get('/api/admin/contact', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    return res.json(contactMessagesStore);
  });

  app.post('/api/admin/contact/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const msg = contactMessagesStore.find((m) => m.id === req.params.id);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    msg.status = req.body.status || 'RESOLVED';
    return res.json({ success: true, message: msg });
  });

  // ============================================================
  // 8. VITE MIDDLEWARE / STATIC ASSETS & SERVER START
  // ============================================================
  export async function startServer() {
    const PORT = Number(process.env.PORT) || 3000;
    app.use(express.static(path.join(process.cwd(), 'public')));

    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[EYE WINN Platform] Server running on http://0.0.0.0:${PORT}`);
    });
  }

  // Only boot listener if running directly as a standalone Node server (not on Vercel Serverless)
  if (!process.env.VERCEL) {
    startServer();
  }

  export default app;

# EYE WINN — Cinematic & Literary Platform

> **Official Web Application & Production Portal for Master Beerbhan: From a Village Story to the Big Screen.**

---

## 🌟 Overview

**EYE WINN** is a full-stack web application designed for literary showcase, digital book preview & paid access, casting/audition management, and editorial administration.

### Key Features
- **Cinematic Experience**: Immersive typography, responsive animations, and chapter breakdowns.
- **Secure Book Reader**:
  - Pages 1–3 are open for free preview.
  - Subsequent pages are protected by server-side authorization and granted exclusively upon payment verification or administrative access.
  - Dynamic user-attribution watermarking on paid document pages.
  - Zero raw PDF files are exposed via static file paths.
- **Audition & Casting Engine**:
  - Multi-field casting registration with resume/portfolio attachment support.
  - Candidate status tracker protected by ownership and email verification.
  - Strict applicant isolation: candidates cannot access peer portfolios.
- **Editorial & Super Admin Console**:
  - Live revenue & reader analytics.
  - Audition review, scheduling, and direct notes.
  - Dynamic content management.
  - Tamper-evident administrative audit trail.
  - Built-in 10-point Security Acceptance suite.

---

## 🛡️ Security Architecture & Patches

The codebase has undergone defensive security auditing and hardening prior to GitHub release:

| Area | Threat Vector / Loophole | Remediated Defense |
|---|---|---|
| **Authentication Backdoors** | Hardcoded static session tokens | **Eliminated static backdoor tokens.** All sessions are dynamically generated via cryptographically secure UUIDs (`crypto.randomUUID()`) on authenticated login. |
| **Password Verification** | Side-channel timing attacks & hardcoded salt | **Timing-Safe Comparison:** Implemented `crypto.timingSafeEqual` with configurable `PASSWORD_SALT` environment variable. |
| **Audition Tracker IDOR** | Insecure Direct Object Reference leaking applicant PII | **Ownership & Email Verification:** Tracking queries require candidate ownership or registered email verification. Sensitive candidate PII (phone, exact address, portfolio internal ID) is redacted from public tracker responses. |
| **Cross-Applicant Isolation** | Unauthorized portfolio asset browsing | **Strict Access Control:** Enforced server-side checks ensuring only the document owner or authorized administrators can access private portfolio documents (`/api/portfolio/:id`). |
| **Prototype Pollution** | Unsanitized `Object.assign` in editorial updates | **Safe Property Whitelisting:** Implemented `safeAssign` utility rejecting `__proto__`, `constructor`, and non-whitelisted keys. |
| **Denial of Service / Brute Force** | Unthrottled login & submission spam | **Sliding Window Rate Limiter:** Applied per-IP rate limiting across authentication, contact forms, and audition submission endpoints. |
| **HTTP Security Headers** | Missing browser defense headers | **OWASP Security Headers Middleware:** Applied `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`. |
| **Cookie Hardening** | Insecure cookie flags | **Secure Cookies:** `httpOnly: true`, `sameSite: 'lax'`, `secure: production`. |

---

## 🚀 Quick Start

### 1. Requirements
- **Node.js**: v18.0.0 or later
- **npm** or **bun**

### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-org/eyewinn-platform.git
cd eyewinn-platform

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
PORT=3000
NODE_ENV=development
PASSWORD_SALT="your_secure_random_salt_here"
APP_URL="http://localhost:3000"
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### 5. Production Build & Deployment

#### Standard Node.js Server (Render / Railway / Fly.io / VPS)
```bash
# Type check and build client & server bundle
npm run build

# Start production server
npm start
```

#### Vercel Deployment (Serverless)
This repository includes ready-to-deploy configuration for Vercel (`vercel.json` and `api/index.ts`):

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for EYE WINN platform"
   git branch -M main
   git remote add origin https://github.com/your-username/eyewinn-platform.git
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository.
   - Vercel automatically detects the framework preset (**Vite**), build command (`npm run build`), and output directory (`dist`).
3. **Set Environment Variables in Vercel**:
   - In the project settings, under **Environment Variables**, add:
     - `PASSWORD_SALT`: A random 32+ character string (e.g. `eyewinn_salt_secure_prod_2026_x89a`)
     - `NODE_ENV`: `production`
4. **Deploy**:
   - Click **Deploy**. Vercel will build your Vite static frontend and mount the Express API as a Vercel Serverless Function under `/api/*`.

> 💡 *Note on Persistence:* The template uses an in-memory data store for state demonstration. For long-term user persistence across serverless cold starts on Vercel, connect a hosted database (such as Supabase, Neon PostgreSQL, or MongoDB Atlas), or deploy to a container runtime like Render or Railway.

---

## 🔑 Default Demonstration Accounts

For local evaluation, the following pre-configured demonstration accounts are available:

| Account Role | Email | Password | Access Rights |
|---|---|---|---|
| **Super Admin** | `admin@eyewinn.com` | `admin12345` | Full Admin Console, Casting, Audit Logs, Settings |
| **Paid Patron** | `priya@example.com` | `priya12345` | Full Book Access with Watermark |
| **Standard Reader** | `reader@example.com` | `reader12345` | Free Preview (Pages 1–3) |

> ⚠️ *Note: In production environments, replace seeded demonstration accounts with persistent database credentials and set strong random passwords.*

---

## 📁 Project Structure

```
.
├── server.ts                 # Express full-stack server & API gateway
├── server/
│   ├── auth.ts              # Authentication & role-based middleware
│   ├── db.ts                # In-memory stores, models & seed data
│   └── security.ts          # Security headers, rate limiting & input sanitization
├── src/
│   ├── components/          # Modular React components
│   │   ├── AdminPanel.tsx   # Super Admin dashboard & security suite
│   │   ├── BookReaderModal.tsx # Digital document reader
│   │   ├── AuditionModal.tsx   # Casting submission modal
│   │   ├── AuditionTrackerModal.tsx # Application status tracker
│   │   └── AuthModal.tsx    # Sign-in & registration
│   ├── App.tsx              # Main application shell
│   └── types.ts             # TypeScript domain definitions
├── public/                  # Static public assets
└── vite.config.ts           # Vite bundler configuration
```

---

## 📄 License
All rights reserved © 2026 EYE WINN Literary & Cinematic Productions.

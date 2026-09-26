export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  hasPaidBook: boolean;
  hasPaidScript?: boolean;
  paymentPending?: boolean;
  pendingUtr?: string;
  scriptPaymentPending?: boolean;
  pendingScriptUtr?: string;
  readingProgress: number; // last page read for book
  readingProgressScript?: number; // last page read for script
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface BookMeta {
  id?: string;
  title: string;
  author: string;
  genre: string;
  synopsis: string;
  themes: string[];
  pageCount: string;
  totalPages: number;
  priceINR: number;
  previewPagesCount: number;
  isPurchaseEnabled: boolean;
  coverUrl?: string;
}

export interface ScriptMeta {
  id?: string;
  title: string;
  author: string;
  genre: string;
  synopsis: string;
  themes?: string[];
  totalPages: number;
  priceINR: number;
  previewPagesCount: number;
  isPurchaseEnabled: boolean;
  coverUrl?: string;
}

export interface BookPage {
  pageNumber: number;
  chapterTitle: string;
  content: string;
  isFreePreview: boolean;
  watermark?: string;
}

export interface BookPageData {
  pageNumber: number;
  title: string;
  chapterName: string;
  content: string[];
  isFreePreview: boolean;
  watermark?: string;
}

export interface ScriptPage {
  pageNumber: number;
  sceneTitle: string;
  sceneHeading?: string;
  sceneLocation?: string;
  content: string;
  isFreePreview: boolean;
  watermark?: string;
}

export interface ScriptPageData {
  pageNumber: number;
  sceneTitle: string;
  sceneHeading?: string;
  sceneLocation?: string;
  content: string[];
  isFreePreview: boolean;
  watermark?: string;
}

export type PaymentStatus = 
  | 'PENDING' 
  | 'PENDING_APPROVAL' 
  | 'SUCCESSFUL' 
  | 'FAILED' 
  | 'REJECTED' 
  | 'REFUNDED'
  | 'REVOKED';

export type PaymentItemType = 'BOOK' | 'SCRIPT';

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentId: string;
  utrNumber?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  itemType?: PaymentItemType;
  itemTitle?: string;
  status: PaymentStatus;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedBy?: string;
  userNote?: string;
  createdAt: string;
  verifiedAt?: string;
}

export type AuditionStatus = 
  | 'SUBMITTED' 
  | 'UNDER REVIEW' 
  | 'SHORTLISTED' 
  | 'AUDITION SCHEDULED' 
  | 'SELECTED' 
  | 'NOT SELECTED';

export interface AuditionApplication {
  id: string; // e.g. EYW-AUD-2026-000123
  userId: string;
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  actingExperience: string;
  currentProfession: string;
  languages: string;
  height: string;
  portfolioUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  introVideoUrl?: string;
  previousProjects?: string;
  characterInterestedIn: string;
  introduction: string;
  profilePhotoUrl?: string;
  demoReelUrl?: string;
  videoAuditionUrl?: string;
  portfolioFileName?: string;
  portfolioFileId?: string;
  status: AuditionStatus;
  scheduleDetails?: {
    date: string;
    time: string;
    locationOrLink: string;
    instructions?: string;
    sceneInstructions?: string;
  };
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'RESOLVED';
  createdAt: string;
}

export interface SiteContent {
  heroHeadline: string;
  heroSupporting: string;
  storyQuoteHindi: string;
  storyQuoteEnglish: string;
  storyIntroText: string;
  beerbhanBio: string;
  economicsText: string;
  bookTitle: string;
  bookAuthor: string;
  bookSynopsis: string;
  authorBio: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  upiId?: string;
  upiPayeeName?: string;
  qrCodeImageUrl?: string;
}

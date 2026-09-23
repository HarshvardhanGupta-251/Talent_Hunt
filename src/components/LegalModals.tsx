import React from 'react';
import { X, Shield, FileText, RotateCcw, Clapperboard } from 'lucide-react';

interface LegalModalsProps {
  type: 'privacy' | 'terms' | 'refund' | 'auditionTerms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      updated: 'March 2026',
      body: `1. Information We Collect
EYE WINN collects minimal personal information necessary to deliver reading access and casting services. This includes your name, email address, contact telephone, and portfolio/audition submissions.

2. Confidentiality of Audition Materials
Portfolios, resumes, demo reels, and private candidate submissions are strictly restricted to verified members of the EYE WINN casting department and executive production team through server-side access control. We never share, sell, or publicly disclose candidate auditions.

3. Direct UPI Payment & Privacy
Payments are made directly from your preferred UPI application (Google Pay, PhonePe, Paytm, BHIM, etc.) to the client's official beneficiary UPI ID / QR code. EYE WINN never requests, accepts, or stores debit cards, credit card numbers, CVVs, or bank login credentials. Verification is performed strictly via the 12-digit bank UTR reference number.

4. Digital Rights & Reader Telemetry
Reading progress is recorded solely to restore your page position upon returning to the reader. Dynamic, personalized digital watermarks are embedded into unlocked manuscript pages to safeguard intellectual property.`,
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      updated: 'March 2026',
      body: `1. Agreement to Terms
By accessing the EYE WINN platform, purchasing digital reading licenses, or submitting audition materials, you agree to abide by these Terms & Conditions.

2. Intellectual Property
All literary works, narrative excerpts, characters (including Master Beerbhan, Santosh, and Nafe), branding, trademarks, and audiovisual adaptations are the exclusive intellectual property of EYE WINN and the author. Unauthorized reproduction, distribution, scraping, or piracy will be prosecuted under applicable copyright laws.

3. Reader Access License
Purchase of the complete digital edition conveys a non-exclusive, non-transferable, personal digital reading license. It does not grant reproduction, resale, translation, or cinematic adaptation rights.`,
    },
    refund: {
      title: 'Refund Policy',
      icon: RotateCcw,
      updated: 'March 2026',
      body: `1. Digital Content Purchases
Because EYE WINN offers a generous 3-page free preview of the book prior to purchase, all sales of the complete digital book edition are final once access is granted.

2. Payment Inquiries or Mismatched Transfers
In the event of a disputed transfer or technical delay where full book access is not unlocked, please contact contact@eyewinn.com or provide your 12-digit UPI UTR Number. The client administrator verifies bank account credits and manually resolves or reconciles any issues directly.`,
    },
    auditionTerms: {
      title: 'Audition & Casting Terms',
      icon: Clapperboard,
      updated: 'March 2026',
      body: `1. Audition Submissions
Submission of an audition application does not guarantee an interview, screen test, callback, or casting engagement. All casting decisions are made at the sole discretion of the EYE WINN production team.

2. Representation of Authentic Information
Applicants warrant that all information, performance reels, and photographs submitted are genuine and belong to the applicant.

3. Casting Notifications & Status
Applicants can track their progress in real-time through the Audition Tracker using their unique Application ID (EYW-AUD-2026-XXXXXX).

4. Production Integrity
No fees are ever charged to audition for EYE WINN productions. Beware of unauthorized third parties asking for money in exchange for casting promises.`,
    },
  };

  const item = contentMap[type];
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#20201E] text-white flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#B49A68]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#20201E]">
                {item.title}
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                Last Updated: {item.updated}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6F6A60] hover:text-[#20201E] hover:bg-[#EAE4D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto font-serif text-sm text-[#20201E] leading-relaxed space-y-4">
          {item.body.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EFE7] border-t border-[#20201E]/8 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

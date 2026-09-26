import React from 'react';
import { BrandLogo } from './BrandLogo.js';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'refund' | 'auditionTerms') => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegal,
}) => {
  return (
    <footer className="bg-[#1C1C1A] text-[#F8F6F0] py-8 sm:py-10 border-t border-[#20201E]/20 relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 pb-6 border-b border-white/10">
          
          {/* Column 1: Brand & About (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <BrandLogo size="sm" variant="light" />
            <p className="text-xs text-[#EAE4D8]/75 leading-relaxed">
              EYE WINN turns original Indian grassroots stories and literature into feature film adaptations.
            </p>
            <p className="text-[11px] text-[#B49A68] italic">
              "Master Beerbhan" — By Wing Commander (Retd.) Surender Singh
            </p>
          </div>

          {/* Column 2: Contact Desk (4 Cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B49A68] block">
              CONTACT & PRODUCTION
            </span>

            <div className="space-y-1.5 text-xs text-[#EAE4D8]/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B49A68] shrink-0" />
                <a href="mailto:contact@eyewinn.com" className="hover:text-white underline transition-colors">
                  contact@eyewinn.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B49A68] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B49A68] shrink-0" />
                <span>New Delhi & Mumbai, India</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#EAE4D8]/60">
                <Clock className="w-3 h-3 text-[#B49A68] shrink-0" />
                <span>Mon–Sat: 10:00 AM – 6:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation (2 Cols) */}
          <div className="lg:col-span-2 space-y-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B49A68] block">
              PAGES
            </span>
            <ul className="space-y-1.5 text-xs text-[#EAE4D8]/75">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-white transition-colors cursor-pointer">
                  The Book
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('script')} className="hover:text-white transition-colors cursor-pointer">
                  The Script
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('audition')} className="hover:text-white transition-colors cursor-pointer">
                  Auditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies (2 Cols) */}
          <div className="lg:col-span-2 space-y-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B49A68] block">
              POLICIES
            </span>
            <ul className="space-y-1.5 text-xs text-[#EAE4D8]/75">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('auditionTerms')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Audition Terms
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Compact single row */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#EAE4D8]/50">
          <p>© {new Date().getFullYear()} EYE WINN. All Rights Reserved.</p>
          <p className="tracking-wider">Official Literary & Feature Film Platform</p>
        </div>
      </div>
    </footer>
  );
};

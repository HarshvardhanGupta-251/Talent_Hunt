import React from 'react';
import { BrandLogo } from './BrandLogo.js';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'refund' | 'auditionTerms') => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegal,
  onOpenAuth,
  isLoggedIn,
}) => {
  return (
    <footer className="bg-[#20201E] text-[#F8F6F0] pt-16 pb-12 border-t border-[#20201E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" variant="light" />
            <p className="text-sm text-[#EAE4D8]/70 leading-relaxed max-w-sm pt-2">
              A literary-to-cinematic publishing and casting platform dedicated to original narrative storytelling, rural inquiry, and critical thinking.
            </p>
            <div className="text-xs text-[#B49A68] tracking-widest uppercase">
              “Education is the power to think.”
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68]">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#EAE4D8]/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-white transition-colors">
                  The Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-white transition-colors">
                  The Book
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('audition')} className="hover:text-white transition-colors">
                  Audition / Casting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Author
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Account Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68]">
              ACCOUNT
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#EAE4D8]/80">
              {isLoggedIn ? (
                <>
                  <li>
                    <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                      My Account & Reading
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                      Payment History
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                      Audition Status
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={onOpenAuth} className="hover:text-white transition-colors">
                      Login
                    </button>
                  </li>
                  <li>
                    <button onClick={onOpenAuth} className="hover:text-white transition-colors">
                      Register
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68]">
              LEGAL & POLICIES
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#EAE4D8]/80">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors text-left">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('auditionTerms')} className="hover:text-white transition-colors text-left">
                  Audition Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EAE4D8]/60">
          <p>© {new Date().getFullYear()} EYE WINN. All Rights Reserved.</p>
          <p className="tracking-wider">Official Literary & Cinematic Platform</p>
        </div>
      </div>
    </footer>
  );
};

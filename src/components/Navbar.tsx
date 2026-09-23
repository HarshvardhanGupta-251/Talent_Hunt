import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.js';
import { User } from '../types.js';
import { 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  hasFullAccess?: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenReader?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  hasFullAccess = false,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'story', label: 'THE STORY' },
    { id: 'book', label: 'THE BOOK' },
    { id: 'audition', label: 'AUDITION' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-40 w-full transition-all duration-200 border-b border-white/60 bg-white/70 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none transition-transform active:scale-98"
          title="EYE WINN — Books to Big Screens"
        >
          <BrandLogo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-xs font-semibold tracking-[0.2em] transition-colors py-1 relative ${
                activeView === link.id
                  ? 'text-[#20201E]'
                  : 'text-[#6F6A60] hover:text-[#20201E]'
              }`}
            >
              {link.label}
              {activeView === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B98268] rounded-full" />
              )}
            </button>
          ))}

          {/* Admin link — Strictly visible ONLY to authorized Admin users */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all ${
                activeView === 'admin'
                  ? 'bg-[#20201E] text-[#F8F6F0] border-[#20201E]'
                  : 'bg-[#6E7560]/10 text-[#6E7560] border-[#6E7560]/30 hover:bg-[#6E7560]/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              ADMIN
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleNavClick('account')}
                className={`flex items-center gap-2 text-xs font-semibold tracking-wider px-4 py-2 rounded-lg transition-all ${
                  activeView === 'account'
                    ? 'bg-[#20201E] text-white shadow-sm'
                    : 'bg-[#F2EFE7] text-[#20201E] hover:bg-[#EAE4D8]'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>MY ACCOUNT</span>
              </button>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 text-[#6F6A60] hover:text-[#20201E] hover:bg-[#F2EFE7] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold tracking-[0.18em] px-5 py-2.5 rounded-lg bg-[#20201E] text-[#FFFFFF] hover:bg-[#6E7560] transition-colors shadow-sm"
            >
              LOGIN / REGISTER
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#20201E] hover:bg-[#F2EFE7] rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#20201E]/10 bg-[#FFFDF8] px-5 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left text-sm font-medium tracking-wider py-2 border-b border-[#20201E]/5 ${
                  activeView === link.id ? 'text-[#B98268] font-bold' : 'text-[#20201E]'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-left text-sm font-semibold tracking-wider py-2 text-[#6E7560] flex items-center gap-2 border-b border-[#20201E]/5"
              >
                <ShieldCheck className="w-4 h-4" />
                ADMIN PANEL
              </button>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick('account')}
                  className="w-full py-2.5 text-center text-xs font-semibold tracking-wider rounded-lg bg-[#20201E] text-white"
                >
                  MY ACCOUNT ({currentUser.name.split(' ')[0]})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-[#6F6A60] hover:text-[#20201E]"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold tracking-wider rounded-lg bg-[#20201E] text-white"
              >
                LOGIN / REGISTER
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

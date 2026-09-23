import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.js';
import { User } from '../types.js';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = tab === 'login' 
        ? { email, password }
        : { name, email, phone, password, confirmPassword };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setTab('login');
    // Auto-trigger submit after setting
    setTimeout(async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: quickEmail, password: quickPass }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onAuthSuccess(data.user, data.token);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showSubtitle={false} />
            <div>
              <h3 className="font-serif font-bold text-base text-[#20201E]">
                {tab === 'login' ? 'Sign In to EYE WINN' : 'Create an Account'}
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                Literary Reader & Casting Desk
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

        {/* Tab switcher */}
        <div className="flex border-b border-[#20201E]/8 bg-[#F8F6F0]">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider transition-colors ${
              tab === 'login'
                ? 'bg-[#FFFDF8] text-[#20201E] border-b-2 border-[#20201E]'
                : 'text-[#6F6A60] hover:text-[#20201E]'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider transition-colors ${
              tab === 'register'
                ? 'bg-[#FFFDF8] text-[#20201E] border-b-2 border-[#20201E]'
                : 'text-[#6F6A60] hover:text-[#20201E]'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#6F6A60] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6F6A60] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E]"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6F6A60] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6F6A60] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E]"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6F6A60] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#6E7560] transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Reviewer Quick Access Section */}
          <div className="pt-4 border-t border-[#20201E]/8">
            <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block mb-2 text-center">
              TEST ACCOUNTS QUICK LOGIN
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@eyewinn.com', 'admin12345')}
                className="w-full p-2 rounded-lg bg-[#F2EFE7] hover:bg-[#EAE4D8] border border-[#20201E]/10 text-left flex items-center justify-between text-xs text-[#20201E]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B98268]" />
                  <span className="font-semibold">Super Admin Account</span>
                </div>
                <span className="text-[10px] font-mono text-[#6F6A60]">admin@eyewinn.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('priya@example.com', 'priya12345')}
                className="w-full p-2 rounded-lg bg-[#F2EFE7] hover:bg-[#EAE4D8] border border-[#20201E]/10 text-left flex items-center justify-between text-xs text-[#20201E]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-semibold">Paid Patron (Full Book Unlocked)</span>
                </div>
                <span className="text-[10px] font-mono text-[#6F6A60]">priya@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('reader@example.com', 'reader12345')}
                className="w-full p-2 rounded-lg bg-[#F2EFE7] hover:bg-[#EAE4D8] border border-[#20201E]/10 text-left flex items-center justify-between text-xs text-[#20201E]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6F6A60]" />
                  <span className="font-semibold">Standard Reader (Preview Only)</span>
                </div>
                <span className="text-[10px] font-mono text-[#6F6A60]">reader@example.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

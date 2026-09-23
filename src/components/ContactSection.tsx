import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactEmail = "contact@eyewinn.com",
  contactPhone = "+91 98765 43210",
  contactAddress = "EYE WINN Literary & Cinematic Productions, New Delhi / Mumbai, India",
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry.');

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Information */}
          <div className="lg:col-span-5 glass-card p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B49A68] block mb-2">
                EDITORIAL & PRODUCTIONS
              </span>
              <h2
                className="text-3xl sm:text-4xl font-serif font-bold text-[#20201E] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                CONNECT WITH EYE WINN.
              </h2>
              <p className="mt-4 text-base text-[#504C44] leading-relaxed">
                For literary inquiries, institutional book adoptions, media coverage, or cinematic production partnerships.
              </p>

              <div className="mt-8 space-y-5 text-sm text-[#20201E]">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/80 border border-[#20201E]/10 flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-4 h-4 text-[#B98268]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">
                      EDITORIAL DESK
                    </span>
                    <span className="font-medium">{contactEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/80 border border-[#20201E]/10 flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-4 h-4 text-[#6E7560]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">
                      DIRECT INQUIRIES
                    </span>
                    <span className="font-medium">{contactPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/80 border border-[#20201E]/10 flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4 text-[#B49A68]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">
                      PRODUCTION OFFICES
                    </span>
                    <span className="font-medium leading-relaxed">{contactAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#20201E]/8 text-xs text-[#6F6A60]">
              <span className="italic">EYE WINN: Bridging intellectual literature with broad cinematic imagination.</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 h-full">
            <div className="glass-card p-8 sm:p-10 rounded-3xl shadow-xl h-full flex flex-col justify-between">
              {status === 'success' ? (
                <div className="text-center py-10 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#6E7560] mx-auto" />
                  <h3 className="font-serif text-2xl font-bold text-[#20201E]">
                    Message Dispatched
                  </h3>
                  <p className="text-sm text-[#6F6A60] max-w-md mx-auto leading-relaxed">
                    Thank you for writing to EYE WINN. Our editorial and production team will review your inquiry promptly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#20201E] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#20201E] mb-2">
                    Send a Correspondence
                  </h3>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Book Inquiry, Film Adaptation, etc."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your thoughts, inquiry or partnership proposal..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E] focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 shadow-md"
                  >
                    <Send className="w-4 h-4 text-[#B49A68]" />
                    <span>{status === 'submitting' ? 'SENDING...' : 'DISPATCH MESSAGE'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

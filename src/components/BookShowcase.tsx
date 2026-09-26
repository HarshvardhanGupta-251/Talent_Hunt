import React from 'react';
import { BookMeta } from '../types.js';
import { BookOpen, Check, Lock, QrCode } from 'lucide-react';

interface BookShowcaseProps {
  bookMeta: BookMeta;
  hasFullAccess: boolean;
  onOpenPreview: () => void;
  onUnlockBook: () => void;
}

export const BookShowcase: React.FC<BookShowcaseProps> = ({
  bookMeta,
  hasFullAccess,
  onOpenPreview,
  onUnlockBook,
}) => {
  return (
    <section id="book" className="py-8 sm:py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl text-center max-w-3xl mx-auto mb-10 shadow-xl">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68] block mb-2">
            OFFICIAL BOOK
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            MASTER BEERBHAN
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#504C44] leading-relaxed">
            Read the first 3 pages freely. To read the complete 184-page book, scan the QR code to pay ₹{bookMeta.priceINR}, enter your 12-digit UTR number, and reading access will be granted upon client verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Column: Book Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm p-6 sm:p-8 rounded-3xl glass-card shadow-xl border border-[#20201E]/10 bg-white">
              {/* Book Spine & Cover Graphic */}
              <div className="rounded-2xl bg-[#20201E] text-[#FFFDF8] p-7 shadow-lg border-l-4 border-l-[#B49A68] flex flex-col justify-between min-h-[360px]">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B49A68] block">
                    ORIGINAL NARRATIVE
                  </span>
                  <span className="text-xs text-[#FFFDF8]/70 block mt-1">
                    {bookMeta.genre}
                  </span>
                </div>

                <div className="my-6">
                  <h3
                    className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDF8] leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {bookMeta.title}
                  </h3>
                  <div className="w-12 h-[2px] bg-[#B98268] my-3" />
                  <p className="text-sm text-[#FFFDF8]/80 font-light">
                    {bookMeta.author}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#FFFDF8]/70">
                  <span>184 Pages</span>
                  <span className="text-[#B49A68] font-semibold">First 3 Pages Free</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-5 text-center">
                {hasFullAccess ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase">
                    <Check className="w-3.5 h-3.5" /> Full Access Granted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-100 text-[#504C44] text-xs font-semibold tracking-wider uppercase">
                    Pages 1 to 3 Free Preview
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details, Workflow & Action */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-xl space-y-5">
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#B98268] uppercase block mb-1">
                  ABOUT THIS EDITION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#20201E]">
                  How to Access the Book
                </h3>
              </div>

              {/* 3 Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10">
                  <span className="text-[10px] text-[#6F6A60] uppercase block">Free Preview</span>
                  <span className="font-serif text-lg font-bold text-[#20201E]">Pages 1 to 3</span>
                  <span className="text-[11px] text-[#504C44] block mt-0.5">Read instantly without payment</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10">
                  <span className="text-[10px] text-[#6F6A60] uppercase block">Complete Book</span>
                  <span className="font-serif text-lg font-bold text-[#20201E]">184 Pages</span>
                  <span className="text-[11px] text-[#504C44] block mt-0.5">₹{bookMeta.priceINR} One-Time Payment</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10">
                  <span className="text-[10px] text-[#6F6A60] uppercase block">Verification</span>
                  <span className="font-serif text-lg font-bold text-[#20201E]">Client UTR Approval</span>
                  <span className="text-[11px] text-[#504C44] block mt-0.5">Verified in Super Admin</span>
                </div>
              </div>

              {/* Clear Step-by-Step Procedure */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#20201E]/10 space-y-2 text-xs text-[#504C44]">
                <h4 className="font-bold text-[#20201E] uppercase tracking-wider text-[11px]">
                  Simple Steps to Read:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                  <li><strong>Read first 3 pages:</strong> Click "Read Free Preview" below to read pages 1, 2, and 3 immediately.</li>
                  <li><strong>Pay via QR Code:</strong> Click "Unlock Complete Book" to view the Client QR code.</li>
                  <li><strong>Enter UTR number:</strong> After scanning and paying ₹{bookMeta.priceINR}, enter the 12-digit UTR reference number.</li>
                  <li><strong>Client verification:</strong> The client will cross-verify the UTR number in the Super Admin portal and grant full reading access.</li>
                </ol>
              </div>

              {/* Synopsis */}
              <div className="pt-2 text-xs sm:text-sm text-[#504C44] leading-relaxed space-y-2 border-t border-[#20201E]/8">
                <p>{bookMeta.synopsis}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onOpenPreview}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-white border border-[#20201E]/20 text-[#20201E] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#F2EFE7] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-[#B98268]" />
                  <span>READ FREE PREVIEW (PAGES 1–3)</span>
                </button>

                {!hasFullAccess ? (
                  <button
                    onClick={onUnlockBook}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-[#20201E] text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4 text-[#B49A68]" />
                    <span>PAY ₹{bookMeta.priceINR} & SUBMIT UTR</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenPreview}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>OPEN COMPLETE BOOK</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

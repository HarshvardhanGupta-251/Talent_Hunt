import React from 'react';
import { BookMeta } from '../types.js';
import { BookOpen, ShieldCheck, Sparkles, Lock, ArrowRight, Check, RotateCw, QrCode } from 'lucide-react';
import { FlipCard } from './FlipCard.js';

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
    <section id="book" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Pre-title */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl text-center max-w-3xl mx-auto mb-10 shadow-xl">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B49A68] block mb-2">
            OFFICIAL PUBLICATION
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            DOCUMENT & POLICY SHOWCASE
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#504C44] leading-relaxed">
            Experience the complete official policy prospectus and terms in our high-definition interactive reader.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Physical Book Visual Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Book Resting Canvas with Natural Soft Shadow & Floating Effect */}
            <div className="relative group p-4 sm:p-6 rounded-3xl glass-card shadow-xl flex flex-col items-center justify-center w-full h-full max-w-md">
              {/* FlipCard for the Book (Front Cover & Back Cover) */}
              <FlipCard
                width={270}
                height={390}
                radius={16}
                axis="y"
                flipOnClick
                draggable
                tilt
                tiltMax={14}
                glare
                glareOpacity={0.24}
                hoverScale={1.03}
                perspective={1200}
                stiffness={180}
                damping={20}
                background="#20201E"
                color="#FFFDF8"
                shadow
                shadowColor="#000000"
                shadowOpacity={0.35}
                front={
                  <div className="w-full h-full rounded-r-xl rounded-l-xs bg-[#20201E] text-[#FFFDF8] flex flex-col justify-between p-6 border-l-4 border-l-[#B49A68] relative select-none">
                    {/* Spine embossing hint */}
                    <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-white/10" />

                    <div className="border-b border-[#FFFDF8]/20 pb-4">
                      <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#B49A68] block">
                        NATIONAL INSURANCE
                      </span>
                      <span className="text-[9px] text-[#FFFDF8]/60 tracking-widest block mt-0.5">
                        OFFICIAL PROSPECTUS
                      </span>
                    </div>

                    <div className="my-auto py-4">
                      <h3
                        className="font-serif text-2xl font-bold tracking-tight text-[#FFFDF8] leading-snug line-clamp-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {bookMeta.title}
                      </h3>
                      <div className="w-10 h-[1.5px] bg-[#B98268] my-3" />
                      <p className="text-xs text-[#FFFDF8]/70 font-light tracking-wide italic">
                        {bookMeta.author}
                      </p>
                    </div>

                    <div className="border-t border-[#FFFDF8]/20 pt-3 flex items-center justify-between text-[10px] text-[#FFFDF8]/60">
                      <span className="tracking-widest uppercase">PAGES: {bookMeta.pageCount}</span>
                      <span className="text-[#B49A68] font-bold">UIN VERIFIED</span>
                    </div>
                  </div>
                }
                back={
                  <div className="w-full h-full rounded-l-xl rounded-r-xs bg-[#1A1A18] text-[#FFFDF8] flex flex-col justify-between p-6 border-r-4 border-r-[#B49A68] relative select-none">
                    <div className="border-b border-[#FFFDF8]/20 pb-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#B49A68]">
                        DOCUMENT SUMMARY
                      </span>
                      <span className="text-[9px] text-white/50 font-mono">BACK COVER</span>
                    </div>

                    <div className="my-auto py-2 space-y-2.5">
                      <p className="text-[11.5px] text-[#FFFDF8]/85 leading-relaxed font-light">
                        {bookMeta.synopsis.slice(0, 190)}...
                      </p>
                      
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/8 space-y-1">
                        <div className="text-[9px] text-[#B49A68] font-mono tracking-wider">
                          UIN: NICHLIP21113V032021
                        </div>
                        <div className="text-[9px] text-white/60 font-mono">
                          IRDAI REGN. NO. 58 • ESTD. 1906
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#FFFDF8]/20 pt-3 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-white/50">
                        <QrCode className="w-3.5 h-3.5 text-[#B49A68]" />
                        <span className="font-mono text-[9px]">OFFICIAL COPY</span>
                      </div>
                      <span className="text-[#B49A68] flex items-center gap-1 font-mono text-[9.5px]">
                        <RotateCw className="w-2.5 h-2.5" /> FLIP FRONT
                      </span>
                    </div>
                  </div>
                }
              />

              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#B98268]">
                <RotateCw className="w-3 h-3 animate-spin-slow" />
                <span>3D Flip & Tilt • Drag or click to turn book</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#6F6A60]">
              <Sparkles className="w-3.5 h-3.5 text-[#B49A68]" />
              <span>Includes Interactive Document Reader • Full 8 Pages</span>
            </div>
          </div>

          {/* Right Column: Book Metadata, Synopsis & CTAs */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-full glass-pill text-[11px] font-semibold tracking-wider text-[#20201E] uppercase">
                  {bookMeta.genre}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/70 border border-stone-200 text-[11px] font-semibold tracking-wider text-[#6E7560] uppercase">
                  {bookMeta.pageCount} PAGES
                </span>
                {hasFullAccess ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-[11px] font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1">
                    <Check className="w-3 h-3" /> UNLOCKED ON YOUR ACCOUNT
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#B98268]/15 text-[11px] font-bold tracking-wider text-[#B98268] uppercase">
                    FIRST 3 PAGES FREE
                  </span>
                )}
              </div>

              <h3
                className="text-2xl sm:text-3xl font-serif font-bold text-[#20201E] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {bookMeta.title}
              </h3>

              <p className="mt-1 text-sm font-medium text-[#6F6A60]">
                Written by <span className="text-[#20201E] font-semibold">{bookMeta.author}</span>
              </p>

              {/* Synopsis Paragraphs */}
              <div className="mt-5 space-y-3 text-sm text-[#504C44] leading-relaxed border-l-2 border-[#B49A68]/40 pl-4 py-1">
                {bookMeta.synopsis.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Themes Tag Cloud */}
              <div className="mt-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#20201E] uppercase block mb-2">
                  CORE EXPLORATIONS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {bookMeta.themes.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full glass-pill border border-[#20201E]/8 text-[#20201E]"
                    >
                      • {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs and Price Block */}
              <div className="mt-8 pt-6 border-t border-[#20201E]/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#6F6A60] block">
                    DIGITAL EDITION ACCESS
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-[#20201E]">
                      ₹{bookMeta.priceINR}
                    </span>
                    <span className="text-xs text-[#6F6A60] line-through">₹499</span>
                    <span className="text-[10px] font-bold text-[#6E7560] uppercase bg-[#6E7560]/10 px-2 py-0.5 rounded">
                      LITERARY PATRON PASS
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {!hasFullAccess && (
                    <button
                      onClick={onOpenPreview}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full glass-pill text-[#20201E] text-xs font-semibold tracking-[0.18em] uppercase hover:bg-white transition-all shadow-xs"
                    >
                      <BookOpen className="w-4 h-4 text-[#B98268]" />
                      <span>READ FREE PREVIEW</span>
                    </button>
                  )}

                  {!hasFullAccess ? (
                    <button
                      onClick={onUnlockBook}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#20201E] text-white text-xs font-semibold tracking-[0.18em] uppercase hover:bg-black transition-all shadow-md active:scale-98"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#B49A68]" />
                      <span>UNLOCK COMPLETE BOOK</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenPreview}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#20201E] text-white text-xs font-semibold tracking-[0.18em] uppercase hover:bg-[#6E7560] transition-all shadow-md active:scale-98"
                    >
                      <BookOpen className="w-4 h-4 text-[#B49A68]" />
                      <span>OPEN FULL READER</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

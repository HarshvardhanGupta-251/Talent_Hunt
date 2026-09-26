import React from 'react';
import { BookOpen, Clapperboard, Film } from 'lucide-react';

interface HeroProps {
  onReadBook: () => void;
  onReadScript: () => void;
  onJoinAudition: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onReadBook,
  onReadScript,
  onJoinAudition,
}) => {
  return (
    <section className="relative w-full overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Main Headline */}
        <div className="flex flex-col items-center max-w-3xl w-full">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#20201E] tracking-tight leading-[1.1] text-center"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            FROM A VILLAGE STORY
            <br />
            <span className="italic font-normal text-[#B98268]">TO THE BIG SCREEN</span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="mt-4 text-lg sm:text-xl text-[#504C44] font-normal leading-relaxed text-center max-w-xl">
            One teacher. A village. A different way of thinking.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-xl">
          <button
            onClick={onReadBook}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#20201E] text-white text-xs font-bold tracking-[0.16em] uppercase hover:bg-black transition-all shadow-md cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#B49A68]" />
            <span>THE BOOK</span>
          </button>

          <button
            onClick={onReadScript}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-[#20201E]/15 text-[#20201E] text-xs font-bold tracking-[0.16em] uppercase hover:bg-[#F2EFE7] transition-all shadow-xs cursor-pointer"
          >
            <Film className="w-4 h-4 text-[#B98268]" />
            <span>THE SCRIPT</span>
          </button>

          <button
            onClick={onJoinAudition}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-[#20201E]/15 text-[#20201E] text-xs font-bold tracking-[0.16em] uppercase hover:bg-[#F2EFE7] transition-all shadow-xs cursor-pointer"
          >
            <Clapperboard className="w-4 h-4 text-[#6E7560]" />
            <span>AUDITIONS</span>
          </button>
        </div>

        {/* 3 Sober Narrative Highlight Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl text-left">
          <div className="glass-card p-6 rounded-3xl bg-white/80 border border-[#20201E]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B49A68]">
                THE BOOK
              </span>
              <BookOpen className="w-4 h-4 text-[#B98268]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#20201E]">
              Master Beerbhan
            </h3>
            <p className="mt-1 text-xs text-[#6F6A60] leading-relaxed">
              Read the complete 184-page book with the first 3 pages free to preview.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl bg-white/80 border border-[#20201E]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B49A68]">
                THE SCREENPLAY
              </span>
              <Film className="w-4 h-4 text-[#6E7560]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#20201E]">
              Original Film Script
            </h3>
            <p className="mt-1 text-xs text-[#6F6A60] leading-relaxed">
              Experience the cinematic screenplay. Scenes 1 to 3 are free to read.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl bg-white/80 border border-[#20201E]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B49A68]">
                FEATURE FILM
              </span>
              <Clapperboard className="w-4 h-4 text-[#B98268]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#20201E]">
              Casting & Auditions
            </h3>
            <p className="mt-1 text-xs text-[#6F6A60] leading-relaxed">
              Inviting actors and fresh talent for lead roles. Submit your profile and receive an Audition ID.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

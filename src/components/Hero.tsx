import React from 'react';
import { BookOpen, Clapperboard, Compass } from 'lucide-react';

interface HeroProps {
  onExploreStory: () => void;
  onReadBook: () => void;
  onJoinAudition: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreStory,
  onReadBook,
  onJoinAudition,
}) => {
  return (
    <section className="relative w-full overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Main Headline */}
        <div className="flex flex-col items-center max-w-4xl w-full">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#20201E] tracking-tight leading-[1.08] drop-shadow-xs text-center"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            FROM A VILLAGE STORY
          </h1>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic font-normal text-[#B98268] tracking-tight leading-[1.12] text-center mt-0.5 sm:mt-1"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            TO THE BIG SCREEN.
          </h2>

          {/* Supporting Line */}
          <div className="mt-5 max-w-2xl">
            <p className="text-lg sm:text-xl md:text-2xl text-[#504C44] font-normal leading-relaxed text-center">
              One teacher. A village. A different way of thinking.
            </p>
          </div>
        </div>

        {/* Elegant Action Pills (Mirroring Reference Screenshot Button Style) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-xl">
          {/* Primary Black Rounded Pill Button */}
          <button
            onClick={onExploreStory}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#20201E] text-white text-xs font-bold tracking-[0.18em] uppercase hover:bg-black hover:scale-105 transition-all shadow-lg active:scale-98"
          >
            <Compass className="w-4 h-4 text-[#B49A68]" />
            <span>EXPLORE THE STORY</span>
          </button>

          {/* Secondary Frosted Glass Pill */}
          <button
            onClick={onReadBook}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass-pill text-[#20201E] text-xs font-bold tracking-[0.18em] uppercase hover:bg-white hover:scale-105 transition-all shadow-sm active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-[#B98268]" />
            <span>READ THE BOOK</span>
          </button>

          {/* Third Frosted Glass Pill */}
          <button
            onClick={onJoinAudition}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass-pill text-[#6E7560] text-xs font-bold tracking-[0.18em] uppercase hover:text-[#20201E] hover:bg-white hover:scale-105 transition-all shadow-sm active:scale-98"
          >
            <Clapperboard className="w-4 h-4 text-[#6E7560]" />
            <span>JOIN AUDITION</span>
          </button>
        </div>

        {/* Floating Narrative Highlight Cards in Translucent Glass */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl text-left">
          <div className="glass-card p-6 rounded-3xl transition-all hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B49A68]">
                PHILOSOPHY
              </span>
              <Compass className="w-4 h-4 text-[#B98268]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#20201E]">
              The Classroom Has No Walls
            </h3>
            <p className="mt-1.5 text-xs text-[#6F6A60] leading-relaxed">
              A teacher connects mathematics to the tea shop and economics to the farming fields.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl transition-all hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B49A68]">
                ORIGINAL WORK
              </span>
              <BookOpen className="w-4 h-4 text-[#6E7560]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#20201E]">
              Authentic Indian Story
            </h3>
            <p className="mt-1.5 text-xs text-[#6F6A60] leading-relaxed">
              Authored by a retired Indian Air Force officer, grounded in real rural social and financial realities.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl transition-all hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B49A68]">
                CINEMA ADAPTATION
              </span>
              <Clapperboard className="w-4 h-4 text-[#B98268]" />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#20201E]">
              Casting the Village
            </h3>
            <p className="mt-1.5 text-xs text-[#6F6A60] leading-relaxed">
              Inviting authentic actors, performers, and fresh faces to embody the characters on the big screen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

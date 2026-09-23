import React from 'react';
import { Feather, Shield, BookOpen } from 'lucide-react';

interface AboutAuthorSectionProps {
  authorName?: string;
  authorBio?: string;
}

export const AboutAuthorSection: React.FC<AboutAuthorSectionProps> = ({
  authorName = "[AUTHOR NAME]",
  authorBio = "Written by a retired Indian Air Force officer whose deep observation of rural life and passionate commitment to foundational education shaped this narrative journey.",
}) => {
  return (
    <section id="about" className="py-12 sm:py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 lg:p-14 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Author Portrait Silhouette / Emblem */}
            <div className="shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white/70 border-2 border-[#B49A68]/40 p-2 flex items-center justify-center relative shadow-md">
              <div className="w-full h-full rounded-full bg-white/90 flex flex-col items-center justify-center text-center p-4">
                <Shield className="w-8 h-8 text-[#6E7560] mb-2" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#B49A68]">
                  VETERAN AUTHOR
                </span>
                <span className="text-[9px] text-[#6F6A60] tracking-wider mt-1">
                  Indian Air Force (Retd.)
                </span>
              </div>
            </div>

            {/* Author Biography Narrative */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/70 border border-[#20201E]/10 text-[11px] font-bold tracking-[0.25em] text-[#6E7560] uppercase mb-4 shadow-xs">
                <Feather className="w-3.5 h-3.5 text-[#B98268]" />
                ABOUT THE AUTHOR
              </div>

              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#20201E] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {authorName}
              </h2>

              <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-[#B49A68] uppercase">
                Retired Indian Air Force Officer • Narrative Storyteller
              </p>

              <div className="mt-6 text-base text-[#504C44] leading-relaxed space-y-3">
                <p>{authorBio}</p>
                <p className="text-sm italic text-[#6F6A60]">
                  “The discipline of service instilled a lifelong habit of observing how systems either serve or fail people. In the rural village classroom, that discipline transforms into an urgent plea for independent thought.”
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#20201E]/8 flex flex-wrap items-center gap-6 text-xs text-[#20201E]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#B98268]" />
                  <span>Original Hindi Manuscript</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6E7560]" />
                  <span>Subject of Forthcoming Film Adaptation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

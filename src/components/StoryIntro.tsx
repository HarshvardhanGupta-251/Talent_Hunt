import React from 'react';
import { Quote } from 'lucide-react';

interface StoryIntroProps {
  quoteHindi?: string;
  quoteEnglish?: string;
  introText?: string;
}

export const StoryIntro: React.FC<StoryIntroProps> = ({
  quoteHindi = "शिक्षा केवल अंक पाने का माध्यम नहीं, सोचने की शक्ति विकसित करने का माध्यम है।",
  quoteEnglish = "Education is not merely a means of earning marks; it is the power to think.",
  introText = "In a village where conversations travel from the fields to the tea shop, ordinary people discuss extraordinary questions — crop prices, government policies, family dignity, and the future.",
}) => {
  return (
    <section className="py-8 sm:py-14 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 sm:p-12 rounded-3xl text-center shadow-xl">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68] block mb-2">
            THE STORY
          </span>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            WHERE EVERYDAY CONVERSATIONS BECOME LESSONS
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#504C44] leading-relaxed max-w-2xl mx-auto font-normal">
            {introText}
          </p>

          {/* The Central Editorial Quote Box */}
          <div className="mt-8 p-6 sm:p-10 rounded-2xl bg-white/70 border border-[#20201E]/10 text-center">
            <Quote className="w-8 h-8 mx-auto text-[#B98268]/60 mb-3" />

            <blockquote
              className="text-xl sm:text-2xl font-serif font-semibold text-[#20201E] leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              “{quoteHindi}”
            </blockquote>

            <div className="w-12 h-[1.5px] bg-[#B49A68] mx-auto my-4" />

            <p className="text-sm sm:text-base text-[#6F6A60] font-medium italic">
              “{quoteEnglish}”
            </p>

            <span className="block mt-4 text-[11px] font-bold tracking-[0.2em] text-[#20201E] uppercase">
              — Master Beerbhan • Village Teacher
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

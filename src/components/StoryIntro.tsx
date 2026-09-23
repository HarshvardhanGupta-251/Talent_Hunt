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
  introText = "In a village where conversations travel from the fields to the tea shop, ordinary people discuss extraordinary questions — the price of crops, government decisions, money, family, education and the future.",
}) => {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-14 rounded-3xl text-center shadow-xl">
          {/* Section Pre-title */}
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B49A68] block mb-3">
            EVERYDAY CONVERSATIONS • EXTRAORDINARY QUESTIONS
          </span>

          {/* Section Title */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            WHERE EVERYDAY CONVERSATIONS
            <br />
            <span className="text-[#6E7560] italic font-normal">BECOME LESSONS.</span>
          </h2>

          {/* Narrative Description */}
          <p className="mt-6 text-base sm:text-lg text-[#504C44] leading-relaxed max-w-2xl mx-auto font-normal">
            {introText}
          </p>

          {/* The Central Editorial Quote Box */}
          <div className="mt-10 relative p-6 sm:p-10 rounded-2xl bg-white/60 border border-[#20201E]/8 text-center backdrop-blur-sm">
            <Quote className="w-8 h-8 mx-auto text-[#B98268]/60 mb-4" />

            {/* Hindi Devanagari Inscription */}
            <blockquote
              className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-[#20201E] leading-relaxed tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              “{quoteHindi}”
            </blockquote>

            {/* Golden Divider */}
            <div className="w-16 h-[1.5px] bg-[#B49A68] mx-auto my-5" />

            {/* English Translation */}
            <p className="text-sm sm:text-base text-[#6F6A60] font-medium tracking-wide italic">
              “{quoteEnglish}”
            </p>

            <span className="block mt-4 text-[11px] font-bold tracking-[0.25em] text-[#20201E] uppercase">
              — Master Beerbhan • Village Teacher
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

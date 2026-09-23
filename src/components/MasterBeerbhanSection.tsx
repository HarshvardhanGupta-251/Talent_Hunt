import React from 'react';
import { Compass, Lightbulb, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

interface MasterBeerbhanSectionProps {
  beerbhanBio?: string;
  onExplorePedagogy?: () => void;
}

export const MasterBeerbhanSection: React.FC<MasterBeerbhanSectionProps> = ({
  beerbhanBio = "Master Beerbhan is a government schoolteacher who has spent three decades teaching in the village. But his classroom extends far beyond the walls of a school into markets, fields, chopal gatherings, and everyday rural situations.",
  onExplorePedagogy,
}) => {
  const cards = [
    {
      num: '01',
      titleHindi: 'सोचने की शक्ति',
      titleEng: 'THE POWER TO THINK',
      description:
        'Moving away from rote memorization toward deep inquiry. Teaching students and villagers how to interrogate assumptions and think for themselves.',
      icon: Lightbulb,
      tag: 'Critical Inquiry',
    },
    {
      num: '02',
      titleHindi: 'व्यावहारिक समाधान',
      titleEng: 'PRACTICAL SOLUTIONS',
      description:
        'Discovering answers embedded directly within life’s challenges. Translating arithmetic and science into fair trade, crop weighing, and problem-solving.',
      icon: Compass,
      tag: 'Applied Realities',
    },
    {
      num: '03',
      titleHindi: 'आत्मनिर्भरता',
      titleEng: 'FINANCIAL & PERSONAL INDEPENDENCE',
      description:
        'Empowering families and farmers to understand interest rates, market risk, and economic self-determination so they no longer rely on exploitation.',
      icon: ShieldCheck,
      tag: 'Sovereignty',
    },
  ];

  return (
    <section id="beerbhan" className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block in Glass Card */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl text-center max-w-4xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#20201E]/10 mb-4 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-[#B98268]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#6E7560] uppercase">
              THE CENTRAL CHARACTER
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            MEET MASTER BEERBHAN
          </h2>

          {/* Key Attributes Bar */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 px-6 rounded-full bg-white/70 border border-[#20201E]/10 text-xs font-semibold tracking-[0.2em] text-[#20201E] uppercase">
            <span>MASTER BEERBHAN</span>
            <span className="text-[#B98268]">•</span>
            <span>50 YEARS OLD</span>
            <span className="text-[#B98268]">•</span>
            <span>30 YEARS OF TEACHING</span>
          </div>

          <p className="mt-6 text-base sm:text-lg text-[#504C44] leading-relaxed max-w-3xl mx-auto">
            {beerbhanBio}
          </p>

          {/* Public Learning Spaces List */}
          <div className="mt-8 flex flex-nowrap items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 no-scrollbar max-w-full">
            {['Village Squares', 'The Tea Stall', 'Local Mandi & Markets', 'Wheat & Mustard Fields', 'Panchayat Gatherings'].map(
              (place, idx) => (
                <span
                  key={idx}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full glass-pill border border-[#20201E]/8 text-[#20201E] tracking-wider uppercase text-[10.5px] sm:text-[11px] whitespace-nowrap shrink-0"
                >
                  {place}
                </span>
              )
            )}
          </div>
        </div>

        {/* Three Core Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.num}
                className="glass-card p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#20201E]/8 pb-4 mb-6">
                    <span
                      className="text-3xl font-serif font-bold text-[#B98268]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {c.num}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6E7560] bg-white/70 px-2.5 py-1 rounded-full border border-stone-200">
                      {c.tag}
                    </span>
                  </div>

                  <h4 className="text-xl font-serif font-bold text-[#20201E] tracking-wide mb-1">
                    {c.titleHindi}
                  </h4>
                  <h5 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B49A68] mb-4">
                    {c.titleEng}
                  </h5>

                  <p className="text-sm text-[#6F6A60] leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#20201E]/8 flex items-center justify-between text-xs text-[#20201E]">
                  <span className="italic font-serif text-[#6F6A60]">Living Education</span>
                  <div className="w-8 h-8 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-[#20201E]">
                    <Icon className="w-4 h-4 text-[#6E7560]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

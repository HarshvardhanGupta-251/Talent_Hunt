import React from 'react';
import { ArrowRight, TrendingUp, DollarSign, HelpCircle, Lightbulb, CheckCircle2, RotateCw, Sparkles } from 'lucide-react';
import { FlipCard } from './FlipCard.js';

interface EconomicThinkingSectionProps {
  economicsText?: string;
}

export const EconomicThinkingSection: React.FC<EconomicThinkingSectionProps> = ({
  economicsText = "Through the everyday struggles and choices of two medium-scale farmer brothers, Santosh and Nafe, agricultural problems transform into profound explorations of rural economics, risk management, and self-reliance.",
}) => {
  const sequenceSteps = [
    {
      step: '01',
      label: 'PROBLEM',
      desc: 'Fluctuating crop prices, rising input costs, and seasonal debt cycles.',
      icon: DollarSign,
      color: 'text-[#B98268]',
      backTitle: 'Market Asymmetry',
      backDetail: 'Distressed post-harvest dumping forces immediate liquidity at rock-bottom prices.',
      takeaway: 'Farmers absorb 100% of weather & market variance alone.',
    },
    {
      step: '02',
      label: 'DISCUSSION',
      desc: 'Brothers Santosh & Nafe consult with village elders at the Chopal.',
      icon: TrendingUp,
      color: 'text-[#6E7560]',
      backTitle: 'Tradition vs Calculus',
      backDetail: 'Generational habits conflict with harsh new inputs like diesel, seeds, and pesticide debt.',
      takeaway: 'Complaints clarify the emotional stakes but delay arithmetic.',
    },
    {
      step: '03',
      label: 'QUESTION',
      desc: 'Master Beerbhan reframes the dilemma: What is the true cost of uncounted family labor?',
      icon: HelpCircle,
      color: 'text-[#B49A68]',
      backTitle: 'Opportunity Cost',
      backDetail: 'Beerbhan asks: “If you paid your family members daily wages, does your balance sheet balance?”',
      takeaway: 'The uncounted cost is where invisible poverty hides.',
    },
    {
      step: '04',
      label: 'THINKING',
      desc: 'Moving from helpless complaints to calculating margins, storage, and collective logistics.',
      icon: Lightbulb,
      color: 'text-[#20201E]',
      backTitle: 'Buffer Mathematics',
      backDetail: 'Modeling post-harvest holding: cost of warehouse space vs expected price rebound in 90 days.',
      takeaway: 'Risk management replaces superstitious hope.',
    },
    {
      step: '05',
      label: 'PRACTICAL SOLUTION',
      desc: 'Community bargaining and financial independence rooted in clear, self-directed math.',
      icon: CheckCircle2,
      color: 'text-[#6E7560]',
      backTitle: 'Collective Leverage',
      backDetail: 'Pooling transport to bypass exploitative intermediaries and securing direct urban mill contracts.',
      takeaway: 'Dignity through economic literacy and agency.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl text-center max-w-4xl mx-auto shadow-xl">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B49A68] block mb-3">
            RURAL ECONOMIC REALITIES
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            WHEN FARMING BECOMES
            <br />
            <span className="italic font-normal text-[#B98268]">AN ECONOMICS LESSON.</span>
          </h2>

          <div className="mt-5 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/70 border border-[#20201E]/10 text-xs font-semibold tracking-[0.2em] text-[#20201E] uppercase">
            <span>INTRODUCING:</span>
            <span className="font-serif font-bold text-sm text-[#B98268]">SANTOSH & NAFE</span>
            <span className="text-[#6F6A60]">(Farmer Brothers)</span>
          </div>

          <p className="mt-6 text-base sm:text-lg text-[#504C44] leading-relaxed max-w-3xl mx-auto">
            {economicsText}
          </p>

          {/* Themes Explored Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs">
            {[
              'Crop Prices & Mandi Dynamics',
              'Farming Economics & Debt Cycles',
              'Family Income vs. Real Expenses',
              'Financial Decision Making',
              'Risk Management & Buffer Storage',
              'Practical Problem Solving',
            ].map((theme, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full glass-pill border border-[#20201E]/8 text-[#20201E] font-medium tracking-wide text-[11px]"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Sequence: Problem -> Discussion -> Question -> Thinking -> Practical Solution */}
        <div className="mt-12">
          <div className="flex items-center justify-between max-w-xl mx-auto mb-6 px-2">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#6F6A60]">
              THE INQUIRY CYCLE
            </span>
            <span className="text-[11px] text-[#B98268] font-medium flex items-center gap-1">
              <RotateCw className="w-3 h-3 animate-spin-slow" />
              <span>Flip cards for economic analysis</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
            {sequenceSteps.map((s, index) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative flex justify-center w-full">
                  <FlipCard
                    width="100%"
                    height={280}
                    radius={20}
                    axis="y"
                    flipOnClick
                    draggable
                    tilt
                    tiltMax={10}
                    glare
                    glareOpacity={0.16}
                    hoverScale={1.02}
                    perspective={1000}
                    stiffness={210}
                    damping={22}
                    background="#FDFBF7"
                    color="#20201E"
                    shadow
                    shadowColor="#20201E"
                    shadowOpacity={0.12}
                    front={
                      <div className="w-full h-full p-5 rounded-2xl flex flex-col justify-between border border-[#20201E]/10 bg-[#FDFBF7]/95">
                        <div className="flex flex-col flex-1">
                          {/* Top Row: Step Number & Icon */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#B49A68] tracking-widest font-mono">
                              {s.step}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-white/80 border border-[#20201E]/6 flex items-center justify-center shadow-2xs">
                              <Icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                          </div>

                          {/* Step Title */}
                          <div className="mb-2">
                            <h4 className="font-serif font-bold text-xs sm:text-[13px] tracking-[0.14em] text-[#20201E] uppercase leading-snug">
                              {s.label}
                            </h4>
                          </div>

                          {/* Step Description */}
                          <p className="text-xs text-[#504C44] leading-relaxed line-clamp-3">
                            {s.desc}
                          </p>
                        </div>

                        {/* Interactive Hint */}
                        <div className="pt-2.5 border-t border-[#20201E]/8 flex items-center justify-between text-[10px] text-[#6F6A60]">
                          <span className="text-[#B98268] font-semibold tracking-wider uppercase flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Insight
                          </span>
                          <span className="font-mono text-[9.5px]">CLICK / DRAG</span>
                        </div>
                      </div>
                    }
                    back={
                      <div className="w-full h-full p-4.5 rounded-2xl flex flex-col justify-between bg-[#20201E] text-[#F8F6F0] border border-white/10 select-none">
                        <div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                            <span className="text-[9.5px] font-bold tracking-widest text-[#B49A68] uppercase font-mono">
                              STEP {s.step} ANALYSIS
                            </span>
                            <span className="text-[9px] text-[#F8F6F0]/50 uppercase">Beerbhan Lens</span>
                          </div>

                          <h5 className="text-xs font-serif font-bold text-[#F8F6F0] mb-1.5">
                            {s.backTitle}
                          </h5>

                          <p className="text-[11px] text-[#F8F6F0]/85 leading-relaxed mb-2 font-light">
                            {s.backDetail}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <p className="text-[10px] text-[#B49A68] italic font-serif leading-tight">
                            “{s.takeaway}”
                          </p>
                          <div className="mt-1 flex justify-end">
                            <span className="text-[9px] text-[#F8F6F0]/50 flex items-center gap-1 font-mono">
                              <RotateCw className="w-2 h-2" /> FLIP
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  />

                  {/* Flow Arrow to Next Step on Desktop */}
                  {index < sequenceSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3.5 lg:-right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-[#20201E]/12 items-center justify-center text-[#6F6A60] shadow-sm pointer-events-none">
                      <ArrowRight className="w-3.5 h-3.5 text-[#20201E]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Philosophy Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl glass-card text-center max-w-2xl mx-auto shadow-lg">
          <p className="font-serif text-lg sm:text-xl font-medium text-[#20201E] italic">
            “Problems become opportunities to learn how to think.”
          </p>
          <span className="block mt-2 text-xs font-semibold tracking-[0.2em] text-[#B49A68] uppercase">
            Economic Consciousness in the Rural Fabric
          </span>
        </div>
      </div>
    </section>
  );
};

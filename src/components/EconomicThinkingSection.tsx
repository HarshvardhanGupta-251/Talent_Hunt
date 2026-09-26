import React from 'react';
import { ArrowRight, TrendingUp, DollarSign, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface EconomicThinkingSectionProps {
  economicsText?: string;
}

export const EconomicThinkingSection: React.FC<EconomicThinkingSectionProps> = ({
  economicsText = "Through the everyday struggles and choices of two farmer brothers, Santosh and Nafe, agricultural problems transform into practical lessons in rural economics, risk management, and self-reliance.",
}) => {
  const steps = [
    {
      step: '01',
      label: 'PROBLEM',
      title: 'Market Pressures & Debt',
      desc: 'Fluctuating crop prices, rising diesel and pesticide costs, and post-harvest debt cycles.',
      icon: DollarSign,
      color: 'text-[#B98268]',
    },
    {
      step: '02',
      label: 'DISCUSSION',
      title: 'Consulting the Chopal',
      desc: 'Brothers Santosh and Nafe meet village elders to weigh traditional habits against harsh input costs.',
      icon: TrendingUp,
      color: 'text-[#6E7560]',
    },
    {
      step: '03',
      label: 'QUESTION',
      title: 'Master Beerbhan’s Inquiry',
      desc: 'Master Beerbhan asks: “If you paid your family members daily wages, does your balance sheet still balance?”',
      icon: HelpCircle,
      color: 'text-[#B49A68]',
    },
    {
      step: '04',
      label: 'THINKING',
      title: 'Buffer Storage & Margins',
      desc: 'Calculating warehouse storage costs against expected price increases after the harvest rush.',
      icon: Lightbulb,
      color: 'text-[#20201E]',
    },
    {
      step: '05',
      label: 'SOLUTION',
      title: 'Collective Bargaining',
      desc: 'Pooling transport to bypass exploitative intermediaries and securing direct contracts.',
      icon: CheckCircle2,
      color: 'text-[#6E7560]',
    },
  ];

  return (
    <section className="py-8 sm:py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl text-center max-w-3xl mx-auto mb-10 shadow-xl">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68] block mb-2">
            RURAL ECONOMIC REALITIES
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            WHEN FARMING BECOMES AN ECONOMICS LESSON
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#504C44] leading-relaxed">
            {economicsText}
          </p>
        </div>

        {/* 5-Step Inquiry Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl border border-[#20201E]/10 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#B49A68] font-mono tracking-wider">
                      STEP {s.step}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#20201E]/8 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6E7560] block mb-1">
                    {s.label}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#20201E] mb-2 leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#504C44] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sober Thought Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-white/70 border border-[#20201E]/10 text-center max-w-2xl mx-auto shadow-sm">
          <p className="font-serif text-base sm:text-lg text-[#20201E] italic">
            “Problems become opportunities to learn how to think.”
          </p>
          <span className="block mt-1 text-xs font-semibold tracking-wider text-[#B49A68] uppercase">
            Master Beerbhan • Education for Self-Reliance
          </span>
        </div>
      </div>
    </section>
  );
};

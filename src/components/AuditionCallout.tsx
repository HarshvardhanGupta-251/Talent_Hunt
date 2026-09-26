import React from 'react';
import { Clapperboard, Search, UserCheck } from 'lucide-react';

interface AuditionCalloutProps {
  onApplyAudition: () => void;
  onTrackAudition: () => void;
}

export const AuditionCallout: React.FC<AuditionCalloutProps> = ({
  onApplyAudition,
  onTrackAudition,
}) => {
  const openRoles = [
    {
      role: 'MASTER BEERBHAN',
      roleHindi: 'मास्टर बीरभान',
      age: 'Approx. 50 Years Old',
      essence: 'Quiet intellectual authority, deep moral grounding, calm village warmth.',
      auditionLine: '“शिक्षा कागज़ की नाव नहीं है जिसे पानी में बहा दो... यह तो तैरने का हुनर है।”',
      englishLine: '“Education is not a paper boat to set adrift; it is the art of swimming through the currents of life.”',
    },
    {
      role: 'SANTOSH (FARMER)',
      roleHindi: 'संतोष (बड़ा भाई)',
      age: 'Approx. 35–45 Years Old',
      essence: 'Elder brother bearing the weight of ancestral soil, vulnerable yet resilient.',
      auditionLine: '“बीरभान जी, खेत तो हमारा है पर उसकी कीमत तय करने वाला कोई और क्यों है?”',
      englishLine: '“Beerbhan ji, the soil is ours, the sweat is ours... why is the price decided by someone elsewhere?”',
    },
    {
      role: 'NAFE (YOUNGER BROTHER)',
      roleHindi: 'नफे (छोटा भाई)',
      age: 'Approx. 28–35 Years Old',
      essence: 'Restless, observant, seeking economic truth amidst tradition.',
      auditionLine: '“अगर हम दोनों भाई मिलकर अनाज रोक लें, तो क्या मंडी झुक नहीं सकती?”',
      englishLine: '“If both of us brothers withhold our grain, can we not make the market listen?”',
    },
    {
      role: 'VILLAGE ELDERS & ENSEMBLE',
      roleHindi: 'ग्रामीण बुजुर्ग एवं चौपाल दल',
      age: 'All Ages',
      essence: 'Authentic rural accents, expressive facial gravity, natural presence.',
      auditionLine: '“जमाना बदल गया मास्टर, अब गेहूं तोलता तराजू भी बिजली से चलता है!”',
      englishLine: '“Times have turned, Master... now even the mandi scale runs on electric current!”',
    },
  ];

  return (
    <section id="audition" className="py-8 sm:py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-white/60">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-[0.25em] text-[#B49A68] uppercase block mb-2">
              CASTING CALL
            </span>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              BRING THE CHARACTERS TO LIFE
            </h2>

            <p className="mt-3 text-base sm:text-lg text-[#504C44] leading-relaxed max-w-2xl mx-auto">
              We are seeking authentic actors, theatre performers, and fresh faces for the upcoming feature film adaptation of Master Beerbhan.
            </p>
          </div>

          {/* 4 Roles Clean Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {openRoles.map((r, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#20201E]/10 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif text-[#6F6A60] italic">
                      {r.roleHindi}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-[#B49A68] uppercase">
                      ROLE 0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#20201E]">
                    {r.role}
                  </h3>
                  <span className="text-xs font-medium text-[#6E7560] block mb-2">
                    {r.age}
                  </span>
                  <p className="text-xs text-[#504C44] leading-relaxed mb-4">
                    {r.essence}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#20201E]/8 space-y-1">
                  <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#B98268] block">
                    Audition Dialogue
                  </span>
                  <p className="text-xs font-serif text-[#20201E] italic">
                    {r.auditionLine}
                  </p>
                  <p className="text-[11px] text-[#6F6A60]">
                    {r.englishLine}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onApplyAudition}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#20201E] text-white text-xs font-bold tracking-[0.16em] uppercase hover:bg-black transition-all shadow-md cursor-pointer"
            >
              <Clapperboard className="w-4 h-4 text-[#B49A68]" />
              <span>APPLY FOR AUDITION</span>
            </button>

            <button
              onClick={onTrackAudition}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-[#20201E]/15 text-[#20201E] text-xs font-bold tracking-[0.16em] uppercase hover:bg-[#F2EFE7] transition-all shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#6E7560]" />
              <span>TRACK AUDITION STATUS</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

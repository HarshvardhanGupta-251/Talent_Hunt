import React from 'react';
import { Clapperboard, Film, Search, RotateCw, Sparkles, MessageSquare } from 'lucide-react';
import { FlipCard } from './FlipCard.js';

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
      cue: 'Scene: At the school threshold, speaking calmly without raising your voice.',
    },
    {
      role: 'SANTOSH (FARMER)',
      roleHindi: 'संतोष (बड़ा भाई)',
      age: 'Approx. 35–45 Years Old',
      essence: 'Elder brother bearing the weight of ancestral soil, vulnerable yet resilient.',
      auditionLine: '“बीरभान जी, खेत तो हमारा है पर उसकी कीमत तय करने वाला कोई और क्यों है?”',
      englishLine: '“Beerbhan ji, the soil is ours, the sweat is ours... why is the price decided by someone in a glass room?”',
      cue: 'Scene: Sitting near the dry tractor wheel, weary yet fiercely protective.',
    },
    {
      role: 'NAFE (YOUNGER BROTHER)',
      roleHindi: 'नफे (छोटा भाई)',
      age: 'Approx. 28–35 Years Old',
      essence: 'Restless, observant, seeking economic truth amidst tradition.',
      auditionLine: '“अगर हम दोनों भाई मिलकर अनाज रोक लें, तो क्या मंडी झुक नहीं सकती?”',
      englishLine: '“If both of us brothers withhold our grain, can we not make the market listen?”',
      cue: 'Scene: Looking over the harvested mustard bags with sharp, calculating eyes.',
    },
    {
      role: 'VILLAGE ELDERS & ENSEMBLE',
      roleHindi: 'ग्रामीण बुजुर्ग एवं चौपाल दल',
      age: 'Varied (All Ages)',
      essence: 'Authentic rural accents, expressive facial gravity, natural presence.',
      auditionLine: '“जमाना बदल गया मास्टर, अब गेहूं तोलता तराजू भी बिजली से चलता है!”',
      englishLine: '“Times have turned, Master... now even the mandi scale runs on electric current!”',
      cue: 'Scene: Chopal debate under the banyan tree; natural conversational rhythm.',
    },
  ];

  return (
    <section id="audition" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Film Frame Aesthetic Container */}
        <div className="glass-card p-8 sm:p-12 lg:p-14 rounded-3xl relative overflow-hidden shadow-2xl border border-white/60">
          {/* Film Strip Edge Accent */}
          <div className="hidden sm:flex justify-between w-full pb-6 border-b border-[#20201E]/8 text-[10px] tracking-[0.3em] font-semibold text-[#6F6A60] uppercase">
            <span>EYE WINN PRODUCTIONS • SCENE I</span>
            <span>CASTING DEPARTMENT</span>
            <span>CINEMATIC ADAPTATION</span>
          </div>

          <div className="text-center max-w-3xl mx-auto my-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#20201E]/10 mb-4 shadow-xs">
              <Clapperboard className="w-4 h-4 text-[#B98268]" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#6E7560] uppercase">
                OFFICIAL CASTING CALL
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              BRING THE STORY TO LIFE.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#504C44] leading-relaxed max-w-2xl mx-auto">
              The characters exist on the page. Now we’re looking for the actors, performers, and real human voices who can bring them to life on screen.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#B98268]">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Flip cards to reveal audition dialogue sides & scene cues</span>
            </div>
          </div>

          {/* Character Roles Grid with FlipCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {openRoles.map((r, i) => (
              <div key={i} className="flex justify-center w-full">
                <FlipCard
                  width="100%"
                  height={310}
                  radius={20}
                  axis="y"
                  flipOnClick
                  draggable
                  tilt
                  tiltMax={10}
                  glare
                  glareOpacity={0.16}
                  hoverScale={1.02}
                  perspective={1100}
                  stiffness={210}
                  damping={22}
                  background="#FDFBF7"
                  color="#20201E"
                  shadow
                  shadowColor="#20201E"
                  shadowOpacity={0.12}
                  front={
                    <div className="w-full h-full p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#20201E]/10 flex flex-col justify-between select-none">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold tracking-widest text-[#B49A68] uppercase font-mono">
                            ROLE 0{i + 1}
                          </span>
                          <span className="text-[10px] font-serif text-[#6F6A60] italic">
                            {r.roleHindi}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#20201E] mb-1 leading-snug">
                          {r.role}
                        </h4>
                        <span className="text-[11px] font-medium text-[#6E7560] block mb-2.5">
                          {r.age}
                        </span>
                        <p className="text-xs text-[#504C44] leading-relaxed line-clamp-3">
                          {r.essence}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#20201E]/8 flex items-center justify-between text-[11px] text-[#20201E]">
                        <span className="font-semibold text-[#B98268] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Audition Sides
                        </span>
                        <span className="text-[9.5px] font-mono text-[#6F6A60] bg-stone-100 px-2 py-0.5 rounded-full">
                          FLIP CARD
                        </span>
                      </div>
                    </div>
                  }
                  back={
                    <div className="w-full h-full p-5 rounded-2xl bg-[#20201E] text-[#F8F6F0] border border-white/10 flex flex-col justify-between select-none">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                          <div className="flex items-center gap-1.5 text-[9.5px] font-bold tracking-wider text-[#B49A68] uppercase">
                            <MessageSquare className="w-3 h-3" />
                            <span>TEST MONOLOGUE</span>
                          </div>
                          <span className="text-[9.5px] text-white/50 font-mono">ROLE 0{i + 1}</span>
                        </div>

                        <p className="text-xs font-serif text-[#F8F6F0] leading-relaxed mb-2 italic">
                          {r.auditionLine}
                        </p>
                        <p className="text-[10.5px] text-[#F8F6F0]/70 leading-snug font-light mb-2">
                          {r.englishLine}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[9px] text-[#B98268] uppercase tracking-wider block font-semibold">
                          DIRECTOR'S CUE:
                        </span>
                        <p className="text-[10px] text-white/60 leading-tight mt-0.5">
                          {r.cue}
                        </p>
                        <div className="mt-2 flex justify-end">
                          <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono">
                            <RotateCw className="w-2 h-2" /> FLIP BACK
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onApplyAudition}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-md active:scale-98"
            >
              <Clapperboard className="w-4 h-4 text-[#B49A68]" />
              <span>APPLY FOR AUDITION</span>
            </button>

            <button
              onClick={onTrackAudition}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-pill text-[#20201E] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xs"
            >
              <Search className="w-4 h-4 text-[#6E7560]" />
              <span>TRACK YOUR APPLICATION</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-[#6F6A60]">
            <span>Secure candidate privacy • Automatic application sequence tracking (e.g. EYW-AUD-2026-000123)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

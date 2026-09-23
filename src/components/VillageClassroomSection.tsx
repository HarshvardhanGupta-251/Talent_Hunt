import React from 'react';
import { Users, Coffee, School, Wheat, ShoppingBag, RotateCw, Sparkles, BookOpen } from 'lucide-react';
import { FlipCard } from './FlipCard.js';

export const VillageClassroomSection: React.FC = () => {
  const environments = [
    {
      id: 'chopal',
      title: 'THE CHOPAL',
      titleHindi: 'चौपाल',
      subtitle: 'The Village Forum',
      description: 'Village conversations about society, politics, community welfare, and the deeper questions of rural governance under the shade of the neem tree.',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      lessonQuote: '“जब तक सामूहिक निर्णय में हर परिवार की आवाज नहीं होगी, तब तक न्याय सिर्फ कागजों पर रहेगा।”',
      keyInquiry: 'Who bears the cost of community silence, and how do informal assemblies shape rural democracy?',
      concept: 'Democratic Discourse & Collective Will',
    },
    {
      id: 'tea-shop',
      title: 'THE TEA SHOP',
      titleHindi: 'चाय की दुकान',
      subtitle: 'The Daily Discourse',
      description: 'Where simmering brass pots and morning ginger tea become the venue for spirited, spontaneous debates on inflation, elections, and family obligations.',
      icon: Coffee,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
      lessonQuote: '“चाय की चुस्की के साथ जो तर्क दिए जाते हैं, वही असली जनमत का आइना हैं।”',
      keyInquiry: 'How do daily news and economic policies translate into the kitchen budgets of ordinary families?',
      concept: 'Public Opinion & Micro-Economics',
    },
    {
      id: 'school',
      title: 'THE SCHOOL',
      titleHindi: 'सरकारी विद्यालय',
      subtitle: 'Unconventional Pedagogy',
      description: 'Traditional curriculum meets critical inquiry. A two-room government school where children learn to question rather than blindly memorize.',
      icon: School,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      lessonQuote: '“किताबें उत्तर नहीं देतीं, वे केवल सोचने का पहला दरवाजा खोलती हैं।”',
      keyInquiry: 'Can rural education be transformed from rote examination into an engine of lifelong problem-solving?',
      concept: 'Critical Inquiry Over Rote Memory',
    },
    {
      id: 'fields',
      title: 'THE FIELDS',
      titleHindi: 'खेत और खलिहान',
      subtitle: 'Applied Rural Economics',
      description: 'Agriculture transformed into a live lesson in pricing, soil stewardship, investment cycles, and the real cost of uncounted agricultural sweat.',
      icon: Wheat,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
      lessonQuote: '“मेहनत का कोई खाता नहीं होता, पर जब हिसाब लगाने बैठो तो पसीना भी कर्ज में दिखता है।”',
      keyInquiry: 'How do two farmer brothers, Santosh and Nafe, calculate opportunity costs and buffer storage?',
      concept: 'Input Cost vs. Family Labor Accounting',
    },
    {
      id: 'market',
      title: 'THE MARKET',
      titleHindi: 'अनाज मंडी और बाज़ार',
      subtitle: 'Decisions in Action',
      description: 'Real-life decisions become profound learning experiences where students calculate margins, weigh grain sacks, and dismantle middlemen markups.',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      lessonQuote: '“मंडी केवल अनाज बेचने की जगह नहीं, यह समझ की कसौटी है।”',
      keyInquiry: 'Why do farmers surrender pricing power at harvest, and what enables collective bargaining?',
      concept: 'Market Power & Margin Analysis',
    },
  ];

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl text-center max-w-3xl mx-auto mb-10 shadow-xl">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#B49A68] block mb-2">
            THE WORLD OF THE STORY
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            THE VILLAGE IS THE CLASSROOM.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#504C44] leading-relaxed">
            Five living environments where routine village existence reveals foundational truths about life, education, economics, and self-reliance.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B98268]/10 text-xs text-[#B98268] font-medium">
            <RotateCw className="w-3 h-3 animate-spin-slow" />
            <span>Interactive 3D Cards • Click or drag to reveal pedagogical insights</span>
          </div>
        </div>

        {/* Five Story Cards Bento Grid with FlipCard Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environments.map((env, i) => {
            const Icon = env.icon;
            const isWide = i === 3 || i === 4;

            return (
              <div
                key={env.id}
                className={`${isWide && i === 3 ? 'lg:col-span-1' : ''} ${
                  isWide && i === 4 ? 'lg:col-span-2' : ''
                } flex justify-center`}
              >
                <FlipCard
                  width="100%"
                  height={420}
                  radius={24}
                  axis="y"
                  flipOnClick
                  draggable
                  tilt
                  tiltMax={10}
                  glare
                  glareOpacity={0.18}
                  hoverScale={1.02}
                  perspective={1200}
                  stiffness={200}
                  damping={22}
                  background="#FDFBF7"
                  color="#20201E"
                  shadow
                  shadowColor="#20201E"
                  shadowOpacity={0.16}
                  front={
                    <div className="w-full h-full flex flex-col justify-between border border-[#20201E]/10 rounded-3xl bg-[#FDFBF7] overflow-hidden">
                      {/* Top Image Banner */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#EAE4D8] shrink-0">
                        <img
                          src={env.image}
                          alt={env.title}
                          className="w-full h-full object-cover object-center filter saturate-90 select-none text-transparent"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#20201E]/85 via-[#20201E]/30 to-transparent pointer-events-none" />

                        {/* Floating Titles on Image */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[11px] font-serif text-[#F8F6F0]/85 tracking-wider block">
                              {env.titleHindi}
                            </span>
                            <h3
                              className="text-lg font-serif font-bold text-[#F8F6F0] tracking-wide"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {env.title}
                            </h3>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#20201E] shadow-sm">
                            <Icon className="w-4 h-4 text-[#B98268]" />
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6E7560] block mb-1.5">
                            {env.subtitle}
                          </span>
                          <p className="text-xs text-[#504C44] leading-relaxed line-clamp-3">
                            {env.description}
                          </p>
                        </div>

                        {/* Interactive Hint Indicator */}
                        <div className="pt-3 border-t border-[#20201E]/8 flex items-center justify-between text-xs text-[#20201E]">
                          <span className="text-[10.5px] font-semibold tracking-wider text-[#B49A68] uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Flip to explore</span>
                          </span>
                          <span className="text-[10px] text-[#6F6A60] font-mono tracking-tight bg-stone-100 px-2 py-0.5 rounded-full">
                            DRAG / CLICK
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                  back={
                    <div className="w-full h-full flex flex-col justify-between p-6 rounded-3xl bg-[#20201E] text-[#F8F6F0] border border-white/10 select-none">
                      {/* Back Card Top Header */}
                      <div className="border-b border-white/12 pb-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#B49A68]" />
                          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B49A68] uppercase">
                            MASTER BEERBHAN'S NOTE
                          </span>
                        </div>
                        <span className="text-[10px] text-[#F8F6F0]/60 font-mono tracking-wider">
                          0{i + 1}
                        </span>
                      </div>

                      {/* Core Inquiry & Quote */}
                      <div className="my-auto py-2 space-y-3">
                        <div className="bg-white/5 border border-white/8 rounded-xl p-3.5">
                          <span className="text-[9.5px] uppercase font-bold tracking-[0.2em] text-[#B98268] block mb-1">
                            CORE QUESTION
                          </span>
                          <p className="text-xs text-[#F8F6F0]/90 leading-relaxed font-serif italic">
                            {env.keyInquiry}
                          </p>
                        </div>

                        <div className="pl-3 border-l-2 border-[#B49A68]">
                          <span className="text-[9px] uppercase tracking-widest text-[#F8F6F0]/50 block">
                            PEDAGOGICAL INSIGHT
                          </span>
                          <p className="text-xs font-serif text-[#F8F6F0] leading-snug mt-1">
                            {env.lessonQuote}
                          </p>
                        </div>
                      </div>

                      {/* Back Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span className="text-[#B49A68] font-semibold tracking-wider uppercase">
                          {env.concept}
                        </span>
                        <span className="text-[#F8F6F0]/50 flex items-center gap-1 font-mono">
                          <RotateCw className="w-2.5 h-2.5" /> FLIP BACK
                        </span>
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

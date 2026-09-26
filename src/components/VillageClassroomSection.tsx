import React from 'react';
import { Users, Coffee, School, Wheat, ShoppingBag } from 'lucide-react';

export const VillageClassroomSection: React.FC = () => {
  const environments = [
    {
      id: 'chopal',
      title: 'THE CHOPAL',
      titleHindi: 'चौपाल',
      subtitle: 'The Village Forum',
      description: 'Village conversations about community, governance, and collective decisions under the shade of the neem tree.',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      lessonQuoteHindi: '“जब तक सामूहिक निर्णय में हर परिवार की आवाज नहीं होगी, तब तक न्याय सिर्फ कागजों पर रहेगा।”',
      lessonQuoteEnglish: 'Until every household has a voice in collective decisions, justice remains only on paper.',
    },
    {
      id: 'tea-shop',
      title: 'THE TEA SHOP',
      titleHindi: 'चाय की दुकान',
      subtitle: 'The Daily Discourse',
      description: 'Where morning tea becomes the venue for lively discussions on inflation, government policies, and household budgets.',
      icon: Coffee,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
      lessonQuoteHindi: '“चाय की चुस्की के साथ जो तर्क दिए जाते हैं, वही असली जनमत का आइना हैं।”',
      lessonQuoteEnglish: 'The reasoning shared over a cup of tea reflects genuine public sentiment and micro-economics.',
    },
    {
      id: 'school',
      title: 'THE SCHOOL',
      titleHindi: 'सरकारी विद्यालय',
      subtitle: 'Critical Inquiry',
      description: 'A two-room government school where Master Beerbhan teaches children to question and think rather than blindly memorize.',
      icon: School,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      lessonQuoteHindi: '“किताबें उत्तर नहीं देतीं, वे केवल सोचने का पहला दरवाजा खोलती हैं।”',
      lessonQuoteEnglish: 'Books do not hand down final answers; they open the first door to independent thought.',
    },
    {
      id: 'fields',
      title: 'THE FIELDS',
      titleHindi: 'खेत और खलिहान',
      subtitle: 'Agricultural Economics',
      description: 'Agriculture turned into practical lessons on input costs, soil health, crop cycles, and the real value of family labor.',
      icon: Wheat,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
      lessonQuoteHindi: '“मेहनत का कोई खाता नहीं होता, पर जब हिसाब लगाने बैठो तो पसीना भी कर्ज में दिखता है।”',
      lessonQuoteEnglish: 'Unaccounted family sweat hides true agricultural costs. Clear calculations bring self-reliance.',
    },
    {
      id: 'market',
      title: 'THE MARKET',
      titleHindi: 'अनाज मंडी',
      subtitle: 'Decisions in Action',
      description: 'Real-world market negotiations where farmers calculate margins, manage price risk, and learn the value of collective bargaining.',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      lessonQuoteHindi: '“मंडी केवल अनाज बेचने की जगह नहीं, यह समझ की कसौटी है।”',
      lessonQuoteEnglish: 'The market is not merely a place to sell grain; it tests real economic awareness.',
    },
  ];

  return (
    <section className="py-8 sm:py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl text-center max-w-3xl mx-auto mb-10 shadow-xl">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#B49A68] block mb-2">
            THE WORLD OF THE STORY
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#20201E] tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            THE VILLAGE IS THE CLASSROOM
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#504C44] leading-relaxed">
            Five living environments where routine village life reveals fundamental truths about education, economics, and critical thinking.
          </p>
        </div>

        {/* 5 Clear, Sober Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environments.map((env, i) => {
            const Icon = env.icon;
            const isWide = i === 4;

            return (
              <div
                key={env.id}
                className={`bg-white rounded-3xl border border-[#20201E]/10 overflow-hidden shadow-md flex flex-col justify-between ${
                  isWide ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-[#EAE4D8]">
                  <img
                    src={env.image}
                    alt={env.title}
                    className="w-full h-full object-cover object-center filter saturate-90"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20201E]/85 via-[#20201E]/30 to-transparent pointer-events-none" />

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-serif text-[#F8F6F0]/80 tracking-wider block">
                        {env.titleHindi}
                      </span>
                      <h3
                        className="text-lg font-serif font-bold text-[#F8F6F0] tracking-wide"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {env.title}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-[#20201E] shadow-sm">
                      <Icon className="w-4 h-4 text-[#B98268]" />
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6E7560] block mb-1">
                      {env.subtitle}
                    </span>
                    <p className="text-xs sm:text-sm text-[#504C44] leading-relaxed">
                      {env.description}
                    </p>
                  </div>

                  {/* Directly Readable Reflection / Quote */}
                  <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#20201E]/8 space-y-1.5">
                    <p className="text-xs font-serif text-[#20201E] font-medium leading-relaxed">
                      {env.lessonQuoteHindi}
                    </p>
                    <p className="text-[11px] text-[#6F6A60] italic leading-normal">
                      "{env.lessonQuoteEnglish}"
                    </p>
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

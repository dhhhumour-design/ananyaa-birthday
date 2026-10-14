import React from 'react';
import { Sparkles, Heart, Sun, Stars } from 'lucide-react';
import { MediaService } from '../utils/mediaStore';

interface MemoryCardData {
  id: string;
  icon: React.ReactNode;
  quote: string;
  accent: string;
  photoUrl: string;
  photoAlt: string;
}

export const MemoryCards: React.FC = () => {
  const MEMORIES: MemoryCardData[] = [
    {
      id: 'm1',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      quote: 'Some people make ordinary days feel a little brighter.',
      accent: 'from-amber-100/50 to-rose-100/30',
      photoUrl: MediaService.getPhoto('photo-2') || '/ananya_real_2.jpg',
      photoAlt: 'Ananya smiling warmly',
    },
    {
      id: 'm2',
      icon: <Stars className="w-5 h-5 text-rose-500" />,
      quote: 'Some friendships become memories before we even realize it.',
      accent: 'from-rose-100/50 to-pink-100/30',
      photoUrl: MediaService.getPhoto('photo-3') || '/ananya_real_3.jpg',
      photoAlt: 'Ananya happy candid moment',
    },
    {
      id: 'm3',
      icon: <Heart className="w-5 h-5 text-rose-600 fill-rose-400" />,
      quote: 'And some people are simply impossible not to smile about.',
      accent: 'from-pink-100/60 to-purple-100/30',
      photoUrl: MediaService.getPhoto('photo-4') || '/ananya_real_4.jpg',
      photoAlt: 'Ananya golden hour smile',
    },
  ];

  return (
    <section className="py-14 px-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Whispers of Appreciation
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
          Reminders For You
        </h2>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {MEMORIES.map((m, idx) => (
          <div
            key={m.id}
            className="liquid-glass relative rounded-3xl p-5 sm:p-6 shadow-lg shadow-rose-950/5 border border-white/85 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-900/10"
            style={{
              animationDelay: `${idx * 0.2}s`,
            }}
          >
            {/* Real circular photo of Ananya instead of cartoon emojis */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full p-0.5 liquid-glass shadow-md border border-white/90 overflow-hidden">
              <img
                src={m.photoUrl}
                alt={m.photoAlt}
                className="w-full h-full object-cover object-center rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-start gap-3.5 pr-12">
              <div className="w-10 h-10 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center shrink-0 border border-white/80">
                {m.icon}
              </div>

              <div>
                <p className="font-serif text-base sm:text-lg text-rose-950 font-medium leading-relaxed">
                  &ldquo;{m.quote}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-6 h-0.5 rounded-full bg-rose-300/80" />
                  <span className="text-[11px] font-semibold text-rose-800/70 uppercase tracking-wider">
                    Always True
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

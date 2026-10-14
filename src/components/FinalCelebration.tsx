import React from 'react';
import { RotateCcw, Heart, Sparkles, Crown } from 'lucide-react';
import { sound } from '../utils/audio';
import { MediaService } from '../utils/mediaStore';

interface FinalCelebrationProps {
  onReplay: () => void;
  onBurstConfetti: (x?: number, y?: number) => void;
  photoUrl?: string;
}

export const FinalCelebration: React.FC<FinalCelebrationProps> = ({
  onReplay,
  onBurstConfetti,
  photoUrl = MediaService.getPhoto('photo-1') || '/ananya_real_1.jpg',
}) => {
  const handleReplayClick = () => {
    sound.playSparkle();
    onBurstConfetti();
    onReplay();
  };

  return (
    <section className="relative pt-12 pb-24 px-4 max-w-lg mx-auto text-center">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-rose-300/40 via-amber-200/40 to-pink-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Circular Photo Accent */}
      <div className="relative inline-block mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 liquid-glass shadow-xl border border-white/90 animate-soft-float mx-auto overflow-hidden">
          <img
            src={photoUrl}
            alt="Ananya glowing smile"
            className="w-full h-full object-cover object-center rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-rose-950 flex items-center justify-center shadow-md border-2 border-white">
          <Crown className="w-4 h-4 fill-amber-300" />
        </div>
        <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-white">
          <Heart className="w-3.5 h-3.5 fill-white" />
        </div>
      </div>

      {/* Headings */}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-950 mb-3 tracking-tight">
        Happy Birthday, <br />
        <span className="shimmer-text">Ananya</span>
      </h2>

      <p className="font-serif text-base sm:text-lg font-semibold text-rose-900/90 mb-8 max-w-sm mx-auto">
        15 October — Your Day, Your Moment, Your Magic ✨
      </p>

      {/* Replay Button */}
      <div className="mb-10">
        <button
          onClick={handleReplayClick}
          className="liquid-pill group px-6 py-3.5 rounded-full font-semibold text-rose-950 text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer glow-champagne"
        >
          <RotateCcw className="w-4 h-4 text-rose-600 group-hover:-rotate-90 transition-transform duration-500" />
          <span>Experience Again ↻</span>
        </button>
      </div>

      {/* Emotional Footer Tagline */}
      <div className="liquid-glass-subtle max-w-xs mx-auto rounded-2xl py-3 px-4 border border-white/70 shadow-sm">
        <p className="text-xs text-rose-900/75 leading-relaxed font-medium">
          Handcrafted with warmth, cherished memories, and boundless celebration. ✨
        </p>
      </div>
    </section>
  );
};

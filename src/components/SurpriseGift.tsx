import React, { useState } from 'react';
import { Gift, Heart, Sparkles, Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface SurpriseGiftProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const SurpriseGift: React.FC<SurpriseGiftProps> = ({ onBurstConfetti }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = (e: React.MouseEvent) => {
    if (isOpen) return;

    sound.playGiftPop();
    const rect = e.currentTarget.getBoundingClientRect();
    onBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3);
    setIsOpen(true);
  };

  return (
    <section className="py-14 px-4 max-w-lg mx-auto text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Gift className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Special Climax
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
          One Last Little Surprise ✨
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/70 mt-1">
          {isOpen ? 'A secret unwrapped just for you' : 'Tap the gift box to see what is hidden inside!'}
        </p>
      </div>

      {/* Interactive Gift Card */}
      <div
        onClick={handleOpenGift}
        className="liquid-glass relative rounded-3xl p-8 sm:p-10 shadow-xl shadow-rose-950/10 border border-white/90 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Glowing Background Core */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isOpen ? 'bg-amber-300/60 scale-150' : 'bg-rose-300/30'
          }`}
        />

        {/* 3D-styled Gift Box */}
        <div className="relative w-44 h-48 mx-auto flex flex-col items-center justify-center">
          {!isOpen ? (
            /* Unopened Bouncing Gift */
            <div className="animate-bounce">
              {/* Lid with Ribbon */}
              <div className="relative w-36 h-10 rounded-xl bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 shadow-md border-b-2 border-rose-700 flex items-center justify-center">
                {/* Gold Bow on top */}
                <div className="absolute -top-6 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-amber-400 border border-amber-300 shadow-md" />
                  <div className="absolute -left-3 -top-1 w-6 h-4 rounded-full border-2 border-amber-400 -rotate-45" />
                  <div className="absolute -right-3 -top-1 w-6 h-4 rounded-full border-2 border-amber-400 rotate-45" />
                </div>
                {/* Vertical Ribbon */}
                <div className="w-6 h-full bg-amber-300 shadow-sm" />
              </div>

              {/* Box Base */}
              <div className="relative w-32 h-28 mx-auto rounded-b-2xl bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 shadow-xl flex justify-center overflow-hidden">
                {/* Vertical Ribbon Stripe */}
                <div className="w-6 h-full bg-amber-300 shadow-sm" />
                {/* Horizontal Ribbon Stripe */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-amber-300 shadow-sm" />
              </div>
            </div>
          ) : (
            /* Opened Gift with Bursting Sparkles */
            <div className="relative flex flex-col items-center animate-fade-in">
              {/* Flying Off Lid */}
              <div className="w-28 h-8 rounded-lg bg-rose-400/80 -rotate-12 translate-y-[-24px] shadow-sm mb-1 opacity-70" />

              {/* Bursting Core */}
              <div className="relative w-32 h-24 rounded-b-xl bg-rose-500/90 shadow-lg flex items-center justify-center overflow-hidden">
                <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
              </div>

              <Sparkles className="absolute -top-7 w-7 h-7 text-amber-400 fill-amber-300 animate-bounce" />
              <Heart className="absolute top-1 -left-6 w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
              <Star className="absolute top-1 -right-6 w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Message / Reveal Text */}
        <div className="mt-6">
          {isOpen ? (
            <div className="animate-fade-in pt-2">
              <div className="liquid-glass-subtle rounded-2xl p-5 border border-white/80 shadow-md max-w-sm mx-auto">
                <p className="font-serif text-lg sm:text-xl font-bold text-rose-950 leading-relaxed mb-2">
                  &ldquo;You&rsquo;re genuinely one of the sweetest parts of this little world.&rdquo;
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-800 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cherished today, tomorrow, and always</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-pill shadow-sm text-xs font-semibold text-rose-900 group-hover:scale-105 transition-transform">
              <span>Tap to Open Surprise</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

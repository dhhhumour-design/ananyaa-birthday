import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Crown } from 'lucide-react';
import { sound } from '../utils/audio';
import { MediaService } from '../utils/mediaStore';

interface HeroSectionProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBurstConfetti,
}) => {
  const [photoUrl, setPhotoUrl] = useState(MediaService.getHeroPhoto());
  const [isPhotoHeartActive, setIsPhotoHeartActive] = useState(false);

  useEffect(() => {
    return MediaService.subscribe(() => {
      setPhotoUrl(MediaService.getHeroPhoto());
    });
  }, []);

  const handlePhotoTap = (e: React.MouseEvent) => {
    sound.playSparkle();
    const rect = e.currentTarget.getBoundingClientRect();
    onBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setIsPhotoHeartActive(true);
    setTimeout(() => setIsPhotoHeartActive(false), 900);
  };

  return (
    <section className="relative pt-10 pb-14 px-4 flex flex-col items-center text-center max-w-lg mx-auto">
      {/* Date Kicker */}
      <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-pill shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
        <span className="text-xs font-semibold tracking-wide text-rose-900 uppercase">
          15 October • Birthday Celebration
        </span>
      </div>

      {/* Hero Portrait in Liquid Glass Frame */}
      <div className="relative mb-7 group cursor-pointer" onClick={handlePhotoTap}>
        {/* Glowing Aura Ring */}
        <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-rose-400/40 via-amber-300/40 to-pink-400/40 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />

        {/* Outer Glass Bezel */}
        <div className="liquid-glass relative p-2.5 sm:p-3 rounded-3xl shadow-2xl shadow-rose-950/15 border border-white/90 animate-soft-float">
          {/* Portrait Container with Ananya's Real Photo */}
          <div className="relative w-64 h-80 sm:w-72 sm:h-92 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100/90 via-pink-50 to-amber-50 shadow-inner flex items-center justify-center">
            <img
              src={photoUrl || '/ananya_real_1.jpg'}
              alt="Ananya celebrating her birthday"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Specular Glare across image */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/40 via-transparent to-white/20 pointer-events-none" />

            {/* Floating Heart Reaction Badge on Tap */}
            {isPhotoHeartActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-ping">
                <Heart className="w-16 h-16 text-rose-500 fill-rose-500/80 drop-shadow-lg" />
              </div>
            )}

            {/* Subtle bottom badge inside frame */}
            <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/70 shadow-sm flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-950 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Birthday Girl • Ananya</span>
              </span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Headline (Clean luxury typography) */}
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 tracking-tight leading-tight mb-3">
        Happy Birthday, <br />
        <span className="shimmer-text">Ananya!</span>
      </h1>

      {/* Emotional Subtitle */}
      <div className="liquid-glass-subtle max-w-sm rounded-2xl p-4 mt-1 border border-white/70 shadow-sm">
        <p className="font-serif italic text-base sm:text-lg text-rose-900/90 leading-relaxed">
          &ldquo;Today isn&rsquo;t just another day...
          <br />
          it&rsquo;s the day someone wonderfully special came into this world.&rdquo;
        </p>
      </div>

      {/* Scroll indicator prompt */}
      <div className="mt-7 flex flex-col items-center gap-1 opacity-70 animate-bounce">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-rose-800">
          Scroll for memories & video
        </span>
        <span className="text-rose-500 text-sm">↓</span>
      </div>
    </section>
  );
};

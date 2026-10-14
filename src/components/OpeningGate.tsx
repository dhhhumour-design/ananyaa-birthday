import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { MediaService } from '../utils/mediaStore';

interface OpeningGateProps {
  onUnlock: () => void;
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const OpeningGate: React.FC<OpeningGateProps> = ({ onUnlock, onBurstConfetti }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const photoUrl = MediaService.getPhoto('photo-1') || '/ananya_real_1.jpg';

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    sound.playSparkle();
    onBurstConfetti(clickX, clickY);

    setIsTransitioning(true);
    setTimeout(() => {
      onUnlock();
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-5 transition-all duration-700 ${
        isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Decorative Subtle Glowing Particles (No random cartoon emojis) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[18%] left-[15%] w-2 h-2 rounded-full bg-rose-400/60 blur-xs animate-ping" />
        <div className="absolute top-[25%] right-[20%] w-3 h-3 rounded-full bg-amber-300/60 blur-xs animate-pulse" />
        <div className="absolute bottom-[28%] left-[22%] w-2.5 h-2.5 rounded-full bg-pink-400/50 blur-xs animate-float-slow" />
        <div className="absolute bottom-[20%] right-[18%] w-3 h-3 rounded-full bg-rose-300/60 blur-xs animate-pulse" />
      </div>

      {/* Main Glass Card */}
      <div className="liquid-glass relative w-full max-w-sm rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-rose-900/10 border border-white/80 animate-soft-float">
        {/* Soft Specular Light Flare */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Real Portrait of Ananya with Soft Glass Frame */}
        <div className="relative mx-auto mb-6 w-24 h-24 rounded-full p-1.5 liquid-glass shadow-xl border border-white/95">
          <div className="w-full h-full rounded-full overflow-hidden bg-rose-100 shadow-inner">
            <img
              src={photoUrl}
              alt="Ananya"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Subtle Glowing Heart Accent */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Primary Prompt Lines */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-rose-950 mb-3">
          Hey Ananya...
        </h1>

        <p className="text-sm sm:text-base text-rose-900/80 font-normal leading-relaxed mb-8 flex items-center justify-center gap-1.5">
          <span>Someone made a little something for you</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline-block animate-pulse shrink-0" />
        </p>

        {/* Liquid Glass Surprise Button */}
        <button
          onClick={handleOpen}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white shadow-xl transition-all duration-300 active:scale-95 cursor-pointer ${
            isPressing ? 'scale-95 shadow-md' : 'hover:scale-[1.02] hover:shadow-rose-400/40 glow-rose'
          }`}
          style={{
            background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 50%, #BE123C 100%)',
          }}
        >
          {/* Glass Highlight Bar */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/20 to-white/35 pointer-events-none" />

          {/* Shimmer overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          <div className="relative flex items-center justify-center gap-2 text-base tracking-wide">
            <span>Open Your Surprise</span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </button>

        <p className="mt-4 text-[11px] text-rose-900/60 tracking-wider uppercase font-semibold">
          15 October • A Handcrafted Birthday Experience
        </p>
      </div>
    </div>
  );
};

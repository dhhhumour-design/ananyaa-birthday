import React, { useState } from 'react';
import { Sparkles, Heart, Wind, Flame } from 'lucide-react';
import { sound } from '../utils/audio';
import { MediaService } from '../utils/mediaStore';

interface InteractiveCakeProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({ onBurstConfetti }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const cakePhotoUrl = MediaService.getPhoto('photo-1') || '/ananya_real_1.jpg';

  const handleBlowCandles = (e: React.MouseEvent) => {
    if (!candlesLit) {
      sound.playSparkle();
      setCandlesLit(true);
      setWishMade(false);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 3;

    sound.playCandleBlow();
    setIsDimmed(true);
    setCandlesLit(false);

    setTimeout(() => {
      onBurstConfetti(clickX, clickY);
      setIsDimmed(false);
      setWishMade(true);
    }, 400);
  };

  return (
    <section className="relative py-14 px-4 max-w-lg mx-auto text-center">
      {/* Dimmed Overlay when blowing candles */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 pointer-events-none transition-opacity duration-700 ${
          isDimmed ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Birthday Ritual
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
          Make a Wish, Ananya ✨
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/70 mt-1">
          {candlesLit
            ? 'Close your eyes, think of your sweetest dream, and tap the candles to blow them out!'
            : 'Your wish has flown into the stars ✨'}
        </p>
      </div>

      {/* Glass Cake Stage */}
      <div
        onClick={handleBlowCandles}
        className="liquid-glass relative rounded-3xl p-8 sm:p-10 shadow-xl shadow-rose-950/10 border border-white/90 cursor-pointer group transition-all duration-300 hover:scale-[1.02] active:scale-98"
      >
        {/* Soft Specular Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Illustrated Multi-Tier Cake with Candles */}
        <div className="relative w-56 h-60 mx-auto flex flex-col items-center justify-end">
          {/* Candles Row */}
          <div className="flex items-end justify-center gap-5 mb-1 z-10">
            {[0, 1, 2, 3].map((candleIndex) => (
              <div key={candleIndex} className="relative flex flex-col items-center">
                {/* Flame */}
                {candlesLit ? (
                  <div className="relative mb-0.5">
                    {/* Flame Glow */}
                    <div className="absolute -inset-2 bg-amber-400/50 rounded-full blur-sm animate-pulse" />
                    {/* Inner Teardrop Flame */}
                    <div className="relative w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-lg shadow-amber-300/80 animate-candle-flame" />
                  </div>
                ) : (
                  /* Smoke Trail */
                  <div className="relative h-6 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 animate-float-slow select-none opacity-60">
                      ~
                    </span>
                  </div>
                )}

                {/* Candle Stick */}
                <div
                  className="w-2.5 h-10 rounded-t-sm shadow-sm"
                  style={{
                    background:
                      candleIndex % 2 === 0
                        ? 'linear-gradient(to right, #FDA4AF, #FB7185)'
                        : 'linear-gradient(to right, #FDE68A, #F59E0B)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Cake Top Tier */}
          <div className="relative w-36 h-14 rounded-2xl bg-gradient-to-b from-white via-rose-50 to-rose-100 border border-rose-200/80 shadow-md flex items-center justify-center">
            {/* Frosting drips */}
            <div className="absolute top-0 inset-x-2 h-3 flex justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 h-3 bg-white rounded-b-full shadow-sm" />
              ))}
            </div>
            <span className="text-xs font-serif italic text-rose-800/80 font-bold tracking-wider mt-2">
              Ananya
            </span>
          </div>

          {/* Cake Middle Tier */}
          <div className="relative w-48 h-16 rounded-2xl bg-gradient-to-b from-rose-100 via-pink-100 to-rose-200 border border-rose-300/80 shadow-md -mt-1 flex items-center justify-center">
            {/* Frosting sugar pearls */}
            <div className="flex gap-4">
              <span className="w-3 h-3 rounded-full bg-white shadow-xs border border-rose-200" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-100 shadow-xs border border-amber-200" />
              <span className="w-3 h-3 rounded-full bg-white shadow-xs border border-rose-200" />
            </div>
          </div>

          {/* Cake Base Plate */}
          <div className="w-56 h-4 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 shadow-lg border border-amber-300/60 -mt-1" />
        </div>

        {/* Real Cake Memory Mini Badge with Ananya's Real Photo */}
        <div className="mt-5 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-sm text-left">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-rose-100 shrink-0 border border-white shadow-xs">
            <img
              src={cakePhotoUrl}
              alt="Ananya celebrating with cake"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-[12px] font-bold text-rose-950 flex items-center gap-1">
              <span>15 October Cake Cutting</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            </p>
            <p className="text-[10px] text-rose-800/75">Cherishing every sweet second ✨</p>
          </div>
        </div>

        {/* Tap Prompt or Wish Message */}
        <div className="mt-6">
          {wishMade ? (
            <div className="animate-fade-in py-2">
              <div className="inline-flex items-center gap-1 text-rose-600 font-serif text-xl sm:text-2xl font-bold mb-1">
                <span>Wish made. ✨</span>
              </div>
              <p className="text-base text-rose-900 font-serif italic font-semibold">
                May it come true.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playSparkle();
                  setCandlesLit(true);
                  setWishMade(false);
                }}
                className="mt-3 text-xs text-rose-700/80 hover:text-rose-900 underline font-medium flex items-center justify-center gap-1 mx-auto"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Light the candles again ↻</span>
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-pill shadow-sm text-xs font-semibold text-rose-900 group-hover:scale-105 transition-transform">
              <Wind className="w-3.5 h-3.5 text-rose-500" />
              <span>Tap to blow out candles</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

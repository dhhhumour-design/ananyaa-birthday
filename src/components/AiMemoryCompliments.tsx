import React, { useState } from 'react';
import { Sparkles, Heart, RefreshCw, Wand2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { ProgressiveImage } from './ProgressiveImage';

interface AiMemoryComplimentsProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

interface AnalysisResult {
  aura: string;
  compliment: string;
  sweetWish: string;
}

interface MemoryOption {
  id: string;
  name: string;
  path: string;
  defaultAura: string;
  defaultCompliment: string;
  defaultWish: string;
}

const MEMORIES: MemoryOption[] = [
  {
    id: '1',
    name: 'Birthday Cake Smile',
    path: '/ananya_real_1.jpg',
    defaultAura: 'Radiant Joy & Candlelight Glow ✨',
    defaultCompliment:
      'The pure joy in Ananya’s smile when the birthday candles are lit illuminates every room. Her warmth is effortless, sincere, and deeply contagious.',
    defaultWish: 'May every candle you blow out return to you as a dream fulfilled! 💗',
  },
  {
    id: '2',
    name: 'Café Twirl & Laugh',
    path: '/ananya_real_2.jpg',
    defaultAura: 'Effortless Grace & Spontaneous Laughter 🌸',
    defaultCompliment:
      'There is a lively, free-spirited lightness to Ananya that turns ordinary café moments into unforgettable poetry. Her laughter carries sunshine.',
    defaultWish: 'May you always dance through life with this exact same happiness! ✨',
  },
  {
    id: '3',
    name: 'Celebration Moments',
    path: '/ananya_real_3.jpg',
    defaultAura: 'Golden Heart & Cherished Warmth 💫',
    defaultCompliment:
      'Surrounded by sweets, flowers, and celebration, Ananya shines brightest. She makes everyone around her feel valued and cherished without even trying.',
    defaultWish: 'May this year bring you as much beauty as you bring into the world! 🫶🏻',
  },
  {
    id: '4',
    name: 'Joyful Birthday Smile',
    path: '/ananya_real_4.jpg',
    defaultAura: 'Vibrant Light & Pure Delight 🌟',
    defaultCompliment:
      'Her authentic, sparkling grin carries genuine sweetness. Ananya has that rare gift of making happiness look so natural and inspiring.',
    defaultWish: 'Wishing you 365 days filled with endless laughter and sweet surprises! 💖',
  },
  {
    id: '5',
    name: 'Golden Hour Radiance',
    path: '/ananya_real_5.jpg',
    defaultAura: 'Sunset Amber & Serene Grace ☀️',
    defaultCompliment:
      'Bathed in warm golden sunlight, Ananya’s calm, radiant presence feels like a gentle breeze. She is a true blessing to everyone who knows her.',
    defaultWish: 'May your future be as bright and glowing as golden hour! ✨',
  },
  {
    id: '6',
    name: 'Candlelight Wish',
    path: '/ananya_real_6.jpg',
    defaultAura: 'Dreamer’s Wish & Starry Heart 🌙',
    defaultCompliment:
      'In the quiet second right before making a secret birthday wish, Ananya’s eyes hold a universe of kindness and hopeful wonder.',
    defaultWish: 'May whatever secret wish you made in this moment come true this year! 💗',
  },
];

export const AiMemoryCompliments: React.FC<AiMemoryComplimentsProps> = ({ onBurstConfetti }) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryOption>(MEMORIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSelect = (m: MemoryOption) => {
    sound.playSparkle();
    setSelectedMemory(m);
    setResult(null);
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
    sound.playSparkle();
    const rect = e.currentTarget.getBoundingClientRect();
    onBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setIsLoading(true);

    try {
      // Attempt server API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('/api/analyze-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoTitle: selectedMemory.name,
          imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.data?.compliment) {
          setResult(data.data);
          return;
        }
      }
      throw new Error('Fallback to curated poem');
    } catch {
      // Exquisite curated response matching selected memory
      setResult({
        aura: selectedMemory.defaultAura,
        compliment: selectedMemory.defaultCompliment,
        sweetWish: selectedMemory.defaultWish,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-14 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Wand2 className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Poetic Memory Reader
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
          Birthday Aura & Appreciation ✨
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/70 max-w-md mx-auto mt-1">
          Select any of Ananya’s photos to reveal a personalized poetic appreciation and birthday aura.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-7 shadow-xl shadow-rose-950/10 border border-white/90">
        {/* Photo Selection Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {MEMORIES.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedMemory.id === m.id
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md'
                  : 'bg-white/80 text-rose-900 hover:bg-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Selected Image Preview (Pristine photo, zero upload buttons) */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-rose-100/60 mb-5 shadow-inner">
          <ProgressiveImage
            src={selectedMemory.path}
            alt={selectedMemory.name}
            aspectRatio="aspect-[4/3]"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover object-center transition-all duration-500"
          />

          {/* Photo Tag Badge */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/45 backdrop-blur-md text-[11px] font-semibold text-white shadow-md z-10 pointer-events-none">
            {selectedMemory.name}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75 glow-rose"
          style={{
            background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 60%, #BE123C 100%)',
          }}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
              <span>Weaving Birthday Magic...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Reveal Birthday Aura & Compliment ✨</span>
            </>
          )}
        </button>

        {/* Compliment Result Card */}
        {result && (
          <div className="mt-6 pt-5 border-t border-rose-200/60 animate-fade-in">
            <div className="liquid-glass-subtle rounded-2xl p-5 border border-white/90 shadow-sm text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold mb-3 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{result.aura}</span>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-rose-950 leading-relaxed mb-3">
                &ldquo;{result.compliment}&rdquo;
              </p>

              <div className="pt-3 border-t border-rose-100/80 flex items-center justify-center gap-2 text-xs font-semibold text-rose-800">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{result.sweetWish}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

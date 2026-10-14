import React, { useMemo } from 'react';

interface FloatingItem {
  id: number;
  emoji: string;
  left: number;
  top: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export const AmbientBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Gentle floating decorative elements (hearts, sparkles, stars, flowers, butterflies)
  const floatingItems: FloatingItem[] = useMemo(() => {
    const emojis = ['💗', '✨', '🌸', '✨', '🤍', '⭐', '🦋', '💫', '🎀'];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 94 + 3,
      top: Math.random() * 90 + 5,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 8,
      size: Math.random() * 10 + 14,
      opacity: Math.random() * 0.35 + 0.2,
    }));
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F3] to-[#FDF4F5]">
      {/* Dreamy Ambient Gradient Orbs */}
      <div
        className="pointer-events-none fixed -top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-pulse-glow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/3 -right-24 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-24 left-1/4 w-96 h-96 rounded-full bg-pink-200/35 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '4s' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-3/4 -left-20 w-80 h-80 rounded-full bg-purple-100/30 blur-3xl"
        aria-hidden="true"
      />

      {/* Floating Gentle Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        {floatingItems.map((item) => (
          <span
            key={item.id}
            className="absolute select-none animate-float-slow"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              fontSize: `${item.size}px`,
              opacity: item.opacity,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

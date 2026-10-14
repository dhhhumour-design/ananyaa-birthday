import React, { useState, useRef } from 'react';
import { ConfettiCanvas, ConfettiHandle } from './components/ConfettiCanvas';
import { AmbientBackground } from './components/AmbientBackground';
import { MusicController } from './components/MusicController';
import { OpeningGate } from './components/OpeningGate';
import { HeroSection } from './components/HeroSection';
import { PhotoGallery } from './components/PhotoGallery';
import { BirthdayVideoReel } from './components/BirthdayVideoReel';
import { MemoryCards } from './components/MemoryCards';
import { BirthdayLetter } from './components/BirthdayLetter';
import { InteractiveCake } from './components/InteractiveCake';
import { SurpriseGift } from './components/SurpriseGift';
import { AiMemoryCompliments } from './components/AiMemoryCompliments';
import { FinalCelebration } from './components/FinalCelebration';
import { sound } from './utils/audio';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const confettiRef = useRef<ConfettiHandle | null>(null);

  const handleBurstConfetti = (x?: number, y?: number) => {
    confettiRef.current?.burst(x, y);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    sound.playSparkle();
  };

  const handleToggleMusic = () => {
    const newState = sound.toggleMelody();
    setIsPlayingMusic(newState);
  };

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsUnlocked(false);
    }, 600);
  };

  return (
    <AmbientBackground>
      {/* Interactive Confetti & Particles Canvas */}
      <ConfettiCanvas ref={confettiRef} />

      {/* Floating Ambient Music Controller */}
      <MusicController isPlaying={isPlayingMusic} onToggle={handleToggleMusic} />

      {/* Opening Gate (First Step) */}
      {!isUnlocked && (
        <OpeningGate
          onUnlock={handleUnlock}
          onBurstConfetti={handleBurstConfetti}
        />
      )}

      {/* Main Handcrafted Birthday Experience */}
      {isUnlocked && (
        <main className="w-full pb-16 animate-fade-in transition-opacity duration-1000">
          {/* Section 1: Hero Celebration */}
          <HeroSection
            onBurstConfetti={handleBurstConfetti}
          />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 2: Photo Memory Gallery (All 6 Photos) */}
          <PhotoGallery
            onBurstConfetti={handleBurstConfetti}
          />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 3: Birthday Video Cinema Reel */}
          <BirthdayVideoReel onBurstConfetti={handleBurstConfetti} />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 4: Emotional Memory Messages */}
          <MemoryCards />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 5: Handwritten Birthday Letter */}
          <BirthdayLetter onBurstConfetti={handleBurstConfetti} />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 6: Interactive Birthday Cake */}
          <InteractiveCake onBurstConfetti={handleBurstConfetti} />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 7: Surprise Gift Box */}
          <SurpriseGift onBurstConfetti={handleBurstConfetti} />

          {/* Hairline Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-4" />

          {/* Section 8: Photo Memory Appreciation & Aura */}
          <AiMemoryCompliments onBurstConfetti={handleBurstConfetti} />

          {/* Hairline Divider */}
          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-300 to-transparent my-6" />

          {/* Section 9: Final Emotional Screen & Replay */}
          <FinalCelebration
            onReplay={handleReplay}
            onBurstConfetti={handleBurstConfetti}
          />
        </main>
      )}
    </AmbientBackground>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Film, Play, Pause, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { MediaService } from '../utils/mediaStore';

interface BirthdayVideoReelProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const BirthdayVideoReel: React.FC<BirthdayVideoReelProps> = ({ onBurstConfetti }) => {
  const [videoSrc, setVideoSrc] = useState<string>(MediaService.getVideoUrl());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return MediaService.subscribe(() => {
      setVideoSrc(MediaService.getVideoUrl());
    });
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      sound.playSparkle();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    sound.playSparkle();
  };

  return (
    <section className="py-14 px-4 max-w-lg mx-auto text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Film className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Birthday Cinema Reel
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
          Ananya in Motion ✨
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/75 max-w-sm mx-auto mt-1">
          A special video of pure smiles, sweet laughter, and unforgettable moments.
        </p>
      </div>

      {/* 9:16 Vertical Phone Video Frame */}
      <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[320px] aspect-[9/16] rounded-3xl p-3 liquid-glass shadow-2xl shadow-rose-950/20 border border-white/90 overflow-hidden group">
        {/* Glowing Aura Ring */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-rose-400/30 via-pink-300/30 to-amber-300/30 blur-2xl opacity-75 pointer-events-none" />

        {/* Video Container */}
        <div
          onClick={togglePlay}
          className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer shadow-inner"
        >
          <video
            ref={videoRef}
            src={videoSrc || '/ananya_video.mp4'}
            poster="/ananya_real_2.jpg"
            className="w-full h-full object-cover"
            playsInline
            loop
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Top Tag Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-semibold tracking-wider">
              ANANYA REEL • 15 OCT
            </span>
            <div className="pointer-events-auto">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white shadow-md hover:bg-black/70 active:scale-90 transition-transform cursor-pointer"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Play/Pause Overlay indicator */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-black/25'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/35 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white ml-1" />
              )}
            </div>
          </div>

          {/* Subtle bottom info bar */}
          <div className="absolute bottom-3 left-3 right-3 py-2 px-3 rounded-xl bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-between text-[11px] z-20">
            <span className="font-serif italic font-medium flex items-center gap-1.5">
              <span>Sweet Birthday Memories</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
            </span>
            <span className="text-[10px] text-white/80">Tap to {isPlaying ? 'Pause' : 'Play'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

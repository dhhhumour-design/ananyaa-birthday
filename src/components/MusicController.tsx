import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface MusicControllerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const MusicController: React.FC<MusicControllerProps> = ({ isPlaying, onToggle }) => {
  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={() => {
          sound.playSparkle();
          onToggle();
        }}
        aria-label={isPlaying ? 'Mute background melody' : 'Play sweet background melody'}
        className="liquid-pill group flex items-center gap-2 px-3.5 py-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-rose-900/5"
      >
        <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-600">
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </div>

        <span className="text-xs font-medium tracking-tight text-rose-950/80 whitespace-nowrap">
          {isPlaying ? 'Melody On' : 'Play Music'}
        </span>

        {isPlaying && (
          <div className="flex items-center gap-0.5 ml-0.5">
            <span className="w-0.5 h-3 bg-rose-400 rounded-full animate-[candleFlicker_1s_ease-in-out_infinite]" />
            <span className="w-0.5 h-4 bg-rose-500 rounded-full animate-[candleFlicker_1.4s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 h-2 bg-rose-300 rounded-full animate-[candleFlicker_0.8s_ease-in-out_infinite_0.4s]" />
          </div>
        )}
      </button>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles, Maximize2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { MediaService, MediaItem } from '../utils/mediaStore';

// Alternating polaroid rotations for organic scrapbook depth
const ROTATIONS = [-2.5, 2.2, 2.8, -2.0, 2.4, -2.6];

interface PhotoGalleryProps {
  onBurstConfetti: (x?: number, y?: number) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  onBurstConfetti,
}) => {
  const [photos, setPhotos] = useState<MediaItem[]>(MediaService.getMediaList());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    return MediaService.subscribe(() => {
      setPhotos(MediaService.getMediaList());
    });
  }, []);

  const handleOpenPhoto = (index: number) => {
    sound.playSparkle();
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    sound.playSparkle();
    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    sound.playSparkle();
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  const toggleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSparkle();
    const rect = e.currentTarget.getBoundingClientRect();
    onBurstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-14 px-4 max-w-xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill mb-2">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
          <span className="text-xs font-semibold text-rose-900 tracking-wide uppercase">
            Memory Vault
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2">
          Little Pieces of You
        </h2>
        <p className="text-sm text-rose-900/70 max-w-md mx-auto">
          Some moments deserve to be kept forever. Tap any polaroid to view the memories in full detail.
        </p>
      </div>

      {/* 2-Column Polaroid Grid with Scroll-Triggered Parallax Fade-In */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 items-start">
        {photos.map((item, index) => {
          const isLiked = likedPhotos[item.id];
          const targetRotation = ROTATIONS[index % ROTATIONS.length];
          const initialRotation = targetRotation * 1.8;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleOpenPhoto(index)}
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.88,
                rotate: initialRotation,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: targetRotation,
              }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                type: 'spring',
                stiffness: 170,
                damping: 20,
                mass: 0.85,
                delay: (index % 2) * 0.12,
              }}
              whileHover={{
                scale: 1.04,
                rotate: 0,
                y: -6,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              className={`group relative rounded-3xl p-3 sm:p-3.5 cursor-pointer bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl shadow-rose-950/10 transition-shadow duration-300 hover:shadow-2xl hover:shadow-rose-500/15 ${
                index % 2 === 1 ? 'sm:mt-4' : ''
              }`}
            >
              {/* Subtle Polaroid Tape Decal at Top */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/70 backdrop-blur-sm rounded-sm border border-white/80 shadow-xs pointer-events-none -rotate-1 opacity-75 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />

              {/* Polaroid Image Frame */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100/70 via-pink-50/80 to-amber-50/70 mb-3 shadow-inner flex items-center justify-center">
                <img
                  src={item.url || `/ananya_real_${index + 1}.jpg`}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Heart Reaction Button */}
                <button
                  onClick={(e) => toggleHeart(item.id, e)}
                  aria-label="Heart this memory"
                  className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md transition-transform active:scale-90 hover:scale-110 z-10"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Tap to expand hint */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/45 backdrop-blur-md text-[10px] text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-2.5 h-2.5" />
                  <span>Expand</span>
                </div>

                {/* Tag Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-rose-900 shadow-sm">
                  {item.tag}
                </div>
              </div>

              {/* Polaroid Handwritten Caption Area */}
              <div className="px-1.5 pb-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-serif font-bold text-base text-rose-950 truncate">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-rose-800/80 shrink-0">
                    {item.date}
                  </span>
                </div>

                {/* Handwritten Script Note */}
                <p className="font-['Caveat',_cursive] text-base text-rose-700/90 leading-tight">
                  &ldquo;{item.handwrittenNote}&rdquo;
                </p>

                <p className="text-xs text-rose-900/65 line-clamp-2 leading-relaxed mt-1">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full-Screen Glass Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/75 backdrop-blur-xl animate-fade-in"
          onClick={handleClose}
        >
          <div
            className="liquid-glass relative w-full max-w-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/90 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close photo viewer"
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-950 shadow-md hover:bg-white active:scale-90 transition-transform z-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Active Photo Container */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-rose-100 mb-4 shadow-inner">
              <img
                src={photos[selectedIndex].url || `/ananya_real_${selectedIndex + 1}.jpg`}
                alt={photos[selectedIndex].title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-rose-950 shadow-md hover:bg-white active:scale-90 transition-transform"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-rose-950 shadow-md hover:bg-white active:scale-90 transition-transform"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Sparkle Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-900/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>
                  {selectedIndex + 1} of {photos.length}
                </span>
              </div>
            </div>

            {/* Caption & Story Details */}
            <div className="px-1 text-center">
              <h3 className="font-serif text-xl font-bold text-rose-950 mb-1">
                {photos[selectedIndex].title}
              </h3>
              <p className="font-['Caveat',_cursive] text-lg text-rose-600 font-semibold mb-1">
                &ldquo;{photos[selectedIndex].handwrittenNote}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed mb-4">
                {photos[selectedIndex].caption}
              </p>

              {/* Heart Action Bar */}
              <button
                onClick={(e) => toggleHeart(photos[selectedIndex].id, e)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-pill hover:scale-105 active:scale-95 transition-transform shadow-md text-xs font-semibold text-rose-900"
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedPhotos[photos[selectedIndex].id]
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-rose-400'
                  }`}
                />
                <span>
                  {likedPhotos[photos[selectedIndex].id]
                    ? 'Saved in Heart'
                    : 'Tap to send love'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

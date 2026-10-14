import React, { useState, useEffect, useRef, memo } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

export interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string; // e.g. "aspect-[4/5]", "aspect-[3/4]", "aspect-square"
  placeholderSrc?: string;
  placeholderBg?: string; // gradient classes
  priority?: boolean; // if true, bypasses lazy-load and decodes immediately
  memorySafe?: boolean; // if true, evicts full bitmap when far offscreen on mobile
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onLoad?: () => void;
}

/**
 * Built-in ultra-lightweight SVG blur placeholders for Ananya's photos.
 * Takes 0 network requests, 0 latency, and guarantees CLS = 0 with soft warm tones.
 */
const DEFAULT_SVG_PLACEHOLDERS: Record<string, string> = {
  '/ananya_real_1.jpg': `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fed7aa'/><stop offset='50%' stop-color='%23fbcfe8'/><stop offset='100%' stop-color='%23fda4af'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g1)'/><circle cx='20' cy='22' r='10' fill='%23f43f5e' opacity='0.15'/></svg>`,
  '/ananya_real_2.jpg': `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fbcfe8'/><stop offset='50%' stop-color='%23f5d0fe'/><stop offset='100%' stop-color='%23fecdd3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g2)'/><circle cx='20' cy='20' r='12' fill='%23e11d48' opacity='0.12'/></svg>`,
  '/ananya_real_3.jpg': `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fef3c7'/><stop offset='50%' stop-color='%23fce7f3'/><stop offset='100%' stop-color='%23ffe4e6'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g3)'/><circle cx='20' cy='25' r='11' fill='%23fb7185' opacity='0.15'/></svg>`,
  '/ananya_real_4.jpg': `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fed7aa'/><stop offset='50%' stop-color='%23fde68a'/><stop offset='100%' stop-color='%23fecdd3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g4)'/><circle cx='20' cy='18' r='13' fill='%23f59e0b' opacity='0.15'/></svg>`,
  '/ananya_real_5.jpg': `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g5' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23ffe4e6'/><stop offset='50%' stop-color='%23fce7f3'/><stop offset='100%' stop-color='%23fecdd3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g5)'/><circle cx='20' cy='22' r='12' fill='%23e11d48' opacity='0.12'/></svg>`,
  '/ananya_real_6.jpg': `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g6' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fecdd3'/><stop offset='50%' stop-color='%23fde68a'/><stop offset='100%' stop-color='%23fbcfe8'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g6)'/><circle cx='20' cy='20' r='10' fill='%239f1239' opacity='0.14'/></svg>`,
};

/**
 * Universal fallback SVG placeholder with gentle warm gradient
 */
const GENERIC_SVG_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 50'><defs><linearGradient id='g0' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23ffe4e6'/><stop offset='100%' stop-color='%23fce7f3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g0)'/></svg>`;

export const ProgressiveImage: React.FC<ProgressiveImageProps> = memo(({
  src,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover object-center',
  aspectRatio,
  placeholderSrc,
  placeholderBg = 'from-rose-100 via-pink-50 to-amber-50',
  priority = false,
  memorySafe = true,
  referrerPolicy = 'no-referrer',
  onClick,
  onLoad,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeImageRef = useRef<HTMLImageElement | null>(null);

  // States
  const [isNearViewport, setIsNearViewport] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Determine low-res placeholder
  const lowResPlaceholder =
    placeholderSrc ||
    DEFAULT_SVG_PLACEHOLDERS[src] ||
    GENERIC_SVG_PLACEHOLDER;

  // 1. Intersection Observer for Progressive Lazy Loading & Memory-Safe Cleanup
  useEffect(() => {
    if (priority) {
      setIsNearViewport(true);
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    // Root margin: 300px triggers load slightly before scrolling into view
    // so images are decoded and ready when user arrives at the card
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsNearViewport(true);
        } else if (memorySafe && !priority) {
          // If the image is far away (> 700px offscreen), evict decoded texture on low-end devices
          // We check the bounding client rect distance
          const rect = entry.boundingClientRect;
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const isFarOffscreen = rect.bottom < -600 || rect.top > vh + 600;

          if (isFarOffscreen) {
            // Memory safe eviction: Clean up high-res bitmap reference
            // Browser instantly reclaims GPU decoded buffer
            setIsNearViewport(false);
            setIsLoaded(false);

            if (activeImageRef.current) {
              activeImageRef.current.onload = null;
              activeImageRef.current.onerror = null;
              activeImageRef.current.src = '';
              activeImageRef.current = null;
            }
          }
        }
      },
      {
        root: null,
        rootMargin: '300px 0px 300px 0px',
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [priority, memorySafe, src]);

  // 2. Offscreen Decode and Memory-Safe Image Loader
  useEffect(() => {
    if (!isNearViewport || !src) return;

    let isCancelled = false;
    setHasError(false);

    // Create off-screen image element for background thread decoding
    const offscreenImg = new Image();
    activeImageRef.current = offscreenImg;
    offscreenImg.referrerPolicy = referrerPolicy;

    const handleSuccess = async () => {
      if (isCancelled) return;

      // Use HTMLImageElement.decode() if supported to decode OFF the main UI thread.
      // This prevents scroll stutter / frame drops on low-end Android mobile GPUs.
      if ('decode' in offscreenImg) {
        try {
          await offscreenImg.decode();
        } catch {
          // Decode failure fallback (e.g. image aborted or older engine)
        }
      }

      if (!isCancelled) {
        setIsLoaded(true);
        setIsRetrying(false);
        if (onLoad) onLoad();
      }
    };

    const handleError = () => {
      if (isCancelled) return;
      setHasError(true);
      setIsLoaded(false);
      setIsRetrying(false);
    };

    offscreenImg.onload = handleSuccess;
    offscreenImg.onerror = handleError;
    offscreenImg.src = src;

    // If image was already cached in browser memory
    if (offscreenImg.complete && offscreenImg.naturalWidth > 0) {
      handleSuccess();
    }

    // Memory-safe cleanup on unmount or src change
    return () => {
      isCancelled = true;
      offscreenImg.onload = null;
      offscreenImg.onerror = null;
      // Revoke src to immediately release image buffer from browser heap
      offscreenImg.src = '';
      if (activeImageRef.current === offscreenImg) {
        activeImageRef.current = null;
      }
    };
  }, [isNearViewport, src, referrerPolicy, onLoad, isRetrying]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRetrying(true);
    setHasError(false);
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden select-none ${aspectRatio || ''} ${className}`}
      style={{
        // Containment prevents offscreen layout & paint recalculation on low-end devices
        contain: 'layout paint',
        transform: 'translateZ(0)', // Force dedicated composite layer without memory bloat
      }}
    >
      {/* 1. Low-Resolution Base Placeholder (Always available immediately, 0 latency) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${placeholderBg} transition-opacity duration-500 flex items-center justify-center ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        <img
          src={lowResPlaceholder}
          alt=""
          className="w-full h-full object-cover object-center filter blur-md scale-105 transform-gpu"
          decoding="async"
        />

        {/* Shimmer sweep animation while high-res image is decoding */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
        )}
      </div>

      {/* 2. Full High-Resolution Image (Smooth blur-up fade in when decoded) */}
      {isNearViewport && !hasError && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy={referrerPolicy}
          className={`${imgClassName} transition-all duration-500 ease-out transform-gpu ${
            isLoaded
              ? 'opacity-100 filter-none scale-100'
              : 'opacity-0 filter blur-xs scale-[1.02]'
          }`}
        />
      )}

      {/* 3. Graceful Error & Offline Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-rose-50/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
          <ImageOff className="w-6 h-6 text-rose-400 mb-1.5" />
          <span className="text-[11px] font-medium text-rose-900/80 mb-2">
            Memory softly resting
          </span>
          <button
            onClick={handleRetry}
            className="px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold hover:bg-rose-600 active:scale-95 transition-all shadow-xs"
          >
            {isRetrying ? 'Loading...' : 'Tap to reload'}
          </button>
        </div>
      )}

      {/* Subtle celebratory shimmer speckle when loaded */}
      {isLoaded && (
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden="true"
        >
          <Sparkles className="w-3.5 h-3.5 text-white/90 drop-shadow-md" />
        </div>
      )}
    </div>
  );
});

ProgressiveImage.displayName = 'ProgressiveImage';

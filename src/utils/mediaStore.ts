/**
 * Media Store & Local Storage Persistence
 * Manages Ananya's Real Photos and Birthday Video with instant persistence,
 * server upload API synchronization, and real photography integration.
 */

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  caption: string;
  date: string;
  tag: string;
  handwrittenNote: string;
  defaultFilename: string;
  url: string; // real photo URL
  placeholderBg: string;
}

// Ananya's Real Photos extracted from her birthday video & synced with API
export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'photo-1',
    type: 'image',
    title: 'The Birthday Glow',
    caption: 'That radiant smile with candles burning bright and wishes in the air.',
    date: '15 October',
    tag: 'Celebration ✨',
    handwrittenNote: 'Birthday girl with her cakes ✨',
    defaultFilename: 'ananya_real_1.jpg',
    url: '/ananya_real_1.jpg',
    placeholderBg: 'from-rose-100 via-pink-50 to-amber-50',
  },
  {
    id: 'photo-2',
    type: 'image',
    title: 'Grace & Whimsy',
    caption: 'Effortless elegance, twirling with endless joy and radiant smiles.',
    date: 'Pure Happiness',
    tag: 'Elegance 🌸',
    handwrittenNote: 'Twirling through the day 🌸',
    defaultFilename: 'ananya_real_2.jpg',
    url: '/ananya_real_2.jpg',
    placeholderBg: 'from-pink-100 via-rose-50 to-purple-50',
  },
  {
    id: 'photo-3',
    type: 'image',
    title: 'Double the Sweetness',
    caption: 'Sweet moments, gentle laughter, and joy that lights up the whole room.',
    date: 'Unforgettable',
    tag: 'Celebration 💐',
    handwrittenNote: 'Two cakes & big smiles 🫶🏻',
    defaultFilename: 'ananya_real_3.jpg',
    url: '/ananya_real_3.jpg',
    placeholderBg: 'from-amber-100 via-rose-50 to-pink-50',
  },
  {
    id: 'photo-4',
    type: 'image',
    title: 'Golden Hour Magic',
    caption: 'Sunlight kissing her curls, catching a genuine, warm, heartwarming look.',
    date: 'Warm Sunshine',
    tag: 'Radiance ☀️',
    handwrittenNote: 'Warm golden sun & love ☀️',
    defaultFilename: 'ananya_real_4.jpg',
    url: '/ananya_real_4.jpg',
    placeholderBg: 'from-amber-100 via-yellow-50 to-rose-50',
  },
  {
    id: 'photo-5',
    type: 'image',
    title: 'Soft Peach Serenity',
    caption: 'A gentle, peaceful moment with soft lighting and a quiet heartwarming smile.',
    date: 'Sweet Moments',
    tag: 'Serenity 🎀',
    handwrittenNote: 'Soft smiles & peace 🌸',
    defaultFilename: 'ananya_real_5.jpg',
    url: '/ananya_real_5.jpg',
    placeholderBg: 'from-orange-100 via-peach-50 to-rose-50',
  },
  {
    id: 'photo-6',
    type: 'image',
    title: 'Candid Cinema Smile',
    caption: 'Looking back over her shoulder, capturing spontaneous laughter and spark.',
    date: 'Candid Magic',
    tag: 'Whimsical ✨',
    handwrittenNote: 'A moment caught in laughter 💫',
    defaultFilename: 'ananya_real_6.jpg',
    url: '/ananya_real_6.jpg',
    placeholderBg: 'from-purple-100 via-pink-50 to-rose-50',
  },
];

const STORAGE_KEY = 'ananya_birthday_media_v4';
const VIDEO_STORAGE_KEY = 'ananya_birthday_video_v4';
const DEFAULT_VIDEO_URL = '/ananya_video.mp4';

export class MediaService {
  private static listeners: Array<() => void> = [];
  private static isInitialized = false;

  public static init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.syncFromApi();
  }

  public static async syncFromApi() {
    try {
      const res = await fetch('/api/media/list');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        let changed = false;
        // Check for video
        const video = data.media.find((m: { type: string; url: string }) => m.type === 'video');
        if (video && !localStorage.getItem(VIDEO_STORAGE_KEY)) {
          localStorage.setItem(VIDEO_STORAGE_KEY, video.url);
          changed = true;
        }
        if (changed) {
          this.notify();
        }
      }
    } catch (e) {
      console.warn('Media API sync failed:', e);
    }
  }

  public static subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify() {
    this.listeners.forEach((l) => l());
  }

  public static getMediaList(): MediaItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>;
        return INITIAL_MEDIA.map((item) => ({
          ...item,
          url: parsed[item.id] || item.url || '',
        }));
      }
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
    return INITIAL_MEDIA;
  }

  public static getPhoto(id: string): string {
    const list = this.getMediaList();
    const item = list.find((m) => m.id === id);
    return item?.url || '/ananya_real_1.jpg';
  }

  public static getHeroPhoto(): string {
    return this.getPhoto('photo-1') || '/ananya_real_1.jpg';
  }

  public static hasAnyPhotos(): boolean {
    return true;
  }

  public static updatePhoto(id: string, url: string) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[id] = url;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      this.notify();
    } catch (e) {
      console.warn('Failed to save photo:', e);
    }
  }

  public static getVideoUrl(): string {
    try {
      const custom = localStorage.getItem(VIDEO_STORAGE_KEY);
      return custom || DEFAULT_VIDEO_URL;
    } catch {
      return DEFAULT_VIDEO_URL;
    }
  }

  public static setVideoUrl(url: string) {
    try {
      localStorage.setItem(VIDEO_STORAGE_KEY, url);
      this.notify();
    } catch (e) {
      console.warn('Failed to save video:', e);
    }
  }

  public static async uploadToServer(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const res = await fetch('/api/media/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              mimeType: file.type,
              base64Data: base64,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            resolve(data.url || (reader.result as string));
          } else {
            resolve(reader.result as string);
          }
        } catch {
          resolve(reader.result as string);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  public static async importMultipleFiles(files: FileList | File[]): Promise<number> {
    const fileArray = Array.from(files);
    let count = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const name = file.name.toUpperCase();

      if (file.type.startsWith('video/') || name.endsWith('.MP4') || name.endsWith('.MOV') || name.endsWith('.WEBM')) {
        const url = await this.uploadToServer(file);
        this.setVideoUrl(url);
        count++;
        continue;
      }

      let targetId: string | null = null;
      if (name.includes('WA0013') || name.includes('0013') || name.includes('REAL_1')) targetId = 'photo-1';
      else if (name.includes('WA0010') || name.includes('0010') || name.includes('REAL_2')) targetId = 'photo-2';
      else if (name.includes('WA0012') || name.includes('0012') || name.includes('REAL_3')) targetId = 'photo-3';
      else if (name.includes('WA0011') || name.includes('0011') || name.includes('REAL_4')) targetId = 'photo-4';
      else if (name.includes('WA0018') || name.includes('0018') || name.includes('REAL_5')) targetId = 'photo-5';
      else if (name.includes('WA0016') || name.includes('0016') || name.includes('REAL_6')) targetId = 'photo-6';
      else {
        targetId = `photo-${Math.min(6, i + 1)}`;
      }

      if (targetId) {
        const url = await this.uploadToServer(file);
        this.updatePhoto(targetId, url);
        count++;
      }
    }

    return count;
  }
}

// Auto initialize
MediaService.init();

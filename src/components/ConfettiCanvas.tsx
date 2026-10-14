import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiHandle {
  burst: (x?: number, y?: number, count?: number) => void;
  heartBurst: (x?: number, y?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'heart' | 'star';
  opacity: number;
  life: number;
  maxLife: number;
}

const COLORS = [
  '#FDA4AF', // Rose 300
  '#FB7185', // Rose 400
  '#F43F5E', // Rose 500
  '#FDE68A', // Amber 200 (Gold)
  '#F59E0B', // Amber 500 (Champagne)
  '#FBCFE8', // Pink 200
  '#E9D5FF', // Purple 200
  '#FFFFFF', // White glow
];

export const ConfettiCanvas = forwardRef<ConfettiHandle, { className?: string }>(
  ({ className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const addParticles = (
      originX: number,
      originY: number,
      count: number,
      preferredShape?: 'heart' | 'star'
    ) => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const maxLife = Math.random() * 60 + 80;
        const shape =
          preferredShape ||
          (['rect', 'circle', 'heart', 'star'][Math.floor(Math.random() * 4)] as
            | 'rect'
            | 'circle'
            | 'heart'
            | 'star');

        newParticles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 3 + 2), // upward bias
          size: Math.random() * 8 + 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.15,
          shape,
          opacity: 1,
          life: 0,
          maxLife,
        });
      }
      particlesRef.current.push(...newParticles);
    };

    useImperativeHandle(ref, () => ({
      burst: (x, y, count = 70) => {
        const canvas = canvasRef.current;
        const originX = x ?? (canvas ? canvas.width / 2 : window.innerWidth / 2);
        const originY = y ?? (canvas ? canvas.height / 2 : window.innerHeight / 2);
        addParticles(originX, originY, count);
      },
      heartBurst: (x, y) => {
        const canvas = canvasRef.current;
        const originX = x ?? (canvas ? canvas.width / 2 : window.innerWidth / 2);
        const originY = y ?? (canvas ? canvas.height / 2 : window.innerHeight / 2);
        addParticles(originX, originY, 45, 'heart');
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let lastTime = performance.now();

      const loop = (time: number) => {
        const dt = Math.min((time - lastTime) / 16.67, 2);
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const remaining: Particle[] = [];
        const particles = particlesRef.current;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.life += dt;

          if (p.life < p.maxLife) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 0.18 * dt; // gravity
            p.vx *= 0.98; // air resistance
            p.rotation += p.vRot * dt;

            // Fade out smoothly near end of life
            const progress = p.life / p.maxLife;
            p.opacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
              ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
            } else if (p.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.shape === 'heart') {
              const s = p.size * 0.7;
              ctx.beginPath();
              ctx.moveTo(0, s * 0.3);
              ctx.bezierCurveTo(-s * 0.6, -s * 0.4, -s * 1.1, s * 0.2, 0, s * 1.1);
              ctx.bezierCurveTo(s * 1.1, s * 0.2, s * 0.6, -s * 0.4, 0, s * 0.3);
              ctx.fill();
            } else if (p.shape === 'star') {
              const r = p.size * 0.7;
              ctx.beginPath();
              for (let n = 0; n < 5; n++) {
                ctx.lineTo(
                  Math.cos(((18 + n * 72) * Math.PI) / 180) * r,
                  -Math.sin(((18 + n * 72) * Math.PI) / 180) * r
                );
                ctx.lineTo(
                  Math.cos(((54 + n * 72) * Math.PI) / 180) * (r * 0.5),
                  -Math.sin(((54 + n * 72) * Math.PI) / 180) * (r * 0.5)
                );
              }
              ctx.closePath();
              ctx.fill();
            }

            ctx.restore();
            remaining.push(p);
          }
        }

        particlesRef.current = remaining;
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);

      return () => {
        window.removeEventListener('resize', resize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-50 ${className}`}
        aria-hidden="true"
      />
    );
  }
);

ConfettiCanvas.displayName = 'ConfettiCanvas';

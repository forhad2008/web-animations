import { AnimationConfig } from '../types';

interface Firefly {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  glowPhase: number;
  glowSpeed: number;
  color: string;
}

export class FirefliesForestRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private fireflies: Firefly[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initFireflies();
  }

  private initFireflies() {
    this.fireflies = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        size: 1.5 + Math.random() * 3.5,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.6,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.02 + Math.random() * 0.04,
        color: Math.random() > 0.4 ? 'primary' : 'accent'
      });
    }
  }

  public updateMouse(x: number, y: number, isHover: boolean) {
    this.mouseX = x;
    this.mouseY = y;
    this.isHovered = isHover;
  }

  public render(config: AnimationConfig) {
    const ctx = this.ctx;
    if (!ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const speed = config.speed || 1.0;
    const intensity = config.intensity || 1.0;

    this.time += 0.015 * speed;

    // Deep enchanted twilight atmosphere
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, config.backgroundColor || '#02050f');
    bgGrad.addColorStop(1, '#050c18');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ambient soft mist gradients
    const mist1 = ctx.createRadialGradient(width * 0.3, height * 0.8, 50, width * 0.3, height * 0.8, width * 0.5);
    mist1.addColorStop(0, `${config.secondaryColor || '#6366f1'}18`);
    mist1.addColorStop(1, 'transparent');
    ctx.fillStyle = mist1;
    ctx.fillRect(0, 0, width, height);

    const mist2 = ctx.createRadialGradient(width * 0.8, height * 0.3, 50, width * 0.8, height * 0.3, width * 0.4);
    mist2.addColorStop(0, `${config.primaryColor || '#a855f7'}12`);
    mist2.addColorStop(1, 'transparent');
    ctx.fillStyle = mist2;
    ctx.fillRect(0, 0, width, height);

    const mx = this.mouseX * width;
    const my = this.mouseY * height;

    // Update and draw fireflies
    for (const f of this.fireflies) {
      f.glowPhase += f.glowSpeed * speed;
      const glow = (Math.sin(f.glowPhase) + 1) * 0.5;

      // Brownian turbulence
      f.vx += (Math.random() - 0.5) * 0.15;
      f.vy += (Math.random() - 0.5) * 0.15;
      f.vx *= 0.98;
      f.vy *= 0.98;

      // Mouse attraction swirl
      if (this.isHovered) {
        const dx = mx - f.x;
        const dy = my - f.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          f.vx += (dx / dist) * 0.25;
          f.vy += (dy / dist) * 0.25;
        }
      }

      f.x += f.vx * speed;
      f.y += f.vy * speed;

      // Wrap edges
      if (f.x < 0) f.x = width;
      if (f.x > width) f.x = 0;
      if (f.y < 0) f.y = height;
      if (f.y > height) f.y = 0;

      const baseCol = f.color === 'primary' ? (config.primaryColor || '#facc15') : (config.accentColor || '#38bdf8');

      // Outer soft aura
      const aura = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 12 * intensity);
      aura.addColorStop(0, `${baseCol}${Math.floor(glow * 180).toString(16).padStart(2, '0')}`);
      aura.addColorStop(0.3, `${baseCol}${Math.floor(glow * 60).toString(16).padStart(2, '0')}`);
      aura.addColorStop(1, 'transparent');

      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 12 * intensity, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central ember
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = baseCol;
      ctx.shadowBlur = 12 * glow;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * (0.8 + glow * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  public destroy() {
    this.ctx = null;
  }
}

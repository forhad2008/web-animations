import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorType: 'primary' | 'secondary' | 'accent';
}

export class GlassOrbsRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private orbs: Orb[] = [];
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private width: number = 0;
  private height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initOrbs();
  }

  private initOrbs() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    if (this.width === 0 || this.height === 0) return;

    this.orbs = [];
    const orbCount = 9;

    for (let i = 0; i < orbCount; i++) {
      const radius = 90 + Math.random() * 120;
      this.orbs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius,
        colorType: i % 3 === 0 ? 'accent' : i % 2 === 0 ? 'primary' : 'secondary',
      });
    }
  }

  public updateMouse(x: number, y: number) {
    this.mouseX = x * this.canvas.width;
    this.mouseY = y * this.canvas.height;
  }

  public render(config: AnimationConfig) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (w !== this.width || h !== this.height) {
      this.initOrbs();
    }

    // Background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const speed = config.speed * 1.0;

    // Draw blurred floating radiant orbs
    ctx.save();
    ctx.filter = `blur(${Math.max(30, config.blur || 50)}px)`;

    for (const orb of this.orbs) {
      orb.x += orb.vx * speed;
      orb.y += orb.vy * speed;

      if (orb.x - orb.radius < -100) { orb.vx *= -1; orb.x = -100 + orb.radius; }
      if (orb.x + orb.radius > w + 100) { orb.vx *= -1; orb.x = w + 100 - orb.radius; }
      if (orb.y - orb.radius < -100) { orb.vy *= -1; orb.y = -100 + orb.radius; }
      if (orb.y + orb.radius > h + 100) { orb.vy *= -1; orb.y = h + 100 - orb.radius; }

      // Mouse attraction
      if (config.mouseInteraction && this.mouseX > 0) {
        const dx = this.mouseX - orb.x;
        const dy = this.mouseY - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          orb.x += (dx / dist) * 1.5;
          orb.y += (dy / dist) * 1.5;
        }
      }

      const color =
        orb.colorType === 'accent' ? config.accentColor :
        orb.colorType === 'primary' ? config.primaryColor : config.secondaryColor;

      const grad = ctx.createRadialGradient(
        orb.x, orb.y, orb.radius * 0.1,
        orb.x, orb.y, orb.radius
      );
      grad.addColorStop(0, hexToRgba(color, 0.85));
      grad.addColorStop(0.6, hexToRgba(color, 0.4));
      grad.addColorStop(1, hexToRgba(color, 0));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Subtle fine glass noise overlay
    if (config.grain > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
    }
  }

  public destroy() {
    this.orbs = [];
  }
}

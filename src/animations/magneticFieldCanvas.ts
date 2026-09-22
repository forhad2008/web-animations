import { AnimationConfig } from '../types';

interface MagneticParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export class MagneticFieldRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private particles: MagneticParticle[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initParticles();
  }

  private initParticles() {
    this.particles = [];
    const count = 350;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        vx: 0,
        vy: 0,
        life: Math.random() * 100,
        maxLife: 60 + Math.random() * 80,
        color: Math.random() > 0.5 ? 'primary' : 'accent'
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

    this.time += 0.02 * speed;

    // Dark canvas with soft flux motion blur
    ctx.fillStyle = `${config.backgroundColor || '#030511'}33`;
    ctx.fillRect(0, 0, width, height);

    // Magnetic Dipole poles (North & South)
    const pole1X = width * (0.35 + Math.sin(this.time * 0.7) * 0.1);
    const pole1Y = height * (0.5 + Math.cos(this.time * 0.5) * 0.15);

    // South pole steered by mouse if hovered
    const pole2X = this.isHovered ? this.mouseX * width : width * (0.65 - Math.sin(this.time * 0.7) * 0.1);
    const pole2Y = this.isHovered ? this.mouseY * height : height * (0.5 - Math.cos(this.time * 0.5) * 0.15);

    // 1. Draw dipole core glows
    const glow1 = ctx.createRadialGradient(pole1X, pole1Y, 5, pole1X, pole1Y, 70);
    glow1.addColorStop(0, config.primaryColor || '#a855f7');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.beginPath();
    ctx.arc(pole1X, pole1Y, 70, 0, Math.PI * 2);
    ctx.fill();

    const glow2 = ctx.createRadialGradient(pole2X, pole2Y, 5, pole2X, pole2Y, 70);
    glow2.addColorStop(0, config.accentColor || '#38bdf8');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.beginPath();
    ctx.arc(pole2X, pole2Y, 70, 0, Math.PI * 2);
    ctx.fill();

    // 2. Simulate Lorentz Magnetic Force Vector Field for particles
    ctx.lineWidth = 1.5;
    for (const p of this.particles) {
      p.life += speed;
      if (p.life > p.maxLife) {
        p.life = 0;
        p.x = pole1X + (Math.random() - 0.5) * 40;
        p.y = pole1Y + (Math.random() - 0.5) * 40;
        p.vx = (Math.random() - 0.5) * 2;
        p.vy = (Math.random() - 0.5) * 2;
      }

      // Vector to North pole (repel/emanate)
      const d1x = p.x - pole1X;
      const d1y = p.y - pole1Y;
      const dist1 = Math.max(20, Math.sqrt(d1x * d1x + d1y * d1y));

      // Vector to South pole (attract)
      const d2x = pole2X - p.x;
      const d2y = pole2Y - p.y;
      const dist2 = Math.max(20, Math.sqrt(d2x * d2x + d2y * d2y));

      // Dipole field force formula
      const f1 = 1800 / (dist1 * dist1);
      const f2 = 1800 / (dist2 * dist2);

      p.vx += ((d1x / dist1) * f1 + (d2x / dist2) * f2) * 0.08 * intensity;
      p.vy += ((d1y / dist1) * f1 + (d2y / dist2) * f2) * 0.08 * intensity;

      p.vx *= 0.94;
      p.vy *= 0.94;

      const prevX = p.x;
      const prevY = p.y;

      p.x += p.vx * speed;
      p.y += p.vy * speed;

      // Draw particle trajectory flux segment
      const pCol = p.color === 'primary' ? (config.primaryColor || '#a855f7') : (config.accentColor || '#38bdf8');
      const alpha = Math.sin((p.life / p.maxLife) * Math.PI);

      ctx.strokeStyle = pCol;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  public destroy() {
    this.ctx = null;
  }
}

import { AnimationConfig } from '../types';

interface Jellyfish {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  pulsePhase: number;
  pulseSpeed: number;
  tentaclesCount: number;
  tentacles: { x: number; y: number }[][];
}

export class BioluminescentJellyfishRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private jellies: Jellyfish[] = [];
  private particles: { x: number; y: number; size: number; alpha: number; speedY: number }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initJellies();
  }

  private initJellies() {
    this.jellies = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const size = 30 + Math.random() * 50;
      const tCount = 6 + Math.floor(Math.random() * 5);
      const tentacles: { x: number; y: number }[][] = [];

      for (let t = 0; t < tCount; t++) {
        const segs = [];
        for (let s = 0; s < 12; s++) {
          segs.push({ x: 0, y: s * 8 });
        }
        tentacles.push(segs);
      }

      this.jellies.push({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        size,
        speedY: -(0.4 + Math.random() * 0.6),
        speedX: (Math.random() - 0.5) * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.02,
        tentaclesCount: tCount,
        tentacles
      });
    }

    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        size: 1 + Math.random() * 3,
        alpha: 0.2 + Math.random() * 0.6,
        speedY: -(0.2 + Math.random() * 0.3)
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

    // Deep abyssal ocean gradient
    ctx.fillStyle = config.backgroundColor || '#020514';
    ctx.fillRect(0, 0, width, height);

    // Floating plankton particles
    ctx.fillStyle = config.accentColor || '#38bdf8';
    for (const p of this.particles) {
      p.y += p.speedY * speed;
      if (p.y < 0) p.y = height;
      if (p.x > width) p.x = 0;

      ctx.globalAlpha = p.alpha * Math.sin(this.time + p.x);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Render each bioluminescent jellyfish
    for (const j of this.jellies) {
      j.pulsePhase += j.pulseSpeed * speed;
      const pulse = Math.sin(j.pulsePhase);
      const contraction = 1 + pulse * 0.25;

      j.y += (j.speedY - (pulse > 0 ? pulse * 0.8 : 0)) * speed;
      j.x += (j.speedX + Math.sin(this.time + j.y * 0.01) * 0.3) * speed;

      // Mouse attraction
      if (this.isHovered) {
        const mx = this.mouseX * width;
        const my = this.mouseY * height;
        const dx = mx - j.x;
        const dy = my - j.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          j.x += (dx / dist) * 1.5;
          j.y += (dy / dist) * 1.5;
        }
      }

      // Wrap around bounds
      if (j.y < -150) {
        j.y = height + 100;
        j.x = Math.random() * width;
      }
      if (j.x < -100) j.x = width + 50;
      if (j.x > width + 100) j.x = -50;

      ctx.save();
      ctx.translate(j.x, j.y);

      // Bell Dome (Head)
      const w = (j.size * 1.4) / contraction;
      const h = j.size * contraction;

      const bellGrad = ctx.createRadialGradient(0, -h * 0.3, 2, 0, 0, w);
      bellGrad.addColorStop(0, '#ffffff');
      bellGrad.addColorStop(0.3, config.primaryColor || '#a855f7');
      bellGrad.addColorStop(0.7, config.secondaryColor || '#3b82f6');
      bellGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = bellGrad;
      ctx.shadowColor = config.accentColor || '#38bdf8';
      ctx.shadowBlur = 20 * intensity;

      ctx.beginPath();
      ctx.ellipse(0, 0, w, h * 0.8, 0, Math.PI, 0);
      ctx.quadraticCurveTo(w * 0.6, h * 0.3, 0, h * 0.15);
      ctx.quadraticCurveTo(-w * 0.6, h * 0.3, -w, 0);
      ctx.closePath();
      ctx.fill();

      // Undulating tentacle filaments
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = config.secondaryColor || '#60a5fa';
      ctx.shadowBlur = 10;

      const tentacleSpacing = (w * 1.6) / (j.tentaclesCount - 1);
      for (let t = 0; t < j.tentaclesCount; t++) {
        const startX = -w * 0.8 + t * tentacleSpacing;
        const segs = j.tentacles[t];

        ctx.beginPath();
        ctx.moveTo(startX, 0);

        let curX = startX;
        let curY = 0;

        for (let s = 0; s < segs.length; s++) {
          const wave = Math.sin(this.time * 2 + s * 0.5 + t + j.pulsePhase) * (4 + s * 1.5);
          curX += wave * 0.6;
          curY += (h * 0.18 + s * 1.2);
          ctx.lineTo(curX, curY);
        }
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  public destroy() {
    this.ctx = null;
  }
}

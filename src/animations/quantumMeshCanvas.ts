import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
}

export class QuantumMeshRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private isMouseInside: boolean = false;
  private width: number = 0;
  private height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initParticles();
  }

  private initParticles() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    if (this.width === 0 || this.height === 0) return;

    const count = Math.min(130, Math.floor((this.width * this.height) / 12000));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const radius = 1.5 + Math.random() * 2.5;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius,
        baseRadius: radius,
        color: i % 3 === 0 ? 'accent' : i % 2 === 0 ? 'primary' : 'secondary',
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
  }

  public updateMouse(x: number, y: number, isInside: boolean) {
    this.mouseX = x * this.canvas.width;
    this.mouseY = y * this.canvas.height;
    this.isMouseInside = isInside;
  }

  public render(config: AnimationConfig) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (w !== this.width || h !== this.height) {
      this.initParticles();
    }

    // Background fill
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const speed = config.speed * 1.2;
    const maxConnectDist = 130 * (config.distortion * 0.5 + 0.8);
    const mouseRadius = (config.mouseRadius || 180) * (w / 1200);

    // Update & Draw Particles
    const pCount = this.particles.length;

    for (let i = 0; i < pCount; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx * speed;
      p.y += p.vy * speed;

      // Bounce on edges
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > w) { p.x = w; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > h) { p.y = h; p.vy *= -1; }

      // Mouse interaction
      if (config.mouseInteraction && this.isMouseInside) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * (config.mouseForce || 3.0);
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
          p.radius = p.baseRadius * 1.8;
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.1;
        }
      }

      // Draw particle glow
      const color =
        p.color === 'accent' ? config.accentColor :
        p.color === 'primary' ? config.primaryColor : config.secondaryColor;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw connections between close particles
    ctx.lineWidth = 1;
    for (let i = 0; i < pCount; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < pCount; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxConnectDist) {
          const alpha = (1 - dist / maxConnectDist) * 0.45 * (config.intensity || 1.0);
          ctx.strokeStyle = hexToRgba(config.primaryColor, alpha);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (config.mouseInteraction && this.isMouseInside) {
        const dx = this.mouseX - p1.x;
        const dy = this.mouseY - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const alpha = (1 - dist / mouseRadius) * 0.75;
          ctx.strokeStyle = hexToRgba(config.accentColor, alpha);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(this.mouseX, this.mouseY);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    }
  }

  public destroy() {
    this.particles = [];
  }
}

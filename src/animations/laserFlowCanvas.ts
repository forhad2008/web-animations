import { AnimationConfig } from '../types';

interface LaserBeam {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  color: string;
  angle: number;
}

export class LaserFlowRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private beams: LaserBeam[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initBeams();
  }

  private initBeams() {
    this.beams = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.beams.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        length: 80 + Math.random() * 250,
        speed: 8 + Math.random() * 14,
        width: 1.5 + Math.random() * 3,
        color: Math.random() > 0.5 ? 'primary' : 'accent',
        angle: -0.45 + (Math.random() - 0.5) * 0.2
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

    // Dark cyber backdrop with motion persistence trail
    ctx.fillStyle = `${config.backgroundColor || '#02030a'}cc`;
    ctx.fillRect(0, 0, width, height);

    // Subtle background speed lines
    ctx.strokeStyle = `${config.secondaryColor || '#6366f1'}12`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const lineY = (i * (height / 7) + this.time * 50) % height;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(width, lineY + Math.tan(-0.45) * width);
      ctx.stroke();
    }

    // Interactive mouse warp vortex
    const mx = this.mouseX * width;
    const my = this.mouseY * height;

    for (const b of this.beams) {
      let vx = Math.cos(b.angle) * b.speed * speed;
      let vy = Math.sin(b.angle) * b.speed * speed;

      if (this.isHovered) {
        const dx = mx - b.x;
        const dy = my - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          vx += (dy / dist) * 4;
          vy -= (dx / dist) * 4;
        }
      }

      b.x += vx;
      b.y += vy;

      // Wrap boundaries
      if (b.x > width + b.length || b.y < -b.length) {
        b.x = -b.length;
        b.y = Math.random() * (height + 300);
      }

      const headX = b.x;
      const headY = b.y;
      const tailX = b.x - Math.cos(b.angle) * b.length;
      const tailY = b.y - Math.sin(b.angle) * b.length;

      const beamCol = b.color === 'primary' ? (config.primaryColor || '#ec4899') : (config.accentColor || '#06b6d4');

      // Outer neon laser glow
      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.7, beamCol);
      grad.addColorStop(1, '#ffffff');

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = b.width * 2 * intensity;
      ctx.shadowColor = beamCol;
      ctx.shadowBlur = 16 * intensity;
      ctx.stroke();

      // Sharp intense center core
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, b.width * 0.6);
      ctx.stroke();

      // Laser impact spark head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX, headY, b.width * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  public destroy() {
    this.ctx = null;
  }
}

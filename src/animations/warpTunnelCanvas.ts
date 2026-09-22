import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

interface WarpStar {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  colorType: 'primary' | 'secondary' | 'accent';
}

export class WarpTunnelRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private stars: WarpStar[] = [];
  private numStars: number = 400;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initStars();
  }

  private initStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000,
        prevZ: 1000,
        colorType: i % 4 === 0 ? 'accent' : i % 2 === 0 ? 'primary' : 'secondary',
      });
    }
  }

  public render(config: AnimationConfig) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Fill background with motion trail
    ctx.fillStyle = hexToRgba(config.backgroundColor, 0.25);
    ctx.fillRect(0, 0, w, h);

    const speed = config.speed * 28;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.prevZ = star.z;
      star.z -= speed;

      if (star.z <= 0) {
        star.z = 1000;
        star.prevZ = 1000;
        star.x = (Math.random() - 0.5) * 2000;
        star.y = (Math.random() - 0.5) * 2000;
      }

      const k = 250 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      const prevK = 250 / star.prevZ;
      const prevPx = star.x * prevK + cx;
      const prevPy = star.y * prevK + cy;

      if (px >= 0 && px <= w && py >= 0 && py <= h) {
        const size = Math.max(1, (1 - star.z / 1000) * 3.5);
        const alpha = Math.min(1, (1 - star.z / 1000) * 1.5);

        const color =
          star.colorType === 'accent' ? config.accentColor :
          star.colorType === 'primary' ? config.primaryColor : config.secondaryColor;

        // Draw light streak
        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = hexToRgba(color, alpha);
        ctx.lineWidth = size;
        ctx.stroke();

        // Star head ping
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  public destroy() {
    this.stars = [];
  }
}

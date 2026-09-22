import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

export class TopographicRadarRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private startTime: number = performance.now();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
  }

  public render(config: AnimationConfig) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Fill background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const time = (performance.now() - this.startTime) * 0.0006 * config.speed;
    const numRings = 18;
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.sqrt(cx * cx + cy * cy) * 1.1;

    // Draw topographic elevation isolines
    ctx.lineWidth = 1.2;
    for (let r = 0; r < numRings; r++) {
      const radiusBase = (r / numRings) * maxRadius;
      const progress = r / numRings;

      ctx.beginPath();
      const points = 72;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        
        // Organic contour warping
        const warp1 = Math.sin(angle * 4 + time * 3 + r * 0.5) * 25 * config.distortion;
        const warp2 = Math.cos(angle * 7 - time * 2) * 15 * config.distortion;
        const radius = radiusBase + warp1 + warp2;

        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      const alpha = 0.2 + 0.3 * Math.sin(progress * Math.PI + time * 2);
      ctx.strokeStyle = hexToRgba(progress > 0.6 ? config.accentColor : config.primaryColor, alpha);
      ctx.stroke();
    }

    // Rotating radar scan sweep line
    const sweepAngle = time * 5;
    const sx = cx + Math.cos(sweepAngle) * maxRadius;
    const sy = cy + Math.sin(sweepAngle) * maxRadius;

    const radarGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    radarGrad.addColorStop(0, hexToRgba(config.accentColor, 0.25));
    radarGrad.addColorStop(1, hexToRgba(config.accentColor, 0));

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, sweepAngle - 0.4, sweepAngle);
    ctx.closePath();
    ctx.fillStyle = radarGrad;
    ctx.fill();

    // Radar beam leading edge
    ctx.strokeStyle = hexToRgba(config.accentColor, 0.75);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.stroke();
    ctx.restore();
  }

  public destroy() {}
}

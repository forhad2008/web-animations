import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

export class SilkWavesRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private startTime: number = performance.now();
  private mouseX: number = 0.5;
  private mouseY: number = 0.5;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
  }

  public updateMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  public render(config: AnimationConfig) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Fill background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const time = (performance.now() - this.startTime) * 0.001 * config.speed;
    const waveCount = 7;
    const points = 24;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let layer = 0; layer < waveCount; layer++) {
      const progress = layer / waveCount;
      const layerOffset = layer * 0.7;

      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const normX = i / points;

        // Multi-frequency wave calculation
        const sin1 = Math.sin(normX * 4 + time * 1.2 + layerOffset) * 60;
        const sin2 = Math.cos(normX * 2.5 - time * 0.8 + layerOffset * 1.5) * 45;
        const sin3 = Math.sin((normX + time * 0.2) * 8) * 20;

        // Interactive mouse disturbance
        let mouseInfluence = 0;
        if (config.mouseInteraction) {
          const dx = normX - this.mouseX;
          mouseInfluence = Math.exp(-dx * dx * 16) * (this.mouseY - 0.5) * 120;
        }

        const baseY = h * 0.5 + (layer - waveCount / 2) * 40;
        const y = baseY + (sin1 + sin2 + sin3) * config.distortion + mouseInfluence;

        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          // Smooth quadratic curve to next point
          const prevX = ((i - 1) / points) * w;
          const cx = (prevX + x) / 2;
          ctx.quadraticCurveTo(prevX, y, cx, y);
        }
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      // Create flowing linear gradient
      const grad = ctx.createLinearGradient(0, h * 0.2, w, h);
      const colorA = hexToRgba(config.primaryColor, 0.25 * (1 - progress * 0.5));
      const colorB = hexToRgba(config.secondaryColor, 0.2 * progress);
      const colorC = hexToRgba(config.accentColor, 0.15);

      grad.addColorStop(0, colorA);
      grad.addColorStop(0.5, colorB);
      grad.addColorStop(1, colorC);

      ctx.fillStyle = grad;
      ctx.fill();

      // Top edge highlight line
      ctx.strokeStyle = hexToRgba(progress > 0.5 ? config.accentColor : config.primaryColor, 0.4);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  public destroy() {}
}

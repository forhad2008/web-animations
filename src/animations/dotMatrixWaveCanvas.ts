import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

export class DotMatrixWaveRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private startTime: number = performance.now();
  private mouseX: number = -1000;
  private mouseY: number = -1000;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
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

    // Fill background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const time = (performance.now() - this.startTime) * 0.001 * config.speed;
    const spacing = Math.max(20, Math.floor(w / 45));
    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(h / spacing);

    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const x = c * spacing;
        const y = r * spacing;

        // 3D wave interference formula
        const distFromCenter = Math.sqrt(
          Math.pow((x - w / 2) / w, 2) + Math.pow((y - h / 2) / h, 2)
        );
        const wave = Math.sin(distFromCenter * 14 - time * 3) * Math.cos(x * 0.015 + time);

        // Mouse ripple influence
        let mouseBoost = 0;
        if (config.mouseInteraction && this.mouseX > 0) {
          const mDist = Math.sqrt(Math.pow(x - this.mouseX, 2) + Math.pow(y - this.mouseY, 2));
          if (mDist < 200) {
            mouseBoost = (1 - mDist / 200) * 4.0;
          }
        }

        const size = Math.max(1, 1.8 + wave * 1.5 * config.distortion + mouseBoost);
        const alpha = Math.min(1, Math.max(0.15, 0.4 + wave * 0.35 + mouseBoost * 0.4));

        ctx.fillStyle = mouseBoost > 1 ? hexToRgba(config.accentColor, alpha) : hexToRgba(config.primaryColor, alpha);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  public destroy() {}
}

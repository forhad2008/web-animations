import { AnimationConfig } from '../types';

export class DnaHelixRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
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

    // Dark canvas background
    ctx.fillStyle = config.backgroundColor || '#02040d';
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const numPairs = 48;
    const helixRadius = Math.min(width, height) * 0.22;
    const helixLength = Math.max(width, height) * 1.2;
    const stepY = helixLength / numPairs;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Interactive 3D tilt
    const tiltAngle = (this.mouseX - 0.5) * 0.8;
    const pitchAngle = (this.mouseY - 0.5) * 0.5;
    ctx.rotate(tiltAngle - 0.4);

    const nodesToDraw: Array<{
      x1: number; y1: number; z1: number;
      x2: number; y2: number; z2: number;
      color1: string; color2: string;
      index: number;
    }> = [];

    for (let i = 0; i < numPairs; i++) {
      const y = -helixLength * 0.5 + i * stepY;
      const angle = i * 0.35 + this.time * 1.5;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;

      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      nodesToDraw.push({
        x1, y1: y, z1,
        x2, y2: y, z2,
        color1: config.primaryColor || '#a855f7',
        color2: config.accentColor || '#38bdf8',
        index: i
      });
    }

    // Sort by Z-depth for correct 3D perspective layering
    // Average Z depth of each rung
    nodesToDraw.sort((a, b) => (a.z1 + a.z2) - (b.z1 + b.z2));

    for (const rung of nodesToDraw) {
      // Perspective scale calculations
      const p1 = 300 / (300 + rung.z1);
      const p2 = 300 / (300 + rung.z2);

      const sx1 = rung.x1 * p1;
      const sy1 = rung.y1 * p1;
      const sx2 = rung.x2 * p2;
      const sy2 = rung.y2 * p2;

      // Draw connecting hydrogen bond rung
      const rungGrad = ctx.createLinearGradient(sx1, sy1, sx2, sy2);
      rungGrad.addColorStop(0, rung.color1);
      rungGrad.addColorStop(0.5, '#ffffff');
      rungGrad.addColorStop(1, rung.color2);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = rungGrad;
      ctx.lineWidth = Math.max(0.5, 2.5 * ((p1 + p2) * 0.5));
      ctx.globalAlpha = Math.max(0.2, (p1 + p2) * 0.45);
      ctx.stroke();

      // Strand 1 Node
      const r1 = Math.max(2, 6 * p1 * intensity);
      ctx.globalAlpha = Math.min(1.0, Math.max(0.3, p1));
      ctx.fillStyle = rung.color1;
      ctx.shadowColor = rung.color1;
      ctx.shadowBlur = 10 * p1;
      ctx.beginPath();
      ctx.arc(sx1, sy1, r1, 0, Math.PI * 2);
      ctx.fill();

      // Strand 2 Node
      const r2 = Math.max(2, 6 * p2 * intensity);
      ctx.fillStyle = rung.color2;
      ctx.shadowColor = rung.color2;
      ctx.shadowBlur = 10 * p2;
      ctx.beginPath();
      ctx.arc(sx2, sy2, r2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
  }

  public destroy() {
    this.ctx = null;
  }
}

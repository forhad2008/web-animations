import { AnimationConfig } from '../types';

export class SoundEqualizerRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private barsCount = 64;
  private smoothHeights: number[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    for (let i = 0; i < this.barsCount; i++) {
      this.smoothHeights.push(0);
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

    // Dark background
    ctx.fillStyle = config.backgroundColor || '#04020a';
    ctx.fillRect(0, 0, width, height);

    const barWidth = width / this.barsCount;
    const baselineY = height * 0.55;

    // Simulate multi-octave audio frequency energy
    for (let i = 0; i < this.barsCount; i++) {
      const normI = i / this.barsCount;
      const freq1 = Math.sin(normI * 12 + this.time * 3);
      const freq2 = Math.cos(normI * 24 - this.time * 4.5);
      const freq3 = Math.sin(normI * 6 + this.time * 1.5);
      const mouseDist = Math.abs(normI - this.mouseX);
      const mouseBoost = Math.exp(-mouseDist * 6.0) * (this.isHovered ? 1.5 : 0.4);

      let targetVal = (Math.abs(freq1 * 0.4 + freq2 * 0.35 + freq3 * 0.25) + mouseBoost) * intensity;
      targetVal = Math.min(1.2, Math.max(0.05, targetVal));

      // Smooth lerp
      this.smoothHeights[i] += (targetVal - this.smoothHeights[i]) * 0.18;
    }

    // Draw 3D floor grid perspective
    ctx.save();
    ctx.strokeStyle = `${config.secondaryColor || '#3b82f6'}18`;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, baselineY);
      ctx.lineTo((x - width / 2) * 2 + width / 2, height);
      ctx.stroke();
    }
    for (let y = baselineY; y < height; y += (height - baselineY) / 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 1. Draw reflected bottom waveform
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < this.barsCount; i++) {
      const h = this.smoothHeights[i] * (height * 0.35);
      const x = i * barWidth;
      const grad = ctx.createLinearGradient(0, baselineY, 0, baselineY + h);
      grad.addColorStop(0, config.accentColor || '#38bdf8');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, baselineY, barWidth - 2, h);
    }
    ctx.restore();

    // 2. Draw upper audio frequency spectrum bars
    for (let i = 0; i < this.barsCount; i++) {
      const h = this.smoothHeights[i] * (height * 0.45);
      const x = i * barWidth;
      const y = baselineY - h;

      const grad = ctx.createLinearGradient(0, baselineY, 0, y);
      grad.addColorStop(0, config.secondaryColor || '#6366f1');
      grad.addColorStop(0.6, config.primaryColor || '#a855f7');
      grad.addColorStop(1, config.accentColor || '#ec4899');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x + 1, y, Math.max(1, barWidth - 2), h, [4, 4, 0, 0]);
      ctx.fill();

      // Peak floating cap line
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 1, y - 3, Math.max(1, barWidth - 2), 2);
    }

    // 3. Draw continuous luminous spline wave over the peaks
    ctx.beginPath();
    ctx.moveTo(0, baselineY - this.smoothHeights[0] * (height * 0.45));
    for (let i = 1; i < this.barsCount; i++) {
      const x = i * barWidth + barWidth / 2;
      const y = baselineY - this.smoothHeights[i] * (height * 0.45);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = config.accentColor || '#ec4899';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  public destroy() {
    this.ctx = null;
  }
}

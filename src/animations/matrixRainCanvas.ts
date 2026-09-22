import { AnimationConfig } from '../types';
import { hexToRgba } from '../utils/webglHelper';

export class MatrixRainRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private drops: number[] = [];
  private speeds: number[] = [];
  private chars: string = '0123456789ABCDEF010101XYZ日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  private fontSize: number = 16;
  private columns: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initMatrix();
  }

  private initMatrix() {
    this.fontSize = Math.max(14, Math.floor(this.canvas.width / 80));
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    this.speeds = [];

    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
      this.speeds[i] = 0.6 + Math.random() * 0.8;
    }
  }

  public render(config: AnimationConfig) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const currentCols = Math.floor(w / this.fontSize);
    if (currentCols !== this.columns) {
      this.initMatrix();
    }

    // Translucent black overlay for persistence trails
    ctx.fillStyle = hexToRgba(config.backgroundColor, 0.12);
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;

    const charLen = this.chars.length;
    const speedMultiplier = config.speed * 1.5;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * charLen)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Glowing head drop
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.shadowColor = config.accentColor;
      ctx.fillText(char, x, y);

      // Trailing stream character
      ctx.fillStyle = config.primaryColor;
      ctx.shadowBlur = 0;
      if (this.drops[i] > 1) {
        const prevChar = this.chars[Math.floor(Math.random() * charLen)];
        ctx.fillText(prevChar, x, y - this.fontSize);
      }

      // Reset when drop reaches bottom
      if (y > h && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      this.drops[i] += this.speeds[i] * speedMultiplier;
    }
  }

  public destroy() {
    this.drops = [];
  }
}

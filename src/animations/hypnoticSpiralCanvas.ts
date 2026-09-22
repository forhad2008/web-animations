import { AnimationConfig } from '../types';

export class HypnoticSpiralRenderer {
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

    this.time += 0.015 * speed;

    // Background fill
    ctx.fillStyle = config.backgroundColor || '#05020c';
    ctx.fillRect(0, 0, width, height);

    const centerX = width * (0.5 + (this.mouseX - 0.5) * 0.15);
    const centerY = height * (0.5 + (this.mouseY - 0.5) * 0.15);
    const maxRadius = Math.sqrt(width * width + height * height) * 0.65;

    ctx.save();
    ctx.translate(centerX, centerY);

    const numArms = 8;
    const numRings = Math.floor(45 * (config.complexity || 1.0));

    // Dynamic rotation
    ctx.rotate(this.time * 0.2);

    for (let r = numRings; r > 0; r--) {
      const radiusRatio = r / numRings;
      const radius = radiusRatio * maxRadius;
      const wave = Math.sin(radiusRatio * 15 - this.time * 3) * (15 * intensity);
      const effectiveRadius = Math.max(2, radius + wave);

      // Interpolate colors
      const gradient = ctx.createRadialGradient(0, 0, effectiveRadius * 0.2, 0, 0, effectiveRadius);
      gradient.addColorStop(0, config.primaryColor || '#a855f7');
      gradient.addColorStop(0.5, config.secondaryColor || '#6366f1');
      gradient.addColorStop(1, config.accentColor || '#ec4899');

      ctx.beginPath();
      ctx.lineWidth = Math.max(1, 4 * radiusRatio * intensity);
      ctx.strokeStyle = gradient;

      for (let a = 0; a <= Math.PI * 2; a += 0.05) {
        const spiralAngle = a + this.time * (0.5 + (1 - radiusRatio));
        const armOffset = Math.sin(a * numArms + this.time * 2) * (20 * radiusRatio);
        const curR = effectiveRadius + armOffset;

        const x = Math.cos(spiralAngle) * curR;
        const y = Math.sin(spiralAngle) * curR;

        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();

      // Inner glowing moiré dots
      if (r % 3 === 0) {
        ctx.fillStyle = r % 2 === 0 ? config.primaryColor : config.accentColor;
        for (let i = 0; i < numArms; i++) {
          const dotAngle = (i / numArms) * Math.PI * 2 + this.time + radiusRatio * 4;
          const dx = Math.cos(dotAngle) * effectiveRadius;
          const dy = Math.sin(dotAngle) * effectiveRadius;
          ctx.beginPath();
          ctx.arc(dx, dy, Math.max(1, 3 * radiusRatio), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Central radiant vortex core
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 80 * intensity);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, config.primaryColor || '#a855f7');
    coreGrad.addColorStop(0.7, config.secondaryColor || '#6366f1');
    coreGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 80 * intensity, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  public destroy() {
    this.ctx = null;
  }
}

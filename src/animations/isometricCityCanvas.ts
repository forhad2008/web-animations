import { AnimationConfig } from '../types';

interface Building {
  gridX: number;
  gridY: number;
  height: number;
  targetHeight: number;
  pulsePhase: number;
  color: string;
}

interface DataPacket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  color: string;
}

export class IsometricCityRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private buildings: Building[] = [];
  private packets: DataPacket[] = [];
  private gridRows = 8;
  private gridCols = 8;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initCity();
  }

  private initCity() {
    this.buildings = [];
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        const baseH = 20 + Math.random() * 90;
        this.buildings.push({
          gridX: c,
          gridY: r,
          height: baseH,
          targetHeight: baseH,
          pulsePhase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.4 ? 'primary' : 'accent'
        });
      }
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

    ctx.fillStyle = config.backgroundColor || '#04020a';
    ctx.fillRect(0, 0, width, height);

    // Isometric projection math
    const tileW = Math.min(width, height) * 0.1;
    const tileH = tileW * 0.5;
    const originX = width * 0.5;
    const originY = height * 0.35;

    ctx.save();

    // Sort buildings for isometric painters algorithm (back to front)
    const sorted = [...this.buildings].sort((a, b) => (a.gridX + a.gridY) - (b.gridX + b.gridY));

    for (const b of sorted) {
      b.pulsePhase += 0.03 * speed;
      const pulseH = Math.sin(b.pulsePhase + this.time) * (15 * intensity);
      const h = Math.max(10, b.height + pulseH);

      // Isometric 2D coordinates
      const isoX = originX + (b.gridX - b.gridY) * (tileW * 0.5);
      const isoY = originY + (b.gridX + b.gridY) * (tileH * 0.5);

      const topX = isoX;
      const topY = isoY - h;

      const pCol = b.color === 'primary' ? (config.primaryColor || '#a855f7') : (config.accentColor || '#38bdf8');
      const sCol = config.secondaryColor || '#6366f1';

      // 1. Left Facet
      ctx.beginPath();
      ctx.moveTo(isoX - tileW * 0.5, isoY);
      ctx.lineTo(isoX, isoY + tileH * 0.5);
      ctx.lineTo(topX, topY + tileH * 0.5);
      ctx.lineTo(topX - tileW * 0.5, topY);
      ctx.closePath();
      ctx.fillStyle = `${sCol}66`;
      ctx.fill();
      ctx.strokeStyle = `${sCol}88`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 2. Right Facet
      ctx.beginPath();
      ctx.moveTo(isoX, isoY + tileH * 0.5);
      ctx.lineTo(isoX + tileW * 0.5, isoY);
      ctx.lineTo(topX + tileW * 0.5, topY);
      ctx.lineTo(topX, topY + tileH * 0.5);
      ctx.closePath();
      ctx.fillStyle = `${pCol}44`;
      ctx.fill();
      ctx.strokeStyle = `${pCol}88`;
      ctx.stroke();

      // 3. Top Roof Facet
      ctx.beginPath();
      ctx.moveTo(topX, topY - tileH * 0.5);
      ctx.lineTo(topX + tileW * 0.5, topY);
      ctx.lineTo(topX, topY + tileH * 0.5);
      ctx.lineTo(topX - tileW * 0.5, topY);
      ctx.closePath();

      const roofGrad = ctx.createLinearGradient(topX - tileW * 0.5, topY, topX + tileW * 0.5, topY);
      roofGrad.addColorStop(0, pCol);
      roofGrad.addColorStop(1, '#ffffff');

      ctx.fillStyle = roofGrad;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Glowing roof antenna node
      if (b.height > 60) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = pCol;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(topX, topY - tileH * 0.5 - 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();
  }

  public destroy() {
    this.ctx = null;
  }
}

import { AnimationConfig } from '../types';

interface Vertex {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  phase: number;
  speed: number;
}

interface Triangle {
  v1: number;
  v2: number;
  v3: number;
  colorOffset: number;
}

export class GeometricOrigamiRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private time = 0;
  private vertices: Vertex[] = [];
  private triangles: Triangle[] = [];
  private cols = 14;
  private rows = 10;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.initMesh();
  }

  private initMesh() {
    this.vertices = [];
    this.triangles = [];

    const w = 1200;
    const h = 800;
    const cellW = w / (this.cols - 1);
    const cellH = h / (this.rows - 1);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const jitterX = (Math.random() - 0.5) * cellW * 0.5;
        const jitterY = (Math.random() - 0.5) * cellH * 0.5;
        const x = c * cellW + jitterX;
        const y = r * cellH + jitterY;

        this.vertices.push({
          baseX: x,
          baseY: y,
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.8
        });
      }
    }

    // Build Delaunay-style triangle grid
    for (let r = 0; r < this.rows - 1; r++) {
      for (let c = 0; c < this.cols - 1; c++) {
        const i1 = r * this.cols + c;
        const i2 = r * this.cols + (c + 1);
        const i3 = (r + 1) * this.cols + c;
        const i4 = (r + 1) * this.cols + (c + 1);

        if ((r + c) % 2 === 0) {
          this.triangles.push({ v1: i1, v2: i2, v3: i3, colorOffset: Math.random() });
          this.triangles.push({ v1: i2, v2: i4, v3: i3, colorOffset: Math.random() });
        } else {
          this.triangles.push({ v1: i1, v2: i2, v3: i4, colorOffset: Math.random() });
          this.triangles.push({ v1: i1, v2: i4, v3: i3, colorOffset: Math.random() });
        }
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

    this.time += 0.015 * speed;

    ctx.fillStyle = config.backgroundColor || '#04020a';
    ctx.fillRect(0, 0, width, height);

    const scaleX = width / 1200;
    const scaleY = height / 800;

    const mx = this.mouseX * width;
    const my = this.mouseY * height;

    // Update vertices with smooth harmonic wave displacements
    for (const v of this.vertices) {
      const vx = v.baseX * scaleX;
      const vy = v.baseY * scaleY;

      const waveX = Math.sin(this.time * v.speed + v.phase) * (20 * intensity * scaleX);
      const waveY = Math.cos(this.time * v.speed * 0.8 + v.phase) * (20 * intensity * scaleY);

      // Mouse repulsion
      let pushX = 0;
      let pushY = 0;
      if (this.isHovered) {
        const dx = vx - mx;
        const dy = vy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const force = (1 - dist / 220) * 45;
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }
      }

      v.x = vx + waveX + pushX;
      v.y = vy + waveY + pushY;
    }

    // Render 3D faceted triangles with dynamic normals lighting
    for (const t of this.triangles) {
      const p1 = this.vertices[t.v1];
      const p2 = this.vertices[t.v2];
      const p3 = this.vertices[t.v3];

      // Calculate centroid and normal illumination
      const cx = (p1.x + p2.x + p3.x) / 3;
      const cy = (p1.y + p2.y + p3.y) / 3;

      // Lighting vector from top-left
      const lx = cx - width * 0.2;
      const ly = cy - height * 0.1;
      const lightFactor = Math.sin((cx / width) * 4 + (cy / height) * 3 + this.time + t.colorOffset * 3) * 0.4 + 0.6;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();

      // Triangle fill
      const grad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
      if (lightFactor > 0.6) {
        grad.addColorStop(0, config.primaryColor || '#a855f7');
        grad.addColorStop(1, config.secondaryColor || '#6366f1');
      } else {
        grad.addColorStop(0, config.secondaryColor || '#6366f1');
        grad.addColorStop(1, config.backgroundColor || '#04020a');
      }

      ctx.fillStyle = grad;
      ctx.globalAlpha = Math.min(0.9, 0.4 + lightFactor * 0.5);
      ctx.fill();

      // Delicate wireframe facets
      ctx.strokeStyle = `${config.accentColor || '#38bdf8'}33`;
      ctx.lineWidth = 0.75;
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
  }

  public destroy() {
    this.ctx = null;
  }
}

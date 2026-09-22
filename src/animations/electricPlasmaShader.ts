import { AnimationConfig } from '../types';

export class ElectricPlasmaRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animId: number = 0;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private isHovered = false;
  private startTime = performance.now();

  private uniforms: Record<string, WebGLUniformLocation | null> = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGL();
  }

  private initGL() {
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      console.warn('WebGL not supported for ElectricPlasmaRenderer');
      return;
    }
    this.gl = gl;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_speed;
      uniform float u_intensity;
      uniform float u_complexity;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      uniform vec3 u_bgColor;

      // Fractal Brownian Motion Noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time * u_speed * 0.6;
        vec2 m = (u_mouse - 0.5) * 1.5;

        // Interaction distortion towards pointer
        float distToMouse = length(uv - m);
        float mouseAttract = exp(-distToMouse * 3.0) * 0.5;
        uv += normalize(uv - m + 0.001) * mouseAttract;

        // Dynamic plasma coordinates
        vec2 q = vec2(fbm(uv * u_complexity + t * 0.2), fbm(uv * u_complexity + vec2(5.2, 1.3) + t * 0.3));
        vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.4), fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.35));

        float f = fbm(uv + 4.0 * r);

        // Electric lightning filaments
        float electric = 0.04 / (abs(f - 0.5) + 0.02);
        float arc1 = 0.02 / (abs(sin(q.x * 6.28 + t) + uv.y * 1.5) + 0.04);
        float arc2 = 0.015 / (abs(cos(r.y * 6.28 - t * 1.2) + uv.x * 1.5) + 0.04);

        // Color blending
        vec3 col = u_bgColor;
        col = mix(col, u_color2, clamp(f * f * 4.0, 0.0, 1.0));
        col = mix(col, u_color1, clamp(length(q), 0.0, 1.0));
        col += u_color3 * electric * u_intensity * 0.6;
        col += u_color1 * (arc1 + arc2) * u_intensity * 0.4;

        // Core glow & vignette
        float vignette = 1.0 - length(gl_FragCoord.xy / u_resolution.xy - 0.5) * 0.7;
        col *= clamp(vignette, 0.2, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    this.program = program;

    // Uniform locations
    const uniformNames = [
      'u_resolution', 'u_time', 'u_mouse', 'u_speed', 'u_intensity',
      'u_complexity', 'u_color1', 'u_color2', 'u_color3', 'u_bgColor'
    ];
    uniformNames.forEach((name) => {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    });

    // Quad geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    ];
  }

  public updateMouse(x: number, y: number, isHover: boolean) {
    this.mouseX = x;
    this.mouseY = 1.0 - y;
    this.isHovered = isHover;
  }

  public render(config: AnimationConfig) {
    const gl = this.gl;
    if (!gl || !this.program) return;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.program);

    const time = (performance.now() - this.startTime) * 0.001;

    gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.u_time, time);
    gl.uniform2f(this.uniforms.u_mouse, this.mouseX, this.mouseY);
    gl.uniform1f(this.uniforms.u_speed, config.speed || 1.0);
    gl.uniform1f(this.uniforms.u_intensity, config.intensity || 1.0);
    gl.uniform1f(this.uniforms.u_complexity, config.complexity || 1.0);

    const c1 = this.hexToRgb(config.primaryColor || '#a855f7');
    const c2 = this.hexToRgb(config.secondaryColor || '#3b82f6');
    const c3 = this.hexToRgb(config.accentColor || '#06b6d4');
    const bg = this.hexToRgb(config.backgroundColor || '#04020a');

    gl.uniform3f(this.uniforms.u_color1, c1[0], c1[1], c1[2]);
    gl.uniform3f(this.uniforms.u_color2, c2[0], c2[1], c2[2]);
    gl.uniform3f(this.uniforms.u_color3, c3[0], c3[1], c3[2]);
    gl.uniform3f(this.uniforms.u_bgColor, bg[0], bg[1], bg[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}

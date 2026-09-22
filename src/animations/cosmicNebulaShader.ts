import { standardVertexShader, createProgram, setupQuad, hexToRgbVec3 } from '../utils/webglHelper';
import { AnimationConfig } from '../types';

export const cosmicNebulaFragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_speed;
uniform float u_distortion;
uniform float u_intensity;
uniform vec3 u_primary_color;
uniform vec3 u_secondary_color;
uniform vec3 u_accent_color;
uniform vec3 u_bg_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + vec2(10.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;

  float t = u_time * u_speed * 0.25;

  // Space vortex rotation
  float r = length(p);
  float a = atan(p.y, p.x);
  vec2 rotP = vec2(r * cos(a + t * 0.1), r * sin(a + t * 0.1));

  // Layered cosmic gas clouds
  float n1 = fbm(rotP * 2.5 + vec2(t * 0.1, -t * 0.15));
  float n2 = fbm(rotP * 4.0 - vec2(n1 * 2.0 * u_distortion));
  float n3 = fbm(p * 6.0 + vec2(n2 * 1.5, t * 0.05));

  // Multi-tier gas density
  vec3 col = u_bg_color;

  // Core flare
  float core = exp(-r * 3.5) * 1.8 * u_intensity;
  col += u_accent_color * core;

  // Primary nebula gas filaments
  float gas1 = smoothstep(0.2, 0.8, n1 * n2);
  col += u_primary_color * gas1 * 1.4 * u_intensity;

  // Secondary cloud veil
  float gas2 = smoothstep(0.3, 0.9, n3);
  col += u_secondary_color * gas2 * 1.1 * u_intensity;

  // Twinkling stars
  float starSeed = hash(floor(uv * 180.0));
  float star = pow(starSeed, 24.0) * (sin(t * 8.0 + starSeed * 20.0) * 0.3 + 0.7);
  col += vec3(star) * 1.2;

  // Dark cosmic dust lanes
  float dust = smoothstep(0.4, 0.7, fbm(p * 3.0 + 5.0));
  col *= (1.0 - dust * 0.6);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export class CosmicNebulaRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private startTime: number = performance.now();
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGL();
  }

  private initGL() {
    const gl = this.canvas.getContext('webgl', { alpha: false, preserveDrawingBuffer: true });
    if (!gl) return;
    this.gl = gl;
    this.program = createProgram(gl, standardVertexShader, cosmicNebulaFragmentShader);
    if (this.program) {
      setupQuad(gl, this.program);
    }
  }

  public render(config: AnimationConfig) {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.program);

    const currentTime = (performance.now() - this.startTime) * 0.001;
    const set1f = (name: string, val: number) => {
      const loc = gl.getUniformLocation(this.program!, name);
      if (loc) gl.uniform1f(loc, val);
    };
    const set2f = (name: string, x: number, y: number) => {
      const loc = gl.getUniformLocation(this.program!, name);
      if (loc) gl.uniform2f(loc, x, y);
    };
    const set3fv = (name: string, rgb: [number, number, number]) => {
      const loc = gl.getUniformLocation(this.program!, name);
      if (loc) gl.uniform3fv(loc, rgb);
    };

    set2f('u_resolution', this.canvas.width, this.canvas.height);
    set1f('u_time', currentTime);
    set1f('u_speed', config.speed);
    set1f('u_distortion', config.distortion);
    set1f('u_intensity', config.intensity || 1.0);
    set3fv('u_primary_color', hexToRgbVec3(config.primaryColor));
    set3fv('u_secondary_color', hexToRgbVec3(config.secondaryColor));
    set3fv('u_accent_color', hexToRgbVec3(config.accentColor));
    set3fv('u_bg_color', hexToRgbVec3(config.backgroundColor));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public destroy() {
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

import { standardVertexShader, createProgram, setupQuad, hexToRgbVec3 } from '../utils/webglHelper';
import { AnimationConfig } from '../types';

export const cyberGridFragmentShader = `
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

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * u_speed * 0.8;
  vec3 col = u_bg_color;

  // Horizon line
  float horizon = -0.05;

  if (p.y < horizon) {
    // 3D Perspective Ground Plane
    float z = 0.45 / (horizon - p.y);
    float x = p.x * z;
    float y = z + t * 2.5;

    // Terrain elevation displacement
    float terrain = noise(vec2(x * 0.3, y * 0.3)) * 0.4 * u_distortion;
    x += terrain;

    // Smooth Anti-Aliased Grid Lines (GLSL 1.0 compatible without extensions)
    vec2 gridFract = abs(fract(vec2(x, y)) - 0.5);
    float lineWidth = 0.05 + 0.02 * min(z * 0.1, 1.0);
    float lineX = smoothstep(lineWidth, 0.0, gridFract.x);
    float lineY = smoothstep(lineWidth, 0.0, gridFract.y);
    float c = max(lineX, lineY);

    // Fog / depth fading towards horizon
    float depthFade = exp(-z * 0.12);
    
    // Glowing grid lines
    vec3 gridColor = mix(u_primary_color, u_secondary_color, sin(y * 0.1) * 0.5 + 0.5);
    col += gridColor * c * depthFade * (1.0 + u_intensity * 0.5);

    // Ambient ground glow
    col += u_primary_color * (0.15 * depthFade);
  } else {
    // Sky with Cyber Sun / Horizon Glow
    float sunDist = length(p - vec2(0.0, horizon + 0.25));
    float sun = smoothstep(0.42, 0.38, sunDist);

    // Sun horizontal scanlines
    float scanline = sin((p.y - horizon) * 60.0);
    if (scanline > 0.3 && p.y < horizon + 0.5) {
      sun *= 0.15;
    }

    vec3 sunColor = mix(u_accent_color, u_primary_color, (p.y - horizon) * 2.0);
    col += sunColor * sun * 1.5;

    // Horizon line bloom
    float horizonBloom = 0.08 / (abs(p.y - horizon) + 0.04);
    col += u_secondary_color * horizonBloom * 0.4;

    // Distant stars
    float star = pow(hash(floor(p * 80.0)), 32.0) * 0.8;
    col += vec3(star) * u_accent_color;
  }

  // Vignette
  float vig = 1.0 - length(uv - 0.5) * 0.65;
  col *= vig;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export class CyberGridRenderer {
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
    this.program = createProgram(gl, standardVertexShader, cyberGridFragmentShader);
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

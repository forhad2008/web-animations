import { standardVertexShader, createProgram, setupQuad, hexToRgbVec3 } from '../utils/webglHelper';
import { AnimationConfig } from '../types';

export const auroraFragmentShader = `
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
  float t = u_time * u_speed * 0.5;

  // Starfield in the dark night sky
  float star = pow(hash(floor(uv * 250.0)), 28.0) * 0.8;

  // Aurora vertical curtain displacement
  vec3 color = u_bg_color + vec3(star);

  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float offset = fi * 0.18;
    
    // Wave calculations with noise distortion
    float wave = sin(uv.x * (3.0 + fi * 1.5) + t * (0.8 + fi * 0.3) + sin(uv.x * 6.0 + t)) * 0.15;
    float n = noise(vec2(uv.x * 4.0 + t * 0.2, uv.y * 2.0 + fi)) * u_distortion * 0.25;
    
    float baseY = 0.45 + offset + wave + n;
    float dist = abs(uv.y - baseY);
    
    // Aurora vertical light ray intensity (soft glow falling off upwards)
    float curtain = smoothstep(0.35, 0.0, dist) * exp(-abs(uv.y - baseY) * 4.0);
    
    // Vertical ray striations
    float rays = sin(uv.x * 80.0 + t * 2.0 + fi * 10.0) * 0.5 + 0.5;
    rays = pow(rays, 2.0) * 0.4 + 0.6;
    
    curtain *= rays;

    // Gradient blend through primary, secondary, and accent colors
    vec3 bandColor = mix(u_primary_color, u_secondary_color, float(i) / 3.0);
    bandColor = mix(bandColor, u_accent_color, sin(uv.x * 2.0 + t + fi) * 0.5 + 0.5);

    color += bandColor * curtain * (u_intensity * 1.2);
  }

  // Atmospheric bottom glow
  float groundGlow = smoothstep(0.0, 0.4, uv.y) * smoothstep(0.8, 0.2, uv.y);
  color += u_primary_color * groundGlow * 0.15 * u_intensity;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export class AuroraRenderer {
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
    this.program = createProgram(gl, standardVertexShader, auroraFragmentShader);
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

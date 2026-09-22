import { standardVertexShader, createProgram, setupQuad, hexToRgbVec3 } from '../utils/webglHelper';
import { AnimationConfig } from '../types';

export const iridescentFluidFragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouse_active;
uniform float u_speed;
uniform float u_distortion;
uniform float u_roughness;
uniform float u_iridescence;
uniform float u_specular;
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

// Complex fluid turbulence
vec2 curlNoise(vec2 p, float t) {
  float eps = 0.1;
  float n1 = noise(p + vec2(0.0, eps) + t * 0.1);
  float n2 = noise(p - vec2(0.0, eps) + t * 0.1);
  float n3 = noise(p + vec2(eps, 0.0) + t * 0.1);
  float n4 = noise(p - vec2(eps, 0.0) + t * 0.1);
  return vec2(n1 - n2, n4 - n3) / (2.0 * eps);
}

// Thin film spectral interference color
vec3 thinFilmColor(float thickness) {
  vec3 k = vec3(2.0, 3.0, 4.0);
  return 0.5 + 0.5 * cos(6.28318 * (thickness * k + vec3(0.0, 0.33, 0.67)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect * 2.5;

  vec2 mouse = (u_mouse - 0.5) * aspect * 2.5;
  float t = u_time * u_speed * 0.6;

  // Fluid curl advection
  vec2 flow = p;
  for (int i = 0; i < 3; i++) {
    vec2 curl = curlNoise(flow * (1.2 + float(i) * 0.5), t + float(i) * 1.5);
    flow += curl * (0.35 * u_distortion);
  }

  // Interactive mouse vortex
  if (u_mouse_active > 0.0) {
    vec2 mDelta = p - mouse;
    float mLen = length(mDelta);
    float mTwist = exp(-mLen * 3.0) * 2.0 * u_mouse_active;
    flow += vec2(-mDelta.y, mDelta.x) * mTwist;
  }

  float fluidPattern = sin(flow.x * 3.0 + t) * cos(flow.y * 3.0 - t);
  float filmThickness = length(flow) * 0.8 + fluidPattern * 0.4 + t * 0.1;

  vec3 iridCol = thinFilmColor(filmThickness);

  // Gradient mixing
  vec3 base = mix(u_bg_color, u_primary_color, smoothstep(-1.0, 1.0, flow.x));
  base = mix(base, u_secondary_color, smoothstep(-1.0, 1.0, flow.y));
  
  vec3 finalCol = mix(base, iridCol * u_accent_color * 1.6, u_iridescence);

  // Specular sheen
  float sheen = pow(max(0.0, sin(flow.x * 5.0 + flow.y * 5.0 + t * 2.0)), 12.0) * u_specular;
  finalCol += vec3(sheen * 0.8);

  gl_FragColor = vec4(clamp(finalCol, 0.0, 1.0), 1.0);
}
`;

export class IridescentFluidRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private startTime: number = performance.now();
  private mouseX: number = 0.5;
  private mouseY: number = 0.5;
  private mouseActive: number = 0;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGL();
  }

  private initGL() {
    const gl = this.canvas.getContext('webgl', { alpha: false, preserveDrawingBuffer: true });
    if (!gl) return;
    this.gl = gl;
    this.program = createProgram(gl, standardVertexShader, iridescentFluidFragmentShader);
    if (this.program) {
      setupQuad(gl, this.program);
    }
  }

  public updateMouse(x: number, y: number, isInside: boolean) {
    this.mouseX = x;
    this.mouseY = y;
    this.mouseActive = isInside ? 1.0 : 0.0;
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
    set2f('u_mouse', this.mouseX, 1.0 - this.mouseY);
    set1f('u_mouse_active', config.mouseInteraction ? this.mouseActive : 0.0);
    set1f('u_speed', config.speed);
    set1f('u_distortion', config.distortion);
    set1f('u_roughness', config.roughness);
    set1f('u_iridescence', config.iridescence);
    set1f('u_specular', config.specular);

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

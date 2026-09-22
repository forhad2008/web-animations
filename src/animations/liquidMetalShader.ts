import { standardVertexShader, createProgram, setupQuad, hexToRgbVec3 } from '../utils/webglHelper';
import { AnimationConfig } from '../types';

export const liquidMetalFragmentShader = `
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
uniform float u_grain;
uniform float u_contrast;
uniform float u_metallic;
uniform vec3 u_primary_color;
uniform vec3 u_secondary_color;
uniform vec3 u_accent_color;
uniform vec3 u_bg_color;

// Hash & Noise utilities
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

// Multi-octave domain warped flow for liquid mercury
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

// Surface height function
float surfaceHeight(vec2 p, float t, vec2 mouse, float mouseActive) {
  float scale = 2.4;
  vec2 q = vec2(fbm(p * scale + vec2(0.0, t * 0.15)),
                fbm(p * scale + vec2(5.2, t * 0.12)));

  vec2 r = vec2(fbm(p * scale + 4.0 * q + vec2(t * 0.22, 9.2)),
                fbm(p * scale + 4.0 * q + vec2(8.3, t * 0.18)));

  float h = fbm(p * scale + 3.5 * r * u_distortion);

  // Mouse fluid disturbance
  if (mouseActive > 0.0) {
    vec2 mDist = p - mouse;
    float d = length(mDist);
    float ripple = sin(d * 24.0 - t * 6.0) * exp(-d * 4.5);
    h += ripple * 0.35 * mouseActive;
  }

  return h;
}

// Palette iridescence generator
vec3 iridescentSpectral(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;

  vec2 mouse = (u_mouse - 0.5) * aspect;
  float t = u_time * u_speed * 0.7;

  // Calculate surface normal using finite differences
  float eps = 0.006;
  float hC = surfaceHeight(p, t, mouse, u_mouse_active);
  float hR = surfaceHeight(p + vec2(eps, 0.0), t, mouse, u_mouse_active);
  float hU = surfaceHeight(p + vec2(0.0, eps), t, mouse, u_mouse_active);

  vec3 normal = normalize(vec3((hC - hR) / eps, (hC - hU) / eps, 0.85 + u_roughness * 0.5));

  // Studio Reflection Environment Bands (Simulating high-key studio softboxes)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 reflectDir = reflect(-viewDir, normal);

  // Stretched horizontal & diagonal studio lighting banks
  float band1 = smoothstep(0.0, 0.25, sin(reflectDir.y * 7.0 + reflectDir.x * 3.0 + t * 0.5));
  float band2 = smoothstep(0.1, 0.45, sin(reflectDir.y * 14.0 - reflectDir.x * 5.0 - t * 0.3));
  float band3 = smoothstep(0.2, 0.6, cos(reflectDir.x * 9.0 + t * 0.4));
  float studioLighting = band1 * 0.6 + band2 * 0.4 + band3 * 0.35;

  // Hot Specular Pings (Key Lights)
  vec3 lightDir1 = normalize(vec3(0.6, 0.8, 0.7));
  vec3 lightDir2 = normalize(vec3(-0.7, -0.5, 0.6));
  float spec1 = pow(max(dot(reflectDir, lightDir1), 0.0), 64.0 / (0.2 + u_roughness));
  float spec2 = pow(max(dot(reflectDir, lightDir2), 0.0), 32.0 / (0.2 + u_roughness));
  float hotSpecular = (spec1 * 1.6 + spec2 * 0.9) * u_specular;

  // Fresnel edge brightness
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

  // Iridescent Dispersion / Chromatic Shimmer along curvature
  float curvature = length(vec2(hC - hR, hC - hU));
  vec3 rainbow = iridescentSpectral(reflectDir.z * 1.5 + curvature * 3.0 + hC * 1.2 + t * 0.1);
  vec3 iridEffect = mix(vec3(1.0), rainbow, u_iridescence);

  // Chrome Mercury Base gradient with user colors
  vec3 baseTone = mix(u_bg_color, u_primary_color, hC * 1.2);
  baseTone = mix(baseTone, u_secondary_color, studioLighting * 0.7);

  // Composite metallic mirror reflection
  vec3 metalCol = baseTone * (0.3 + 0.7 * studioLighting);
  metalCol += u_accent_color * (band1 * 0.4 + fresnel * 0.6);
  metalCol *= iridEffect;
  metalCol += vec3(hotSpecular * 1.2) * mix(vec3(1.0), u_primary_color, 0.25);
  metalCol += vec3(fresnel * 0.45);

  // Contrast & Metallic adjustment
  metalCol = mix(vec3(dot(metalCol, vec3(0.299, 0.587, 0.114))), metalCol, u_metallic);
  metalCol = pow(metalCol, vec3(1.0 / (u_contrast * 0.9 + 0.1)));

  // Subtle film grain
  float grainNoise = (hash(uv * u_resolution.xy + vec2(t * 10.0)) - 0.5) * u_grain * 0.08;
  metalCol += grainNoise;

  gl_FragColor = vec4(clamp(metalCol, 0.0, 1.0), 1.0);
}
`;

export class LiquidMetalRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private quad: { buffer: WebGLBuffer } | null = null;
  private animId: number = 0;
  private startTime: number = performance.now();
  private mouseX: number = 0.5;
  private mouseY: number = 0.5;
  private targetMouseX: number = 0.5;
  private targetMouseY: number = 0.5;
  private mouseActive: number = 0;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGL();
  }

  private initGL() {
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    if (!gl) return;
    this.gl = gl;

    this.program = createProgram(gl, standardVertexShader, liquidMetalFragmentShader);
    if (this.program) {
      this.quad = setupQuad(gl, this.program);
    }
  }

  public updateMouse(x: number, y: number, isInside: boolean) {
    this.targetMouseX = x;
    this.targetMouseY = y;
    this.mouseActive = isInside ? 1.0 : 0.0;
  }

  public render(config: AnimationConfig) {
    if (!this.gl || !this.program) return;
    const gl = this.gl;

    // Smooth mouse lerp
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;

    const width = this.canvas.width;
    const height = this.canvas.height;
    gl.viewport(0, 0, width, height);

    gl.useProgram(this.program);

    const currentTime = (performance.now() - this.startTime) * 0.001;

    // Uniform setters
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

    set2f('u_resolution', width, height);
    set1f('u_time', currentTime);
    set2f('u_mouse', this.mouseX, 1.0 - this.mouseY); // Invert Y for WebGL
    set1f('u_mouse_active', config.mouseInteraction ? this.mouseActive : 0.0);
    set1f('u_speed', config.speed);
    set1f('u_distortion', config.distortion);
    set1f('u_roughness', config.roughness);
    set1f('u_iridescence', config.iridescence);
    set1f('u_specular', config.specular);
    set1f('u_grain', config.grain);
    set1f('u_contrast', config.contrast);
    set1f('u_metallic', config.metallic);

    set3fv('u_primary_color', hexToRgbVec3(config.primaryColor));
    set3fv('u_secondary_color', hexToRgbVec3(config.secondaryColor));
    set3fv('u_accent_color', hexToRgbVec3(config.accentColor));
    set3fv('u_bg_color', hexToRgbVec3(config.backgroundColor));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

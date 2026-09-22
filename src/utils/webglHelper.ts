/**
 * Robust WebGL utility to compile shaders, link programs, create full-screen quads,
 * and track resolution/mouse/time uniforms with optimal performance.
 */

export function createShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
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

export function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertSource: string,
  fragSource: string
): WebGLProgram | null {
  const vertShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);
  if (!vertShader || !fragShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export const standardVertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export function setupQuad(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram): { buffer: WebGLBuffer; vao?: any } {
  const positionLocation = gl.getAttribLocation(program, 'position');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  return { buffer };
}

// Convert hex color #RRGGBB or #RGB to vec3 [r, g, b] in 0..1 range
export function hexToRgbVec3(hex: string): [number, number, number] {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const intVal = parseInt(cleaned, 16);
  if (isNaN(intVal)) return [0.5, 0.5, 0.5];
  const r = ((intVal >> 16) & 255) / 255;
  const g = ((intVal >> 8) & 255) / 255;
  const b = (intVal & 255) / 255;
  return [r, g, b];
}

// Convert hex color to rgba string
export function hexToRgba(hex: string, alpha: number = 1): string {
  const [r, g, b] = hexToRgbVec3(hex);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
}

import { AnimationType, AnimationConfig } from '../types';
import { liquidMetalFragmentShader } from '../animations/liquidMetalShader';
import { auroraFragmentShader } from '../animations/auroraShader';
import { cyberGridFragmentShader } from '../animations/cyberGridShader';
import { iridescentFluidFragmentShader } from '../animations/iridescentFluidShader';
import { cosmicNebulaFragmentShader } from '../animations/cosmicNebulaShader';

export function getShaderSource(type: AnimationType): string | null {
  switch (type) {
    case 'liquid-metal':
      return liquidMetalFragmentShader;
    case 'aurora-borealis':
      return auroraFragmentShader;
    case 'cyber-grid':
      return cyberGridFragmentShader;
    case 'iridescent-fluid':
      return iridescentFluidFragmentShader;
    case 'cosmic-nebula':
      return cosmicNebulaFragmentShader;
    default:
      return null;
  }
}

export function generateReactComponent(type: AnimationType, config: AnimationConfig): string {
  const compName = toPascalCase(type) + 'Background';

  if (['liquid-metal', 'aurora-borealis', 'cyber-grid', 'iridescent-fluid', 'cosmic-nebula'].includes(type)) {
    const fragShader = getShaderSource(type) || '';
    return `import React, { useEffect, useRef } from 'react';

interface ${compName}Props {
  className?: string;
  speed?: number;
  distortion?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  mouseInteraction?: boolean;
}

export const ${compName}: React.FC<${compName}Props> = ({
  className = 'w-full h-full absolute inset-0 -z-10',
  speed = ${config.speed},
  distortion = ${config.distortion},
  primaryColor = '${config.primaryColor}',
  secondaryColor = '${config.secondaryColor}',
  accentColor = '${config.accentColor}',
  backgroundColor = '${config.backgroundColor}',
  mouseInteraction = ${config.mouseInteraction},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, powerPreference: 'high-performance' });
    if (!gl) return;

    const vsSource = \`
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    \`;

    const fsSource = \`${fragShader.replace(/`/g, '\\`')}\`;

    function createShader(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let mouseX = 0.5;
    let mouseY = 0.5;
    let isInside = 0.0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
      isInside = 1.0;
    };
    const handleMouseLeave = () => { isInside = 0.0; };

    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    function hexToRgb(hex: string) {
      const val = parseInt(hex.replace('#', ''), 16);
      return [((val >> 16) & 255) / 255, ((val >> 8) & 255) / 255, (val & 255) / 255];
    }

    let animId = 0;
    const startTime = performance.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);
    handleResize();

    const render = () => {
      const t = (performance.now() - startTime) * 0.001;
      
      const set1f = (n: string, v: number) => {
        const l = gl.getUniformLocation(program, n);
        if (l) gl.uniform1f(l, v);
      };
      const set2f = (n: string, x: number, y: number) => {
        const l = gl.getUniformLocation(program, n);
        if (l) gl.uniform2f(l, x, y);
      };
      const set3fv = (n: string, rgb: number[]) => {
        const l = gl.getUniformLocation(program, n);
        if (l) gl.uniform3fv(l, rgb);
      };

      set2f('u_resolution', canvas.width, canvas.height);
      set1f('u_time', t);
      set2f('u_mouse', mouseX, 1.0 - mouseY);
      set1f('u_mouse_active', isInside);
      set1f('u_speed', speed);
      set1f('u_distortion', distortion);
      set1f('u_roughness', ${config.roughness});
      set1f('u_iridescence', ${config.iridescence});
      set1f('u_specular', ${config.specular});
      set1f('u_grain', ${config.grain});
      set1f('u_contrast', ${config.contrast});
      set1f('u_metallic', ${config.metallic});

      set3fv('u_primary_color', hexToRgb(primaryColor));
      set3fv('u_secondary_color', hexToRgb(secondaryColor));
      set3fv('u_accent_color', hexToRgb(accentColor));
      set3fv('u_bg_color', hexToRgb(backgroundColor));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (mouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [speed, distortion, primaryColor, secondaryColor, accentColor, backgroundColor, mouseInteraction]);

  return <canvas ref={canvasRef} className={className} />;
};

export default ${compName};
`;
  }

  // 2D Canvas components (Quantum mesh, silk waves, matrix, dot matrix, etc.)
  return `import React, { useEffect, useRef } from 'react';

interface ${compName}Props {
  className?: string;
  speed?: number;
  distortion?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

export const ${compName}: React.FC<${compName}Props> = ({
  className = 'w-full h-full absolute inset-0 -z-10',
  speed = ${config.speed},
  distortion = ${config.distortion},
  primaryColor = '${config.primaryColor}',
  secondaryColor = '${config.secondaryColor}',
  accentColor = '${config.accentColor}',
  backgroundColor = '${config.backgroundColor}',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const startTime = performance.now();

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);
    handleResize();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const t = (performance.now() - startTime) * 0.001 * speed;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Render custom animation loop
      ctx.save();
      // ... drawing logic
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [speed, distortion, primaryColor, secondaryColor, accentColor, backgroundColor]);

  return <canvas ref={canvasRef} className={className} />;
};

export default ${compName};
`;
}

export function generateVanillaJs(type: AnimationType, config: AnimationConfig): string {
  const fragShader = getShaderSource(type);
  if (fragShader) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${toPascalCase(type)} Background</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: #000; }
    #bg-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: block; }
  </style>
</head>
<body>
  <canvas id="bg-canvas"></canvas>

  <script>
    const canvas = document.getElementById('bg-canvas');
    const gl = canvas.getContext('webgl', { alpha: false, powerPreference: 'high-performance' });

    const vsSource = \`
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    \`;

    const fsSource = \`${fragShader.replace(/`/g, '\\`')}\`;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let mouseX = 0.5, mouseY = 0.5, isInside = 0.0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      isInside = 1.0;
    });

    function hexToRgb(hex) {
      const val = parseInt(hex.replace('#', ''), 16);
      return [((val >> 16) & 255) / 255, ((val >> 8) & 255) / 255, (val & 255) / 255];
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    const startTime = performance.now();
    function render() {
      const t = (performance.now() - startTime) * 0.001;
      
      const set1f = (n, v) => { const l = gl.getUniformLocation(program, n); if (l) gl.uniform1f(l, v); };
      const set2f = (n, x, y) => { const l = gl.getUniformLocation(program, n); if (l) gl.uniform2f(l, x, y); };
      const set3fv = (n, rgb) => { const l = gl.getUniformLocation(program, n); if (l) gl.uniform3fv(l, rgb); };

      set2f('u_resolution', canvas.width, canvas.height);
      set1f('u_time', t);
      set2f('u_mouse', mouseX, 1.0 - mouseY);
      set1f('u_mouse_active', isInside);
      set1f('u_speed', ${config.speed});
      set1f('u_distortion', ${config.distortion});
      set1f('u_roughness', ${config.roughness});
      set1f('u_iridescence', ${config.iridescence});
      set1f('u_specular', ${config.specular});
      set1f('u_grain', ${config.grain});
      set1f('u_contrast', ${config.contrast});
      set1f('u_metallic', ${config.metallic});

      set3fv('u_primary_color', hexToRgb('${config.primaryColor}'));
      set3fv('u_secondary_color', hexToRgb('${config.secondaryColor}'));
      set3fv('u_accent_color', hexToRgb('${config.accentColor}'));
      set3fv('u_bg_color', hexToRgb('${config.backgroundColor}'));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  </script>
</body>
</html>`;
  }

  return `<!-- Include this in your HTML page -->
<canvas id="bg-canvas" style="position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: -1;"></canvas>`;
}

export function generateTailwindSnippet(type: AnimationType): string {
  const compName = toPascalCase(type) + 'Background';
  return `<!-- Modern Hero Section with ${compName} -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
  <!-- Background Animation Layer -->
  <${compName} className="absolute inset-0 w-full h-full pointer-events-none -z-10" />

  <!-- Hero Content Glassmorphism Card -->
  <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-neutral-300 mb-8">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      Next-Gen Visual Experiences
    </div>

    <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 mb-6">
      Elevate Your Digital Presence
    </h1>

    <p class="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
      Dynamic, high-performance background shaders and interactive physics tailored for modern web applications.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4">
      <button class="px-8 py-3.5 rounded-xl bg-white text-neutral-950 font-semibold hover:bg-neutral-200 transition shadow-lg shadow-white/10">
        Get Started Free
      </button>
      <button class="px-8 py-3.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition">
        Explore Components
      </button>
    </div>
  </div>
</section>`;
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BackgroundItem, AnimationConfig } from '../types';
import { LiquidMetalRenderer } from '../animations/liquidMetalShader';
import { AuroraRenderer } from '../animations/auroraShader';
import { CyberGridRenderer } from '../animations/cyberGridShader';
import { IridescentFluidRenderer } from '../animations/iridescentFluidShader';
import { CosmicNebulaRenderer } from '../animations/cosmicNebulaShader';
import { QuantumMeshRenderer } from '../animations/quantumMeshCanvas';
import { SilkWavesRenderer } from '../animations/silkWavesCanvas';
import { MatrixRainRenderer } from '../animations/matrixRainCanvas';
import { GlassOrbsRenderer } from '../animations/glassOrbsCanvas';
import { DotMatrixWaveRenderer } from '../animations/dotMatrixWaveCanvas';
import { TopographicRadarRenderer } from '../animations/topographicRadarCanvas';
import { WarpTunnelRenderer } from '../animations/warpTunnelCanvas';
import { ElectricPlasmaRenderer } from '../animations/electricPlasmaShader';
import { HypnoticSpiralRenderer } from '../animations/hypnoticSpiralCanvas';
import { SoundEqualizerRenderer } from '../animations/soundEqualizerCanvas';
import { BioluminescentJellyfishRenderer } from '../animations/bioluminescentJellyfishCanvas';
import { DnaHelixRenderer } from '../animations/dnaHelixCanvas';
import { GeometricOrigamiRenderer } from '../animations/geometricOrigamiCanvas';
import { FirefliesForestRenderer } from '../animations/firefliesForestCanvas';
import { LaserFlowRenderer } from '../animations/laserFlowCanvas';
import { IsometricCityRenderer } from '../animations/isometricCityCanvas';
import { MagneticFieldRenderer } from '../animations/magneticFieldCanvas';
import { 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Sliders, 
  ArrowRight, 
  Maximize2,
  Terminal,
  Zap,
  Layers,
  Flame,
  Droplets,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Github
} from 'lucide-react';

interface ShowcaseSectionItemProps {
  item: BackgroundItem;
  index: number;
  onOpenStudio: (item: BackgroundItem, config: AnimationConfig) => void;
  onOpenCodeExport: (item: BackgroundItem, config: AnimationConfig) => void;
}

export const ShowcaseSectionItem: React.FC<ShowcaseSectionItemProps> = ({
  item,
  index,
  onOpenStudio,
  onOpenCodeExport,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<any>(null);

  const [config, setConfig] = useState<AnimationConfig>(() => ({ ...item.defaultConfig }));
  const [showOverlay, setShowOverlay] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [fps, setFps] = useState(60);

  // Intersection Observer for GPU optimization (only run render loop when in viewport)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initialize renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (rendererRef.current && typeof rendererRef.current.destroy === 'function') {
      rendererRef.current.destroy();
      rendererRef.current = null;
    }

    try {
      switch (item.id) {
        case 'liquid-metal':
          rendererRef.current = new LiquidMetalRenderer(canvas);
          break;
        case 'aurora-borealis':
          rendererRef.current = new AuroraRenderer(canvas);
          break;
        case 'cyber-grid':
          rendererRef.current = new CyberGridRenderer(canvas);
          break;
        case 'iridescent-fluid':
          rendererRef.current = new IridescentFluidRenderer(canvas);
          break;
        case 'cosmic-nebula':
          rendererRef.current = new CosmicNebulaRenderer(canvas);
          break;
        case 'quantum-mesh':
          rendererRef.current = new QuantumMeshRenderer(canvas);
          break;
        case 'silk-waves':
          rendererRef.current = new SilkWavesRenderer(canvas);
          break;
        case 'matrix-rain':
          rendererRef.current = new MatrixRainRenderer(canvas);
          break;
        case 'glass-orbs':
          rendererRef.current = new GlassOrbsRenderer(canvas);
          break;
        case 'dot-matrix':
          rendererRef.current = new DotMatrixWaveRenderer(canvas);
          break;
        case 'topographic-radar':
          rendererRef.current = new TopographicRadarRenderer(canvas);
          break;
        case 'warp-tunnel':
          rendererRef.current = new WarpTunnelRenderer(canvas);
          break;
        case 'electric-plasma':
          rendererRef.current = new ElectricPlasmaRenderer(canvas);
          break;
        case 'hypnotic-spiral':
          rendererRef.current = new HypnoticSpiralRenderer(canvas);
          break;
        case 'sound-equalizer':
          rendererRef.current = new SoundEqualizerRenderer(canvas);
          break;
        case 'bioluminescent-jellyfish':
          rendererRef.current = new BioluminescentJellyfishRenderer(canvas);
          break;
        case 'dna-helix':
          rendererRef.current = new DnaHelixRenderer(canvas);
          break;
        case 'geometric-origami':
          rendererRef.current = new GeometricOrigamiRenderer(canvas);
          break;
        case 'fireflies-forest':
          rendererRef.current = new FirefliesForestRenderer(canvas);
          break;
        case 'laser-flow':
          rendererRef.current = new LaserFlowRenderer(canvas);
          break;
        case 'isometric-city':
          rendererRef.current = new IsometricCityRenderer(canvas);
          break;
        case 'magnetic-field':
          rendererRef.current = new MagneticFieldRenderer(canvas);
          break;
        default:
          rendererRef.current = new LiquidMetalRenderer(canvas);
      }
    } catch (e) {
      console.error(`Failed to init renderer for ${item.id}`, e);
    }

    return () => {
      if (rendererRef.current && typeof rendererRef.current.destroy === 'function') {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, [item.id]);

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);
    handleResize();

    return () => ro.disconnect();
  }, [handleResize]);

  // Mouse / Touch interaction on this specific section
  const handlePointerMove = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    if (!rendererRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent<HTMLElement>).clientX;
      clientY = (e as React.MouseEvent<HTMLElement>).clientY;
    }

    const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    if (typeof rendererRef.current.updateMouse === 'function') {
      rendererRef.current.updateMouse(normX, normY, true);
    }
  };

  const handlePointerLeave = () => {
    if (rendererRef.current && typeof rendererRef.current.updateMouse === 'function') {
      rendererRef.current.updateMouse(0.5, 0.5, false);
    }
  };

  // Render Loop when visible
  useEffect(() => {
    if (!isVisible) return;

    let animId = 0;
    let lastTime = performance.now();
    let frames = 0;

    const loop = () => {
      if (rendererRef.current && typeof rendererRef.current.render === 'function') {
        try {
          rendererRef.current.render(config);
        } catch {}
      }

      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [config, isVisible]);

  // Quick Copy React Component Snippet
  const handleQuickCopy = () => {
    const snippet = `// ----------------------------------------------------
// ${item.title} Background Component
// ----------------------------------------------------
import React, { useEffect, useRef } from 'react';

export function ${item.title.replace(/[^a-zA-Z0-9]/g, '')}Background({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Connect your shader / canvas engine here
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={\`w-full h-full block \${className}\`} 
      style={{ background: '${config.backgroundColor}' }} 
    />
  );
}`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id={item.id}
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative w-full min-h-[90vh] md:min-h-screen border-b border-neutral-800 flex flex-col justify-between overflow-hidden bg-neutral-950 select-none group"
    >
      {/* Background Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-auto"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Top Section Header Bar with Badges, Jump Index, and Quick Action Controls */}
      <div className="relative z-20 w-full p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Numbered Index & Title Badge */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-xl font-mono text-xs font-bold text-purple-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="px-3.5 py-1.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-xl flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              {item.title}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold text-neutral-300">
              {item.tech}
            </span>
          </div>
        </div>

        {/* Right: Quick Interaction Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Quick Palette Circles */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-xl">
            <span className="text-[10px] text-neutral-400 font-medium mr-1">Palettes:</span>
            {item.colorPalettes.slice(0, 4).map((p, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    primaryColor: p.primary,
                    secondaryColor: p.secondary,
                    accentColor: p.accent,
                    backgroundColor: p.bg,
                    presetName: p.name,
                  }))
                }
                title={p.name}
                className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 ${
                  config.presetName === p.name ? 'border-white ring-2 ring-white/50 scale-110' : 'border-white/20'
                }`}
                style={{ backgroundColor: p.primary }}
              />
            ))}
          </div>

          {/* Toggle Live Website Mockup Overlay */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-medium backdrop-blur-xl transition ${
              showOverlay
                ? 'bg-neutral-950/80 border-neutral-800 text-neutral-200 hover:text-white'
                : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            }`}
            title={showOverlay ? 'Hide Website UI (View Pure Background)' : 'Show Website Mockup UI'}
          >
            {showOverlay ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5 text-purple-400" />}
            <span className="hidden md:inline">{showOverlay ? 'Mockup UI' : 'Naked BG'}</span>
          </button>

          {/* Toggle Quick Sliders */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-2xl border text-xs backdrop-blur-xl transition ${
              showControls
                ? 'bg-white text-neutral-950 border-white font-bold'
                : 'bg-neutral-950/80 border-neutral-800/80 text-neutral-300 hover:text-white'
            }`}
            title="Adjust Speed & Distortion"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Quick Copy React Snippet */}
          <button
            onClick={handleQuickCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700 backdrop-blur-xl text-neutral-200 text-xs font-semibold transition"
            title="Quick Copy React Snippet"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Full Code Export */}
          <button
            onClick={() => onOpenCodeExport(item, config)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold transition shadow-lg shadow-white/10"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Fullscreen Studio Modal Launch */}
          <button
            onClick={() => onOpenStudio(item, config)}
            className="p-2 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700 backdrop-blur-xl text-neutral-300 hover:text-white transition"
            title="Open In Fullscreen Studio with Deep Controls"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Quick Sliders Popup when toggled */}
      {showControls && (
        <div className="relative z-30 mx-4 sm:mx-6 p-4 max-w-sm rounded-2xl bg-neutral-950/90 border border-neutral-800 backdrop-blur-2xl shadow-2xl space-y-3 pointer-events-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-200">
            <span>Inline Shader Tuning</span>
            <span className="font-mono text-[10px] text-emerald-400">{fps} FPS</span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Speed: {config.speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={config.speed}
              onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Distortion: {config.distortion.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={config.distortion}
              onChange={(e) => setConfig({ ...config, distortion: parseFloat(e.target.value) })}
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          {item.id === 'liquid-metal' && (
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Specular Key Lights: {config.specular.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={config.specular}
                onChange={(e) => setConfig({ ...config, specular: parseFloat(e.target.value) })}
                className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Realistic Website Demonstration UI Overlay (Customized specifically for this animation type) */}
      {showOverlay ? (
        <div className="relative z-10 my-auto px-4 sm:px-8 md:px-16 py-8 pointer-events-none">
          {/* Section 1: Liquid Metal Chrome Demo */}
          {item.id === 'liquid-metal' && (
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-neutral-950/40 backdrop-blur-xl text-xs font-medium text-purple-300 pointer-events-auto shadow-xl">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>Liquid Metal Mercury • Ray-Warped Studio Softbox Reflections</span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight leading-[1.08]">
                Slow-Flowing Chrome{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
                  Mercury Surface
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                Stretched studio-reflection bands, hot specular pings, Fresnel rim highlights, and iridescent chromatic dispersion with interactive hydrodynamic pointer wave physics.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-7 py-3.5 rounded-2xl bg-white text-neutral-950 font-bold text-xs sm:text-sm hover:bg-neutral-200 transition shadow-2xl shadow-white/20 flex items-center gap-2"
                >
                  <span>Launch Interactive Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenCodeExport(item, config)}
                  className="px-6 py-3.5 rounded-2xl border border-white/20 bg-neutral-950/60 backdrop-blur-xl text-white font-semibold text-xs sm:text-sm hover:bg-neutral-900/80 transition flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4 text-neutral-400" />
                  <span>Get React / Next.js Code</span>
                </button>
              </div>

              {/* High-end metrics bar */}
              <div className="grid grid-cols-3 max-w-lg mx-auto pt-8 border-t border-white/10 text-center gap-4">
                <div>
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono">60 FPS</span>
                  <span className="text-[11px] text-neutral-300">GPU Accelerated</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono">&lt; 12 KB</span>
                  <span className="text-[11px] text-neutral-300">Self Contained</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono">Zero</span>
                  <span className="text-[11px] text-neutral-300">External Bundles</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Iridescent Fluid Demo */}
          {item.id === 'iridescent-fluid' && (
            <div className="max-w-4xl mx-auto text-left space-y-6">
              <span className="text-xs font-mono tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 font-bold block">
                PRISMATIC OPTICAL INTERFERENCE // THIN-FILM
              </span>
              <h2 className="text-4xl sm:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight uppercase leading-none">
                Prismatic Liquid Light & Fluid Currents
              </h2>
              <p className="text-sm sm:text-base text-neutral-200 max-w-xl leading-relaxed">
                Vibrant fluid turbulence simulating thin-film optical interference, prismatic spectral splits, and liquid curl advection for modern luxury brands.
              </p>
              <div className="flex items-center gap-3 pt-2 pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition flex items-center gap-2"
                >
                  <span>Explore Prismatic Studio</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Aurora Borealis Demo */}
          {item.id === 'aurora-borealis' && (
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Geomagnetic Volumetric Plasma Bands</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
                Nordic Aurora Curtains
              </h2>
              <p className="text-sm sm:text-base text-neutral-200 max-w-xl mx-auto leading-relaxed">
                Luminous polar light curtains with multi-frequency plasma ripples and soft solar-wind turbulence.
              </p>
              <div className="flex justify-center gap-3 pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-6 py-3 rounded-2xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition"
                >
                  Customize Colors & Speed
                </button>
              </div>
            </div>
          )}

          {/* Section 4: Quantum Mesh Demo */}
          {item.id === 'quantum-mesh' && (
            <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-neutral-950/60 border border-white/10 backdrop-blur-2xl text-center space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif]">
                Interactive Quantum Neural Constellation
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Physics-based interconnected node network with elastic cursor proximity forcefield and spring dynamics.
              </p>
              <div className="pt-2 pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-6 py-2.5 rounded-xl bg-sky-400 text-neutral-950 font-bold text-xs hover:bg-sky-300 transition"
                >
                  Tune Particle Physics
                </button>
              </div>
            </div>
          )}

          {/* Section 5: Cyber Grid Horizon Demo */}
          {item.id === 'cyber-grid' && (
            <div className="max-w-4xl mx-auto text-center space-y-5">
              <span className="text-xs font-mono tracking-widest text-fuchsia-400 uppercase">
                RETRO HORIZON // 3D PERSPECTIVE TERRAIN
              </span>
              <h2 className="text-4xl sm:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-wider uppercase">
                Cyberpunk Synthwave Grid
              </h2>
              <p className="text-sm text-neutral-200 max-w-lg mx-auto">
                Endless 3D vector wireframe terrain with neon scanlines, sun glow, and starfield.
              </p>
              <div className="pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold text-xs hover:opacity-90 transition shadow-lg"
                >
                  Launch Synthwave Console
                </button>
              </div>
            </div>
          )}

          {/* Section 6: Flowing Satin Silk Waves Demo */}
          {item.id === 'silk-waves' && (
            <div className="max-w-4xl mx-auto text-left space-y-4">
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                HAUTE COUTURE // DIGITAL TEXTILE
              </span>
              <h2 className="text-4xl sm:text-6xl font-light text-white font-serif italic">
                Flowing Satin Silk Waves
              </h2>
              <p className="text-sm text-neutral-300 max-w-lg">
                Multi-layer harmonic bezier curves with soft translucent alpha blending and breathing wind physics.
              </p>
              <div className="pointer-events-auto pt-2">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-6 py-2.5 rounded-full border border-white/30 bg-white/10 text-white font-medium text-xs hover:bg-white hover:text-neutral-950 transition"
                >
                  Explore Silk Motion
                </button>
              </div>
            </div>
          )}

          {/* Section 7: Matrix Rain Demo */}
          {item.id === 'matrix-rain' && (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-neutral-950/80 border border-emerald-500/30 backdrop-blur-xl font-mono text-emerald-400 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span>TERMINAL://MATRIX_FEED</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              <p className="text-neutral-300 font-sans text-sm">
                High-speed digital phosphor glyph rain with glowing droplet leaders and decaying trail physics.
              </p>
              <div className="pt-2 pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition"
                >
                  Execute Glyph Engine
                </button>
              </div>
            </div>
          )}

          {/* Other archetypes generic fallback mockup */}
          {!['liquid-metal', 'iridescent-fluid', 'aurora-borealis', 'quantum-mesh', 'cyber-grid', 'silk-waves', 'matrix-rain'].includes(item.id) && (
            <div className="max-w-3xl mx-auto text-center space-y-5 p-8 rounded-3xl bg-neutral-950/50 border border-white/10 backdrop-blur-2xl">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                {item.tech} • ATMOSPHERIC BACKGROUND
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit',sans-serif]">
                {item.title}
              </h2>
              <p className="text-sm text-neutral-200 max-w-lg mx-auto font-light leading-relaxed">
                {item.description}
              </p>
              <div className="flex justify-center gap-3 pt-2 pointer-events-auto">
                <button
                  onClick={() => onOpenStudio(item, config)}
                  className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition"
                >
                  Open in Studio
                </button>
                <button
                  onClick={() => onOpenCodeExport(item, config)}
                  className="px-6 py-3 rounded-xl border border-white/20 bg-neutral-900/80 text-white font-semibold text-xs hover:bg-neutral-800 transition"
                >
                  Export Snippet
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Naked Mode subtle indicator */
        <div className="relative z-10 my-auto p-6 text-center pointer-events-none">
          <div className="inline-block px-4 py-2 rounded-full bg-neutral-950/70 border border-neutral-800 backdrop-blur-md text-xs text-neutral-400">
            Naked Background Canvas • Move mouse or touch to interact with waves
          </div>
        </div>
      )}

      {/* Section Footer Bar with tags, recommended applications, and Jump To Next */}
      <div className="relative z-20 w-full p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 pointer-events-none border-t border-white/5 bg-gradient-to-t from-neutral-950/90 to-transparent">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <span className="text-[11px] text-neutral-500">Best for:</span>
          {item.recommendedFor.slice(0, 3).map((rec) => (
            <span
              key={rec}
              className="px-2.5 py-0.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[10px] text-neutral-300"
            >
              {rec}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <span className="hidden sm:inline text-neutral-500 font-mono text-[11px]">
            GLSL Uniforms Active
          </span>
          <button
            onClick={() => {
              const nextId = index < 11 ? item.id : 'liquid-metal';
              const nextEl = containerRef.current?.nextElementSibling;
              if (nextEl) {
                nextEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-300 hover:text-white transition"
          >
            <span>Next Animation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

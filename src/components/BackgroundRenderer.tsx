import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimationType, AnimationConfig } from '../types';
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

interface BackgroundRendererProps {
  type: AnimationType;
  config: AnimationConfig;
  onFpsUpdate?: (fps: number) => void;
  className?: string;
  canvasRefCallback?: (canvas: HTMLCanvasElement | null) => void;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  type,
  config,
  onFpsUpdate,
  className = 'w-full h-full absolute inset-0',
  canvasRefCallback,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const framesCountRef = useRef<number>(0);

  // Initialize renderer on type change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvasRefCallback) {
      canvasRefCallback(canvas);
    }

    // Cleanup previous renderer
    if (rendererRef.current && typeof rendererRef.current.destroy === 'function') {
      rendererRef.current.destroy();
      rendererRef.current = null;
    }

    // Recreate canvas context by replacing or resizing cleanly
    try {
      switch (type) {
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
      console.error('Failed to init renderer for', type, e);
    }

    return () => {
      if (rendererRef.current && typeof rendererRef.current.destroy === 'function') {
        rendererRef.current.destroy();
      }
    };
  }, [type]);

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, config.dpr || 1.5);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
  }, [config.dpr]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(canvas.parentElement);
    handleResize();

    return () => ro.disconnect();
  }, [handleResize]);

  // Mouse move handlers
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!rendererRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
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

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  // Animation render loop
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      if (rendererRef.current && typeof rendererRef.current.render === 'function') {
        try {
          rendererRef.current.render(config);
        } catch (err) {
          console.error('Render error:', err);
        }
      }

      // Calculate FPS
      framesCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((framesCountRef.current * 1000) / (now - lastTimeRef.current));
        if (onFpsUpdate) onFpsUpdate(fps);
        framesCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [config, onFpsUpdate]);

  return (
    <canvas
      id="aether-motion-canvas"
      ref={canvasRef}
      className={`${className} block touch-none pointer-events-auto`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

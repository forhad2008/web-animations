import React, { useEffect, useRef, useState } from 'react';
import { BackgroundItem } from '../types';
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

interface MiniAnimationPreviewProps {
  item: BackgroundItem;
  isHovered?: boolean;
}

export const MiniAnimationPreview: React.FC<MiniAnimationPreviewProps> = ({ item, isHovered = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Setup Intersection Observer to only render when in viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Initialize renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    // Set preview resolution (compact 320x180 scaled to canvas for performance)
    canvas.width = 360;
    canvas.height = 200;

    if (rendererRef.current && typeof rendererRef.current.destroy === 'function') {
      rendererRef.current.destroy();
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
        default:
          rendererRef.current = new LiquidMetalRenderer(canvas);
      }
    } catch (e) {
      console.error('Failed to init mini renderer', e);
    }

    let animId = 0;
    const renderLoop = () => {
      if (rendererRef.current && typeof rendererRef.current.render === 'function') {
        const previewConfig = {
          ...item.defaultConfig,
          speed: isHovered ? item.defaultConfig.speed * 1.5 : item.defaultConfig.speed,
          dpr: 1.0,
        };
        try {
          rendererRef.current.render(previewConfig);
        } catch {}
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      if (rendererRef.current && typeof rendererRef.current.destroy === 'function') {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, [item, isVisible, isHovered]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-neutral-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

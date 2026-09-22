export type AnimationCategory = 
  | 'all'
  | 'liquid-metal'
  | 'shaders'
  | 'particles'
  | 'minimal'
  | 'cyber-retro'
  | 'cosmic'
  | 'geometric';

export interface ColorStop {
  color: string;
  position: number;
}

export interface AnimationConfig {
  speed: number;
  intensity: number;
  complexity: number;
  roughness: number;
  iridescence: number;
  specular: number;
  distortion: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  mouseInteraction: boolean;
  mouseForce: number;
  mouseRadius: number;
  grain: number;
  blur: number;
  dpr: number;
  flowDirection: number; // 0 to 360 deg
  contrast: number;
  brightness: number;
  metallic: number;
  presetName?: string;
  [key: string]: any;
}

export type AnimationType =
  | 'liquid-metal'
  | 'iridescent-fluid'
  | 'aurora-borealis'
  | 'quantum-mesh'
  | 'cyber-grid'
  | 'warp-tunnel'
  | 'silk-waves'
  | 'matrix-rain'
  | 'glass-orbs'
  | 'cosmic-nebula'
  | 'dot-matrix'
  | 'topographic-radar'
  | 'electric-plasma'
  | 'hypnotic-spiral'
  | 'sound-equalizer'
  | 'bioluminescent-jellyfish'
  | 'dna-helix'
  | 'geometric-origami'
  | 'fireflies-forest'
  | 'laser-flow'
  | 'isometric-city'
  | 'magnetic-field';

export interface BackgroundItem {
  id: AnimationType;
  title: string;
  tagline: string;
  description: string;
  category: AnimationCategory;
  tags: string[];
  tech: 'WebGL 2' | 'WebGL Shader' | 'Canvas 2D' | 'Physics Engine';
  recommendedFor: string[];
  defaultConfig: AnimationConfig;
  colorPalettes: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  }[];
}

export type OverlayMode =
  | 'none'
  | 'saas-hero'
  | 'agency-portfolio'
  | 'auth-card'
  | 'feature-bento'
  | 'pricing-tier';

export type AppView = 'hub' | 'detail';

export interface Preset {
  id: string;
  name: string;
  animationType: AnimationType;
  category: string;
  config: AnimationConfig;
  previewGradient: string;
}

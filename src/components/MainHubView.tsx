import React, { useState } from 'react';
import { BackgroundItem, AnimationCategory } from '../types';
import { BACKGROUND_ITEMS, ALL_CATEGORIES } from '../data/presets';
import { MiniAnimationPreview } from './MiniAnimationPreview';
import { 
  Sparkles, 
  Search, 
  Code2, 
  ArrowRight, 
  Layers, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Check, 
  Flame, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Monitor,
  Smartphone,
  Eye
} from 'lucide-react';

interface MainHubViewProps {
  onOpenDetail: (item: BackgroundItem) => void;
  onOpenCodeExport: (item: BackgroundItem) => void;
}

export const MainHubView: React.FC<MainHubViewProps> = ({
  onOpenDetail,
  onOpenCodeExport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const featuredItem = BACKGROUND_ITEMS[0]; // Liquid Metal Chrome

  const filteredItems = BACKGROUND_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tech.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleQuickCopy = (e: React.MouseEvent, item: BackgroundItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`// ${item.title} Background component for React / Next.js
import { ${item.title.replace(/\s+/g, '')}Background } from './animations';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen">
      <${item.title.replace(/\s+/g, '')}Background className="absolute inset-0 -z-10" />
      <div className="relative z-10 p-8">
        <h1>Your Next-Gen Website</h1>
      </div>
    </div>
  );
}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 font-['Plus_Jakarta_Sans',sans-serif] overflow-y-auto custom-scrollbar">
      {/* Top Main Navigation */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 bg-neutral-950/80 border-b border-neutral-800/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white via-neutral-200 to-neutral-500 flex items-center justify-center text-neutral-950 font-black text-xs shadow-md">
            AM
          </div>
          <div>
            <span className="font-['Outfit',sans-serif] font-bold text-base tracking-tight text-white block leading-none">
              Aether<span className="text-neutral-400 font-light">Motion</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
              Web Background Animation Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>22 GPU Shaders & Engines</span>
          </div>

          <button
            onClick={() => onOpenDetail(featuredItem)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white text-xs font-bold hover:brightness-110 transition shadow-lg shadow-purple-600/25 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Open Studio</span>
          </button>
        </div>
      </header>

      {/* Hero Banner with Featured Liquid Metal Preview */}
      <section className="relative px-4 sm:px-8 pt-8 pb-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl border border-neutral-800 overflow-hidden bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 sm:p-10 shadow-2xl">
          {/* Background Canvas preview behind hero text */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <MiniAnimationPreview item={featuredItem} isHovered={true} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-5 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>Featured Shader • Liquid Metal Ambient Mercury</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight leading-[1.1] mb-4">
              Modern Background Animations for High-End Websites
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-8">
              Slow-flowing liquid chrome mercury, ethereal Nordic aurora curtains, interactive quantum particle mesh, and cyberpunk 3D horizon grids. Optimized for 60 FPS across desktop & mobile.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenDetail(featuredItem)}
                className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs sm:text-sm hover:bg-neutral-200 transition shadow-xl shadow-white/15 flex items-center gap-2"
              >
                <span>Launch Liquid Metal Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenCodeExport(featuredItem)}
                className="px-5 py-3 rounded-xl border border-neutral-700 bg-neutral-900/80 backdrop-blur-md text-white font-medium text-xs sm:text-sm hover:bg-neutral-800 transition flex items-center gap-2"
              >
                <Code2 className="w-4 h-4 text-neutral-400" />
                <span>Quick Export Code</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Controls */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl">
          {/* Category Pills (Horizontal scrolling on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-white text-neutral-950 shadow-md'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search animations, shaders, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>
      </section>

      {/* Grid of 10+ Background Animation Cards */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit',sans-serif]">
              Animation Catalog ({filteredItems.length})
            </h2>
            <span className="text-xs text-neutral-400 font-mono">Live Interactive Previews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isHovered = hoveredId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative rounded-3xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-300 p-5 flex flex-col justify-between shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <div>
                  {/* Miniature Canvas Preview */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-neutral-800/80 shadow-inner group-hover:border-neutral-700 transition">
                    <MiniAnimationPreview item={item} isHovered={isHovered} />

                    {/* Tech Badge overlay */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-neutral-300">
                      {item.tech}
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-white/10">
                      {item.colorPalettes.slice(0, 3).map((pal, idx) => (
                        <span
                          key={idx}
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: pal.primary }}
                          title={pal.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title and Tagline */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] group-hover:text-purple-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-300 font-light mt-1 line-clamp-2">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-neutral-800/60 border border-neutral-700/40 text-[10px] text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenDetail(item)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Full Page</span>
                  </button>

                  <button
                    onClick={(e) => handleQuickCopy(e, item)}
                    title="Quick Copy React Code"
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60 transition"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onOpenCodeExport(item)}
                    title="Export Code Modal"
                    className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60 transition"
                  >
                    <Code2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature & Performance Benchmark Section */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit',sans-serif] mb-2">
              Engineered for Production Web Applications
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Designed with strict adherence to WebGL lifecycle management, dynamic resolution scaling, and responsive layout compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <span className="block text-3xl font-extrabold text-white font-mono mb-1">60 FPS</span>
              <span className="text-xs text-neutral-300 font-medium block">Steady Framerate</span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Hardware rasterized quads</span>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <span className="block text-3xl font-extrabold text-white font-mono mb-1">&lt; 15 KB</span>
              <span className="text-xs text-neutral-300 font-medium block">Zero Extra Bundles</span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Pure GLSL & Canvas</span>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <span className="block text-3xl font-extrabold text-white font-mono mb-1">100%</span>
              <span className="text-xs text-neutral-300 font-medium block">Mobile Friendly</span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Touch ripple hydrodynamics</span>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <span className="block text-3xl font-extrabold text-white font-mono mb-1">1-Click</span>
              <span className="text-xs text-neutral-300 font-medium block">React & Next.js Export</span>
              <span className="text-[11px] text-neutral-500 mt-1 block">TypeScript types included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Footer */}
      <footer className="px-4 sm:px-8 py-8 border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AetherMotion</span>
            <span>•</span>
            <span>Mathematical GLSL & Canvas Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <span>MIT License</span>
            <span>React 19 / Next.js Ready</span>
            <span>WebGL 2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

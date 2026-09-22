import React, { useState, useEffect, useRef } from 'react';
import { BackgroundItem, AnimationConfig, AnimationCategory } from '../types';
import { BACKGROUND_ITEMS, ALL_CATEGORIES } from '../data/presets';
import { ShowcaseSectionItem } from './ShowcaseSectionItem';
import { MiniAnimationPreview } from './MiniAnimationPreview';
import { 
  Sparkles, 
  Search, 
  Code2, 
  Layers, 
  Zap, 
  Cpu, 
  Check, 
  Flame, 
  Copy, 
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  Sliders,
  Maximize2,
  ArrowUp,
  Compass,
  Eye,
  SlidersHorizontal,
  Home
} from 'lucide-react';

interface FullShowcaseMainPageProps {
  onOpenStudio: (item: BackgroundItem, config?: AnimationConfig) => void;
  onOpenCodeExport: (item: BackgroundItem, config?: AnimationConfig) => void;
  onOpenSnapshot: (item: BackgroundItem) => void;
}

export const FullShowcaseMainPage: React.FC<FullShowcaseMainPageProps> = ({
  onOpenStudio,
  onOpenCodeExport,
  onOpenSnapshot,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'stream' | 'grid'>('stream');
  const [activeSectionId, setActiveSectionId] = useState<string>(BACKGROUND_ITEMS[0].id);
  const [isJumpMenuOpen, setIsJumpMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      if (viewMode !== 'stream') return;

      const sections = BACKGROUND_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSectionId(BACKGROUND_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const filteredItems = BACKGROUND_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tech.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const scrollToSection = (id: string) => {
    setIsJumpMenuOpen(false);
    if (viewMode === 'grid') {
      setViewMode('stream');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {/* Top Sticky Universal Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-neutral-950/90 border-b border-neutral-800/80 backdrop-blur-2xl flex items-center justify-between shadow-2xl">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white via-neutral-200 to-neutral-500 flex items-center justify-center text-neutral-950 font-black text-xs shadow-md">
            AM
          </div>
          <div>
            <span className="font-['Outfit',sans-serif] font-bold text-base tracking-tight text-white block leading-none">
              Aether<span className="text-neutral-400 font-light">Motion</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
              Background Animation Collection • by Abdullah
            </span>
          </div>
        </div>

        {/* Center: Quick Jump Dropdown Menu */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsJumpMenuOpen(!isJumpMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 transition"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Jump to Animation (12)</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {isJumpMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto custom-scrollbar rounded-2xl bg-neutral-950 border border-neutral-800 backdrop-blur-2xl shadow-2xl p-2 space-y-1 z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Select Animation Page
                </div>
                {BACKGROUND_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                      activeSectionId === item.id
                        ? 'bg-white text-neutral-950 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{item.title}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">{item.tech.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: View Mode Toggle & Studio Trigger */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle (Stream vs Grid) */}
          <div className="flex items-center p-1 rounded-2xl bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setViewMode('stream')}
              title="Full Stream Showcase View"
              className={`p-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                viewMode === 'stream'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Stream</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Interactive Bento Cards Grid"
              className={`p-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Grid</span>
            </button>
          </div>

          {/* Open Featured Studio */}
          <button
            onClick={() => onOpenStudio(BACKGROUND_ITEMS[0])}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white hover:brightness-110 text-xs font-bold transition shadow-lg shadow-purple-600/25 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Studio</span>
          </button>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative px-4 sm:px-8 pt-8 pb-10 max-w-7xl mx-auto">
        <div className="relative rounded-3xl border border-neutral-800/80 overflow-hidden bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 sm:p-10 shadow-2xl">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>22 High-Performance Background Animations for Modern Web</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight leading-[1.1]">
              Background Animation Collection{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 font-bold block sm:inline text-2xl sm:text-4xl lg:text-5xl drop-shadow-sm">
                by Abdullah
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Explore 22 production-ready background animations engineered in pure WebGL shaders and Canvas 2D physics. All animations run live below with interactive mouse waves and 1-click code exports.
            </p>

            {/* Category Filter Pills & Search */}
            <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-white text-neutral-950 shadow-md'
                        : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter animations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Viewport Content */}
      {viewMode === 'stream' ? (
        /* 1. Full Stream Showcase: All 12 animations rendered sequentially as interactive website pages */
        <div className="w-full flex flex-col divide-y divide-neutral-800/80">
          {filteredItems.map((item, idx) => (
            <ShowcaseSectionItem
              key={item.id}
              item={item}
              index={idx}
              onOpenStudio={onOpenStudio}
              onOpenCodeExport={onOpenCodeExport}
            />
          ))}
        </div>
      ) : (
        /* 2. Interactive Bento Cards Grid Mode */
        <div className="px-4 sm:px-8 max-w-7xl mx-auto pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-3xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-all p-5 flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-4 border border-neutral-800">
                  <MiniAnimationPreview item={item} isHovered={true} />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-neutral-950/80 border border-white/10 text-[10px] font-semibold text-neutral-300">
                    {item.tech}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-purple-400 font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-300 font-light mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="flex-1 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Section</span>
                </button>
                <button
                  onClick={() => onOpenStudio(item)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                  title="Open in Studio"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenCodeExport(item)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                  title="Export Code"
                >
                  <Code2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Side Quick Navigation Dots for Desktop Stream View */}
      {viewMode === 'stream' && (
        <nav
          aria-label="Animation Jump Links"
          className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-2 p-2 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-xl shadow-2xl"
        >
          {BACKGROUND_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              title={`${idx + 1}. ${item.title}`}
              className={`group flex items-center gap-2 p-1 rounded-xl transition ${
                activeSectionId === item.id ? 'bg-white/10' : 'hover:bg-neutral-800/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  activeSectionId === item.id
                    ? 'w-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 ring-2 ring-purple-500/40'
                    : 'bg-neutral-600 group-hover:bg-neutral-400'
                }`}
              />
              <span className="sr-only">{item.title}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 shadow-2xl backdrop-blur-xl transition animate-fade-in"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Footer */}
      <footer className="w-full py-12 px-6 border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AetherMotion</span>
            <span>•</span>
            <span>Background Animation Collection by Abdullah</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Pure GLSL & Canvas</span>
            <span>Next.js / Vite / React 19 Ready</span>
            <span>MIT Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

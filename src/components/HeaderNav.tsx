import React, { useState } from 'react';
import { BackgroundItem, OverlayMode, AnimationType } from '../types';
import { ALL_CATEGORIES, BACKGROUND_ITEMS } from '../data/presets';
import { 
  Code2, 
  Camera, 
  Maximize2, 
  Minimize2, 
  Layout, 
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Grid,
  Home
} from 'lucide-react';

interface HeaderNavProps {
  currentItem: BackgroundItem;
  onSelectAnimation: (item: BackgroundItem) => void;
  overlayMode: OverlayMode;
  onSelectOverlay: (mode: OverlayMode) => void;
  onOpenCodeExport: () => void;
  onOpenSnapshot: () => void;
  onOpenGallery: () => void;
  onBackToHub: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  fps: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentItem,
  onSelectAnimation,
  overlayMode,
  onSelectOverlay,
  onOpenCodeExport,
  onOpenSnapshot,
  onOpenGallery,
  onBackToHub,
  onToggleSidebar,
  isSidebarOpen,
  fps,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOverlayDropdownOpen, setIsOverlayDropdownOpen] = useState(false);
  const [isAnimDropdownOpen, setIsAnimDropdownOpen] = useState(false);

  const currentIndex = BACKGROUND_ITEMS.findIndex((b) => b.id === currentItem.id);
  const prevItem = BACKGROUND_ITEMS[(currentIndex - 1 + BACKGROUND_ITEMS.length) % BACKGROUND_ITEMS.length];
  const nextItem = BACKGROUND_ITEMS[(currentIndex + 1) % BACKGROUND_ITEMS.length];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const overlayOptions: { id: OverlayMode; label: string; icon: string }[] = [
    { id: 'saas-hero', label: 'SaaS Hero Page', icon: '🚀' },
    { id: 'agency-portfolio', label: 'Luxury Portfolio', icon: '✨' },
    { id: 'auth-card', label: 'Glass Login Modal', icon: '🔒' },
    { id: 'feature-bento', label: 'Feature Bento Grid', icon: '📦' },
    { id: 'pricing-tier', label: 'Pricing Comparison', icon: '💳' },
    { id: 'none', label: 'Clean / Naked View', icon: '🎨' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between pointer-events-none">
      {/* Left: Hub Home Link & Animation Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto">
        {/* Back to Main Hub Button */}
        <button
          onClick={onBackToHub}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-950/85 border border-neutral-800/80 hover:border-neutral-600 backdrop-blur-xl text-neutral-200 hover:text-white text-xs font-semibold shadow-xl transition"
          title="Back to All Animations Hub"
        >
          <Home className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Hub</span>
        </button>

        {/* Prev / Next Page Stepper */}
        <div className="flex items-center rounded-2xl bg-neutral-950/85 border border-neutral-800/80 backdrop-blur-xl p-0.5 shadow-xl">
          <button
            onClick={() => onSelectAnimation(prevItem)}
            title={`Previous: ${prevItem.title}`}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-xl transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectAnimation(nextItem)}
            title={`Next: ${nextItem.title}`}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-xl transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Animation Picker Dropdown */}
        <div className="relative">
          <button
            id="animation-selector-btn"
            onClick={() => setIsAnimDropdownOpen(!isAnimDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-neutral-950/85 border border-neutral-800/80 hover:border-neutral-600 backdrop-blur-xl text-neutral-200 text-xs font-semibold shadow-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="max-w-[120px] sm:max-w-[180px] truncate">{currentItem.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {isAnimDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto custom-scrollbar rounded-2xl bg-neutral-950/95 border border-neutral-800 backdrop-blur-2xl shadow-2xl p-2 space-y-1 z-50">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                12 Background Shaders & Physics
              </div>
              {BACKGROUND_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectAnimation(item);
                    setIsAnimDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                    currentItem.id === item.id
                      ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="block font-medium">{item.title}</span>
                      <span className="text-[10px] text-neutral-400 block line-clamp-1">{item.tech}</span>
                    </div>
                  </div>
                  {currentItem.id === item.id && <Check className="w-3.5 h-3.5 text-neutral-950" />}
                </button>
              ))}

              <div className="pt-2 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setIsAnimDropdownOpen(false);
                    onOpenGallery();
                  }}
                  className="w-full py-2 text-center text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-xl transition"
                >
                  View All in Visual Grid →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls, Mock Overlay Selector, FPS, Export */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Mock Site Overlay Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOverlayDropdownOpen(!isOverlayDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-2xl bg-neutral-950/85 border border-neutral-800/80 hover:border-neutral-600 backdrop-blur-xl text-neutral-300 hover:text-white text-xs font-medium shadow-xl transition"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Overlay:</span>
            <span className="text-white font-semibold text-[11px] sm:text-xs">
              {overlayOptions.find((o) => o.id === overlayMode)?.label.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {isOverlayDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-neutral-950/95 border border-neutral-800 backdrop-blur-2xl shadow-2xl p-1.5 space-y-1 z-50">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Preview With Mock UI
              </div>
              {overlayOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectOverlay(opt.id);
                    setIsOverlayDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                    overlayMode === opt.id
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  {overlayMode === opt.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FPS Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-950/85 border border-neutral-800/80 backdrop-blur-xl text-xs font-mono text-emerald-400 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{fps} FPS</span>
        </div>

        {/* Snapshot Capture Button */}
        <button
          onClick={onOpenSnapshot}
          title="Capture PNG Snapshot"
          className="hidden sm:flex p-2 rounded-2xl bg-neutral-950/85 border border-neutral-800/80 hover:border-neutral-600 backdrop-blur-xl text-neutral-300 hover:text-white shadow-xl transition"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="hidden sm:flex p-2 rounded-2xl bg-neutral-950/85 border border-neutral-800/80 hover:border-neutral-600 backdrop-blur-xl text-neutral-300 hover:text-white shadow-xl transition"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Get Code Export Button */}
        <button
          id="export-code-btn"
          onClick={onOpenCodeExport}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold tracking-tight shadow-xl shadow-white/10 transition"
        >
          <Code2 className="w-4 h-4" />
          <span className="hidden sm:inline">Export Code</span>
          <span className="sm:hidden">Code</span>
        </button>
      </div>
    </header>
  );
};

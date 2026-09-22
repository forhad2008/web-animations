import React, { useState } from 'react';
import { BackgroundItem, AnimationCategory } from '../types';
import { BACKGROUND_ITEMS, ALL_CATEGORIES } from '../data/presets';
import { Search, X, Sparkles, Zap, Check, ArrowRight } from 'lucide-react';

interface PresetGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: BackgroundItem;
  onSelect: (item: BackgroundItem) => void;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({
  isOpen,
  onClose,
  currentItem,
  onSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = BACKGROUND_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-6xl max-h-[90vh] bg-neutral-950/95 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Gallery Header */}
        <div className="p-6 md:p-8 border-b border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-['Outfit',sans-serif]">
                Website Background Shaders & Animations
              </h2>
            </div>
            <p className="text-xs md:text-sm text-neutral-400">
              Select from mathematical GLSL fluid shaders, interactive particle meshes, and organic wave ribbons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search shaders, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-6 md:px-8 py-3 border-b border-neutral-800/80 bg-neutral-900/30 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-900/70 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 custom-scrollbar">
          {filteredItems.map((item) => {
            const isSelected = currentItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? 'bg-neutral-900/90 border-white ring-1 ring-white/50 shadow-2xl shadow-white/5'
                    : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/80'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-neutral-300">
                      {item.tech}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.colorPalettes.slice(0, 3).map((p, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: p.primary }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-['Outfit',sans-serif] group-hover:text-amber-300 transition flex items-center justify-between">
                    {item.title}
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-neutral-800/60 text-[10px] text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition">
                  <span className="text-[11px]">Click to launch in studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-500 px-6">
          <span>Showing {filteredItems.length} background generators</span>
          <span>Zero-dependency WebGL & Canvas</span>
        </div>
      </div>
    </div>
  );
};

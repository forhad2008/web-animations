import React, { useState } from 'react';
import { AnimationType, AnimationConfig, BackgroundItem } from '../types';
import { 
  Sliders, 
  Palette, 
  Sparkles, 
  MousePointer, 
  RotateCcw, 
  Shuffle, 
  Save, 
  Trash2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Droplets,
  Layers,
  Zap,
  Gauge,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarControlsProps {
  item: BackgroundItem;
  config: AnimationConfig;
  onChange: (newConfig: AnimationConfig) => void;
  onReset: () => void;
  fps: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  item,
  config,
  onChange,
  onReset,
  fps,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'colors' | 'physics' | 'presets'>('visuals');
  const [customPresets, setCustomPresets] = useState<{ name: string; config: AnimationConfig }[]>(() => {
    try {
      const saved = localStorage.getItem(`custom_presets_${item.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [presetInputName, setPresetInputName] = useState('');

  const updateParam = (key: keyof AnimationConfig, val: any) => {
    onChange({
      ...config,
      [key]: val,
    });
  };

  const handleApplyPalette = (palette: { primary: string; secondary: string; accent: string; bg: string; name: string }) => {
    onChange({
      ...config,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      backgroundColor: palette.bg,
      presetName: palette.name,
    });
  };

  const handleRandomize = () => {
    onChange({
      ...config,
      speed: Number((0.4 + Math.random() * 1.2).toFixed(2)),
      distortion: Number((0.5 + Math.random() * 1.2).toFixed(2)),
      roughness: Number((0.05 + Math.random() * 0.6).toFixed(2)),
      iridescence: Number((0.2 + Math.random() * 0.8).toFixed(2)),
      specular: Number((0.6 + Math.random() * 1.4).toFixed(2)),
      grain: Number((Math.random() * 0.4).toFixed(2)),
    });
  };

  const handleSaveCustomPreset = () => {
    if (!presetInputName.trim()) return;
    const newPreset = { name: presetInputName.trim(), config: { ...config } };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    setPresetInputName('');
    try {
      localStorage.setItem(`custom_presets_${item.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePreset = (index: number) => {
    const updated = customPresets.filter((_, i) => i !== index);
    setCustomPresets(updated);
    try {
      localStorage.setItem(`custom_presets_${item.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Mobile Floating Controls Trigger (Bottom Bar for Mobile) */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white font-semibold text-xs shadow-2xl backdrop-blur-xl"
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span>Tune Parameters</span>
        </button>
      </div>

      {/* Desktop Collapse Toggle Button */}
      <button
        id="sidebar-toggle-btn"
        onClick={onToggle}
        className={`hidden md:flex fixed top-20 ${
          isOpen ? 'right-[360px]' : 'right-4'
        } z-40 p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/60 shadow-xl backdrop-blur-md transition-all duration-300 items-center gap-1.5 text-xs font-medium`}
        title={isOpen ? 'Collapse Studio Panel' : 'Expand Studio Panel'}
      >
        {isOpen ? <ChevronRight className="w-4 h-4 text-neutral-300" /> : <ChevronLeft className="w-4 h-4 text-neutral-300" />}
        <span>{isOpen ? 'Close' : 'Controls'}</span>
      </button>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Control Drawer (Desktop: Right Sidebar | Mobile: Slide-in Panel) */}
      <aside
        id="studio-control-sidebar"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[380px] md:w-[360px] z-50 md:z-30 bg-neutral-950/95 md:bg-neutral-950/85 border-l border-neutral-800/80 backdrop-blur-2xl transition-transform duration-300 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase font-['Outfit',sans-serif]">
                {item.title}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md bg-white/10 text-neutral-300 border border-white/10">
                {item.tech}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{item.tagline}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRandomize}
              title="Randomize Parameters"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              title="Reset to Default"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {/* Close button on mobile */}
            <button
              onClick={onToggle}
              className="md:hidden p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800/80 bg-neutral-900/40 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('visuals')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'visuals'
                ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Visuals
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'colors'
                ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Palette
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'physics'
                ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            Physics
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Presets
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-neutral-200 text-sm">
          {activeTab === 'visuals' && (
            <div className="space-y-5">
              {/* Flow Speed */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="font-medium text-neutral-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Flow Speed
                  </label>
                  <span className="font-mono text-neutral-400">{config.speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.05"
                  value={config.speed}
                  onChange={(e) => updateParam('speed', parseFloat(e.target.value))}
                  className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Distortion & Viscosity */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="font-medium text-neutral-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    Distortion & Turbulence
                  </label>
                  <span className="font-mono text-neutral-400">{config.distortion.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={config.distortion}
                  onChange={(e) => updateParam('distortion', parseFloat(e.target.value))}
                  className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Liquid Metal Specific sliders */}
              {item.id === 'liquid-metal' && (
                <>
                  {/* Hot Specular Pings */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        Specular Key Lights (Pings)
                      </label>
                      <span className="font-mono text-neutral-400">{config.specular.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={config.specular}
                      onChange={(e) => updateParam('specular', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Iridescent Rainbow Dispersion */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Iridescent Dispersion
                      </label>
                      <span className="font-mono text-neutral-400">{Math.round(config.iridescence * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={config.iridescence}
                      onChange={(e) => updateParam('iridescence', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Surface Roughness */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        Surface Mirror Polish / Roughness
                      </label>
                      <span className="font-mono text-neutral-400">{config.roughness.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.8"
                      step="0.02"
                      value={config.roughness}
                      onChange={(e) => updateParam('roughness', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Metallic Weight */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300">Metallic Weight</label>
                      <span className="font-mono text-neutral-400">{config.metallic.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.0"
                      step="0.05"
                      value={config.metallic}
                      onChange={(e) => updateParam('metallic', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Grain Noise */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300">Film Grain</label>
                      <span className="font-mono text-neutral-400">{(config.grain * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={config.grain}
                      onChange={(e) => updateParam('grain', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}

              {/* Resolution / DPI Scaling */}
              <div className="pt-3 border-t border-neutral-800/80">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <label className="font-medium text-neutral-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                    Rendering Resolution (DPI)
                  </label>
                  <span className="font-mono text-emerald-400 font-semibold">{fps} FPS</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { label: '1x Normal', val: 1.0 },
                    { label: '1.5x Sharp', val: 1.5 },
                    { label: '2x Retina', val: 2.0 },
                  ].map((res) => (
                    <button
                      key={res.val}
                      onClick={() => updateParam('dpr', res.val)}
                      className={`py-2 rounded-xl border transition ${
                        config.dpr === res.val
                          ? 'bg-white text-neutral-950 font-semibold border-white'
                          : 'bg-neutral-900 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-5">
              {/* Curated Palettes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
                  Curated Metallic Palettes
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {item.colorPalettes.map((pal) => (
                    <button
                      key={pal.name}
                      onClick={() => handleApplyPalette(pal)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left transition group ${
                        config.presetName === pal.name
                          ? 'border-white bg-white/10'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-800/60'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-medium text-neutral-200 block">{pal.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: pal.primary }} />
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: pal.secondary }} />
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: pal.accent }} />
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: pal.bg }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-3">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Custom Tone Channels
                </label>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                    <span className="text-xs font-medium text-neutral-300">Primary Tone</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">{config.primaryColor}</span>
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => updateParam('primaryColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-neutral-700 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                    <span className="text-xs font-medium text-neutral-300">Secondary Tone</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">{config.secondaryColor}</span>
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => updateParam('secondaryColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-neutral-700 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                    <span className="text-xs font-medium text-neutral-300">Accent Specular</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">{config.accentColor}</span>
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateParam('accentColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-neutral-700 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/70 p-3 rounded-xl border border-neutral-800">
                    <span className="text-xs font-medium text-neutral-300">Base Background</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">{config.backgroundColor}</span>
                      <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => updateParam('backgroundColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-neutral-700 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'physics' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800">
                <div>
                  <span className="text-xs font-semibold text-neutral-200 block">Pointer Wave Disturbances</span>
                  <span className="text-[11px] text-neutral-400">Generate hydrodynamic ripples on touch / mouse</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.mouseInteraction}
                  onChange={(e) => updateParam('mouseInteraction', e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {config.mouseInteraction && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300">Ripple Shockwave Force</label>
                      <span className="font-mono text-neutral-400">{(config.mouseForce || 1.2).toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="4.0"
                      step="0.2"
                      value={config.mouseForce || 1.2}
                      onChange={(e) => updateParam('mouseForce', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <label className="font-medium text-neutral-300">Influence Proximity Radius</label>
                      <span className="font-mono text-neutral-400">{config.mouseRadius || 180}px</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="350"
                      step="10"
                      value={config.mouseRadius || 180}
                      onChange={(e) => updateParam('mouseRadius', parseFloat(e.target.value))}
                      className="w-full accent-white h-2 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Save New Preset */}
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2.5">
                <label className="text-xs font-semibold text-neutral-200 block">Save Current Setup</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. My Custom Mercury"
                    value={presetInputName}
                    onChange={(e) => setPresetInputName(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                  <button
                    onClick={handleSaveCustomPreset}
                    disabled={!presetInputName.trim()}
                    className="px-3.5 py-2 bg-white text-neutral-950 rounded-lg text-xs font-semibold hover:bg-neutral-200 transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>

              {/* Saved Presets list */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2 uppercase tracking-wider">
                  Your Saved Variations ({customPresets.length})
                </label>
                {customPresets.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-3 text-center bg-neutral-900/30 rounded-xl border border-neutral-800/40">
                    No custom presets saved yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customPresets.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition group"
                      >
                        <button
                          onClick={() => onChange({ ...p.config, presetName: p.name })}
                          className="text-left flex-1"
                        >
                          <span className="text-xs font-medium text-neutral-200 block group-hover:text-white">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Spd {p.config.speed}x • Dist {p.config.distortion}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeletePreset(idx)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/90 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time GLSL Shader
          </span>
          <span className="font-mono text-neutral-300">{fps} FPS</span>
        </div>
      </aside>
    </>
  );
};

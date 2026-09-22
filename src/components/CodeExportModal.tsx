import React, { useState } from 'react';
import { BackgroundItem, AnimationConfig } from '../types';
import { 
  generateReactComponent, 
  generateVanillaJs, 
  generateTailwindSnippet 
} from '../utils/codeGenerators';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  FileCode, 
  Layers, 
  BookOpen 
} from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BackgroundItem;
  config: AnimationConfig;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  item,
  config,
}) => {
  const [activeTab, setActiveTab] = useState<'react' | 'vanilla' | 'tailwind' | 'docs'>('react');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reactCode = generateReactComponent(item.id, config);
  const vanillaCode = generateVanillaJs(item.id, config);
  const tailwindCode = generateTailwindSnippet(item.id);

  const getActiveCode = () => {
    switch (activeTab) {
      case 'react':
        return reactCode;
      case 'vanilla':
        return vanillaCode;
      case 'tailwind':
        return tailwindCode;
      default:
        return reactCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([vanillaCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}-background.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-neutral-950 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5 text-neutral-900" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                Export {item.title}
              </h2>
              <p className="text-xs text-neutral-400">
                Ready-to-use production code with active tuned parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons & Actions Bar */}
        <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('react')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'react'
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              React (TypeScript)
            </button>
            <button
              onClick={() => setActiveTab('vanilla')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'vanilla'
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Vanilla HTML/JS
            </button>
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'tailwind'
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Tailwind Layout
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Props API
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700/70 hover:bg-neutral-800 text-xs font-medium text-neutral-200 hover:text-white transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download HTML
            </button>

            <button
              id="copy-code-btn"
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition shadow-md flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
            </button>
          </div>
        </div>

        {/* Code Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-950 font-mono text-xs text-neutral-300 custom-scrollbar">
          {activeTab !== 'docs' ? (
            <pre className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 overflow-x-auto text-[11px] leading-relaxed">
              <code>{getActiveCode()}</code>
            </pre>
          ) : (
            <div className="space-y-6 font-sans text-neutral-200">
              <div>
                <h3 className="text-sm font-bold text-white mb-2 font-['Outfit',sans-serif]">
                  Component Configuration & Props
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Pass these optional props into the generated component to override default shader constants dynamically.
                </p>

                <div className="border border-neutral-800 rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-neutral-900/90 p-3 font-semibold text-neutral-300 border-b border-neutral-800">
                    <div>Prop</div>
                    <div>Type</div>
                    <div>Default</div>
                    <div>Description</div>
                  </div>
                  <div className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                    <div className="grid grid-cols-4 p-3 items-center">
                      <span className="text-amber-300">speed</span>
                      <span className="text-neutral-400">number</span>
                      <span className="text-neutral-500">{config.speed}</span>
                      <span className="text-neutral-300 font-sans text-xs">Animation time multiplier</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 items-center">
                      <span className="text-amber-300">distortion</span>
                      <span className="text-neutral-400">number</span>
                      <span className="text-neutral-500">{config.distortion}</span>
                      <span className="text-neutral-300 font-sans text-xs">Turbulence & wave amplitude</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 items-center">
                      <span className="text-amber-300">primaryColor</span>
                      <span className="text-neutral-400">string (hex)</span>
                      <span className="text-neutral-500">{config.primaryColor}</span>
                      <span className="text-neutral-300 font-sans text-xs">Base fluid / metallic color</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 items-center">
                      <span className="text-amber-300">secondaryColor</span>
                      <span className="text-neutral-400">string (hex)</span>
                      <span className="text-neutral-500">{config.secondaryColor}</span>
                      <span className="text-neutral-300 font-sans text-xs">Studio reflection gradient tone</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 items-center">
                      <span className="text-amber-300">accentColor</span>
                      <span className="text-neutral-400">string (hex)</span>
                      <span className="text-neutral-500">{config.accentColor}</span>
                      <span className="text-neutral-300 font-sans text-xs">Specular key light and pings</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 items-center">
                      <span className="text-amber-300">mouseInteraction</span>
                      <span className="text-neutral-400">boolean</span>
                      <span className="text-neutral-500">{config.mouseInteraction ? 'true' : 'false'}</span>
                      <span className="text-neutral-300 font-sans text-xs">Enable pointer wave disturbances</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Performance Tips</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  • Shaders automatically throttle to canvas bounding client rect and disconnect on unmount.<br />
                  • For battery savings on mobile, keep DPR at 1x to 1.5x.<br />
                  • All WebGL context calls are wrapped with high-performance flags.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-500 px-6">
          <span>Production Ready • Works with Next.js App Router, Vite, Astro, Remix</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

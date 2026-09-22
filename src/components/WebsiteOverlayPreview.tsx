import React from 'react';
import { OverlayMode, BackgroundItem } from '../types';
import { 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Lock, 
  Mail, 
  ArrowRight, 
  Check, 
  Github, 
  Globe,
  Terminal,
  Cpu
} from 'lucide-react';

interface WebsiteOverlayPreviewProps {
  mode: OverlayMode;
  item: BackgroundItem;
  onSelectOverlay: (mode: OverlayMode) => void;
}

export const WebsiteOverlayPreview: React.FC<WebsiteOverlayPreviewProps> = ({
  mode,
  item,
  onSelectOverlay,
}) => {
  if (mode === 'none') {
    return (
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        <div className="px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-700/60 backdrop-blur-md text-xs text-neutral-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Naked Background Mode • Drag & move cursor to interact</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-y-auto custom-scrollbar flex flex-col justify-between">
      {/* SaaS Hero Overlay */}
      {mode === 'saas-hero' && (
        <div className="w-full min-h-full flex flex-col justify-between p-6 md:p-12">
          {/* Glass Navbar */}
          <nav className="w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl bg-neutral-950/40 border border-white/10 backdrop-blur-xl shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-white to-neutral-400 flex items-center justify-center text-neutral-950 font-bold text-sm shadow-md">
                A
              </div>
              <span className="font-['Outfit',sans-serif] font-bold text-base tracking-tight text-white">
                Aether<span className="text-neutral-400 font-light">Motion</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#shaders" className="hover:text-white transition">Shaders</a>
              <a href="#showcase" className="hover:text-white transition">Showcase</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white transition">
                Sign In
              </button>
              <button className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition shadow-md shadow-white/10">
                Get Started
              </button>
            </div>
          </nav>

          {/* Hero Centerpiece */}
          <div className="w-full max-w-4xl mx-auto text-center my-auto py-12 px-4 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs font-medium text-neutral-200 mb-6 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Generation Visual Shaders & Backgrounds</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif] leading-[1.08] mb-6">
              Atmospheric Web{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500">
                Experiences
              </span>
            </h1>

            <p className="text-base md:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              Elevate conversion rates and user immersion with mathematical GPU-accelerated liquid metal shaders, responsive particle networks, and organic silk flows.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="px-7 py-3.5 rounded-xl bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-200 transition shadow-xl shadow-white/15 flex items-center gap-2">
                Start Building Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-7 py-3.5 rounded-xl border border-white/20 bg-neutral-900/60 backdrop-blur-md text-white font-medium text-sm hover:bg-neutral-800/80 transition flex items-center gap-2">
                <Github className="w-4 h-4 text-neutral-400" />
                View Repository
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 max-w-xl mx-auto mt-12 pt-8 border-t border-white/10 text-center gap-4">
              <div>
                <span className="block text-2xl font-bold text-white font-mono">60 FPS</span>
                <span className="text-xs text-neutral-400">Zero Main-thread Lag</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-mono">&lt; 12 KB</span>
                <span className="text-xs text-neutral-400">Self-Contained Bundle</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-mono">100%</span>
                <span className="text-xs text-neutral-400">WebGL & Canvas Pure</span>
              </div>
            </div>
          </div>

          {/* Footer banner */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-xs text-neutral-400 pointer-events-auto py-3">
            <span>Powered by WebGL 2 & GLSL Fragment Shaders</span>
            <div className="flex items-center gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Docs</span>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Portfolio Agency Overlay */}
      {mode === 'agency-portfolio' && (
        <div className="w-full min-h-full flex flex-col justify-between p-6 md:p-14 pointer-events-auto">
          <header className="flex justify-between items-center">
            <span className="text-xs font-mono tracking-widest uppercase text-neutral-300">
              STUDIO KROMATIC // 2026
            </span>
            <span className="text-xs font-mono text-neutral-400">TOKYO • BERLIN • SAN FRANCISCO</span>
          </header>

          <main className="my-auto max-w-5xl">
            <span className="text-xs font-mono text-amber-400 tracking-wider uppercase block mb-3">
              CREATIVE DIRECTION & COMPUTATIONAL DESIGN
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase font-['Outfit',sans-serif] leading-none mb-6">
              Sculpting<br />
              <span className="italic font-serif font-normal text-neutral-300">Digital</span> Matter
            </h1>
            <p className="text-sm md:text-base text-neutral-300 max-w-xl leading-relaxed mb-8">
              We craft boundary-pushing interactive brand identities and generative motion experiences for forward-looking tech luminaries.
            </p>

            <div className="flex items-center gap-6">
              <button className="px-6 py-3 rounded-full bg-white text-neutral-950 text-xs font-bold tracking-wider uppercase hover:bg-neutral-200 transition flex items-center gap-2">
                Explore Selected Works
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-neutral-400 underline cursor-pointer">
                DOWNLOAD MANIFESTO [PDF]
              </span>
            </div>
          </main>

          <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs font-mono text-neutral-400">
            <div>01 // ARCHITECTURAL VISUALS</div>
            <div>02 // GPU SHADER RESEARCH</div>
            <div>03 // GENERATIVE CAMPAIGNS</div>
          </footer>
        </div>
      )}

      {/* Auth Card Overlay */}
      {mode === 'auth-card' && (
        <div className="w-full min-h-full flex items-center justify-center p-6 pointer-events-auto">
          <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-950/60 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white text-neutral-950 font-bold flex items-center justify-center mx-auto mb-2 text-sm shadow-lg">
                <Lock className="w-5 h-5 text-neutral-900" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white font-['Outfit',sans-serif]">
                Welcome Back
              </h2>
              <p className="text-xs text-neutral-400">Enter your credentials to access your workspace</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="alex@enterprise.com"
                    className="w-full bg-neutral-900/80 border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-neutral-300">Password</label>
                  <a href="#" className="text-[11px] text-neutral-400 hover:text-white transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-900/80 border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 transition shadow-lg shadow-white/10">
                Sign In to Console
              </button>
            </div>

            <div className="pt-2 text-center text-xs text-neutral-400">
              Don't have an account?{' '}
              <a href="#" className="text-white font-medium hover:underline">Create an account</a>
            </div>
          </div>
        </div>
      )}

      {/* Feature Bento Grid Overlay */}
      {mode === 'feature-bento' && (
        <div className="w-full min-h-full flex flex-col justify-center p-6 md:p-12 max-w-6xl mx-auto pointer-events-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block mb-2">
              ENGINEERED FOR MODERN PERFORMANCE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white font-['Outfit',sans-serif]">
              Architectural Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-neutral-950/50 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Runtime Dependencies</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Self-contained GLSL fragment shaders compiled directly onto GPU raster quad buffers with native WebGL.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950/50 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Full React & Next.js Hooks</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Plug-and-play TypeScript components with automatic DPR throttling, ResizeObserver, and visibility cleanup.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950/50 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Pointer Wave Hydrodynamics</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Interactive mouse and touch wave propagation with responsive elastic shockwaves and Fresnel edge pings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tier Overlay */}
      {mode === 'pricing-tier' && (
        <div className="w-full min-h-full flex flex-col justify-center p-6 md:p-12 max-w-5xl mx-auto pointer-events-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white font-['Outfit',sans-serif] mb-3">
              Transparent Pricing Plans
            </h2>
            <p className="text-sm text-neutral-300">Choose the license that fits your production rollout</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-6 rounded-2xl bg-neutral-950/50 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Indie Dev</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-4">For personal portfolios & experiments</p>
                <div className="text-3xl font-bold text-white mb-6 font-mono">$0 <span className="text-xs font-normal text-neutral-400">/ forever</span></div>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 12 Full Background Animations</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> React & Vanilla Code Export</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> MIT Open Source License</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-2.5 rounded-xl border border-white/20 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition">
                Start Free
              </button>
            </div>

            {/* Pro Featured */}
            <div className="p-6 rounded-2xl bg-neutral-900/80 border-2 border-white/40 backdrop-blur-2xl flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-neutral-950 text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Commercial Pro</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-4">For client projects & SaaS businesses</p>
                <div className="text-3xl font-bold text-white mb-6 font-mono">$49 <span className="text-xs font-normal text-neutral-400">/ one-time</span></div>
                <ul className="space-y-2.5 text-xs text-neutral-200">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Commercial Projects</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 4K Ultra Retina Preset Pack</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Custom Shader Generation Tools</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Priority Support</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition shadow-lg shadow-white/15">
                Get Commercial License
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl bg-neutral-950/50 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise Scale</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-4">For large teams and global design systems</p>
                <div className="text-3xl font-bold text-white mb-6 font-mono">$199 <span className="text-xs font-normal text-neutral-400">/ team</span></div>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Figma Token Sync & Plugins</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Bespoke Custom Shader Development</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Technical SLA</li>
                </ul>
              </div>
              <button className="mt-8 w-full py-2.5 rounded-xl border border-white/20 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BackgroundItem, AnimationConfig, OverlayMode, AppView } from './types';
import { BACKGROUND_ITEMS } from './data/presets';
import { FullShowcaseMainPage } from './components/FullShowcaseMainPage';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { SidebarControls } from './components/SidebarControls';
import { WebsiteOverlayPreview } from './components/WebsiteOverlayPreview';
import { HeaderNav } from './components/HeaderNav';
import { PresetGallery } from './components/PresetGallery';
import { CodeExportModal } from './components/CodeExportModal';
import { SnapshotModal } from './components/SnapshotModal';

export default function App() {
  // Navigation View: 'hub' (all animation scrollable showcase on one main page) or 'detail' (interactive full studio)
  const [currentView, setCurrentView] = useState<AppView>('hub');

  // Selected animation item (defaulting to Liquid Metal Chrome)
  const [currentItem, setCurrentItem] = useState<BackgroundItem>(() => BACKGROUND_ITEMS[0]);
  const [config, setConfig] = useState<AnimationConfig>(() => ({ ...BACKGROUND_ITEMS[0].defaultConfig }));

  // Website Overlay Mode (SaaS Hero by default in studio view)
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('saas-hero');

  // Drawers and Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Performance State
  const [fps, setFps] = useState<number>(60);
  const canvasRefInstance = useRef<HTMLCanvasElement | null>(null);

  // Switch animation archetype & open Studio
  const handleOpenStudio = useCallback((item: BackgroundItem, customConfig?: AnimationConfig) => {
    setCurrentItem(item);
    setConfig(customConfig ? { ...customConfig } : { ...item.defaultConfig });
    setCurrentView('detail');
  }, []);

  // Quick code export
  const handleOpenCodeExport = useCallback((item: BackgroundItem, customConfig?: AnimationConfig) => {
    setCurrentItem(item);
    setConfig(customConfig ? { ...customConfig } : { ...item.defaultConfig });
    setIsCodeModalOpen(true);
  }, []);

  // Open Snapshot
  const handleOpenSnapshot = useCallback((item: BackgroundItem) => {
    setCurrentItem(item);
    setIsSnapshotModalOpen(true);
  }, []);

  // Reset current animation to factory default
  const handleReset = useCallback(() => {
    setConfig({ ...currentItem.defaultConfig });
  }, [currentItem]);

  // Keyboard shortcut navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'g' || e.key === 'G') {
        setIsGalleryOpen((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsCodeModalOpen((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        if (currentView === 'detail') {
          setIsSidebarOpen((prev) => !prev);
        }
      } else if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') {
        if (isCodeModalOpen || isGalleryOpen || isSnapshotModalOpen) {
          setIsCodeModalOpen(false);
          setIsGalleryOpen(false);
          setIsSnapshotModalOpen(false);
        } else if (currentView === 'detail') {
          setCurrentView('hub');
        }
      } else if (e.key === ' ' && currentView === 'detail' && !isCodeModalOpen && !isGalleryOpen) {
        e.preventDefault();
        setOverlayMode((prev) => (prev === 'none' ? 'saas-hero' : 'none'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, isCodeModalOpen, isGalleryOpen, isSnapshotModalOpen]);

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 font-['Plus_Jakarta_Sans',sans-serif] text-neutral-100">
      {/* 1. All-In-One Main Page Showcase (All 12 background animations live on one page) */}
      {currentView === 'hub' ? (
        <FullShowcaseMainPage
          onOpenStudio={handleOpenStudio}
          onOpenCodeExport={handleOpenCodeExport}
          onOpenSnapshot={handleOpenSnapshot}
        />
      ) : (
        /* 2. Dedicated Interactive Animation Studio Page */
        <div className="relative w-screen h-screen overflow-hidden">
          {/* Top Bar Navigation */}
          <HeaderNav
            currentItem={currentItem}
            onSelectAnimation={(item) => handleOpenStudio(item)}
            overlayMode={overlayMode}
            onSelectOverlay={setOverlayMode}
            onOpenCodeExport={() => setIsCodeModalOpen(true)}
            onOpenSnapshot={() => setIsSnapshotModalOpen(true)}
            onOpenGallery={() => setIsGalleryOpen(true)}
            onBackToHub={() => setCurrentView('hub')}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            isSidebarOpen={isSidebarOpen}
            fps={fps}
          />

          {/* Canvas Viewport */}
          <main className="relative w-full h-full">
            {/* Realtime WebGL / Canvas Engine */}
            <BackgroundRenderer
              type={currentItem.id}
              config={config}
              onFpsUpdate={setFps}
              canvasRefCallback={(canvas) => {
                canvasRefInstance.current = canvas;
              }}
            />

            {/* Live Website Mockup Overlay */}
            <WebsiteOverlayPreview
              mode={overlayMode}
              item={currentItem}
              onSelectOverlay={setOverlayMode}
            />
          </main>

          {/* Interactive Responsive Controls Drawer */}
          <SidebarControls
            item={currentItem}
            config={config}
            onChange={setConfig}
            onReset={handleReset}
            fps={fps}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((prev) => !prev)}
          />

          {/* Floating Bottom Hotkey Helper for Desktop */}
          <div className="fixed bottom-4 left-6 z-30 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 backdrop-blur-md text-[11px] text-neutral-400 pointer-events-none">
            <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[10px]">H</kbd> hub</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[10px]">Space</kbd> toggle overlay</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-[10px]">C</kbd> controls</span>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <PresetGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentItem={currentItem}
        onSelect={(item) => handleOpenStudio(item)}
      />

      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        item={currentItem}
        config={config}
      />

      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        canvas={canvasRefInstance.current}
        item={currentItem}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { BackgroundItem } from '../types';
import { X, Download, Camera, Check } from 'lucide-react';

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: HTMLCanvasElement | null;
  item: BackgroundItem;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  isOpen,
  onClose,
  canvas,
  item,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (isOpen && canvas) {
      try {
        const url = canvas.toDataURL('image/png');
        setDataUrl(url);
      } catch (err) {
        console.error('Failed to capture canvas frame', err);
      }
    }
  }, [isOpen, canvas]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${item.id}-snapshot-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-neutral-950">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                Captured Frame Snapshot
              </h2>
              <p className="text-xs text-neutral-400">High-resolution PNG from current render</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {dataUrl ? (
            <div className="w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900 mb-6">
              <img src={dataUrl} alt="Animation snapshot" className="w-full h-auto object-contain max-h-80" />
            </div>
          ) : (
            <div className="py-16 text-neutral-500 text-xs">Capturing frame...</div>
          )}

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleDownload}
              disabled={!dataUrl}
              className="flex-1 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition shadow-lg flex items-center justify-center gap-2"
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'Saved to Downloads!' : 'Download High-Res PNG'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

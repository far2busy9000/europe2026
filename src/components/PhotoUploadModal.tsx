import React, { useState } from 'react';
import { Camera, UploadCloud, CheckCircle2, ShieldCheck, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { TripData, WaypointPhoto } from '../types';
import { compressImageFile, formatBytes, CompressedImageResult } from '../utils/imageCompressor';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  targetItemId?: string;
  onSavePhoto: (photo: WaypointPhoto, targetItemId?: string) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  trip,
  targetItemId,
  onSavePhoto
}) => {
  const targetItem = targetItemId ? trip.items.find(i => i.id === targetItemId) : undefined;
  
  const [caption, setCaption] = useState(targetItem ? `Visiting ${targetItem.title}` : '');
  const [locationName, setLocationName] = useState(targetItem?.locationName || 'Italy');
  const [author, setAuthor] = useState(trip.members[0]?.name || 'Anthony');
  const [imageUrl, setImageUrl] = useState('');
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [compressStats, setCompressStats] = useState<CompressedImageResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  if (!isOpen) return null;

  const processImageFile = async (file: File) => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const result = await compressImageFile(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82
      });
      setPreviewFile(result.dataUrl);
      setCompressStats(result);
    } catch (err) {
      console.error('File compression error:', err);
      alert('Could not process this image file. Please try another.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processImageFile(file);
    }
  };

  const handleSave = () => {
    const finalUrl = previewFile || imageUrl;
    if (!finalUrl) {
      alert('Please select a photo file or provide an image URL.');
      return;
    }

    const newPhoto: WaypointPhoto = {
      id: `photo-${Date.now()}`,
      url: finalUrl,
      caption: caption.trim() || (targetItem ? targetItem.title : 'European Summer Memory'),
      takenAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      author,
      locationName: locationName.trim() || 'Italy'
    };

    onSavePhoto(newPhoto, targetItemId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A535C]/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-base font-black font-display text-[#1A535C] dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#FF6B6B]" />
              <span>{targetItem ? `Add Photo to "${targetItem.title}"` : 'Upload Travel Memory'}</span>
            </h4>
            {targetItem && (
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Stop #{trip.items.findIndex(i => i.id === targetItemId) + 1} • {targetItem.destinationCity}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#FF6B6B] text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Zero cost & original safety guarantee */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>100% Free & Safe:</strong> Photos are automatically compressed in your browser before saving. Your original high-resolution photo remains unaltered on your phone.
          </div>
        </div>

        {/* Upload options */}
        <div className="space-y-3">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="relative border-2 border-dashed border-[#FFE66D] dark:border-slate-700 hover:border-[#FF6B6B] dark:hover:border-[#FF6B6B] rounded-2xl p-4 text-center transition-colors bg-[#FFF9F2]/50 dark:bg-slate-800/40 cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              <UploadCloud className="w-8 h-8 text-[#FF6B6B]" />
              <p className="text-xs font-bold text-[#1A535C] dark:text-white">
                {isCompressing ? 'Optimizing photo in browser...' : 'Tap to select photo from phone / camera'}
              </p>
              <p className="text-[10px] text-slate-400">
                Any size photo accepted • Auto-compressed for fast offline saving
              </p>
            </div>
          </div>

          {/* Compression stats banner */}
          {compressStats && (
            <div className="p-3 rounded-2xl bg-[#4ECDC4]/15 dark:bg-[#4ECDC4]/20 border border-[#4ECDC4]/40 flex items-center justify-between text-xs text-[#1A535C] dark:text-[#4ECDC4]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4ECDC4] flex-shrink-0" />
                <div>
                  <span className="font-black">Optimized: </span>
                  <span className="line-through text-slate-400 mr-1">{formatBytes(compressStats.originalSizeBytes)}</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">➔ {formatBytes(compressStats.compressedSizeBytes)}</span>
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    {compressStats.savedPercent}% saved
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-[10px] text-[#2D3436]/50 dark:text-slate-400 font-black uppercase tracking-wider">
            — OR PASTE IMAGE URL —
          </div>

          <div>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={e => {
                setImageUrl(e.target.value);
                if (e.target.value) setCompressStats(null);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
            />
          </div>

          {previewFile && (
            <div className="aspect-video rounded-xl overflow-hidden border-2 border-[#FFE66D] relative shadow-inner">
              <img src={previewFile} alt="Preview" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                Optimized Preview
              </span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#1A535C] dark:text-slate-300 block mb-1">
              Polaroid Caption / Memory Note:
            </label>
            <input
              type="text"
              placeholder="e.g. Best view of the Colosseum at sunset!"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-[#1A535C] dark:text-slate-300 block mb-1">
                Location:
              </label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1A535C] dark:text-slate-300 block mb-1">
                Captured By:
              </label>
              <select
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-semibold"
              >
                {trip.members.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isCompressing || (!previewFile && !imageUrl)}
            className="px-4 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] disabled:opacity-50 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save Photo</span>
          </button>
        </div>

      </div>
    </div>
  );
};

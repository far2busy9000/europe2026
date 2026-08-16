import React, { useState } from 'react';
import { Camera, Plus, MapPin, Sparkles, User, Trash2, CheckCircle2, ShieldCheck, UploadCloud, X, ZoomIn } from 'lucide-react';
import { TripData, WaypointPhoto } from '../types';
import { compressImageFile, formatBytes, CompressedImageResult } from '../utils/imageCompressor';

interface TravelJournalGalleryProps {
  trip: TripData;
  onAddPhoto: (photo: WaypointPhoto) => void;
  onDeletePhoto: (id: string) => void;
}

export const TravelJournalGallery: React.FC<TravelJournalGalleryProps> = ({
  trip,
  onAddPhoto,
  onDeletePhoto
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [locationName, setLocationName] = useState('Rome');
  const [author, setAuthor] = useState(trip.members[0]?.name || 'Anthony');
  const [imageUrl, setImageUrl] = useState('');
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [compressStats, setCompressStats] = useState<CompressedImageResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedViewingPhoto, setSelectedViewingPhoto] = useState<WaypointPhoto | null>(null);

  // Aggregate all photos from trip + items
  const allPhotos: WaypointPhoto[] = [...(trip.allPhotos || [])];
  trip.items.forEach(it => {
    if (it.photos) {
      it.photos.forEach(p => {
        if (!allPhotos.some(ap => ap.id === p.id)) {
          allPhotos.push(p);
        }
      });
    }
  });

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

  const handleSavePhoto = () => {
    const finalUrl = previewFile || imageUrl;
    if (!finalUrl) {
      alert('Please select an image file or provide an image URL.');
      return;
    }

    const newPhoto: WaypointPhoto = {
      id: `photo-${Date.now()}`,
      url: finalUrl,
      caption: caption.trim() || 'European Summer Memory',
      takenAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      author,
      locationName: locationName.trim() || 'Italy'
    };

    onAddPhoto(newPhoto);
    setShowUploadModal(false);
    setCaption('');
    setImageUrl('');
    setPreviewFile(null);
    setCompressStats(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 dark:bg-[#1A282F]/85 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-[#FFE66D]/70 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-display text-[#1A535C] dark:text-white">
                Family Visual Travel Journal ({allPhotos.length} Memories)
              </h3>
              <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 font-medium">
                Snapshots, seaside polaroids, and sunset memories across Italy & French Riviera.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setCompressStats(null);
            setPreviewFile(null);
            setShowUploadModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black shadow-sm shadow-[#FF6B6B]/30 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Memory</span>
        </button>
      </div>

      {/* Polaroid Grid */}
      {allPhotos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-[#FFE66D] dark:border-slate-800">
          <span className="text-5xl">📷</span>
          <h4 className="text-base font-black text-[#1A535C] dark:text-slate-200 mt-3">
            No holiday photos logged yet
          </h4>
          <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
            Upload your first gelato moment, sunset view, or beach snapshot to start the family album.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-black hover:bg-[#E85A5A] cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => setSelectedViewingPhoto(photo)}
              className="bg-white dark:bg-[#1A282F] rounded-2xl p-3.5 pb-5 shadow-md hover:shadow-xl border border-[#FFE66D]/80 dark:border-slate-800 transition-all hover:-translate-y-1 group cursor-pointer"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[#FFE66D]/40">
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Location Tag */}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#1A535C]/85 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                  <MapPin className="w-3 h-3 text-[#FFE66D]" />
                  <span>{photo.locationName}</span>
                </div>

                {/* Zoom hover indicator */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="p-2 rounded-full bg-white/90 text-[#1A535C] shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove photo "${photo.caption}"?`)) {
                      onDeletePhoto(photo.id);
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-[#FF6B6B] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Caption & Details */}
              <div className="mt-3.5 px-1 space-y-1">
                <p className="font-serif italic text-lg text-[#1A535C] dark:text-slate-100 leading-snug">
                  "{photo.caption}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#FFE66D]/40 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-bold text-[#1A535C] dark:text-slate-300">
                    <User className="w-3 h-3 text-[#FF6B6B]" /> {photo.author}
                  </span>
                  <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 font-medium">{photo.takenAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedViewingPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedViewingPhoto(null)}
        >
          <div 
            className="max-w-3xl w-full bg-white dark:bg-[#1A282F] rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                <span className="font-bold text-sm text-[#1A535C] dark:text-white">
                  {selectedViewingPhoto.locationName}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {selectedViewingPhoto.takenAt}</span>
              </div>
              <button 
                onClick={() => setSelectedViewingPhoto(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#1A535C] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img 
                src={selectedViewingPhoto.url} 
                alt={selectedViewingPhoto.caption}
                className="max-h-[65vh] w-auto object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="font-serif italic text-base sm:text-lg text-[#1A535C] dark:text-slate-200">
                "{selectedViewingPhoto.caption}"
              </p>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFE66D]/40 text-[#1A535C] dark:text-[#FFE66D]">
                Photo by {selectedViewingPhoto.author}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Memory Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A535C]/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-black font-display text-[#1A535C] dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FF6B6B]" />
                <span>Upload Travel Memory</span>
              </h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-[#FF6B6B] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Zero cost & original safety notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>100% Free & Safe:</strong> Photos are automatically compressed on your device before saving. Your original high-resolution photo remains unaltered on your phone's camera roll.
              </div>
            </div>

            {/* File upload or URL */}
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
                    {isCompressing ? 'Optimizing photo in browser...' : 'Click to browse or drop phone photo here'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports any size photo (JPG, PNG, HEIC/WebP) • Auto-optimized
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
                — OR ENTER WEB IMAGE URL —
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
                    Compressed Preview
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#1A535C] dark:text-slate-300 block mb-1">
                  Polaroid Handwritten Caption:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best pistachio gelato in Trastevere!"
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
                    Taken By:
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
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhoto}
                disabled={isCompressing || (!previewFile && !imageUrl)}
                className="px-4 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] disabled:opacity-50 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pin to Journal</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


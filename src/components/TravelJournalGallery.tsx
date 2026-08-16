import React, { useState } from 'react';
import { Camera, Plus, MapPin, Sparkles, User, Trash2, CheckCircle2, ShieldCheck, UploadCloud, X, ZoomIn, Filter, Calendar, Heart } from 'lucide-react';
import { TripData, WaypointPhoto } from '../types';
import { compressImageFile, formatBytes, CompressedImageResult } from '../utils/imageCompressor';
import { PolaroidLightboxModal } from './PolaroidLightboxModal';

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
  
  // Filtering states
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState<string>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');

  // Viewing lightbox photo
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

  // Filtered photos
  const filteredPhotos = allPhotos.filter(p => {
    if (selectedAuthorFilter !== 'all' && p.author !== selectedAuthorFilter) return false;
    if (selectedCityFilter !== 'all' && !p.locationName?.toLowerCase().includes(selectedCityFilter.toLowerCase())) return false;
    return true;
  });

  // Unique cities
  const uniqueCities = Array.from(new Set(allPhotos.map(p => p.locationName).filter(Boolean)));

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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-[#1A282F]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-[#FFE66D]/70 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white shadow-md shadow-[#FF6B6B]/20 flex-shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-display text-[#1A535C] dark:text-white">
              Family Travel Journal & Polaroid Album ({allPhotos.length} Memories)
            </h3>
            <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 font-medium">
              Click any Polaroid to view full size, read handwritten captions, or download to your phone.
            </p>
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

      {/* Filter Bar */}
      {allPhotos.length > 0 && (
        <div className="bg-white/80 dark:bg-[#1A282F]/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#FF6B6B]" /> Filter:
            </span>

            <button
              onClick={() => setSelectedAuthorFilter('all')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedAuthorFilter === 'all'
                  ? 'bg-[#1A535C] text-[#FFE66D]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Members
            </button>

            {trip.members.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedAuthorFilter(selectedAuthorFilter === member.name ? 'all' : member.name)}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  selectedAuthorFilter === member.name
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{member.avatarEmoji}</span>
                <span>{member.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {uniqueCities.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-bold">City:</span>
              <select
                value={selectedCityFilter}
                onChange={e => setSelectedCityFilter(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="all">All Locations</option>
                {uniqueCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Polaroid Corkboard Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-[#FFE66D] dark:border-slate-800">
          <span className="text-5xl">📷</span>
          <h4 className="text-base font-black text-[#1A535C] dark:text-slate-200 mt-3">
            {allPhotos.length === 0 ? 'No holiday memories uploaded yet' : 'No photos match this filter'}
          </h4>
          <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
            {allPhotos.length === 0
              ? 'Upload your first gelato moment, sunset view, or beach snapshot to start the family album.'
              : 'Try clearing the filters to view all trip photos.'}
          </p>
          <button
            onClick={() => {
              if (allPhotos.length === 0) setShowUploadModal(true);
              else {
                setSelectedAuthorFilter('all');
                setSelectedCityFilter('all');
              }
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-black hover:bg-[#E85A5A] cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{allPhotos.length === 0 ? 'Upload Memory' : 'Reset Filters'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredPhotos.map((photo, idx) => {
            // Subtle alternating rotation for realistic polaroid scrapbook feel
            const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
            const rot = rotations[idx % rotations.length];

            return (
              <div 
                key={photo.id}
                onClick={() => setSelectedViewingPhoto(photo)}
                className={`bg-[#FFFDF9] dark:bg-[#1E293B] rounded-2xl p-3 sm:p-4 pb-5 shadow-md hover:shadow-2xl border-4 border-white dark:border-slate-800 transition-all duration-300 hover:scale-[1.03] hover:z-20 group cursor-pointer ${rot}`}
              >
                {/* Washi Tape Header */}
                <div className="flex justify-center -mt-6 mb-2">
                  <div className="w-20 h-5 bg-[#FFE66D]/80 backdrop-blur-xs rounded-xs shadow-xs -rotate-1 border border-amber-300/60" />
                </div>

                {/* Photo Canvas */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Location Tag */}
                  {photo.locationName && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                      <MapPin className="w-3 h-3 text-[#FFE66D]" />
                      <span>{photo.locationName}</span>
                    </div>
                  )}

                  {/* Zoom Hover Indicator */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/95 text-[#1A535C] shadow-lg font-bold text-xs flex items-center gap-1">
                      <ZoomIn className="w-4 h-4 text-[#FF6B6B]" />
                      <span>View Full Size</span>
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

                {/* Polaroid Handwritten Caption */}
                <div className="mt-3.5 px-1 space-y-1.5">
                  <p 
                    className="text-lg sm:text-xl text-[#1A535C] dark:text-[#FFE66D] font-bold leading-tight line-clamp-2"
                    style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT', sans-serif" }}
                  >
                    "{photo.caption || 'Summer Memory'}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1 font-bold text-[#FF6B6B] dark:text-[#FFA8A8]">
                      <User className="w-3 h-3" /> {photo.author}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{photo.takenAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reusable Polaroid Lightbox Modal */}
      <PolaroidLightboxModal
        isOpen={Boolean(selectedViewingPhoto)}
        onClose={() => setSelectedViewingPhoto(null)}
        photo={selectedViewingPhoto}
        allPhotos={filteredPhotos}
        onSelectPhoto={setSelectedViewingPhoto}
        onDeletePhoto={onDeletePhoto}
      />

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
                    {isCompressing ? 'Optimizing photo in browser...' : 'Tap to select photo from phone / camera'}
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

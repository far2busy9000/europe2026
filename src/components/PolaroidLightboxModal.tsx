import React, { useEffect } from 'react';
import { X, MapPin, User, Calendar, Download, Trash2, ChevronLeft, ChevronRight, Sparkles, Tag } from 'lucide-react';
import { WaypointPhoto } from '../types';

interface PolaroidLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: WaypointPhoto | null;
  allPhotos?: WaypointPhoto[];
  onSelectPhoto?: (photo: WaypointPhoto) => void;
  onDeletePhoto?: (photoId: string) => void;
}

export const PolaroidLightboxModal: React.FC<PolaroidLightboxModalProps> = ({
  isOpen,
  onClose,
  photo,
  allPhotos = [],
  onSelectPhoto,
  onDeletePhoto
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && allPhotos.length > 1 && onSelectPhoto) {
        const idx = allPhotos.findIndex(p => p.id === photo.id);
        if (idx > 0) onSelectPhoto(allPhotos[idx - 1]);
        else if (idx === 0) onSelectPhoto(allPhotos[allPhotos.length - 1]);
      }
      if (e.key === 'ArrowRight' && allPhotos.length > 1 && onSelectPhoto) {
        const idx = allPhotos.findIndex(p => p.id === photo.id);
        if (idx >= 0 && idx < allPhotos.length - 1) onSelectPhoto(allPhotos[idx + 1]);
        else if (idx === allPhotos.length - 1) onSelectPhoto(allPhotos[0]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photo, allPhotos, onClose, onSelectPhoto]);

  if (!isOpen || !photo) return null;

  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const hasMultiple = allPhotos.length > 1 && onSelectPhoto;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectPhoto) return;
    if (currentIndex > 0) {
      onSelectPhoto(allPhotos[currentIndex - 1]);
    } else {
      onSelectPhoto(allPhotos[allPhotos.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectPhoto) return;
    if (currentIndex < allPhotos.length - 1) {
      onSelectPhoto(allPhotos[currentIndex + 1]);
    } else {
      onSelectPhoto(allPhotos[0]);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `europe2026-${(photo.caption || 'memory').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer z-50 shadow-lg hover:scale-110"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer z-50 shadow-lg hover:scale-110"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-50">
        {hasMultiple && (
          <span className="text-white/80 text-xs font-black px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md">
            {currentIndex + 1} / {allPhotos.length}
          </span>
        )}

        <button
          onClick={handleDownload}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-md"
          title="Download original photo to device"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Save Photo</span>
        </button>

        {onDeletePhoto && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete memory "${photo.caption}" from the trip album?`)) {
                onDeletePhoto(photo.id);
                onClose();
              }
            }}
            className="p-2 rounded-xl bg-red-500/30 hover:bg-red-500/60 text-red-200 hover:text-white backdrop-blur-md transition-all cursor-pointer"
            title="Delete Photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Authentic Polaroid Frame Card */}
      <div 
        className="max-w-xl sm:max-w-2xl w-full bg-[#FFFDF9] dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl p-3 sm:p-5 pt-4 sm:pt-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 sm:border-8 border-white dark:border-slate-800 space-y-3 sm:space-y-4 max-h-[92vh] flex flex-col justify-between transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Decorative Tape Strip */}
        <div className="flex justify-center -mt-6 sm:-mt-8 mb-1">
          <div className="w-24 sm:w-32 h-6 sm:h-7 bg-[#FFE66D]/80 backdrop-blur-xs rounded-xs shadow-xs -rotate-2 border border-amber-300/60 flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-[#1A535C]/70">
              EUROPE 2026
            </span>
          </div>
        </div>

        {/* Main Photo Canvas */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center flex-1 max-h-[62vh] sm:max-h-[66vh] border border-slate-200 dark:border-slate-700 shadow-inner">
          <img 
            src={photo.url} 
            alt={photo.caption} 
            className="max-h-[62vh] sm:max-h-[66vh] w-auto max-w-full object-contain mx-auto"
            referrerPolicy="no-referrer"
          />

          {/* Location Badge on Photo */}
          {photo.locationName && (
            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-black flex items-center gap-1.5 border border-white/20 shadow-md">
              <MapPin className="w-3.5 h-3.5 text-[#FFE66D]" />
              <span>{photo.locationName}</span>
            </div>
          )}
        </div>

        {/* Polaroid Bottom Chin - Handwritten Caption & Signature */}
        <div className="pt-2 sm:pt-3 pb-1 px-2 space-y-2 border-t border-slate-200/60 dark:border-slate-700/60">
          {/* Handwritten Caption */}
          <div className="flex items-start justify-between gap-3">
            <p 
              className="text-xl sm:text-2xl md:text-3xl text-[#1A535C] dark:text-[#FFE66D] font-bold leading-tight"
              style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT', sans-serif" }}
            >
              "{photo.caption || 'Unforgettable Summer Moment'}"
            </p>
          </div>

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-bold text-[#FF6B6B] dark:text-[#FFA8A8] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-md">
                <User className="w-3.5 h-3.5" />
                <span>Captured by {photo.author || 'Family'}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              {photo.takenAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#4ECDC4]" />
                  <span>{photo.takenAt}</span>
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

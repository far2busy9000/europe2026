import React, { useEffect, useState } from 'react';
import { X, MapPin, User, Calendar, Download, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Reset confirmation whenever photo changes
  useEffect(() => {
    setShowConfirmDelete(false);
  }, [photo?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !photo) return;
      if (e.key === 'Escape') {
        if (showConfirmDelete) {
          setShowConfirmDelete(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowLeft' && allPhotos.length > 1 && onSelectPhoto && !showConfirmDelete) {
        const idx = allPhotos.findIndex(p => p.id === photo.id);
        if (idx > 0) onSelectPhoto(allPhotos[idx - 1]);
        else if (idx === 0) onSelectPhoto(allPhotos[allPhotos.length - 1]);
      }
      if (e.key === 'ArrowRight' && allPhotos.length > 1 && onSelectPhoto && !showConfirmDelete) {
        const idx = allPhotos.findIndex(p => p.id === photo.id);
        if (idx >= 0 && idx < allPhotos.length - 1) onSelectPhoto(allPhotos[idx + 1]);
        else if (idx === allPhotos.length - 1) onSelectPhoto(allPhotos[0]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photo, allPhotos, onClose, onSelectPhoto, showConfirmDelete]);

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

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeletePhoto && photo) {
      onDeletePhoto(photo.id);
      setShowConfirmDelete(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-fadeIn"
      onClick={onClose}
    >
      {/* Navigation Arrows for screens */}
      {hasMultiple && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer z-50 shadow-lg hover:scale-110 active:scale-95"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer z-50 shadow-lg hover:scale-110 active:scale-95"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        </>
      )}

      {/* Top Floating Controls Bar */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-50">
        {hasMultiple && (
          <span className="text-white/90 text-[11px] sm:text-xs font-black px-2.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md">
            {currentIndex + 1} / {allPhotos.length}
          </span>
        )}

        <button
          onClick={handleDownload}
          className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 text-xs font-bold shadow-sm active:scale-95"
          title="Save original photo to your device"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {onDeletePhoto && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmDelete(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 text-xs font-bold shadow-sm active:scale-95"
            title="Delete this photo"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer active:scale-95"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Delete Confirmation Overlay inside modal */}
      {showConfirmDelete && (
        <div 
          className="absolute inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border-2 border-red-400 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 dark:text-white">Delete Photo Memory?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                "{photo.caption || 'This memory'}" will be permanently removed from your family trip album across all devices.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs shadow-md shadow-red-500/30 cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentic Polaroid Frame Card - Strictly fits screen with no vertical scroll */}
      <div 
        className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[82dvh] sm:max-h-[86dvh] bg-[#FFFDF9] dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl border-4 sm:border-6 border-white dark:border-slate-800 flex flex-col justify-between overflow-hidden transition-all select-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Decorative Tape Strip */}
        <div className="flex justify-center -mt-1 mb-1.5 flex-shrink-0">
          <div className="w-20 sm:w-28 h-4 sm:h-5 bg-[#FFE66D]/85 backdrop-blur-xs rounded-xs shadow-xs border border-amber-300/60 flex items-center justify-center -rotate-1">
            <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-[#1A535C]/70">
              EUROPE 2026
            </span>
          </div>
        </div>

        {/* Main Photo Canvas - Auto Scales to viewport with no scrolling */}
        <div className="relative flex-1 min-h-0 w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner">
          <img 
            src={photo.url} 
            alt={photo.caption} 
            className="max-h-full max-w-full w-auto h-auto object-contain block mx-auto pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Location Badge on Photo */}
          {photo.locationName && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-black flex items-center gap-1 border border-white/20 shadow-md">
              <MapPin className="w-3 h-3 text-[#FFE66D]" />
              <span>{photo.locationName}</span>
            </div>
          )}
        </div>

        {/* Polaroid Bottom Chin - Handwritten Caption & Signature */}
        <div className="flex-shrink-0 pt-2 sm:pt-3 px-1 space-y-1 sm:space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
          {/* Handwritten Caption */}
          <div className="flex items-start justify-between gap-2">
            <p 
              className="text-base sm:text-xl md:text-2xl text-[#1A535C] dark:text-[#FFE66D] font-bold leading-tight line-clamp-2"
              style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT', sans-serif" }}
            >
              "{photo.caption || 'Unforgettable Summer Moment'}"
            </p>
          </div>

          {/* Metadata & Quick Action Footer */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-bold text-[#FF6B6B] dark:text-[#FFA8A8] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-md">
                <User className="w-3 h-3" />
                <span>{photo.author || 'Family Member'}</span>
              </span>
              {photo.takenAt && (
                <span className="hidden sm:flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-[#4ECDC4]" />
                  <span>{photo.takenAt}</span>
                </span>
              )}
            </div>

            {/* In-Card Quick Delete */}
            {onDeletePhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(true);
                }}
                className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Delete this photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

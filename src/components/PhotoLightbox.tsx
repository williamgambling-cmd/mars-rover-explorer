import { useEffect, useCallback } from 'react';
import type { RoverPhoto } from '../types';

interface PhotoLightboxProps {
  photo: RoverPhoto;
  photos: RoverPhoto[];
  onClose: () => void;
  onNavigate: (photo: RoverPhoto) => void;
}

export default function PhotoLightbox({
  photo,
  photos,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(photos[currentIndex - 1]);
    }
  }, [currentIndex, photos, onNavigate]);

  const goNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(photos[currentIndex + 1]);
    }
  }, [currentIndex, photos, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goPrev, goNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors p-2"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 z-10 text-white/70 hover:text-white transition-colors p-2"
          aria-label="Previous photo"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 z-10 text-white/70 hover:text-white transition-colors p-2"
          aria-label="Next photo"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.img_src}
          alt={`Mars rover photo ${photo.id}`}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Metadata bar */}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-300 justify-center">
          <span className="bg-gray-800/80 px-3 py-1 rounded-full text-xs">
            {photo.camera.full_name}
          </span>
          <span className="bg-gray-800/80 px-3 py-1 rounded-full text-xs">
            Sol {photo.sol}
          </span>
          <span className="bg-gray-800/80 px-3 py-1 rounded-full text-xs">
            {photo.earth_date}
          </span>
          <span className="bg-gray-800/80 px-3 py-1 rounded-full text-xs text-gray-500">
            ID: {photo.id}
          </span>
        </div>

        {/* Counter */}
        <div className="mt-2 text-xs text-gray-500">
          {currentIndex + 1} of {photos.length}
        </div>
      </div>
    </div>
  );
}

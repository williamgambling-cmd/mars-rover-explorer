import { useRef, useEffect } from 'react';
import type { RoverPhoto } from '../types';

interface PhotoGalleryProps {
  photos: RoverPhoto[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onPhotoClick: (photo: RoverPhoto) => void;
}

export default function PhotoGallery({
  photos,
  loading,
  hasMore,
  onLoadMore,
  onPhotoClick,
}: PhotoGalleryProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (!loading && photos.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        <div className="text-3xl mb-2">📷</div>
        <p>No photos found for the current filters.</p>
        <p className="text-xs mt-1">Try a different sol or camera.</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => onPhotoClick(photo)}
            className="relative aspect-square overflow-hidden rounded-md bg-gray-800 group focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <img
              src={photo.img_src}
              alt={`Mars rover photo ${photo.id}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%236b7280" font-size="12">No Image</text></svg>';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="truncate">{photo.camera.full_name}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="aspect-square rounded-md bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-4" />}

      {/* End of results */}
      {!hasMore && photos.length > 0 && (
        <p className="text-center text-gray-600 text-xs py-4">
          End of photos for this sol
        </p>
      )}
    </div>
  );
}

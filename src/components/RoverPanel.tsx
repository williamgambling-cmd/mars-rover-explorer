import { useState, useEffect } from 'react';
import { ROVERS } from '../data/rovers';
import { useRoverManifest } from '../hooks/useRoverManifest';
import { useRoverPhotos } from '../hooks/useRoverPhotos';
import PhotoGallery from './PhotoGallery';
import PhotoLightbox from './PhotoLightbox';
import type { RoverPhoto } from '../types';

interface RoverPanelProps {
  selectedRover: string | null;
  onSelectRover: (roverApiName: string) => void;
  onClose: () => void;
}

export default function RoverPanel({
  selectedRover,
  onSelectRover,
  onClose,
}: RoverPanelProps) {
  const rover = ROVERS.find((r) => r.apiName === selectedRover);
  const { manifest, loading: manifestLoading } = useRoverManifest(selectedRover);
  const { photos, loading, error, hasMore, loadMore, setFilters, filters } =
    useRoverPhotos(selectedRover);

  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [solInput, setSolInput] = useState<string>('1');
  const [lightboxPhoto, setLightboxPhoto] = useState<RoverPhoto | null>(null);

  // Update sol input when manifest loads to use a sol with photos
  useEffect(() => {
    if (manifest?.photo_manifest) {
      const maxSol = manifest.photo_manifest.max_sol;
      setSolInput(String(maxSol));
      setFilters({ sol: maxSol, camera: undefined });
      setSelectedCamera('');
    }
  }, [manifest, setFilters]);

  const handleSolChange = () => {
    const sol = parseInt(solInput, 10);
    if (!isNaN(sol) && sol >= 0) {
      setFilters({ sol, camera: selectedCamera || undefined, earthDate: undefined });
    }
  };

  const handleCameraChange = (camera: string) => {
    setSelectedCamera(camera);
    const sol = parseInt(solInput, 10);
    setFilters({
      sol: !isNaN(sol) ? sol : undefined,
      camera: camera || undefined,
    });
  };

  // Available cameras from manifest for current sol
  const solEntry = manifest?.photo_manifest?.photos?.find(
    (p) => p.sol === parseInt(solInput, 10)
  );
  const availableCameras = solEntry?.cameras || [];

  if (!selectedRover || !rover) {
    return (
      <div className="h-full flex flex-col bg-gray-900/95 backdrop-blur-sm">
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">🔴</div>
          <h2 className="text-xl font-semibold mb-2">Mars Rover Explorer</h2>
          <p className="text-gray-400 text-sm mb-6">
            Click on a rover marker on the 3D Mars globe to explore photos from
            NASA's Mars rovers.
          </p>
          <div className="w-full space-y-2">
            {ROVERS.map((r) => (
              <button
                key={r.apiName}
                onClick={() => onSelectRover(r.apiName)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-500"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      r.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-gray-400">
                      {r.landingSite} &middot; Landed {r.landingDate}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                rover.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
              }`}
            />
            <h2 className="text-lg font-semibold">{rover.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          {rover.landingSite} &middot;{' '}
          {rover.status === 'active' ? 'Active' : 'Mission Complete'}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {rover.description}
        </p>

        {/* Manifest stats */}
        {manifest && !manifestLoading && (
          <div className="flex gap-3 mt-3 text-xs">
            <div className="bg-gray-800 rounded px-2 py-1">
              <span className="text-gray-400">Photos: </span>
              <span className="text-white font-medium">
                {manifest.photo_manifest.total_photos.toLocaleString()}
              </span>
            </div>
            <div className="bg-gray-800 rounded px-2 py-1">
              <span className="text-gray-400">Sols: </span>
              <span className="text-white font-medium">
                {manifest.photo_manifest.max_sol.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0 space-y-3">
        {/* Sol input */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Sol (Martian Day)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={manifest?.photo_manifest?.max_sol}
              value={solInput}
              onChange={(e) => setSolInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSolChange()}
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={handleSolChange}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded transition-colors"
            >
              Go
            </button>
          </div>
        </div>

        {/* Camera filter */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => handleCameraChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">All Cameras</option>
            {availableCameras.map((cam) => {
              const camInfo = rover.cameras.find((c) => c.name === cam);
              return (
                <option key={cam} value={cam}>
                  {camInfo ? camInfo.fullName : cam}
                </option>
              );
            })}
          </select>
        </div>

        {/* Current sol info */}
        {solEntry && (
          <div className="text-xs text-gray-500">
            {solEntry.total_photos} photos on Sol {solEntry.sol} ({solEntry.earth_date})
          </div>
        )}
      </div>

      {/* Photo gallery */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {error && (
          <div className="p-4 text-red-400 text-sm text-center">
            <p>{error}</p>
            <button
              onClick={() => setFilters({ ...filters, page: 1 })}
              className="mt-2 text-amber-500 hover:text-amber-400 underline"
            >
              Retry
            </button>
          </div>
        )}

        <PhotoGallery
          photos={photos}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onPhotoClick={setLightboxPhoto}
        />
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <PhotoLightbox
          photo={lightboxPhoto}
          photos={photos}
          onClose={() => setLightboxPhoto(null)}
          onNavigate={setLightboxPhoto}
        />
      )}
    </div>
  );
}

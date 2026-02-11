import { useState, useEffect, useCallback, useRef } from 'react';
import type { RoverPhoto, PhotoFilters } from '../types';
import { fetchRoverPhotos } from '../services/api';

interface UseRoverPhotosResult {
  photos: RoverPhoto[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  setFilters: (filters: Partial<PhotoFilters>) => void;
  filters: PhotoFilters;
}

export function useRoverPhotos(rover: string | null): UseRoverPhotosResult {
  const [photos, setPhotos] = useState<RoverPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFiltersState] = useState<PhotoFilters>({ page: 1, sol: 1 });
  const abortRef = useRef<AbortController | null>(null);
  const prevRoverRef = useRef<string | null>(null);

  const setFilters = useCallback((newFilters: Partial<PhotoFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters, page: 1 }));
    setPhotos([]);
    setHasMore(true);
  }, []);

  // Reset when rover changes
  useEffect(() => {
    if (rover !== prevRoverRef.current) {
      prevRoverRef.current = rover;
      setPhotos([]);
      setFiltersState({ page: 1, sol: 1 });
      setHasMore(true);
      setError(null);
    }
  }, [rover]);

  // Fetch photos
  useEffect(() => {
    if (!rover) {
      setPhotos([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchRoverPhotos(rover, filters)
      .then((data) => {
        if (!controller.signal.aborted) {
          const newPhotos = data.photos || [];
          if (filters.page === 1) {
            setPhotos(newPhotos);
          } else {
            setPhotos((prev) => [...prev, ...newPhotos]);
          }
          // NASA API returns 25 per page
          setHasMore(newPhotos.length === 25);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load photos');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [rover, filters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setFiltersState((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [loading, hasMore]);

  return { photos, loading, error, hasMore, loadMore, setFilters, filters };
}

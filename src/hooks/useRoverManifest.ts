import { useState, useEffect, useRef } from 'react';
import type { RoverManifest } from '../types';
import { fetchRoverManifest } from '../services/api';

interface UseRoverManifestResult {
  manifest: RoverManifest | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, RoverManifest>();

export function useRoverManifest(rover: string | null): UseRoverManifestResult {
  const [manifest, setManifest] = useState<RoverManifest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!rover) {
      setManifest(null);
      setError(null);
      return;
    }

    // Check cache first
    const cached = cache.get(rover);
    if (cached) {
      setManifest(cached);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchRoverManifest(rover)
      .then((data) => {
        if (!controller.signal.aborted) {
          cache.set(rover, data);
          setManifest(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load manifest');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [rover]);

  return { manifest, loading, error };
}

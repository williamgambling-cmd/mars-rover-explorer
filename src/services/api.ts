import type { PhotosResponse, RoverManifest, PhotoFilters } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${errorText || response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

export async function fetchRoverPhotos(
  rover: string,
  filters: PhotoFilters
): Promise<PhotosResponse> {
  const params = new URLSearchParams();

  if (filters.sol !== undefined) {
    params.set('sol', String(filters.sol));
  } else if (filters.earthDate) {
    params.set('earth_date', filters.earthDate);
  }

  if (filters.camera) {
    params.set('camera', filters.camera);
  }

  params.set('page', String(filters.page));

  return fetchJson<PhotosResponse>(
    `${API_BASE}/rovers/${rover}/photos?${params.toString()}`
  );
}

export async function fetchRoverManifest(
  rover: string
): Promise<RoverManifest> {
  return fetchJson<RoverManifest>(`${API_BASE}/rovers/${rover}/manifest`);
}

export interface RoverInfo {
  name: string;
  apiName: string;
  landingSite: string;
  latitude: number;
  longitude: number;
  landingDate: string;
  status: 'active' | 'complete';
  description: string;
  cameras: CameraInfo[];
}

export interface CameraInfo {
  name: string;
  fullName: string;
}

export interface RoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface RoverManifest {
  photo_manifest: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
    photos: ManifestSolEntry[];
  };
}

export interface ManifestSolEntry {
  sol: number;
  earth_date: string;
  total_photos: number;
  cameras: string[];
}

export interface PhotosResponse {
  photos: RoverPhoto[];
}

export interface PhotoFilters {
  sol?: number;
  earthDate?: string;
  camera?: string;
  page: number;
}

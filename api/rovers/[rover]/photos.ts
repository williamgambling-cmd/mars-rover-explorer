import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nasaFetch } from '../../_lib/nasa';

const VALID_ROVERS = ['curiosity', 'opportunity', 'spirit'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { rover } = req.query;
  const roverName = Array.isArray(rover) ? rover[0] : rover;

  if (!roverName || !VALID_ROVERS.includes(roverName.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid rover name. Use: curiosity, opportunity, or spirit' });
  }

  const { sol, earth_date, camera, page } = req.query;

  const params: Record<string, string> = {};

  if (sol) {
    params.sol = Array.isArray(sol) ? sol[0] : sol;
  } else if (earth_date) {
    params.earth_date = Array.isArray(earth_date) ? earth_date[0] : earth_date;
  } else {
    params.sol = '1'; // Default to sol 1
  }

  if (camera) {
    params.camera = Array.isArray(camera) ? camera[0] : camera;
  }

  if (page) {
    params.page = Array.isArray(page) ? page[0] : page;
  }

  try {
    const response = await nasaFetch(`/rovers/${roverName.toLowerCase()}/photos`, params);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `NASA API error: ${errorText || response.statusText}`,
      });
    }

    const data = await response.json();

    // Cache for 1 hour on Vercel's CDN
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching rover photos:', error);
    return res.status(500).json({ error: 'Failed to fetch photos from NASA API' });
  }
}

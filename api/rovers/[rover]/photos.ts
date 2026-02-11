import type { VercelRequest, VercelResponse } from '@vercel/node';

const VALID_ROVERS = ['curiosity', 'opportunity', 'spirit'];
const NASA_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { rover } = req.query;
  const roverName = Array.isArray(rover) ? rover[0] : rover;

  if (!roverName || !VALID_ROVERS.includes(roverName.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid rover name. Use: curiosity, opportunity, or spirit' });
  }

  const apiKey = (process.env.NASA_API_KEY || 'DEMO_KEY').trim();
  const { sol, earth_date, camera, page } = req.query;

  const params = new URLSearchParams();
  params.set('api_key', apiKey);

  if (sol) {
    params.set('sol', Array.isArray(sol) ? sol[0] : sol);
  } else if (earth_date) {
    params.set('earth_date', Array.isArray(earth_date) ? earth_date[0] : earth_date);
  } else {
    params.set('sol', '1');
  }

  if (camera) {
    params.set('camera', Array.isArray(camera) ? camera[0] : camera);
  }

  if (page) {
    params.set('page', Array.isArray(page) ? page[0] : page);
  }

  const url = `${NASA_BASE_URL}/rovers/${roverName.toLowerCase()}/photos?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `NASA API error: ${errorText || response.statusText}`,
      });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching rover photos:', error);
    return res.status(500).json({ error: 'Failed to fetch photos from NASA API' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nasaFetch } from '../../_lib/nasa';

const VALID_ROVERS = ['curiosity', 'opportunity', 'spirit'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { rover } = req.query;
  const roverName = Array.isArray(rover) ? rover[0] : rover;

  if (!roverName || !VALID_ROVERS.includes(roverName.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid rover name. Use: curiosity, opportunity, or spirit' });
  }

  try {
    const response = await nasaFetch(`/manifests/${roverName.toLowerCase()}`);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `NASA API error: ${errorText || response.statusText}`,
      });
    }

    const data = await response.json();

    // Manifests change infrequently, cache for 6 hours
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching rover manifest:', error);
    return res.status(500).json({ error: 'Failed to fetch manifest from NASA API' });
  }
}

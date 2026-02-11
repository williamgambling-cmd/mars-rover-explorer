import type { VercelRequest, VercelResponse } from '@vercel/node';

const ROVERS = [
  {
    name: 'Curiosity',
    apiName: 'curiosity',
    landingSite: 'Gale Crater',
    landingDate: '2012-08-06',
    status: 'active',
  },
  {
    name: 'Opportunity',
    apiName: 'opportunity',
    landingSite: 'Meridiani Planum',
    landingDate: '2004-01-25',
    status: 'complete',
  },
  {
    name: 'Spirit',
    apiName: 'spirit',
    landingSite: 'Gusev Crater',
    landingDate: '2004-01-04',
    status: 'complete',
  },
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).json({ rovers: ROVERS });
}

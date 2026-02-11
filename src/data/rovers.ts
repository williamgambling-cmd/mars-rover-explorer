import type { RoverInfo } from '../types';

export const ROVERS: RoverInfo[] = [
  {
    name: 'Curiosity',
    apiName: 'curiosity',
    landingSite: 'Gale Crater',
    latitude: -4.5895,
    longitude: 137.4417,
    landingDate: '2012-08-06',
    status: 'active',
    description:
      'NASA\'s Curiosity rover landed on Mars on August 6, 2012, inside Gale Crater. Its mission is to study the climate and geology of Mars, investigate whether the selected field site has ever offered environmental conditions favorable for microbial life, and to study the role of water.',
    cameras: [
      { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
      { name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
      { name: 'MAST', fullName: 'Mast Camera' },
      { name: 'CHEMCAM', fullName: 'Chemistry and Camera Complex' },
      { name: 'MAHLI', fullName: 'Mars Hand Lens Imager' },
      { name: 'MARDI', fullName: 'Mars Descent Imager' },
      { name: 'NAVCAM', fullName: 'Navigation Camera' },
    ],
  },
  {
    name: 'Opportunity',
    apiName: 'opportunity',
    landingSite: 'Meridiani Planum',
    latitude: -1.9462,
    longitude: 354.4734,
    landingDate: '2004-01-25',
    status: 'complete',
    description:
      'Opportunity landed on Mars on January 25, 2004. Originally designed for a 90-day mission, it operated for nearly 15 years, traveling over 28 miles. Contact was lost in June 2018 during a planet-wide dust storm.',
    cameras: [
      { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
      { name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
      { name: 'NAVCAM', fullName: 'Navigation Camera' },
      { name: 'PANCAM', fullName: 'Panoramic Camera' },
      { name: 'MINITES', fullName: 'Miniature Thermal Emission Spectrometer' },
    ],
  },
  {
    name: 'Spirit',
    apiName: 'spirit',
    landingSite: 'Gusev Crater',
    latitude: -14.5684,
    longitude: 175.4726,
    landingDate: '2004-01-04',
    status: 'complete',
    description:
      'Spirit landed on Mars on January 4, 2004. Like its twin Opportunity, it was designed for a 90-day mission but operated for over 6 years. Spirit became stuck in soft soil in 2009 and its last communication was in March 2010.',
    cameras: [
      { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
      { name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
      { name: 'NAVCAM', fullName: 'Navigation Camera' },
      { name: 'PANCAM', fullName: 'Panoramic Camera' },
      { name: 'MINITES', fullName: 'Miniature Thermal Emission Spectrometer' },
    ],
  },
];

export function getRoverByApiName(apiName: string): RoverInfo | undefined {
  return ROVERS.find((r) => r.apiName === apiName);
}

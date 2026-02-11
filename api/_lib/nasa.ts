const NASA_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

export function getNasaApiKey(): string {
  const key = process.env.NASA_API_KEY;
  if (!key) {
    throw new Error('NASA_API_KEY environment variable is not set');
  }
  return key;
}

export async function nasaFetch(path: string, params: Record<string, string> = {}): Promise<Response> {
  const url = new URL(`${NASA_BASE_URL}${path}`);
  url.searchParams.set('api_key', getNasaApiKey());

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString());
  return response;
}

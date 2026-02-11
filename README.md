# Mars Rover Explorer

An interactive web app that lets you explore Mars in 3D and browse photos from NASA's Mars rovers (Curiosity, Opportunity, and Spirit).

Built with React, CesiumJS, and NASA's Mars Rover Photos API. Deployed on Vercel.

## Features

- **Interactive 3D Mars Globe** -- powered by CesiumJS and Cesium Mars 3D Tiles with real terrain data
- **Rover Landing Sites** -- clickable markers on the globe showing where each rover landed
- **Photo Browser** -- browse thousands of Mars rover photos filtered by sol (Martian day) and camera
- **Photo Lightbox** -- full-screen photo viewer with keyboard navigation
- **Dark Space Theme** -- immersive UI designed for exploring another planet

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **3D Globe**: CesiumJS with Cesium Mars 3D Tiles
- **Styling**: Tailwind CSS 4
- **API Proxy**: Vercel Serverless Functions
- **Data**: NASA Mars Rover Photos API

## Getting Started

### Prerequisites

1. **NASA API Key** (free) -- sign up at [api.nasa.gov](https://api.nasa.gov/)
2. **Cesium Ion Token** (free) -- sign up at [ion.cesium.com](https://ion.cesium.com/), then add the "Cesium Mars" asset from the Asset Depot

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/mars-rover-explorer.git
cd mars-rover-explorer

# Install dependencies
npm install

# Copy environment variables and fill in your keys
cp .env.example .env
# Edit .env with your NASA_API_KEY and VITE_CESIUM_ION_TOKEN

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NASA_API_KEY` | NASA API key for Mars rover photos | [api.nasa.gov](https://api.nasa.gov/) |
| `VITE_CESIUM_ION_TOKEN` | Cesium Ion access token for 3D Mars tiles | [ion.cesium.com](https://ion.cesium.com/) |

## Deployment

This app is designed to deploy to [Vercel](https://vercel.com/) for free:

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy -- Vercel auto-detects Vite and configures everything

## API Endpoints

The app includes serverless API functions that proxy requests to NASA's API (keeping the API key server-side):

- `GET /api/rovers` -- list available rovers
- `GET /api/rovers/:rover/photos?sol=X&camera=Y&page=Z` -- fetch rover photos
- `GET /api/rovers/:rover/manifest` -- fetch rover mission manifest

## Available Rovers

| Rover | Landing Site | Landing Date | Status |
|-------|-------------|--------------|--------|
| Curiosity | Gale Crater | 2012-08-06 | Active |
| Opportunity | Meridiani Planum | 2004-01-25 | Complete |
| Spirit | Gusev Crater | 2004-01-04 | Complete |

## License

MIT

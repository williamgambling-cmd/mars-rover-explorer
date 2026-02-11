import { useState } from 'react';
import MarsGlobe from './MarsGlobe';
import RoverPanel from './RoverPanel';

export default function Layout() {
  const [selectedRover, setSelectedRover] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  const handleSelectRover = (roverApiName: string) => {
    setSelectedRover(roverApiName);
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setSelectedRover(null);
    setPanelOpen(true); // reset to default state showing rover list
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* 3D Mars Globe */}
      <div className="flex-1 relative">
        <MarsGlobe
          selectedRover={selectedRover}
          onSelectRover={handleSelectRover}
        />

        {/* Panel toggle button (mobile) */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute top-4 right-4 z-10 md:hidden bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-lg border border-gray-700"
          aria-label="Toggle panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {panelOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* App title overlay */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <h1 className="text-lg font-bold text-white drop-shadow-lg">
            Mars Rover Explorer
          </h1>
          <p className="text-xs text-gray-300 drop-shadow-lg">
            Explore Mars in 3D &middot; Browse NASA rover photos
          </p>
        </div>
      </div>

      {/* Side panel */}
      <div
        className={`
          w-[360px] flex-shrink-0 border-l border-gray-800
          transition-transform duration-300 ease-in-out
          fixed md:relative right-0 top-0 h-full z-20
          ${panelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <RoverPanel
          selectedRover={selectedRover}
          onSelectRover={handleSelectRover}
          onClose={handleClosePanel}
        />
      </div>
    </div>
  );
}

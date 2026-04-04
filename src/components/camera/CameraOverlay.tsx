'use client';

interface CameraOverlayProps {
  region?: 'frontal' | 'superior' | 'inferior';
}

export default function CameraOverlay({ region = 'frontal' }: CameraOverlayProps) {
  const getOverlayPath = () => {
    switch (region) {
      case 'superior':
        return 'M 30 55 Q 50 35 70 55';
      case 'inferior':
        return 'M 30 45 Q 50 65 70 45';
      default: // frontal
        return 'M 25 40 Q 25 60 50 65 Q 75 60 75 40 Q 75 30 50 28 Q 25 30 25 40';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Darkened overlay with cutout */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <mask id="mouth-cutout">
            <rect width="100" height="100" fill="white" />
            <ellipse cx="50" cy="48" rx="28" ry="22" fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="rgba(0,0,0,0.4)" mask="url(#mouth-cutout)" />

        {/* Guide outline */}
        <ellipse
          cx="50"
          cy="48"
          rx="28"
          ry="22"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="3 2"
          className="animate-pulse"
        />

        {/* Mouth guide path */}
        <path
          d={getOverlayPath()}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.4"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Guide text */}
      <div className="absolute top-6 left-0 right-0 text-center">
        <p className="text-white text-sm font-medium drop-shadow-lg">
          Encaixe sua boca no guia
        </p>
      </div>
    </div>
  );
}

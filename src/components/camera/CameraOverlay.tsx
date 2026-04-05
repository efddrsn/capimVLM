'use client';

import type { OverlayRegion } from '@/lib/types';

interface CameraOverlayProps {
  region?: OverlayRegion;
  instructionText?: string;
}

const overlayConfigs: Record<OverlayRegion, { cx: number; cy: number; rx: number; ry: number; path: string }> = {
  frontal: {
    cx: 50, cy: 48, rx: 28, ry: 22,
    path: 'M 25 40 Q 25 60 50 65 Q 75 60 75 40 Q 75 30 50 28 Q 25 30 25 40',
  },
  'lateral-direita': {
    cx: 55, cy: 48, rx: 22, ry: 20,
    path: 'M 38 40 Q 40 55 55 58 Q 70 55 72 40 Q 70 32 55 30 Q 40 32 38 40',
  },
  'lateral-esquerda': {
    cx: 45, cy: 48, rx: 22, ry: 20,
    path: 'M 28 40 Q 30 55 45 58 Q 60 55 62 40 Q 60 32 45 30 Q 30 32 28 40',
  },
  superior: {
    cx: 50, cy: 45, rx: 26, ry: 24,
    path: 'M 30 55 Q 50 35 70 55',
  },
  inferior: {
    cx: 50, cy: 52, rx: 26, ry: 24,
    path: 'M 30 45 Q 50 65 70 45',
  },
  extra: {
    cx: 50, cy: 48, rx: 18, ry: 18,
    path: 'M 35 48 Q 50 35 65 48 Q 50 61 35 48',
  },
};

export default function CameraOverlay({ region = 'frontal', instructionText }: CameraOverlayProps) {
  const config = overlayConfigs[region];

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Darkened overlay with cutout */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <mask id="mouth-cutout">
            <rect width="100" height="100" fill="white" />
            <ellipse cx={config.cx} cy={config.cy} rx={config.rx} ry={config.ry} fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="rgba(0,0,0,0.4)" mask="url(#mouth-cutout)" />

        {/* Guide outline */}
        <ellipse
          cx={config.cx}
          cy={config.cy}
          rx={config.rx}
          ry={config.ry}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="3 2"
          className="animate-pulse"
        />

        {/* Mouth guide path */}
        <path
          d={config.path}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.4"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Guide text */}
      <div className="absolute top-6 left-0 right-0 text-center">
        <p className="text-white text-sm font-medium drop-shadow-lg">
          {instructionText || 'Encaixe sua boca no guia'}
        </p>
      </div>
    </div>
  );
}

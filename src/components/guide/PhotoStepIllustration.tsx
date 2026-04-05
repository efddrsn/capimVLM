'use client';

import { motion } from 'framer-motion';

interface PhotoStepIllustrationProps {
  stepId: string;
  size?: number;
}

function CameraPulse({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <motion.g
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="-12" y="-9" width="24" height="18" rx="3" fill="#0284c7" opacity="0.9" />
        <circle cx="0" cy="0" r="5" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="2" fill="white" />
      </motion.g>
      {/* Flash indicator */}
      <line x1="8" y1="-9" x2="8" y2="-13" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function TeethGrid({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const cols = 6;
  const rows = 2;
  const gapX = width / cols;
  const gapY = height / rows;
  return (
    <g>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * gapX + 1}
            y={y + r * gapY + 1}
            width={gapX - 2}
            height={gapY - 2}
            rx="1.5"
            fill="white"
            stroke="#d1d5db"
            strokeWidth="0.5"
          />
        ))
      )}
    </g>
  );
}

function FrontalIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Face outline */}
      <ellipse cx="100" cy="95" rx="55" ry="65" fill="#fef3c7" stroke="#d1d5db" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="80" cy="75" rx="6" ry="4" fill="#374151" />
      <ellipse cx="120" cy="75" rx="6" ry="4" fill="#374151" />
      {/* Nose */}
      <path d="M97 85 L100 92 L103 85" fill="none" stroke="#d1d5db" strokeWidth="1" />
      {/* Mouth opening - wide */}
      <ellipse cx="100" cy="115" rx="28" ry="16" fill="#fca5a5" stroke="#d1d5db" strokeWidth="1" />
      {/* Teeth */}
      <TeethGrid x={76} y={105} width={48} height={20} />
      {/* Hands pulling lips */}
      <motion.g animate={{ x: [-1, -3, -1] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M62 110 Q55 112 52 108 Q50 105 55 103 L65 107" fill="#fde68a" stroke="#d1d5db" strokeWidth="0.8" />
        <line x1="55" y1="112" x2="62" y2="112" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
        </line>
      </motion.g>
      <motion.g animate={{ x: [1, 3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M138 110 Q145 112 148 108 Q150 105 145 103 L135 107" fill="#fde68a" stroke="#d1d5db" strokeWidth="0.8" />
        <line x1="138" y1="112" x2="145" y2="112" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
        </line>
      </motion.g>
      {/* Camera */}
      <CameraPulse x={100} y={170} />
      {/* Distance indicator */}
      <line x1="100" y1="155" x2="100" y2="135" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  );
}

function LateralDireitaIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Side profile face - looking left */}
      <path
        d="M120 30 Q145 35 150 60 Q155 80 150 100 Q148 110 140 120 L125 135 Q115 140 110 135 L105 125 Q95 120 90 110 Q85 95 85 80 Q85 50 100 35 Z"
        fill="#fef3c7" stroke="#d1d5db" strokeWidth="1.5"
      />
      {/* Eye */}
      <ellipse cx="120" cy="70" rx="5" ry="3.5" fill="#374151" />
      {/* Ear */}
      <path d="M85 70 Q78 70 78 80 Q78 90 85 90" fill="#fef3c7" stroke="#d1d5db" strokeWidth="1" />
      {/* Mouth area */}
      <ellipse cx="130" cy="115" rx="15" ry="10" fill="#fca5a5" stroke="#d1d5db" strokeWidth="0.8" />
      {/* Side teeth */}
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={120 + i * 6} y={110} width={5} height={10} rx="1" fill="white" stroke="#d1d5db" strokeWidth="0.5" />
        ))}
      </g>
      {/* Finger pulling cheek */}
      <motion.g animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M150 110 Q158 108 162 112 Q165 116 160 118 L148 115" fill="#fde68a" stroke="#d1d5db" strokeWidth="0.8" />
        <line x1="150" y1="112" x2="162" y2="112" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
        </line>
      </motion.g>
      {/* Camera on right side */}
      <CameraPulse x={45} y={110} angle={0} />
      <line x1="60" y1="110" x2="80" y2="110" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  );
}

function LateralEsquerdaIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Side profile face - looking right (mirrored) */}
      <path
        d="M80 30 Q55 35 50 60 Q45 80 50 100 Q52 110 60 120 L75 135 Q85 140 90 135 L95 125 Q105 120 110 110 Q115 95 115 80 Q115 50 100 35 Z"
        fill="#fef3c7" stroke="#d1d5db" strokeWidth="1.5"
      />
      {/* Eye */}
      <ellipse cx="80" cy="70" rx="5" ry="3.5" fill="#374151" />
      {/* Ear */}
      <path d="M115 70 Q122 70 122 80 Q122 90 115 90" fill="#fef3c7" stroke="#d1d5db" strokeWidth="1" />
      {/* Mouth area */}
      <ellipse cx="70" cy="115" rx="15" ry="10" fill="#fca5a5" stroke="#d1d5db" strokeWidth="0.8" />
      {/* Side teeth */}
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={58 + i * 6} y={110} width={5} height={10} rx="1" fill="white" stroke="#d1d5db" strokeWidth="0.5" />
        ))}
      </g>
      {/* Finger pulling cheek */}
      <motion.g animate={{ x: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <path d="M50 110 Q42 108 38 112 Q35 116 40 118 L52 115" fill="#fde68a" stroke="#d1d5db" strokeWidth="0.8" />
        <line x1="50" y1="112" x2="38" y2="112" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
        </line>
      </motion.g>
      {/* Camera on left side */}
      <CameraPulse x={155} y={110} angle={0} />
      <line x1="140" y1="110" x2="120" y2="110" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  );
}

function SuperiorIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Head tilted back - simplified side view */}
      <path
        d="M70 140 Q60 120 65 90 Q70 60 100 50 Q130 60 135 90 Q140 120 130 140"
        fill="#fef3c7" stroke="#d1d5db" strokeWidth="1.5" fillOpacity="0.7"
      />
      {/* Open mouth - view from above */}
      <ellipse cx="100" cy="140" rx="25" ry="18" fill="#fca5a5" stroke="#d1d5db" strokeWidth="1" />
      {/* Upper teeth arch */}
      <path d="M78 135 Q80 125 100 122 Q120 125 122 135" fill="none" stroke="white" strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = -80 + i * (160 / 7);
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + Math.cos(rad) * 20;
        const cy = 132 + Math.sin(rad) * 8;
        return <rect key={i} x={cx - 3} y={cy - 3} width={6} height={6} rx="1.5" fill="white" stroke="#d1d5db" strokeWidth="0.5" transform={`rotate(${angle}, ${cx}, ${cy})`} />;
      })}
      {/* Camera pointing down */}
      <CameraPulse x={100} y={25} angle={0} />
      {/* Arrow pointing down */}
      <motion.g animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <line x1="100" y1="40" x2="100" y2="80" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M94 74 L100 84 L106 74" fill="#0284c7" />
      </motion.g>
      {/* Tilt head indicator */}
      <motion.path
        d="M140 80 Q150 65 145 50"
        fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <path d="M143 55 L145 48 L150 55" fill="#0284c7" opacity="0.6" />
    </svg>
  );
}

function InferiorIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Head - chin down view */}
      <path
        d="M70 60 Q60 80 65 110 Q70 140 100 150 Q130 140 135 110 Q140 80 130 60"
        fill="#fef3c7" stroke="#d1d5db" strokeWidth="1.5" fillOpacity="0.7"
      />
      {/* Open mouth - view from below */}
      <ellipse cx="100" cy="65" rx="25" ry="18" fill="#fca5a5" stroke="#d1d5db" strokeWidth="1" />
      {/* Lower teeth arch */}
      <path d="M78 70 Q80 80 100 83 Q120 80 122 70" fill="none" stroke="white" strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = 80 - i * (160 / 7);
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + Math.cos(rad) * 20;
        const cy = 73 - Math.sin(rad) * 8;
        return <rect key={i} x={cx - 3} y={cy - 3} width={6} height={6} rx="1.5" fill="white" stroke="#d1d5db" strokeWidth="0.5" transform={`rotate(${-angle}, ${cx}, ${cy})`} />;
      })}
      {/* Tongue pulled back indicator */}
      <ellipse cx="100" cy="58" rx="10" ry="6" fill="#f87171" opacity="0.4" />
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <path d="M94 55 L100 50 L106 55" fill="#f87171" opacity="0.5" />
      </motion.g>
      {/* Camera pointing up */}
      <CameraPulse x={100} y={180} angle={0} />
      {/* Arrow pointing up */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <line x1="100" y1="165" x2="100" y2="120" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M94 126 L100 116 L106 126" fill="#0284c7" />
      </motion.g>
      {/* Chin down indicator */}
      <motion.path
        d="M140 120 Q150 135 145 150"
        fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <path d="M143 145 L145 152 L150 145" fill="#0284c7" opacity="0.6" />
    </svg>
  );
}

function ExtraIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Single tooth */}
      <g transform="translate(100, 90)">
        <path d="M-15 -20 Q-15 -30 0 -32 Q15 -30 15 -20 L12 15 Q8 25 0 25 Q-8 25 -12 15 Z" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
        {/* Problem area highlight */}
        <motion.circle
          cx="5" cy="-10" r="6"
          fill="none" stroke="#ef4444" strokeWidth="1.5"
          animate={{ r: [5, 7, 5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <circle cx="5" cy="-10" r="3" fill="#fca5a5" opacity="0.5" />
      </g>
      {/* Magnifying glass */}
      <motion.g
        animate={{ rotate: [-5, 5, -5], x: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <circle cx="115" cy="70" r="22" fill="none" stroke="#0284c7" strokeWidth="2.5" opacity="0.3" />
        <line x1="131" y1="86" x2="145" y2="100" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      </motion.g>
      {/* Camera close-up indicator */}
      <CameraPulse x={100} y={160} />
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <line x1="100" y1="148" x2="100" y2="125" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" />
      </motion.g>
      {/* 10-15cm label */}
      <text x="100" y="180" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="system-ui">
        10–15 cm
      </text>
    </svg>
  );
}

const illustrations: Record<string, React.FC> = {
  frente: FrontalIllustration,
  direito: LateralDireitaIllustration,
  esquerdo: LateralEsquerdaIllustration,
  superior: SuperiorIllustration,
  inferior: InferiorIllustration,
  extra: ExtraIllustration,
};

export default function PhotoStepIllustration({ stepId, size = 180 }: PhotoStepIllustrationProps) {
  const Illustration = illustrations[stepId];
  if (!Illustration) return null;

  return (
    <motion.div
      className="mx-auto"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Illustration />
    </motion.div>
  );
}

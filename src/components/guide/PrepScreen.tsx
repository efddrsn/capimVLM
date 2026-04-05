'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface PrepScreenProps {
  onStart: () => void;
}

const tips = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect x="16" y="4" width="8" height="24" rx="4" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="8" y="28" width="24" height="6" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
        {/* Bristles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={12 + i * 4} y1="28" x2={12 + i * 4} y2="24" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </svg>
    ),
    text: 'Escove os dentes',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <circle cx="20" cy="18" r="10" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
        {/* Light rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={20 + Math.cos(rad) * 13}
              y1={18 + Math.sin(rad) * 13}
              x2={20 + Math.cos(rad) * 17}
              y2={18 + Math.sin(rad) * 17}
              stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"
            />
          );
        })}
        <text x="20" y="36" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">natural</text>
      </svg>
    ),
    text: 'Luz natural ou branca',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect x="10" y="4" width="20" height="32" rx="4" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
        <rect x="13" y="8" width="14" height="20" rx="1" fill="#e2e8f0" />
        {/* Camera lens */}
        <circle cx="20" cy="15" r="4" fill="#0284c7" opacity="0.3" />
        <circle cx="20" cy="15" r="2" fill="#0284c7" />
        {/* No flash X */}
        <g transform="translate(28, 6)">
          <line x1="-3" y1="-3" x2="3" y2="3" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="-3" x2="-3" y2="3" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    ),
    text: 'Sem flash, sem filtro',
  },
];

export default function PrepScreen({ onStart }: PrepScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center space-y-2">
        <div className="text-5xl">📸</div>
        <h1 className="text-xl font-bold text-gray-900">Vamos tirar 5 fotos</h1>
        <p className="text-sm text-gray-500">Cada uma de um ângulo diferente</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <div className="flex-shrink-0">{tip.icon}</div>
            <p className="text-sm font-medium text-gray-700">{tip.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-xs text-gray-400 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Se possível, peça ajuda a alguém
      </motion.p>

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="primary" size="lg" onClick={onStart} className="w-full text-lg">
          Começar
        </Button>
      </motion.div>
    </motion.div>
  );
}

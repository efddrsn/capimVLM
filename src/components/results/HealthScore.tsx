'use client';

import { motion } from 'framer-motion';

interface HealthScoreProps {
  score: number; // 0-10
  status: 'boa' | 'atenção' | 'preocupante';
}

const statusConfig = {
  'boa': { color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'stroke-emerald-500', label: 'Boa' },
  'atenção': { color: 'text-amber-600', bg: 'bg-amber-50', ring: 'stroke-amber-500', label: 'Atenção' },
  'preocupante': { color: 'text-red-600', bg: 'bg-red-50', ring: 'stroke-red-500', label: 'Preocupante' },
};

export default function HealthScore({ score, status }: HealthScoreProps) {
  const config = statusConfig[status];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className={`flex items-center gap-4 rounded-2xl p-5 ${config.bg}`}>
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            className={config.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${config.color}`}>{score}</span>
          <span className="text-xs text-gray-500">/10</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600">Saúde bucal visível</p>
        <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
        <p className="text-xs text-gray-500 mt-1">
          Baseado na análise visual da foto
        </p>
      </div>
    </div>
  );
}

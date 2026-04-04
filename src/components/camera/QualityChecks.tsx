'use client';

import { motion } from 'framer-motion';
import type { QualityCheckResult } from '@/lib/image-utils';

interface QualityChecksProps {
  checks: QualityCheckResult | null;
}

interface CheckItemProps {
  label: string;
  passed: boolean;
  icon: string;
  feedback: string;
}

function CheckItem({ label, passed, icon, feedback }: CheckItemProps) {
  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
        ${passed ? 'bg-emerald-500/80 text-white' : 'bg-white/80 text-gray-700'}
      `}
      animate={passed ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}:</span>
      <span>{passed ? '✓' : feedback}</span>
    </motion.div>
  );
}

export default function QualityChecks({ checks }: QualityChecksProps) {
  if (!checks) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 z-20 flex flex-wrap justify-center gap-2 px-4">
      <CheckItem
        label="Luz"
        passed={checks.brightness.passed}
        icon="☀️"
        feedback="Mais luz"
      />
      <CheckItem
        label="Foco"
        passed={checks.focus.passed}
        icon="📸"
        feedback="Segure firme"
      />
      <CheckItem
        label="Distância"
        passed={checks.proximity.passed}
        icon="🔍"
        feedback="Aproxime"
      />
    </div>
  );
}

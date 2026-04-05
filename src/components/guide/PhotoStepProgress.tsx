'use client';

import { motion } from 'framer-motion';
import type { CapturedPhoto, PhotoStep } from '@/lib/types';

interface PhotoStepProgressProps {
  steps: PhotoStep[];
  currentIndex: number;
  capturedPhotos: CapturedPhoto[];
}

export default function PhotoStepProgress({ steps, currentIndex, capturedPhotos }: PhotoStepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {steps.map((step, i) => {
        const captured = capturedPhotos.find((p) => p.stepId === step.id);
        const isCurrent = i === currentIndex;
        const isDone = !!captured;
        const isOptional = step.optional;

        return (
          <motion.div
            key={step.id}
            className={`
              relative w-9 h-9 rounded-full flex items-center justify-center
              transition-colors duration-300 overflow-hidden
              ${isDone ? 'ring-2 ring-emerald-400' : ''}
              ${isCurrent ? 'ring-2 ring-sky-500 bg-sky-100' : ''}
              ${!isDone && !isCurrent ? 'bg-gray-100' : ''}
              ${isOptional && !isDone && !isCurrent ? 'border border-dashed border-gray-300 bg-transparent' : ''}
            `}
            animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
          >
            {isDone ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={captured.dataUrl} alt={step.label} className="w-full h-full object-cover rounded-full" />
            ) : isCurrent ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-sky-600">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <span className="text-[10px] font-medium text-gray-400">{i + 1}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

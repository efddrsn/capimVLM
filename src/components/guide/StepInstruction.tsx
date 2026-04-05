'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { PhotoStep, CapturedPhoto } from '@/lib/types';
import PhotoStepIllustration from './PhotoStepIllustration';
import PhotoStepProgress from './PhotoStepProgress';
import Button from '@/components/ui/Button';
import { PHOTO_STEPS } from '@/lib/types';

interface StepInstructionProps {
  step: PhotoStep;
  stepIndex: number;
  capturedPhotos: CapturedPhoto[];
  onCapture: () => void;
  onSkip?: () => void;
  direction: number; // 1 = forward, -1 = back
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export default function StepInstruction({
  step,
  stepIndex,
  capturedPhotos,
  onCapture,
  onSkip,
  direction,
}: StepInstructionProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <PhotoStepProgress
        steps={PHOTO_STEPS}
        currentIndex={stepIndex}
        capturedPhotos={capturedPhotos}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4 w-full"
        >
          {/* Step number badge */}
          <div className="flex items-center gap-2">
            {!step.optional && (
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                {stepIndex + 1} / 5
              </span>
            )}
            {step.optional && (
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                Opcional
              </span>
            )}
          </div>

          {/* Illustration */}
          <PhotoStepIllustration stepId={step.id} size={180} />

          {/* Title + tip */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-gray-900">{step.label}</h2>
            <p className="text-sm text-gray-500">{step.shortTip}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full max-w-sm">
            {step.optional && onSkip && (
              <Button variant="outline" onClick={onSkip} className="flex-1">
                Pular
              </Button>
            )}
            <Button variant="primary" size="lg" onClick={onCapture} className="flex-1">
              {step.optional ? 'Tirar foto' : 'Tirar foto'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

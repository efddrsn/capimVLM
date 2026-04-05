'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PHOTO_STEPS } from '@/lib/types';
import type { CapturedPhoto, OverlayRegion } from '@/lib/types';
import PrepScreen from './PrepScreen';
import StepInstruction from './StepInstruction';
import PhotoReview from './PhotoReview';
import CameraCapture from '@/components/camera/CameraCapture';

type GuidePhase = 'prep' | 'instruction' | 'capturing' | 'review';

interface PhotoGuideProps {
  onAllPhotosReady: (photos: CapturedPhoto[]) => void;
  loading?: boolean;
}

export default function PhotoGuide({ onAllPhotosReady, loading }: PhotoGuideProps) {
  const [phase, setPhase] = useState<GuidePhase>('prep');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [direction, setDirection] = useState(1);

  const currentStep = PHOTO_STEPS[currentStepIndex];

  const goToStep = useCallback((index: number) => {
    setDirection(index > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(index);
    setPhase('instruction');
  }, [currentStepIndex]);

  const handleStartGuide = useCallback(() => {
    setPhase('instruction');
    setCurrentStepIndex(0);
    setDirection(1);
  }, []);

  const handleOpenCamera = useCallback(() => {
    setPhase('capturing');
  }, []);

  const handlePhotoReady = useCallback((base64: string, dataUrl: string) => {
    const stepId = PHOTO_STEPS[currentStepIndex].id;

    setCapturedPhotos((prev) => {
      // Replace if retaking, otherwise add
      const filtered = prev.filter((p) => p.stepId !== stepId);
      return [...filtered, { stepId, dataUrl, base64 }];
    });

    // Move to next step or review
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < PHOTO_STEPS.length) {
      setDirection(1);
      setCurrentStepIndex(nextIndex);
      setPhase('instruction');
    } else {
      setPhase('review');
    }
  }, [currentStepIndex]);

  const handleSkipExtra = useCallback(() => {
    setPhase('review');
  }, []);

  const handleRetake = useCallback((stepIndex: number) => {
    goToStep(stepIndex);
  }, [goToStep]);

  const handleSubmit = useCallback(() => {
    onAllPhotosReady(capturedPhotos);
  }, [capturedPhotos, onAllPhotosReady]);

  const handleCancelCapture = useCallback(() => {
    setPhase('instruction');
  }, []);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {phase === 'prep' && (
          <motion.div key="prep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrepScreen onStart={handleStartGuide} />
          </motion.div>
        )}

        {phase === 'instruction' && currentStep && (
          <motion.div key={`instruction-${currentStep.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepInstruction
              step={currentStep}
              stepIndex={currentStepIndex}
              capturedPhotos={capturedPhotos}
              onCapture={handleOpenCamera}
              onSkip={currentStep.optional ? handleSkipExtra : undefined}
              direction={direction}
            />
          </motion.div>
        )}

        {phase === 'capturing' && currentStep && (
          <motion.div key="capturing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-3">
              {/* Compact header during capture */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelCapture}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M10 4L4 10M4 4L10 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700">{currentStep.label}</span>
                <span className="text-xs text-gray-400">— {currentStep.shortTip}</span>
              </div>

              <CameraCapture
                onPhotoReady={handlePhotoReady}
                region={currentStep.region as OverlayRegion}
                instructionText={currentStep.shortTip}
              />
            </div>
          </motion.div>
        )}

        {phase === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PhotoReview
              capturedPhotos={capturedPhotos}
              onRetake={handleRetake}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

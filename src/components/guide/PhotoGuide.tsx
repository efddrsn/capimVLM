'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PHOTO_STEPS } from '@/lib/types';
import type { CapturedPhoto, OverlayRegion } from '@/lib/types';
import PrepScreen from './PrepScreen';
import StepInstruction from './StepInstruction';
import PhotoReview from './PhotoReview';
import CameraCapture from '@/components/camera/CameraCapture';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type GuidePhase = 'prep' | 'instruction' | 'capturing' | 'validating' | 'rejected' | 'review';

interface PhotoGuideProps {
  onAllPhotosReady: (photos: CapturedPhoto[]) => void;
  loading?: boolean;
}

export default function PhotoGuide({ onAllPhotosReady, loading }: PhotoGuideProps) {
  const [phase, setPhase] = useState<GuidePhase>('prep');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [direction, setDirection] = useState(1);
  // Per-photo validation state
  const [pendingPhoto, setPendingPhoto] = useState<{ base64: string; dataUrl: string } | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState<string>('');

  const currentStep = PHOTO_STEPS[currentStepIndex];

  const goToStep = useCallback((index: number) => {
    setDirection(index > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(index);
    setPhase('instruction');
    setRejectionFeedback('');
    setPendingPhoto(null);
  }, [currentStepIndex]);

  const handleStartGuide = useCallback(() => {
    setPhase('instruction');
    setCurrentStepIndex(0);
    setDirection(1);
  }, []);

  const handleOpenCamera = useCallback(() => {
    setPhase('capturing');
    setRejectionFeedback('');
  }, []);

  const advanceToNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < PHOTO_STEPS.length) {
      setDirection(1);
      setCurrentStepIndex(nextIndex);
      setPhase('instruction');
    } else {
      setPhase('review');
    }
  }, [currentStepIndex]);

  const handlePhotoReady = useCallback(async (base64: string, dataUrl: string) => {
    const stepId = PHOTO_STEPS[currentStepIndex].id;
    setPendingPhoto({ base64, dataUrl });
    setPhase('validating');

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          expectedAngle: stepId,
        }),
      });

      if (!res.ok) throw new Error('Validation request failed');

      const result = await res.json();

      if (result.isValid) {
        // Photo accepted — save and move on
        setCapturedPhotos((prev) => {
          const filtered = prev.filter((p) => p.stepId !== stepId);
          return [...filtered, { stepId, dataUrl, base64 }];
        });
        setPendingPhoto(null);
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < PHOTO_STEPS.length) {
          setDirection(1);
          setCurrentStepIndex(nextIndex);
          setPhase('instruction');
        } else {
          setPhase('review');
        }
      } else {
        // Photo rejected — show feedback
        setRejectionFeedback(result.feedback || 'A foto não ficou boa. Tente novamente.');
        setPhase('rejected');
      }
    } catch {
      // On error, accept the photo anyway (don't block the user)
      setCapturedPhotos((prev) => {
        const filtered = prev.filter((p) => p.stepId !== stepId);
        return [...filtered, { stepId, dataUrl, base64 }];
      });
      setPendingPhoto(null);
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < PHOTO_STEPS.length) {
        setDirection(1);
        setCurrentStepIndex(nextIndex);
        setPhase('instruction');
      } else {
        setPhase('review');
      }
    }
  }, [currentStepIndex]);

  const handleRetryAfterRejection = useCallback(() => {
    setPendingPhoto(null);
    setPhase('capturing');
  }, []);

  const handleUseAnywayAfterRejection = useCallback(() => {
    if (!pendingPhoto) return;
    const stepId = PHOTO_STEPS[currentStepIndex].id;
    setCapturedPhotos((prev) => {
      const filtered = prev.filter((p) => p.stepId !== stepId);
      return [...filtered, { stepId, dataUrl: pendingPhoto.dataUrl, base64: pendingPhoto.base64 }];
    });
    setPendingPhoto(null);
    setRejectionFeedback('');
    advanceToNext();
  }, [pendingPhoto, currentStepIndex, advanceToNext]);

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
                <span className="text-xs text-gray-400">{currentStep.shortTip}</span>
              </div>

              <CameraCapture
                onPhotoReady={handlePhotoReady}
                region={currentStep.region as OverlayRegion}
                instructionText={currentStep.shortTip}
              />
            </div>
          </motion.div>
        )}

        {phase === 'validating' && (
          <motion.div key="validating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-4 py-8">
              {pendingPhoto && (
                <div className="w-full max-w-xs aspect-[4/3] rounded-2xl overflow-hidden shadow-md opacity-70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pendingPhoto.dataUrl} alt="Validando..." className="w-full h-full object-cover" />
                </div>
              )}
              <LoadingSpinner message="Verificando foto..." />
            </div>
          </motion.div>
        )}

        {phase === 'rejected' && pendingPhoto && (
          <motion.div key="rejected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Show the rejected photo */}
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-amber-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pendingPhoto.dataUrl} alt="Foto rejeitada" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 4V9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="8" cy="12" r="1" fill="white" />
                  </svg>
                </div>
              </div>

              {/* Feedback message */}
              <div className="w-full max-w-sm bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 font-medium text-center">
                  {rejectionFeedback}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full max-w-sm">
                <Button variant="outline" onClick={handleUseAnywayAfterRejection} className="flex-1">
                  Usar assim
                </Button>
                <Button variant="primary" onClick={handleRetryAfterRejection} className="flex-1">
                  Tirar outra
                </Button>
              </div>
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

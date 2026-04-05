'use client';

import { motion } from 'framer-motion';
import type { CapturedPhoto } from '@/lib/types';
import { PHOTO_STEPS } from '@/lib/types';
import Button from '@/components/ui/Button';

interface PhotoReviewProps {
  capturedPhotos: CapturedPhoto[];
  onRetake: (stepIndex: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function PhotoReview({ capturedPhotos, onRetake, onSubmit, loading }: PhotoReviewProps) {
  const requiredSteps = PHOTO_STEPS.filter((s) => !s.optional);
  const extraPhoto = capturedPhotos.find((p) => p.stepId === 'extra');

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center space-y-1">
        <div className="text-3xl">✅</div>
        <h2 className="text-lg font-bold text-gray-900">Suas fotos</h2>
        <p className="text-sm text-gray-500">Toque em uma foto para refazer</p>
      </div>

      {/* Photo grid - 3+2 layout */}
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-3 gap-2">
          {requiredSteps.map((step, i) => {
            const photo = capturedPhotos.find((p) => p.stepId === step.id);
            return (
              <motion.button
                key={step.id}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-sky-400 transition-colors"
                onClick={() => onRetake(i)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={photo.dataUrl} alt={step.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                )}
                {/* Label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-1.5 px-2">
                  <p className="text-[10px] font-medium text-white text-center truncate">{step.label}</p>
                </div>
                {/* Retake icon */}
                {photo && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M10 2 L2 10 M2 2 L10 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Extra photo row */}
        {extraPhoto && (
          <motion.button
            className="mt-2 w-full relative aspect-[3/1] rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-sky-400 transition-colors"
            onClick={() => onRetake(5)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={extraPhoto.dataUrl} alt="Extra" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-1.5 px-2">
              <p className="text-[10px] font-medium text-white text-center">Extra</p>
            </div>
          </motion.button>
        )}
      </div>

      <div className="w-full max-w-sm space-y-2">
        <Button variant="primary" size="lg" onClick={onSubmit} className="w-full text-lg" loading={loading}>
          Enviar para análise
        </Button>
        <p className="text-[10px] text-gray-400 text-center">
          Suas fotos não são salvas em nenhum servidor
        </p>
      </div>
    </motion.div>
  );
}

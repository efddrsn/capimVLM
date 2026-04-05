'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import StepProgress from '@/components/StepProgress';
import DisclaimerModal from '@/components/DisclaimerModal';
import PhotoGuide from '@/components/guide/PhotoGuide';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAnalysis } from '@/hooks/useAnalysis';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { CapturedPhoto } from '@/lib/types';

const stepMessages: Record<string, { message: string; subMessage: string }> = {
  validating: {
    message: 'Verificando qualidade da imagem...',
    subMessage: 'Confirmando que é uma foto dental válida',
  },
  analyzing: {
    message: 'Analisando sua saúde bucal...',
    subMessage: 'A IA está analisando todas as fotos',
  },
  generating: {
    message: 'Gerando simulação visual...',
    subMessage: 'Criando a simulação de antes e depois',
  },
};

export default function CapturaPage() {
  const router = useRouter();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const disclaimerAcceptedRef = useRef(false);
  const [pendingPhotos, setPendingPhotos] = useState<CapturedPhoto[] | null>(null);
  const { step, analysisResult, afterImage, error, startAnalysis, reset } = useAnalysis();

  const proceedWithAnalysis = useCallback(
    async (photos: CapturedPhoto[]) => {
      // Store the frontal image for results page
      const frontalPhoto = photos.find((p) => p.stepId === 'frente') || photos[0];
      sessionStorage.setItem('dentai_image', frontalPhoto.dataUrl);

      await startAnalysis(photos.map((p) => ({ stepId: p.stepId, base64: p.base64 })));
    },
    [startAnalysis]
  );

  const handleAllPhotosReady = useCallback(
    (photos: CapturedPhoto[]) => {
      if (!disclaimerAcceptedRef.current) {
        setPendingPhotos(photos);
        setShowDisclaimer(true);
        return;
      }
      proceedWithAnalysis(photos);
    },
    [proceedWithAnalysis]
  );

  const handleDisclaimerAccept = useCallback(() => {
    disclaimerAcceptedRef.current = true;
    setShowDisclaimer(false);
    if (pendingPhotos) {
      proceedWithAnalysis(pendingPhotos);
      setPendingPhotos(null);
    }
  }, [pendingPhotos, proceedWithAnalysis]);

  // Navigate to results when analysis is done
  if (step === 'done' && analysisResult) {
    sessionStorage.setItem('dentai_analysis', JSON.stringify(analysisResult));
    if (afterImage) {
      sessionStorage.setItem('dentai_after', afterImage);
    }
    router.push('/resultado');
    return <LoadingSpinner message="Preparando resultados..." />;
  }

  // Show loading states
  if (step === 'validating' || step === 'analyzing' || step === 'generating') {
    const msg = stepMessages[step];
    return (
      <div className="space-y-4">
        <StepProgress currentStep={step === 'validating' ? 2 : 3} />
        <LoadingSpinner message={msg.message} subMessage={msg.subMessage} />
        <div className="text-center">
          <p className="text-xs text-gray-400">Suas fotos não são salvas em nenhum lugar</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (step === 'error') {
    return (
      <div className="space-y-4">
        <StepProgress currentStep={2} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="text-center space-y-4">
            <div className="text-4xl">😕</div>
            <h2 className="text-lg font-bold text-gray-900">Vamos tentar de novo?</h2>
            <p className="text-sm text-gray-600">{error}</p>
            <Button variant="primary" onClick={reset} className="w-full">
              Tirar novas fotos
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StepProgress currentStep={1} />
      <PhotoGuide onAllPhotosReady={handleAllPhotosReady} loading={step !== 'idle'} />
      <DisclaimerModal
        isOpen={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onCancel={() => {
          setShowDisclaimer(false);
          setPendingPhotos(null);
        }}
      />
    </div>
  );
}

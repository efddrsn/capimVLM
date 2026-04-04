'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import StepProgress from '@/components/StepProgress';
import DisclaimerModal from '@/components/DisclaimerModal';
import CameraCapture from '@/components/camera/CameraCapture';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAnalysis } from '@/hooks/useAnalysis';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const stepMessages: Record<string, { message: string; subMessage: string }> = {
  validating: {
    message: 'Verificando qualidade da imagem...',
    subMessage: 'Confirmando que é uma foto dental válida',
  },
  analyzing: {
    message: 'Analisando sua saúde bucal...',
    subMessage: 'A IA está identificando condições visíveis',
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
  const [pendingImage, setPendingImage] = useState<{ base64: string; dataUrl: string } | null>(null);
  const { step, analysisResult, afterImage, error, startAnalysis, reset } = useAnalysis();

  const proceedWithAnalysis = useCallback(
    async (base64: string, dataUrl: string) => {
      await startAnalysis(base64);
      sessionStorage.setItem('dentai_image', dataUrl);
    },
    [startAnalysis]
  );

  const handlePhotoReady = useCallback(
    (base64: string, dataUrl: string) => {
      if (!disclaimerAcceptedRef.current) {
        setPendingImage({ base64, dataUrl });
        setShowDisclaimer(true);
        return;
      }
      proceedWithAnalysis(base64, dataUrl);
    },
    [proceedWithAnalysis]
  );

  const handleDisclaimerAccept = useCallback(() => {
    disclaimerAcceptedRef.current = true;
    setShowDisclaimer(false);
    if (pendingImage) {
      proceedWithAnalysis(pendingImage.base64, pendingImage.dataUrl);
      setPendingImage(null);
    }
  }, [pendingImage, proceedWithAnalysis]);

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
          <p className="text-xs text-gray-400">Sua foto não é salva em nenhum lugar</p>
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
              Tirar outra foto
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StepProgress currentStep={1} />

      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-gray-900">Tire uma foto da sua boca</h1>
        <p className="text-sm text-gray-500 mt-1">
          Use boa iluminação e mantenha a câmera firme
        </p>
      </div>

      <CameraCapture
        onPhotoReady={handlePhotoReady}
        loading={step !== 'idle'}
      />

      <DisclaimerModal
        isOpen={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onCancel={() => {
          setShowDisclaimer(false);
          setPendingImage(null);
        }}
      />
    </div>
  );
}

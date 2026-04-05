'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCamera } from '@/hooks/useCamera';
import { useImageQuality } from '@/hooks/useImageQuality';
import CameraOverlay from './CameraOverlay';
import QualityChecks from './QualityChecks';
import PhotoPreview from './PhotoPreview';
import Button from '../ui/Button';
import { fileToBase64 } from '@/lib/image-utils';
import type { OverlayRegion } from '@/lib/types';

interface CameraCaptureProps {
  onPhotoReady: (base64: string, dataUrl: string) => void;
  loading?: boolean;
  region?: OverlayRegion;
  instructionText?: string;
}

export default function CameraCapture({ onPhotoReady, loading, region, instructionText }: CameraCaptureProps) {
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const { checks, allPassed, passedDuration } = useImageQuality({ videoRef, isStreaming });
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoCaptureDone = useRef(false);

  // Start camera on mount
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    return () => stopCamera();
  }, [mode, startCamera, stopCamera]);

  // Auto-capture when all checks pass for 1.5 seconds
  useEffect(() => {
    if (allPassed && passedDuration >= 1.5 && !capturedPhoto && !autoCaptureDone.current && !countdown) {
      autoCaptureDone.current = true;
      // Use a microtask to avoid direct setState in effect body
      queueMicrotask(() => setCountdown(3));
    }
  }, [allPassed, passedDuration, capturedPhoto, countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      const photo = capturePhoto();
      if (photo) {
        queueMicrotask(() => setCapturedPhoto(photo));
      }
      queueMicrotask(() => setCountdown(null));
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, capturePhoto]);

  const handleManualCapture = useCallback(() => {
    const photo = capturePhoto();
    if (photo) setCapturedPhoto(photo);
  }, [capturePhoto]);

  const handleRetake = useCallback(() => {
    setCapturedPhoto(null);
    autoCaptureDone.current = false;
    setCountdown(null);
  }, []);

  const handleUsePhoto = useCallback(() => {
    if (!capturedPhoto) return;
    const base64 = capturedPhoto.split(',')[1];
    onPhotoReady(base64, capturedPhoto);
  }, [capturedPhoto, onPhotoReady]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|heic|heif)$/i)) {
      alert('Formato não suportado. Use JPEG, PNG ou HEIC.');
      return;
    }

    const base64 = await fileToBase64(file);
    const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
    setCapturedPhoto(dataUrl);
  }, []);

  // Show preview if photo captured
  if (capturedPhoto) {
    return (
      <PhotoPreview
        photoDataUrl={capturedPhoto}
        onRetake={handleRetake}
        onUse={handleUsePhoto}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode toggle */}
      <div className="flex bg-gray-100 rounded-full p-1 gap-1">
        <button
          onClick={() => setMode('camera')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === 'camera' ? 'bg-white shadow text-sky-600' : 'text-gray-500'
          }`}
        >
          Câmera
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === 'upload' ? 'bg-white shadow text-sky-600' : 'text-gray-500'
          }`}
        >
          Galeria
        </button>
      </div>

      {mode === 'camera' ? (
        <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />

          {isStreaming && (
            <>
              <CameraOverlay region={region} instructionText={instructionText} />
              <QualityChecks checks={checks} />

              {/* Countdown overlay */}
              <AnimatePresence>
                {countdown !== null && countdown > 0 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      key={countdown}
                      className="text-white text-7xl font-bold"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                    >
                      {countdown}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Capture button */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                <button
                  onClick={handleManualCapture}
                  className="w-16 h-16 rounded-full border-4 border-white bg-white/20 active:bg-white/40 transition-colors"
                  aria-label="Capturar foto"
                >
                  <div className="w-full h-full rounded-full border-2 border-white/60" />
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-6">
              <div className="text-center">
                <p className="text-white text-sm mb-4">{error}</p>
                <Button variant="outline" onClick={startCamera}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition-colors"
          >
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
              <Image src="" alt="" width={32} height={32} className="hidden" />
              <span className="text-3xl">📁</span>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-medium">Toque para escolher uma foto</p>
              <p className="text-gray-500 text-sm mt-1">JPEG, PNG ou HEIC</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type QualityCheckResult, runAllChecks } from '@/lib/image-utils';

interface UseImageQualityOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  checkInterval?: number;
}

interface UseImageQualityReturn {
  checks: QualityCheckResult | null;
  allPassed: boolean;
  passedDuration: number;
}

export function useImageQuality({
  videoRef,
  isStreaming,
  checkInterval = 500,
}: UseImageQualityOptions): UseImageQualityReturn {
  const [checks, setChecks] = useState<QualityCheckResult | null>(null);
  const [allPassed, setAllPassed] = useState(false);
  const [passedDuration, setPassedDuration] = useState(0);
  const passedSinceRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const analyze = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const scale = 0.25;
    canvas.width = Math.floor(video.videoWidth * scale);
    canvas.height = Math.floor(video.videoHeight * scale);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const result = runAllChecks(canvas);
    setChecks(result);

    const passed = result.brightness.passed && result.focus.passed && result.proximity.passed;
    setAllPassed(passed);

    if (passed) {
      if (!passedSinceRef.current) {
        passedSinceRef.current = Date.now();
      }
      setPassedDuration((Date.now() - passedSinceRef.current) / 1000);
    } else {
      passedSinceRef.current = null;
      setPassedDuration(0);
    }
  }, [videoRef]);

  useEffect(() => {
    if (!isStreaming) {
      // Use a timeout to avoid synchronous setState in effect
      const id = setTimeout(() => {
        setChecks(null);
        setAllPassed(false);
        setPassedDuration(0);
      }, 0);
      passedSinceRef.current = null;
      return () => clearTimeout(id);
    }

    const interval = setInterval(analyze, checkInterval);
    return () => clearInterval(interval);
  }, [isStreaming, checkInterval, analyze]);

  return { checks, allPassed, passedDuration };
}

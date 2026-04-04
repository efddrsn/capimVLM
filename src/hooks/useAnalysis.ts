'use client';

import { useCallback, useState } from 'react';
import type { AnalysisResult, AnalysisStep, ValidationResult } from '@/lib/types';

interface UseAnalysisReturn {
  step: AnalysisStep;
  validationResult: ValidationResult | null;
  analysisResult: AnalysisResult | null;
  afterImage: string | null;
  error: string | null;
  startAnalysis: (imageBase64: string) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [step, setStep] = useState<AnalysisStep>('idle');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setValidationResult(null);
    setAnalysisResult(null);
    setAfterImage(null);
    setError(null);
  }, []);

  const startAnalysis = useCallback(async (imageBase64: string) => {
    try {
      // Step 1: Validate
      setStep('validating');
      const validateRes = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!validateRes.ok) throw new Error('Erro na validação da imagem');

      const validation: ValidationResult = await validateRes.json();
      setValidationResult(validation);

      if (!validation.isValid || validation.qualityScore < 60) {
        setStep('error');
        setError(validation.feedback || 'A imagem não atende aos critérios mínimos de qualidade.');
        return;
      }

      // Step 2: Analyze
      setStep('analyzing');
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!analyzeRes.ok) throw new Error('Erro na análise dental');

      const analysis: AnalysisResult = await analyzeRes.json();
      setAnalysisResult(analysis);

      // Step 3: Generate before/after
      if (analysis.condicoes_identificadas.length > 0) {
        setStep('generating');
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 20000);

          const generateRes = await fetch('/api/generate-after', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: imageBase64,
              conditions: analysis.condicoes_identificadas.map((c) => c.nome_popular),
            }),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (generateRes.ok) {
            const { afterImage: generated } = await generateRes.json();
            setAfterImage(generated);
          }
        } catch {
          // Before/after generation failure is non-blocking
          console.warn('Before/after generation failed or timed out, continuing without it');
        }
      }

      setStep('done');
    } catch (err) {
      setStep('error');
      setError(err instanceof Error ? err.message : 'Erro inesperado na análise');
    }
  }, []);

  return {
    step,
    validationResult,
    analysisResult,
    afterImage,
    error,
    startAnalysis,
    reset,
  };
}

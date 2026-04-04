'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '@/lib/types';
import StepProgress from '@/components/StepProgress';
import HealthScore from '@/components/results/HealthScore';
import ConditionCard from '@/components/results/ConditionCard';
import CostEstimate from '@/components/results/CostEstimate';
import BeforeAfter from '@/components/results/BeforeAfter';
import ShareCard from '@/components/results/ShareCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

function getSessionData() {
  if (typeof window === 'undefined') return null;
  const storedAnalysis = sessionStorage.getItem('dentai_analysis');
  if (!storedAnalysis) return null;
  return {
    analysis: JSON.parse(storedAnalysis) as AnalysisResult,
    beforeImage: sessionStorage.getItem('dentai_image'),
    afterImage: sessionStorage.getItem('dentai_after'),
  };
}

export default function ResultadoPage() {
  const router = useRouter();
  const data = useMemo(() => getSessionData(), []);

  if (!data) {
    router.push('/captura');
    return null;
  }

  const { analysis, beforeImage, afterImage } = data;

  return (
    <div className="space-y-5 pb-8">
      <StepProgress currentStep={4} />

      {/* Disclaimer bar */}
      <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 text-center">
        Avaliação educativa baseada em imagem. Consulte um dentista para diagnóstico.
      </div>

      {/* Health Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <HealthScore score={analysis.score_saude} status={analysis.saude_geral_visivel} />
      </motion.div>

      {/* Positive observations */}
      {analysis.observacoes_positivas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-emerald-50 border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <span>👍</span> Pontos positivos
            </h3>
            <ul className="space-y-1">
              {analysis.observacoes_positivas.map((obs, i) => (
                <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {obs}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Conditions */}
      {analysis.condicoes_identificadas.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900 text-lg">Pontos de atenção</h2>
          {analysis.condicoes_identificadas.map((condition, i) => (
            <ConditionCard key={i} condition={condition} index={i} />
          ))}
        </div>
      ) : (
        <Card className="text-center space-y-2">
          <div className="text-4xl">🎉</div>
          <h3 className="font-bold text-gray-900">Tudo parece bem!</h3>
          <p className="text-sm text-gray-600">
            Não identificamos condições visíveis preocupantes. Continue mantendo uma boa higiene bucal
            e faça check-ups regulares.
          </p>
        </Card>
      )}

      {/* Before/After */}
      {beforeImage && (
        <BeforeAfter beforeImage={beforeImage} afterImage={afterImage} />
      )}

      {/* Cost Estimate */}
      {analysis.condicoes_identificadas.length > 0 && (
        <CostEstimate conditions={analysis.condicoes_identificadas} />
      )}

      {/* Limitations */}
      {analysis.limitacoes_da_analise.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-2 text-sm">Limitações desta análise</h3>
            <ul className="space-y-1">
              {analysis.limitacoes_da_analise.map((lim, i) => (
                <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  {lim}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Share */}
      <ShareCard
        score={analysis.score_saude}
        conditionsCount={analysis.condicoes_identificadas.length}
      />

      {/* CTA to booking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <Link href="/agendamento">
          <Button variant="secondary" size="lg" className="w-full">
            Agendar consulta com dentista
          </Button>
        </Link>

        <Link href="/captura">
          <Button variant="ghost" size="md" className="w-full">
            Fazer nova avaliação
          </Button>
        </Link>
      </motion.div>

      {/* Final disclaimer */}
      <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <p className="font-medium mb-1">Disclaimer</p>
        <p>
          Esta é uma avaliação inicial baseada em imagem. NÃO substitui consulta presencial com dentista.
          Para diagnóstico definitivo, agende uma avaliação clínica com um profissional habilitado.
          Valores são estimativas e podem variar. A simulação visual é ilustrativa.
        </p>
      </div>
    </div>
  );
}

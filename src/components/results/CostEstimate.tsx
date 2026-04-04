'use client';

import { motion } from 'framer-motion';
import type { DentalCondition } from '@/lib/types';
import pricingData from '@/data/pricing.json';
import Card from '../ui/Card';

interface CostEstimateProps {
  conditions: DentalCondition[];
  region?: 'capitais' | 'interior';
}

// Map condition names to pricing keys
function getPricingKey(conditionName: string): string | null {
  const lower = conditionName.toLowerCase();
  if (lower.includes('cárie') || lower.includes('carie')) return 'carie';
  if (lower.includes('tártaro') || lower.includes('tartaro') || lower.includes('cálculo')) return 'tartaro';
  if (lower.includes('gengivite')) return 'gengivite';
  if (lower.includes('retração') || lower.includes('retracao')) return 'retracao_gengival';
  if (lower.includes('fratura') || lower.includes('lascado')) return 'fratura';
  if (lower.includes('ausente') || lower.includes('faltando')) return 'dente_ausente';
  if (lower.includes('oclusão') || lower.includes('oclusao') || lower.includes('alinhamento')) return 'ma_oclusao';
  if (lower.includes('bruxismo') || lower.includes('desgaste')) return 'bruxismo';
  return null;
}

export default function CostEstimate({ conditions, region = 'capitais' }: CostEstimateProps) {
  const pricing = pricingData as Record<string, Record<string, { procedimento: string; faixa_min: number; faixa_max: number; fatores: string; cobertura_convenio: string }>>;
  const estimates = conditions
    .map((c) => {
      const key = getPricingKey(c.nome_popular);
      if (!key || !pricing[key]) return null;
      return { condition: c.nome_popular, ...pricing[key][region] };
    })
    .filter(Boolean) as Array<{ condition: string; procedimento: string; faixa_min: number; faixa_max: number; fatores: string; cobertura_convenio: string }>;

  if (estimates.length === 0) return null;

  const totalMin = estimates.reduce((sum, e) => sum + e.faixa_min, 0);
  const totalMax = estimates.reduce((sum, e) => sum + e.faixa_max, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💰</span>
          Estimativa de Investimento
        </h3>

        <div className="space-y-3">
          {estimates.map((e, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.procedimento}</p>
                  <p className="text-xs text-gray-500">Para: {e.condition}</p>
                </div>
                <p className="text-sm font-bold text-sky-600 whitespace-nowrap">
                  R$ {e.faixa_min} - R$ {e.faixa_max}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{e.cobertura_convenio}</p>
            </div>
          ))}
        </div>

        {estimates.length > 1 && (
          <div className="mt-4 pt-3 border-t-2 border-sky-100">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Faixa total estimada</p>
              <p className="text-base font-bold text-sky-700">
                R$ {totalMin.toLocaleString('pt-BR')} - R$ {totalMax.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 italic">
          Valores estimados para {region === 'capitais' ? 'capitais' : 'interior'}. O orçamento final depende da avaliação presencial.
        </p>
      </Card>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import type { DentalCondition } from '@/lib/types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface ConditionCardProps {
  condition: DentalCondition;
  index: number;
}

const conditionIcons: Record<string, string> = {
  'cárie': '🦷',
  'tártaro': '🪨',
  'cálculo': '🪨',
  'gengivite': '🔴',
  'retração': '📉',
  'fratura': '💔',
  'ausente': '⭕',
  'afta': '⚪',
  'bruxismo': '😬',
  'oclusão': '🔀',
  'placa': '🧫',
};

function getIcon(condition: string): string {
  const lower = condition.toLowerCase();
  for (const [key, icon] of Object.entries(conditionIcons)) {
    if (lower.includes(key)) return icon;
  }
  return '🦷';
}

export default function ConditionCard({ condition, index }: ConditionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5">{getIcon(condition.nome_popular)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900">{condition.nome_popular}</h3>
              <Badge urgency={condition.urgencia} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{condition.nome_tecnico}</p>
            <p className="text-xs text-gray-500">{condition.regiao}</p>

            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              {condition.descricao_paciente}
            </p>

            <div className="mt-3 bg-amber-50 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-800 mb-1">
                E se eu não tratar?
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                {condition.consequencia_sem_tratamento}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

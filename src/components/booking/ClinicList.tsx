'use client';

import { motion } from 'framer-motion';
import type { Clinic } from '@/lib/types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ClinicListProps {
  clinics: Clinic[];
  onSelect: (clinic: Clinic) => void;
}

export default function ClinicList({ clinics, onSelect }: ClinicListProps) {
  return (
    <div className="space-y-3">
      {clinics.map((clinic, i) => (
        <motion.div
          key={clinic.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🏥
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{clinic.nome}</h3>
                  <span className="flex items-center gap-0.5 text-xs text-amber-600 flex-shrink-0">
                    ⭐ {clinic.avaliacao}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{clinic.endereco}</p>
                <p className="text-xs text-gray-500">{clinic.cidade}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {clinic.especialidades.map((esp) => (
                    <span key={esp} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                      {esp}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-emerald-600 font-medium">
                    Agenda em {clinic.dias_disponivel} dia{clinic.dias_disponivel > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="primary" onClick={() => onSelect(clinic)} className="flex-1">
                    Agendar
                  </Button>
                  <a
                    href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de agendar uma avaliação dental. Fiz uma pré-avaliação pelo DentAI.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${clinic.telefone}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    📞
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

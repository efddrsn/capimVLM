'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Hero */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-2">🦷</div>
        <h1 className="text-3xl font-bold text-gray-900">
          Sua saúde bucal em
          <br />
          <span className="text-sky-600">menos de 2 minutos</span>
        </h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
          Tire uma foto da boca e receba uma avaliação inicial com linguagem simples,
          estimativa de custo e simulação visual do resultado.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm"
      >
        <Link href="/captura">
          <Button variant="primary" size="lg" className="w-full text-lg">
            Começar avaliação gratuita
          </Button>
        </Link>
      </motion.div>

      {/* How it works */}
      <motion.div
        className="w-full space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-bold text-gray-900 text-center">Como funciona</h2>

        <div className="grid gap-3">
          {[
            { step: '1', icon: '📸', title: 'Tire uma foto', desc: 'Use a câmera ou envie da galeria' },
            { step: '2', icon: '🤖', title: 'IA analisa', desc: 'Gemini Vision identifica condições visíveis' },
            { step: '3', icon: '📋', title: 'Receba o resultado', desc: 'Diagnóstico simples, custo estimado e simulação' },
            { step: '4', icon: '🏥', title: 'Agende se quiser', desc: 'Encontre clínicas credenciadas perto de você' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trust signals */}
      <motion.div
        className="w-full space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-sky-50 rounded-xl p-4 flex items-start gap-3">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-sm font-medium text-sky-900">Sua privacidade é prioridade</p>
            <p className="text-xs text-sky-700 mt-0.5">
              Nenhuma foto é armazenada. O processamento é efêmero e a imagem é descartada após a análise.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
          <span className="text-lg">⚕️</span>
          <div>
            <p className="text-sm font-medium text-amber-900">Avaliação educativa</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Esta ferramenta NÃO substitui consulta com dentista. É uma pré-triagem visual para orientação.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

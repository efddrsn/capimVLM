'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Button from './ui/Button';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export default function DisclaimerModal({ isOpen, onAccept, onCancel }: DisclaimerModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">
                ⚕️
              </div>
              <h2 className="text-lg font-bold text-gray-900">Aviso Importante</h2>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
              <p className="font-medium mb-2">Esta é uma avaliação inicial baseada em imagem.</p>
              <p>
                <strong>NÃO substitui</strong> consulta presencial com dentista. Para diagnóstico
                definitivo, agende uma avaliação clínica com um profissional habilitado.
              </p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 text-sm text-sky-900">
              <p className="flex items-center gap-2">
                <span>🔒</span>
                <span>Sua foto não é salva em nenhum lugar. O processamento é temporário e a imagem é descartada após a análise.</span>
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">
                Entendo que esta é uma avaliação educativa e informativa, e que devo consultar um dentista para diagnóstico.
              </span>
            </label>

            <div className="flex gap-3">
              <Button variant="ghost" size="md" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!accepted}
                onClick={onAccept}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

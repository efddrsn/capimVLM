'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ShareCardProps {
  score: number;
  conditionsCount: number;
}

export default function ShareCard({ score, conditionsCount }: ShareCardProps) {
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'DentAI — Minha Avaliação Dental',
      text: `Fiz minha pré-avaliação dental com IA! Saúde bucal: ${score}/10. ${conditionsCount} ponto(s) de atenção identificados. Faça a sua também!`,
      url: window.location.origin,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShared(true);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  }, [score, conditionsCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="text-center space-y-3">
          <p className="text-2xl">📤</p>
          <h3 className="font-bold text-gray-900">Compartilhe seu resultado</h3>
          <p className="text-sm text-gray-600">
            Ajude amigos e familiares a cuidarem da saúde bucal
          </p>
          <Button
            variant={shared ? 'secondary' : 'primary'}
            onClick={handleShare}
            className="w-full"
          >
            {shared ? 'Link copiado!' : 'Compartilhar resultado'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

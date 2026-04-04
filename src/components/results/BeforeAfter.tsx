'use client';

import { motion } from 'framer-motion';
import BeforeAfterSlider from '../ui/Slider';
import Card from '../ui/Card';

interface BeforeAfterProps {
  beforeImage: string; // data URL
  afterImage: string | null; // data URL or null if generation failed
}

export default function BeforeAfter({ beforeImage, afterImage }: BeforeAfterProps) {
  if (!afterImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card padding={false} className="overflow-hidden">
        <div className="p-4 pb-2">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span>✨</span>
            Simulação: Antes e Depois
          </h3>
        </div>
        <div className="px-4 pb-4">
          <BeforeAfterSlider
            beforeSrc={beforeImage}
            afterSrc={afterImage}
            beforeLabel="Atual"
            afterLabel="Após tratamento"
          />
        </div>
      </Card>
    </motion.div>
  );
}

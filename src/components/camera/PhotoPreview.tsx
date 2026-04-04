'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface PhotoPreviewProps {
  photoDataUrl: string;
  onRetake: () => void;
  onUse: () => void;
  loading?: boolean;
}

export default function PhotoPreview({ photoDataUrl, onRetake, onUse, loading }: PhotoPreviewProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUrl}
          alt="Foto capturada"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <Button variant="outline" onClick={onRetake} className="flex-1" disabled={loading}>
          Tirar outra
        </Button>
        <Button variant="primary" onClick={onUse} className="flex-1" loading={loading}>
          Usar esta foto
        </Button>
      </div>
    </motion.div>
  );
}

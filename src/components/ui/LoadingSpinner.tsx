'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingSpinner({ message, subMessage }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && <p className="text-gray-700 font-medium text-center">{message}</p>}
      {subMessage && <p className="text-gray-500 text-sm text-center">{subMessage}</p>}
    </div>
  );
}

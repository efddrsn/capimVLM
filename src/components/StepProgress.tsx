'use client';

import { motion } from 'framer-motion';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const stepLabels = ['Foto', 'Validação', 'Análise', 'Resultado', 'Agendamento'];

export default function StepProgress({ currentStep, totalSteps = 5 }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-3">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={stepNum} className="flex items-center gap-1">
            <motion.div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
                transition-colors duration-300
                ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                ${isActive ? 'bg-sky-600 text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-400' : ''}
              `}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {isCompleted ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                stepNum
              )}
            </motion.div>
            <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-sky-600 font-medium' : 'text-gray-400'}`}>
              {stepLabels[i]}
            </span>
            {i < totalSteps - 1 && (
              <div className={`w-4 sm:w-8 h-0.5 mx-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

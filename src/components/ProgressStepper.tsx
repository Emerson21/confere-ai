'use client';

import React, { useEffect, useState } from 'react';
import { Lock, Search, Sparkles, Check } from 'lucide-react';

interface ProgressStepperProps {
  onComplete?: () => void;
}

const STEPS = [
  {
    id: 1,
    label: 'Removendo dados pessoais por privacidade...',
    icon: Lock,
  },
  {
    id: 2,
    label: 'Analisando padrões e consultando bases de checagem...',
    icon: Search,
  },
  {
    id: 3,
    label: 'Sintetizando explicação pedagógica...',
    icon: Sparkles,
  },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = () => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1100);
    const timer2 = setTimeout(() => setCurrentStep(3), 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto py-10 px-6 space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Analisando conteúdo com segurança</h2>
        <p className="text-sm text-gray-600">
          Nosso pipeline de proteção executa múltiplas etapas antes de responder.
        </p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-teal-50/80 border-teal-500 shadow-sm'
                  : isDone
                  ? 'bg-white border-teal-200/80'
                  : 'bg-gray-50/50 border-gray-200 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDone
                    ? 'bg-teal-600 text-white'
                    : isCurrent
                    ? 'bg-teal-600 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-semibold leading-tight ${
                    isCurrent ? 'text-teal-900' : isDone ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-xs text-teal-700 font-medium animate-pulse">
                    Processando...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

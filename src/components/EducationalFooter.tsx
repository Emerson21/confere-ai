'use client';

import React from 'react';
import { HelpCircle, CheckCheck } from 'lucide-react';

interface EducationalFooterProps {
  adviceList: string[];
}

export const EducationalFooter: React.FC<EducationalFooterProps> = ({ adviceList }) => {
  const steps = adviceList.length > 0 ? adviceList : [
    'Não realize pagamentos ou forneça dados pessoais.',
    'Confirme a informação diretamente pelos canais oficiais da instituição.',
  ];

  return (
    <div className="w-full rounded-2xl bg-teal-50 border border-teal-200 p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-teal-800">
        <HelpCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <h3 className="font-bold text-lg leading-tight">O que fazer agora?</h3>
      </div>

      <ul className="space-y-2.5 text-base text-gray-800">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-2.5 leading-snug">
            <span className="font-bold text-teal-700 min-w-[20px]">{idx + 1}.</span>
            <span>{step.replace(/^\d+\.\s*/, '')}</span>
          </li>
        ))}
      </ul>

      <div className="pt-3 border-t border-teal-200/60 flex items-center gap-2 text-xs text-teal-900/80">
        <CheckCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
        <span>Dica: Em caso de dúvida, nunca tome decisões sob pressão ou urgência.</span>
      </div>
    </div>
  );
};

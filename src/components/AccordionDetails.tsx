'use client';

import React, { useState } from 'react';
import { ChevronDown, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Indicator, FactCheckSource } from '@/domain/types/analysis';

interface AccordionDetailsProps {
  indicators: Indicator[];
  sources: FactCheckSource[];
  detailedExplanation: string;
  defaultOpen?: boolean;
}

export const AccordionDetails: React.FC<AccordionDetailsProps> = ({
  indicators,
  sources,
  detailedExplanation,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full rounded-2xl border border-teal-600/30 overflow-hidden bg-white shadow-sm transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Ver Detalhes e Fontes"
        className="w-full bg-teal-600 text-white px-5 py-3.5 flex items-center justify-between font-semibold text-base min-h-[48px] hover:bg-teal-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <span>Ver Detalhes e Fontes</span>
        <ChevronDown
          className={`w-5 h-5 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-5 space-y-4 bg-white text-gray-900">
          {/* Indicadores de Risco */}
          {indicators.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Sinais Identificados
              </h4>
              <ul className="space-y-2.5">
                {indicators.map((indicator, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-base leading-relaxed text-gray-800"
                  >
                    <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">
                        {indicator.type === 'URGENCIA'
                          ? 'Pagamento Urgente: '
                          : indicator.type === 'PADRAO_GOLPE'
                          ? 'Padrão Suspeito: '
                          : indicator.type === 'TYPOSQUATTING'
                          ? 'Domínio Falso: '
                          : indicator.type === 'DADOS_INCOERENTES'
                          ? 'Dados Incoerentes: '
                          : 'Sinal de Atenção: '}
                      </span>
                      <span>{indicator.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explicação detalhada */}
          {detailedExplanation && (
            <div className="pt-2 border-t border-gray-100 text-sm text-gray-700 leading-relaxed">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">
                Contextualização Pedagógica
              </h4>
              <p>{detailedExplanation}</p>
            </div>
          )}

          {/* Fontes consultadas */}
          {sources.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                Bases Oficiais Consultadas
              </h4>
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-sm"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 truncate">
                        {source.publisher}:
                      </span>
                      <span className="text-gray-700 truncate">{source.title}</span>
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-medium text-xs flex-shrink-0 min-h-[48px] min-w-[48px] justify-center"
                        aria-label={`Acessar fonte externa: ${source.title}`}
                      >
                        Acessar <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

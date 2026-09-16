'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck, HelpCircle, Lock } from 'lucide-react';
import { AnalysisResponse } from '@/domain/types/analysis';
import { AccordionDetails } from '@/components/AccordionDetails';
import { EducationalFooter } from '@/components/EducationalFooter';

interface ResultViewProps {
  analysis: AnalysisResponse;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ analysis, onReset }) => {
  const isHighRiskOrSuspicious =
    analysis.risk_level === 'SUSPEITO' || analysis.risk_level === 'ALTO_RISCO';
  const isLowRisk = analysis.risk_level === 'BAIXO_RISCO';

  return (
    <section className="w-full max-w-md mx-auto space-y-4 px-4 py-6 animate-fadeIn">
      {/* 1. Status Banner */}
      <div
        className={`w-full rounded-2xl p-4 flex items-center gap-3 border shadow-sm ${
          isHighRiskOrSuspicious
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : isLowRisk
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}
      >
        {isHighRiskOrSuspicious ? (
          <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
        ) : isLowRisk ? (
          <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
        ) : (
          <HelpCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />
        )}
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">
            {analysis.badge_label}
          </h2>
          <p className="text-xs text-gray-600">
            {isHighRiskOrSuspicious
              ? 'Identificamos características frequentes em golpes digitais.'
              : isLowRisk
              ? 'Conteúdo com coerência em fontes públicas conhecidas.'
              : 'Não foi possível atestar a veracidade com as evidências atuais.'}
          </p>
        </div>
      </div>

      {/* 2. Short Summary Card */}
      <div className="w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
          {analysis.short_summary}
        </p>
      </div>

      {/* 3. Accordion de Detalhes e Fontes */}
      <AccordionDetails
        indicators={analysis.indicators}
        sources={analysis.sources}
        detailedExplanation={analysis.detailed_explanation}
      />

      {/* 4. O Que Fazer Agora? */}
      <EducationalFooter adviceList={analysis.actionable_advice} />

      {/* 5. Feedback de Privacidade de Dados */}
      {analysis.pii_redacted_count > 0 && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-teal-800 font-medium py-1">
          <Lock className="w-3.5 h-3.5 text-teal-600" />
          <span>
            {analysis.pii_redacted_count} dado(s) sensível(is) protegido(s) durante a checagem.
          </span>
        </div>
      )}

      {/* 6. Botão de Ação: Nova Verificação */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base uppercase rounded-xl h-14 flex items-center justify-center transition shadow-md min-h-[48px] focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          NOVA VERIFICAÇÃO
        </button>
      </div>

      {/* 7. Disclaimer Pedagógico de Incerteza (Inviolável) */}
      <p className="text-center text-xs text-gray-500 pt-2 leading-relaxed">
        O <strong>Confere Aí</strong> é um assistente educativo que apoia sua tomada de decisão.
        Nenhuma ferramenta digital oferece 100% de garantia. Em caso de dúvida, sempre consulte os canais oficiais.
      </p>
    </section>
  );
};

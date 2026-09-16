import {
  AnalysisResponse,
  Indicator,
  FactCheckSource,
  RiskLevel,
} from '@/domain/types/analysis';

export interface RiskAssessmentProps {
  riskLevel: RiskLevel;
  badgeLabel: string;
  shortSummary: string;
  indicators: Indicator[];
  sources: FactCheckSource[];
  detailedExplanation: string;
  actionableAdvice: string[];
}

export class RiskAssessment {
  public readonly riskLevel: RiskLevel;
  public readonly badgeLabel: string;
  public readonly shortSummary: string;
  public readonly indicators: Indicator[];
  public readonly sources: FactCheckSource[];
  public readonly detailedExplanation: string;
  public readonly actionableAdvice: string[];

  private static readonly FORBIDDEN_ABSOLUTE_TERMS = [
    /100%\s*segur[oa]/i,
    /totalmente\s*confi[aá]vel/i,
    /isent[oa]\s*de\s*risco/i,
    /garantia\s*total/i,
    /garantid[oa]/i,
    /segur[oa]\s*garantid[oa]/i,
  ];

  constructor(props: RiskAssessmentProps) {
    this.assertNoAbsoluteGuarantees(props);

    this.riskLevel = props.riskLevel;
    this.badgeLabel = props.badgeLabel;
    this.shortSummary = props.shortSummary;
    this.indicators = props.indicators;
    this.sources = props.sources;
    this.detailedExplanation = props.detailedExplanation;
    this.actionableAdvice = props.actionableAdvice;
  }

  private assertNoAbsoluteGuarantees(props: RiskAssessmentProps): void {
    const textToScan = [
      props.badgeLabel,
      props.shortSummary,
      props.detailedExplanation,
      ...props.actionableAdvice,
    ].join(' ');

    for (const pattern of RiskAssessment.FORBIDDEN_ABSOLUTE_TERMS) {
      if (pattern.test(textToScan)) {
        throw new Error(
          `Falsa sensação de segurança detectada: "${pattern}". É expressamente proibido declarar segurança absoluta no Confere Aí.`
        );
      }
    }
  }

  public toResponse(piiRedactedCount: number): AnalysisResponse {
    return {
      risk_level: this.riskLevel,
      badge_label: this.badgeLabel,
      short_summary: this.shortSummary,
      indicators: this.indicators,
      sources: this.sources,
      detailed_explanation: this.detailedExplanation,
      actionable_advice: this.actionableAdvice,
      pii_redacted_count: piiRedactedCount,
    };
  }

  public static createInconclusiveFallback(reason?: string): RiskAssessment {
    return new RiskAssessment({
      riskLevel: 'INCONCLUSIVO',
      badgeLabel: 'Evidências Insuficientes',
      shortSummary:
        reason ||
        'Não encontramos evidências suficientes para concluir com segurança sobre a veracidade desta informação.',
      indicators: [
        {
          type: 'INFORMACAO_FALSA',
          description: 'Ausência de registros consolidados em bases públicas e agências oficiais de checagem.',
          severity: 'BAIXA',
        },
      ],
      sources: [],
      detailedExplanation:
        'A ausência de sinais claros de golpe ou registros em bases de checagem não significa necessariamente que a informação é legítima. Recomendamos cautela preventiva.',
      actionableAdvice: [
        'Consulte diretamente os canais oficiais da instituição antes de tomar qualquer ação.',
        'Nunca forneça senhas, dados de cartão ou códigos de verificação recebidos por SMS.',
        'Não clique em links encurtados ou suspeitos.',
      ],
    });
  }
}

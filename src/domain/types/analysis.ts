/**
 * Domínio do Confere Aí: Níveis de Risco e Contratos de Análise
 * REQUISITO INVIOLÁVEL: Nunca utilizar termos como "100% Seguro".
 */
export type RiskLevel = 'BAIXO_RISCO' | 'SUSPEITO' | 'ALTO_RISCO' | 'INCONCLUSIVO';

export type IndicatorType =
  | 'URGENCIA'
  | 'TYPOSQUATTING'
  | 'DADOS_INCOERENTES'
  | 'PADRAO_GOLPE'
  | 'INFORMACAO_FALSA';

export type SeverityLevel = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface Indicator {
  type: IndicatorType;
  description: string;
  severity: SeverityLevel;
}

export interface FactCheckSource {
  title: string;
  publisher: string;
  url: string;
  rating: string;
}

export interface AnalysisResponse {
  risk_level: RiskLevel;
  badge_label: string;
  short_summary: string;
  indicators: Indicator[];
  sources: FactCheckSource[];
  detailed_explanation: string;
  actionable_advice: string[];
  pii_redacted_count: number;
}

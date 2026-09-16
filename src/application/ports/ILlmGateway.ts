import { AnalysisResponse, FactCheckSource } from '@/domain/types/analysis';

export interface LlmAnalysisInput {
  sanitizedText: string;
  sources: FactCheckSource[];
}

export interface ILlmGateway {
  analyzeContent(input: LlmAnalysisInput): Promise<Omit<AnalysisResponse, 'pii_redacted_count'>>;
}

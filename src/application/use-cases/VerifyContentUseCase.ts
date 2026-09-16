import { IPiiSanitizer } from '@/application/ports/IPiiSanitizer';
import { IFactCheckGateway } from '@/application/ports/IFactCheckGateway';
import { ILlmGateway } from '@/application/ports/ILlmGateway';
import { AnalysisResponse, FactCheckSource } from '@/domain/types/analysis';
import { RiskAssessment } from '@/domain/entities/RiskAssessment';

export interface VerifyContentInput {
  content: string;
  contentType: 'text' | 'url' | 'image_base64';
}

export class VerifyContentUseCase {
  constructor(
    private readonly piiSanitizer: IPiiSanitizer,
    private readonly factCheckGateway: IFactCheckGateway,
    private readonly llmGateway: ILlmGateway
  ) {}

  public async execute(input: VerifyContentInput): Promise<AnalysisResponse> {
    if (!input.content || input.content.trim() === '') {
      throw new Error('Conteúdo para análise não pode estar vazio.');
    }

    // 1. Sanitizar dados pessoais obrigatoriamente antes de qualquer consulta externa
    const sanitizationResult = this.piiSanitizer.sanitize(input.content);

    try {
      // 2. Buscar evidências em bases públicas e agências de checagem
      let sources: FactCheckSource[] = [];
      try {
        sources = await this.factCheckGateway.search(sanitizationResult.sanitizedText);
      } catch {
        // Falhas de rede na busca de fatos não devem derrubar o pipeline
        sources = [];
      }

      // 3. Chamar LLM isolando o input sanitizado
      const analysis = await this.llmGateway.analyzeContent({
        sanitizedText: sanitizationResult.sanitizedText,
        sources,
      });

      // 4. Validar e construir entidade de domínio garantindo salvaguardas (invariants)
      const assessment = new RiskAssessment({
        riskLevel: analysis.risk_level,
        badgeLabel: analysis.badge_label,
        shortSummary: analysis.short_summary,
        indicators: analysis.indicators,
        sources: analysis.sources,
        detailedExplanation: analysis.detailed_explanation,
        actionableAdvice: analysis.actionable_advice,
      });

      return assessment.toResponse(sanitizationResult.redactedCount);
    } catch {
      // 5. Degradação Graciosa: Em caso de falha de IA/Timeout, retorna veredito INCONCLUSIVO seguro
      const fallback = RiskAssessment.createInconclusiveFallback();
      return fallback.toResponse(sanitizationResult.redactedCount);
    }
  }
}

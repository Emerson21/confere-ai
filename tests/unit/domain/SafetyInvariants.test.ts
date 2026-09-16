import { describe, it, expect } from 'vitest';
import { RiskAssessment } from '@/domain/entities/RiskAssessment';
import { RiskLevel } from '@/domain/types/analysis';

describe('US-05: Gestão de Incerteza e Trava de Segurança ("False Sense of Security")', () => {
  it('não deve permitir que o veredito contenha termos de falsa segurança absoluta', () => {
    expect(() => {
      new RiskAssessment({
        riskLevel: 'BAIXO_RISCO',
        badgeLabel: '100% Seguro',
        shortSummary: 'Este conteúdo é totalmente confiável e garantido.',
        indicators: [],
        sources: [],
        detailedExplanation: 'Garantia total de segurança.',
        actionableAdvice: ['Pode confiar de olhos fechados'],
      });
    }).toThrowError(/Falsa sensação de segurança detectada/);
  });

  it('deve aceitar os níveis de risco autorizados no SDD', () => {
    const validLevels: RiskLevel[] = ['BAIXO_RISCO', 'SUSPEITO', 'ALTO_RISCO', 'INCONCLUSIVO'];

    validLevels.forEach((level) => {
      const assessment = new RiskAssessment({
        riskLevel: level,
        badgeLabel: level === 'BAIXO_RISCO' ? 'Baixo Risco' : 'Atenção aos Sinais',
        shortSummary: 'Orientação preventiva para o usuário.',
        indicators: [],
        sources: [],
        detailedExplanation: 'Análise fundamentada.',
        actionableAdvice: ['Verifique nos canais oficiais'],
      });

      expect(assessment.riskLevel).toBe(level);
    });
  });

  it('deve criar um veredito INCONCLUSIVO seguro caso falte contexto ou evidências', () => {
    const fallback = RiskAssessment.createInconclusiveFallback(
      'Não encontramos evidências suficientes para concluir.'
    );

    expect(fallback.riskLevel).toBe('INCONCLUSIVO');
    expect(fallback.badgeLabel).toBe('Evidências Insuficientes');
    expect(fallback.shortSummary).toContain('Não encontramos evidências suficientes');
    expect(fallback.actionableAdvice).toContain(
      'Consulte diretamente os canais oficiais da instituição antes de tomar qualquer ação.'
    );
  });
});

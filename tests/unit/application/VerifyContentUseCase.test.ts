import { describe, it, expect, vi } from 'vitest';
import { VerifyContentUseCase } from '@/application/use-cases/VerifyContentUseCase';
import { IPiiSanitizer } from '@/application/ports/IPiiSanitizer';
import { IFactCheckGateway } from '@/application/ports/IFactCheckGateway';
import { ILlmGateway } from '@/application/ports/ILlmGateway';
import { FactCheckSource } from '@/domain/types/analysis';

describe('US-03 & US-05: VerifyContentUseCase (Orquestração de RAG e Fact-Checking)', () => {
  const mockPiiSanitizer: IPiiSanitizer = {
    sanitize: vi.fn(),
  };

  const mockFactCheckGateway: IFactCheckGateway = {
    search: vi.fn(),
  };

  const mockLlmGateway: ILlmGateway = {
    analyzeContent: vi.fn(),
  };

  const useCase = new VerifyContentUseCase(
    mockPiiSanitizer,
    mockFactCheckGateway,
    mockLlmGateway
  );

  it('deve orquestrar a sanitização, busca de fatos e análise por IA com sucesso', async () => {
    vi.mocked(mockPiiSanitizer.sanitize).mockReturnValue({
      sanitizedText: 'Mensagem com Pix para [EMAIL_OCULTO] urgente.',
      redactedCount: 1,
      detectedTypes: ['EMAIL'],
    });

    const mockSources: FactCheckSource[] = [
      {
        title: 'Alerta sobre golpe de cobrança falsa',
        publisher: 'Agência Lupa',
        url: 'https://lupa.uol.com.br/golpe',
        rating: 'Falso',
      },
    ];
    vi.mocked(mockFactCheckGateway.search).mockResolvedValue(mockSources);

    vi.mocked(mockLlmGateway.analyzeContent).mockResolvedValue({
      risk_level: 'SUSPEITO',
      badge_label: 'Suspeita de Golpe',
      short_summary: 'Mensagem utiliza gatilhos de urgência e dados inconsistentes.',
      indicators: [
        {
          type: 'URGENCIA',
          description: 'Pressão excessiva para pagamento em poucas horas.',
          severity: 'ALTA',
        },
      ],
      sources: mockSources,
      detailed_explanation: 'Análise detalhada comprovando o padrão de golpe.',
      actionable_advice: ['Não realize transferências', 'Bloqueie o contato'],
    });

    const result = await useCase.execute({
      content: 'Mensagem com Pix para fraude@banco.com urgente.',
      contentType: 'text',
    });

    expect(mockPiiSanitizer.sanitize).toHaveBeenCalledWith(
      'Mensagem com Pix para fraude@banco.com urgente.'
    );
    expect(mockLlmGateway.analyzeContent).toHaveBeenCalledWith({
      sanitizedText: 'Mensagem com Pix para [EMAIL_OCULTO] urgente.',
      sources: mockSources,
    });
    expect(result.risk_level).toBe('SUSPEITO');
    expect(result.pii_redacted_count).toBe(1);
    expect(result.sources).toHaveLength(1);
  });

  it('deve degradar graciosamente para INCONCLUSIVO se o gateway de LLM falhar ou der timeout', async () => {
    vi.mocked(mockPiiSanitizer.sanitize).mockReturnValue({
      sanitizedText: 'Texto limpo',
      redactedCount: 0,
      detectedTypes: [],
    });
    vi.mocked(mockFactCheckGateway.search).mockResolvedValue([]);
    vi.mocked(mockLlmGateway.analyzeContent).mockRejectedValue(new Error('Gateway Timeout'));

    const result = await useCase.execute({
      content: 'Texto limpo',
      contentType: 'text',
    });

    expect(result.risk_level).toBe('INCONCLUSIVO');
    expect(result.badge_label).toBe('Evidências Insuficientes');
    expect(result.short_summary).toContain('Não encontramos evidências suficientes');
    expect(result.actionable_advice.length).toBeGreaterThan(0);
  });

  it('deve enriquecer links com metadados/título via IUrlMetadataGateway quando contentType for url', async () => {
    const mockUrlGateway = {
      fetchMetadata: vi.fn().mockResolvedValue({
        originalUrl: 'https://instagram.com/reel/123',
        title: 'Vídeo sobre golpe do falso Pix',
        description: 'Alerta sobre criminosos ligando fingindo ser gerentes',
      }),
    };

    const useCaseWithUrlEnrichment = new VerifyContentUseCase(
      mockPiiSanitizer,
      mockFactCheckGateway,
      mockLlmGateway,
      mockUrlGateway
    );

    vi.mocked(mockPiiSanitizer.sanitize).mockImplementation((text) => ({
      sanitizedText: text,
      redactedCount: 0,
      detectedTypes: [],
    }));

    vi.mocked(mockFactCheckGateway.search).mockResolvedValue([]);
    vi.mocked(mockLlmGateway.analyzeContent).mockResolvedValue({
      risk_level: 'SUSPEITO',
      badge_label: 'Suspeita de Golpe',
      short_summary: 'Vídeo alerta sobre golpe.',
      indicators: [],
      sources: [],
      detailed_explanation: 'Explicação.',
      actionable_advice: [],
    });

    await useCaseWithUrlEnrichment.execute({
      content: 'https://instagram.com/reel/123',
      contentType: 'url',
    });

    expect(mockUrlGateway.fetchMetadata).toHaveBeenCalledWith('https://instagram.com/reel/123');
    expect(mockPiiSanitizer.sanitize).toHaveBeenCalledWith(
      expect.stringContaining('Título / Legenda do Conteúdo: Vídeo sobre golpe do falso Pix')
    );
  });

  it('deve rejeitar entrada vazia com erro de validação de domínio', async () => {
    await expect(
      useCase.execute({
        content: '   ',
        contentType: 'text',
      })
    ).rejects.toThrowError(/Conteúdo para análise não pode estar vazio/);
  });
});


import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultView } from '@/components/ResultView';
import { AnalysisResponse } from '@/domain/types/analysis';

describe('UI Component: ResultView', () => {
  const mockAnalysis: AnalysisResponse = {
    risk_level: 'SUSPEITO',
    badge_label: 'ATENÇÃO: Suspeita de Golpe',
    short_summary: 'Esta mensagem cobra um valor urgente via Pix e usa dados de um beneficiário desconhecido.',
    indicators: [
      {
        type: 'URGENCIA',
        description: 'Solicitação de transferência imediata.',
        severity: 'ALTA',
      },
      {
        type: 'PADRAO_GOLPE',
        description: 'Beneficiário sem vínculo com a instituição alegada.',
        severity: 'MEDIA',
      },
    ],
    sources: [
      {
        title: 'Banco Central & Checagem Oficial',
        publisher: 'Banco Central',
        url: 'https://bcb.gov.br',
        rating: 'Oficial',
      },
    ],
    detailed_explanation: 'Explicação detalhada dos padrões de fraude.',
    actionable_advice: ['Não faça a transferência', 'Bloqueie o contato'],
    pii_redacted_count: 2,
  };

  it('deve renderizar banner de status, resumo curto e lista de conselhos práticos', () => {
    render(<ResultView analysis={mockAnalysis} onReset={() => {}} />);

    expect(screen.getByText('ATENÇÃO: Suspeita de Golpe')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Esta mensagem cobra um valor urgente via Pix e usa dados de um beneficiário desconhecido.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('O que fazer agora?')).toBeInTheDocument();
    expect(screen.getByText('Não faça a transferência')).toBeInTheDocument();
    expect(screen.getByText('Bloqueie o contato')).toBeInTheDocument();
  });

  it('deve alternar a visualização do accordion de detalhes ao clicar', () => {
    render(<ResultView analysis={mockAnalysis} onReset={() => {}} />);

    const accordionTrigger = screen.getByRole('button', { name: /Ver Detalhes e Fontes/i });
    expect(accordionTrigger).toBeInTheDocument();

    // Detalhes visíveis após toggle ou por padrão
    fireEvent.click(accordionTrigger);
    expect(screen.getByText(/Solicitação de transferência imediata/i)).toBeInTheDocument();
  });

  it('deve disparar onReset ao clicar no botão NOVA VERIFICAÇÃO', () => {
    const onResetMock = vi.fn();
    render(<ResultView analysis={mockAnalysis} onReset={onResetMock} />);

    const newCheckBtn = screen.getByRole('button', { name: /NOVA VERIFICAÇÃO/i });
    fireEvent.click(newCheckBtn);

    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});

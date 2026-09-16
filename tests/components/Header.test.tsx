import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header';

describe('UI Component: Header', () => {
  it('deve renderizar o título Confere Aí e o ícone de escudo', () => {
    render(<Header />);
    expect(screen.getByText('Confere Aí')).toBeInTheDocument();
    expect(screen.getByLabelText('Logo Confere Aí')).toBeInTheDocument();
  });

  it('deve exibir botão de voltar e chamar callback quando onBack for fornecido', () => {
    const onBackMock = vi.fn();
    render(<Header onBack={onBackMock} />);

    const backButton = screen.getByLabelText('Voltar');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });
});

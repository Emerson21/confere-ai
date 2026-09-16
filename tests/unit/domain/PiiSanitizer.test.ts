import { describe, it, expect } from 'vitest';
import { RegexPiiSanitizer } from '@/infrastructure/sanitizer/RegexPiiSanitizer';

describe('US-02: Sanitização de Dados Pessoais (PII Scrubbing)', () => {
  const sanitizer = new RegexPiiSanitizer();

  describe('Redação de CPF', () => {
    it('deve ocultar CPF formatado (xxx.xxx.xxx-xx)', () => {
      const input = 'Meu CPF é 123.456.789-00, por favor verifique.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('123.456.789-00');
      expect(result.sanitizedText).toContain('[CPF_OCULTO]');
      expect(result.redactedCount).toBe(1);
      expect(result.detectedTypes).toContain('CPF');
    });

    it('deve ocultar CPF sem pontuação contendo 11 dígitos sequenciais', () => {
      const input = 'Chave CPF 12345678900 para envio do pagamento.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('12345678900');
      expect(result.sanitizedText).toContain('[CPF_OCULTO]');
      expect(result.redactedCount).toBe(1);
    });

    it('não deve ofuscar valores monetários ou números normais como se fossem CPF', () => {
      const input = 'Cobrança no valor de R$ 150,00 com vencimento em 10/10/2026.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).toBe(input);
      expect(result.redactedCount).toBe(0);
    });
  });

  describe('Redação de Telefones', () => {
    it('deve ofuscar número celular com DDD e traço', () => {
      const input = 'Entre em contato pelo WhatsApp (11) 98765-4321 imediatamente.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('98765-4321');
      expect(result.sanitizedText).toContain('[TELEFONE_OCULTO]');
      expect(result.detectedTypes).toContain('PHONE');
    });

    it('deve ofuscar número celular com código de país +55', () => {
      const input = 'Fale comigo no +55 11 99999-8888.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('99999-8888');
      expect(result.sanitizedText).toContain('[TELEFONE_OCULTO]');
    });

    it('deve ofuscar telefone fixo com DDD', () => {
      const input = 'Central de atendimento: (21) 2345-6789.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('2345-6789');
      expect(result.sanitizedText).toContain('[TELEFONE_OCULTO]');
    });
  });

  describe('Redação de E-mails', () => {
    it('deve ofuscar endereço de e-mail corporativo ou pessoal', () => {
      const input = 'Envie o comprovante para suporte.cobranca@empresa-falsa.com.br urgente.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('suporte.cobranca@empresa-falsa.com.br');
      expect(result.sanitizedText).toContain('[EMAIL_OCULTO]');
      expect(result.detectedTypes).toContain('EMAIL');
    });
  });

  describe('Redação de Chaves Pix', () => {
    it('deve ofuscar chave Pix aleatória (UUID)', () => {
      const input = 'Transfira para a chave Pix aleatória: 123e4567-e89b-12d3-a456-426614174000.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('123e4567-e89b-12d3-a456-426614174000');
      expect(result.sanitizedText).toContain('[CHAVE_PIX_OCULTA]');
      expect(result.detectedTypes).toContain('PIX_KEY');
    });
  });

  describe('Cenários Compostos e Resiliência', () => {
    it('deve ofuscar múltiplos dados sensíveis na mesma mensagem mantendo o restante legível', () => {
      const input =
        'Olá Maria, confirme seu CPF 111.222.333-44 e pague via Pix para contato@golpe.com ou ligue (11) 91234-5678.';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).not.toContain('111.222.333-44');
      expect(result.sanitizedText).not.toContain('contato@golpe.com');
      expect(result.sanitizedText).not.toContain('91234-5678');
      expect(result.redactedCount).toBe(3);
      expect(result.detectedTypes).toEqual(
        expect.arrayContaining(['CPF', 'EMAIL', 'PHONE'])
      );
      expect(result.sanitizedText).toContain('Olá Maria, confirme seu CPF [CPF_OCULTO]');
    });

    it('deve lidar com texto vazio ou sem PII sem alterar o conteúdo', () => {
      const input = 'Promoção imperdível de aniversário na loja oficial!';
      const result = sanitizer.sanitize(input);

      expect(result.sanitizedText).toBe(input);
      expect(result.redactedCount).toBe(0);
      expect(result.detectedTypes).toHaveLength(0);
    });
  });
});

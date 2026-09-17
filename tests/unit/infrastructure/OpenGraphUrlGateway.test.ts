import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenGraphUrlGateway } from '@/infrastructure/url-metadata/OpenGraphUrlGateway';

describe('OpenGraphUrlGateway (Enriquecimento Leve de Metadados de Links e Vídeos)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('deve extrair og:title e og:description com sucesso de uma página HTML', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Vídeo de Cachorrinho Emocionante &quot;Amor Infinito&quot;" />
          <meta property="og:description" content="63K curtidas e comentários emocionantes sobre adoção de cães." />
          <meta property="og:image" content="https://instagram.com/thumb.jpg" />
        </head>
        <body></body>
      </html>
    `;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    } as any);

    const gateway = new OpenGraphUrlGateway(1000);
    const result = await gateway.fetchMetadata('https://www.instagram.com/reel/DdPl6b4SjDo/');

    expect(result.originalUrl).toBe('https://www.instagram.com/reel/DdPl6b4SjDo/');
    expect(result.title).toBe('Vídeo de Cachorrinho Emocionante "Amor Infinito"');
    expect(result.description).toContain('63K curtidas');
    expect(result.image).toBe('https://instagram.com/thumb.jpg');
  });

  it('deve usar fallback para <title> se og:title não estiver presente', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notícia Oficial sobre Vacinação</title>
        </head>
        <body></body>
      </html>
    `;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    } as any);

    const gateway = new OpenGraphUrlGateway(1000);
    const result = await gateway.fetchMetadata('https://portal.gov.br/noticia');

    expect(result.title).toBe('Notícia Oficial sobre Vacinação');
  });

  it('deve degradar graciosamente se a requisição falhar ou der erro 404', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as any);

    const gateway = new OpenGraphUrlGateway(1000);
    const result = await gateway.fetchMetadata('https://site-inexistente.xyz/404');

    expect(result.originalUrl).toBe('https://site-inexistente.xyz/404');
    expect(result.title).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it('deve retornar defaultResult sem estourar exceção se fetch lançar erro de rede', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    const gateway = new OpenGraphUrlGateway(1000);
    const result = await gateway.fetchMetadata('https://url-com-erro.com');

    expect(result.originalUrl).toBe('https://url-com-erro.com');
    expect(result.title).toBeUndefined();
  });
});

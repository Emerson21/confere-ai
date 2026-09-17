import { IUrlMetadataGateway, UrlMetadata } from '@/application/ports/IUrlMetadataGateway';

export class OpenGraphUrlGateway implements IUrlMetadataGateway {
  private readonly timeoutMs: number;

  constructor(timeoutMs: number = 3000) {
    this.timeoutMs = timeoutMs;
  }

  public async fetchMetadata(url: string): Promise<UrlMetadata> {
    const defaultResult: UrlMetadata = { originalUrl: url };

    try {
      // Validação básica de URL
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return defaultResult;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      if (!response.ok) {
        return defaultResult;
      }

      // Lê apenas os primeiros 100KB para evitar carregar arquivos gigantes
      const html = await response.text();
      const sampleHtml = html.slice(0, 100000);

      // Decodificador simples de entidades HTML comuns
      const decodeHtmlEntities = (str: string): string => {
        return str
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
      };

      const extractMeta = (regex: RegExp): string | undefined => {
        const match = sampleHtml.match(regex);
        return match && match[1] ? decodeHtmlEntities(match[1]) : undefined;
      };

      const ogTitle =
        extractMeta(/property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
        extractMeta(/name=["']twitter:title["']\s+content=["']([^"']+)["']/i) ||
        extractMeta(/<title>(.*?)<\/title>/i);

      const ogDesc =
        extractMeta(/property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
        extractMeta(/name=["']description["']\s+content=["']([^"']+)["']/i) ||
        extractMeta(/name=["']twitter:description["']\s+content=["']([^"']+)["']/i);

      const ogImage =
        extractMeta(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
        extractMeta(/name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

      return {
        originalUrl: url,
        title: ogTitle,
        description: ogDesc,
        image: ogImage,
      };
    } catch (err) {
      // Degradação graciosa: falha de rede/timeout nunca derruba a aplicação
      return defaultResult;
    }
  }
}

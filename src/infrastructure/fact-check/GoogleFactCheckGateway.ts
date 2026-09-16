import { IFactCheckGateway } from '@/application/ports/IFactCheckGateway';
import { FactCheckSource } from '@/domain/types/analysis';

export class GoogleFactCheckGateway implements IFactCheckGateway {
  private readonly apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FACT_CHECK_API_KEY;
  }

  public async search(query: string): Promise<FactCheckSource[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    // Simplificação de query: extrair até 10 palavras mais significativas
    const sanitizedQuery = query
      .replace(/[^\w\sáéíóúâêîôûãõç]/gi, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 8)
      .join(' ');

    if (!sanitizedQuery) {
      return [];
    }

    try {
      const url = new URL('https://factchecktools.googleapis.com/v1alpha1/claims:search');
      url.searchParams.append('query', sanitizedQuery);
      url.searchParams.append('languageCode', 'pt-BR');
      if (this.apiKey) {
        url.searchParams.append('key', this.apiKey);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        // Timeout de 3 segundos para garantir resposta rápida
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      if (!data.claims || !Array.isArray(data.claims)) {
        return [];
      }

      const sources: FactCheckSource[] = [];
      for (const claim of data.claims) {
        if (claim.claimReview && Array.isArray(claim.claimReview)) {
          for (const review of claim.claimReview) {
            sources.push({
              title: claim.text || review.title || 'Checagem de Fato',
              publisher: review.publisher?.name || 'Agência de Checagem',
              url: review.url || '',
              rating: review.textualRating || 'Analisado',
            });
            if (sources.length >= 3) break;
          }
        }
        if (sources.length >= 3) break;
      }

      return sources;
    } catch {
      return [];
    }
  }
}

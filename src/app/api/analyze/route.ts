import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { RegexPiiSanitizer } from '@/infrastructure/sanitizer/RegexPiiSanitizer';
import { GoogleFactCheckGateway } from '@/infrastructure/fact-check/GoogleFactCheckGateway';
import { GeminiLlmGateway } from '@/infrastructure/llm/GeminiLlmGateway';
import { OpenGraphUrlGateway } from '@/infrastructure/url-metadata/OpenGraphUrlGateway';
import { InMemoryRateLimiter } from '@/infrastructure/security/InMemoryRateLimiter';
import { VerifyContentUseCase } from '@/application/use-cases/VerifyContentUseCase';

// Validação com Zod para proteção de borda
const AnalyzeRequestSchema = z.object({
  content: z
    .string({ required_error: 'O conteúdo para análise é obrigatório.' })
    .trim()
    .min(1, 'O conteúdo para análise não pode estar vazio.')
    .max(5000, 'O texto não pode exceder 5.000 caracteres.'),
  contentType: z.enum(['text', 'url', 'image_base64'], {
    errorMap: () => ({ message: 'Tipo de conteúdo inválido. Deve ser text, url ou image_base64.' }),
  }),
  userConsentAnonymization: z.boolean().optional(),
});

// Instância singleton de rate limiter para proteção contra abuso (15 req/min por IP)
const rateLimiter = new InMemoryRateLimiter({
  maxRequests: 15,
  windowMs: 60 * 1000,
});

// Instanciação e injeção de dependências (Clean Architecture / DIP)
const piiSanitizer = new RegexPiiSanitizer();
const factCheckGateway = new GoogleFactCheckGateway();
const llmGateway = new GeminiLlmGateway();
const urlMetadataGateway = new OpenGraphUrlGateway();
const verifyContentUseCase = new VerifyContentUseCase(
  piiSanitizer,
  factCheckGateway,
  llmGateway,
  urlMetadataGateway
);

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate Limiting por IP
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-client';

    const rateLimitResult = await rateLimiter.check(clientIp);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Limite de requisições atingido. Por favor, aguarde alguns instantes antes de enviar outra consulta.',
        },
        { status: 429 }
      );
    }

    // 2. Validação do Corpo da Requisição
    const rawBody = await req.json();
    const validation = AnalyzeRequestSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Requisição inválida',
          details: validation.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    // 3. Execução do Caso de Uso de Verificação
    const response = await verifyContentUseCase.execute({
      content: validation.data.content,
      contentType: validation.data.contentType,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Erro inesperado na rota /api/analyze:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro interno ao processar a verificação.',
      },
      { status: 500 }
    );
  }
}

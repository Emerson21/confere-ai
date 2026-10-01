import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GeminiLlmGateway } from '@/infrastructure/llm/GeminiLlmGateway';
import { InMemoryRateLimiter } from '@/infrastructure/security/InMemoryRateLimiter';

const TranscribeRequestSchema = z.object({
  audioBase64: z
    .string({ required_error: 'O áudio é obrigatório para transcrição.' })
    .min(10, 'Arquivo de áudio corrompido ou vazio.'),
  mimeType: z.string().optional().default('audio/webm'),
});

const rateLimiter = new InMemoryRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000,
});

const llmGateway = new GeminiLlmGateway();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-client';

    const rateLimitResult = await rateLimiter.check(clientIp);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Limite de transcrições atingido. Aguarde alguns instantes.' },
        { status: 429 }
      );
    }

    const rawBody = await req.json().catch(() => null);
    const validation = TranscribeRequestSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Requisição de áudio inválida.',
          details: validation.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { audioBase64, mimeType } = validation.data;
    console.log(`[Transcribe] Recebido áudio de ${audioBase64.length} caracteres, mimeType: ${mimeType}`);
    const transcription = await llmGateway.transcribeAudio(audioBase64, mimeType);
    console.log(`[Transcribe] Resultado da transcrição (${transcription.length} chars): "${transcription.slice(0, 100)}"`);

    return NextResponse.json(
      {
        transcription: transcription || '',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro na rota /api/transcribe:', error);
    return NextResponse.json(
      { error: 'Falha ao processar a transcrição do áudio.' },
      { status: 500 }
    );
  }
}

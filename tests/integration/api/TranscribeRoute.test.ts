import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/transcribe/route';
import { NextRequest } from 'next/server';

describe('API Route: POST /api/transcribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 400 se o audioBase64 for vazio ou inválido', async () => {
    const req = new NextRequest('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: JSON.stringify({
        audioBase64: '',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('deve retornar 200 com transcrição (mesmo vazia em modo offline/mock)', async () => {
    const req = new NextRequest('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: JSON.stringify({
        audioBase64: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAA==',
        mimeType: 'audio/webm',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.150',
      },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('transcription');
  });
});

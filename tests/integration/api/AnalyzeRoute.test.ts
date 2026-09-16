import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/analyze/route';
import { NextRequest } from 'next/server';

describe('API Route: POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 400 se o corpo da requisição for inválido ou vazio', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        content: '',
        contentType: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('deve retornar 400 se o contentType for inválido', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        content: 'Conteúdo de teste',
        contentType: 'arquivo_invalido',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('deve retornar 200 com AnalysisResponse estruturado para requisição válida', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        content: 'Pague seu débito urgente com o CPF 123.456.789-00 pelo Pix.',
        contentType: 'text',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.100',
      },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('risk_level');
    expect(data).toHaveProperty('badge_label');
    expect(data).toHaveProperty('short_summary');
    expect(data).toHaveProperty('indicators');
    expect(data).toHaveProperty('sources');
    expect(data).toHaveProperty('detailed_explanation');
    expect(data).toHaveProperty('actionable_advice');
    expect(data).toHaveProperty('pii_redacted_count');
    expect(data.pii_redacted_count).toBeGreaterThan(0);
  });
});

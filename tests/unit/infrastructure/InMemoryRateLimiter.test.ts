import { describe, it, expect } from 'vitest';
import { InMemoryRateLimiter } from '@/infrastructure/security/InMemoryRateLimiter';

describe('Proteção contra Abuso: InMemoryRateLimiter', () => {
  it('deve permitir requisições dentro do limite configurado', async () => {
    const rateLimiter = new InMemoryRateLimiter({
      maxRequests: 3,
      windowMs: 1000,
    });

    const res1 = await rateLimiter.check('client-1');
    const res2 = await rateLimiter.check('client-1');
    const res3 = await rateLimiter.check('client-1');

    expect(res1.allowed).toBe(true);
    expect(res2.allowed).toBe(true);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('deve bloquear requisições que ultrapassarem o limite configurado', async () => {
    const rateLimiter = new InMemoryRateLimiter({
      maxRequests: 2,
      windowMs: 1000,
    });

    await rateLimiter.check('client-2');
    await rateLimiter.check('client-2');
    const blockedRes = await rateLimiter.check('client-2');

    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });

  it('não deve misturar limites entre clientes distintos', async () => {
    const rateLimiter = new InMemoryRateLimiter({
      maxRequests: 1,
      windowMs: 1000,
    });

    const clientARes = await rateLimiter.check('client-A');
    const clientBRes = await rateLimiter.check('client-B');

    expect(clientARes.allowed).toBe(true);
    expect(clientBRes.allowed).toBe(true);
  });
});

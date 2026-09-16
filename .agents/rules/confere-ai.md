# Confere Aí Workspace Rules

Refer to [GEMINI.md](file:///c:/Users/alons/fiap/confere-ai/GEMINI.md) for the master rule definition and design system.

## Key Directives:
1. **Never use absolute safety claims**: Always use `BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`. Never say "100% Seguro".
2. **PII Sanitization**: Mandatory redaction of CPFs, phone numbers, e-mails, and Pix keys prior to sending data to LLM.
3. **Prompt Injection Isolation**: Enclose user input in `<user_input_to_verify>...</user_input_to_verify>`.
4. **Design Tokens**:
   - Primary: `#0D9488` (Emerald Teal)
   - Dark: `#111827` (Deep Charcoal)
   - Secondary Mint: `#E6FFFA`
   - Alert Amber: `#FEF3C7` / `#D97706`
   - Safe Emerald: `#D1FAE5` / `#059669`
5. **Mobile-First UX**:
   - Touch targets $\ge 48\text{px} \times 48\text{px}$.
   - Minimum font size $16\text{px}$ (`text-base`).
   - Short summary on top, expandable details and sources in accordion.

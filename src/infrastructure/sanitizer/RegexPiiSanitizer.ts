import { IPiiSanitizer, SanitizationResult } from '@/application/ports/IPiiSanitizer';

export class RegexPiiSanitizer implements IPiiSanitizer {
  // Regex para E-mails
  private static readonly EMAIL_REGEX =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

  // Regex para Chave Pix Aleatória (UUID v4 padrão)
  private static readonly PIX_UUID_REGEX =
    /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;

  // Regex para CPF formatado (xxx.xxx.xxx-xx)
  private static readonly CPF_FORMATTED_REGEX =
    /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;

  // Regex para Telefones brasileiros (+55 opcional, com DDD entre parênteses ou espaço obrigatório)
  private static readonly PHONE_REGEX =
    /(?:\+?55\s*)?(?:\([1-9]{2}\)\s*|\b[1-9]{2}\s+)(?:9\s*\d{4}|\d{4})[-.\s]?\d{4}\b|\b\+55\s*[1-9]{2}\s*9?\d{8}\b/g;

  // Regex para CPF de 11 dígitos isolados (após extração de telefones)
  private static readonly CPF_RAW_REGEX =
    /\b\d{11}\b/g;

  public sanitize(rawText: string): SanitizationResult {
    if (!rawText || rawText.trim() === '') {
      return {
        sanitizedText: rawText,
        redactedCount: 0,
        detectedTypes: [],
      };
    }

    let sanitized = rawText;
    let redactedCount = 0;
    const detectedTypesSet = new Set<'CPF' | 'PHONE' | 'EMAIL' | 'PIX_KEY'>();

    // 1. Sanitizar E-mails
    const emailMatches = sanitized.match(RegexPiiSanitizer.EMAIL_REGEX);
    if (emailMatches) {
      redactedCount += emailMatches.length;
      detectedTypesSet.add('EMAIL');
      sanitized = sanitized.replace(RegexPiiSanitizer.EMAIL_REGEX, '[EMAIL_OCULTO]');
    }

    // 2. Sanitizar Chaves Pix UUID
    const pixMatches = sanitized.match(RegexPiiSanitizer.PIX_UUID_REGEX);
    if (pixMatches) {
      redactedCount += pixMatches.length;
      detectedTypesSet.add('PIX_KEY');
      sanitized = sanitized.replace(RegexPiiSanitizer.PIX_UUID_REGEX, '[CHAVE_PIX_OCULTA]');
    }

    // 3. Sanitizar CPF formatado
    const cpfFormattedMatches = sanitized.match(RegexPiiSanitizer.CPF_FORMATTED_REGEX);
    if (cpfFormattedMatches) {
      redactedCount += cpfFormattedMatches.length;
      detectedTypesSet.add('CPF');
      sanitized = sanitized.replace(RegexPiiSanitizer.CPF_FORMATTED_REGEX, '[CPF_OCULTO]');
    }

    // 4. Sanitizar Telefones
    const phoneMatches = sanitized.match(RegexPiiSanitizer.PHONE_REGEX);
    if (phoneMatches) {
      redactedCount += phoneMatches.length;
      detectedTypesSet.add('PHONE');
      sanitized = sanitized.replace(RegexPiiSanitizer.PHONE_REGEX, '[TELEFONE_OCULTO]');
    }

    // 5. Sanitizar CPF não formatado (11 dígitos isolados que sobraram)
    const cpfRawMatches = sanitized.match(RegexPiiSanitizer.CPF_RAW_REGEX);
    if (cpfRawMatches) {
      redactedCount += cpfRawMatches.length;
      detectedTypesSet.add('CPF');
      sanitized = sanitized.replace(RegexPiiSanitizer.CPF_RAW_REGEX, '[CPF_OCULTO]');
    }

    return {
      sanitizedText: sanitized,
      redactedCount,
      detectedTypes: Array.from(detectedTypesSet),
    };
  }
}

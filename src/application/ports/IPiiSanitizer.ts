export interface SanitizationResult {
  sanitizedText: string;
  redactedCount: number;
  detectedTypes: ('CPF' | 'PHONE' | 'EMAIL' | 'PIX_KEY')[];
}

export interface IPiiSanitizer {
  sanitize(rawText: string): SanitizationResult;
}

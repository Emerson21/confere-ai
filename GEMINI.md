# Antigravity Rules & Coding Instructions: Confere Aí MVP (Tech4Change FIAP 2026)

This file defines the strict system instructions, project standards, architectural constraints, color tokens, and quality gates for the **Antigravity AI Agent** when building the **Confere Aí** WebApp MVP.

Always refer to the project documentation for deeper context:
- **SDD (Software Design Document)**: [docs/specs/sdd_mvp_confere_ai.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/sdd_mvp_confere_ai.md)
- **UI Mocks**:
  - Input Screen: [docs/ui-mocks/input_screen.png](file:///c:/Users/alons/fiap/confere-ai/docs/ui-mocks/input_screen.png)
  - Result Screen: [docs/ui-mocks/result_screen.png](file:///c:/Users/alons/fiap/confere-ai/docs/ui-mocks/result_screen.png)
- **Documentation Index**: [docs/README.md](file:///c:/Users/alons/fiap/confere-ai/docs/README.md)

---

## 1. Project Context & Non-Negotiable Rules

### Core Goal
Build a mobile-first WebApp for **Confere Aí** that receives suspicious text, links, or file uploads (boletos/prints), sanitizes personal data (PII), executes a multi-step verification pipeline (RAG), and delivers an educational, transparent risk assessment.

### Absolute Grounding & Security Constraints (Inviolable)
1. **NO Absolute Guarantees ("False Sense of Security")**:
   - NEVER label any content, link, or boleto as "100% Seguro", "Garantido" or "Isento de Risco".
   - Always use probabilistic/indicator-based status labels: `BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`.
   - Always include an educational disclaimer that digital safety requires user caution.

2. **Mandatory PII Scrubbing Before LLM Processing**:
   - All input text must pass through a strict PII sanitizer (Regex + NER) to redact CPFs (`***.***.***-**`), phone numbers, e-mail addresses, and Pix keys BEFORE reaching any external API or LLM prompt.

3. **Prompt Injection Isolation**:
   - User input MUST be wrapped inside strict XML/delimiters (`<user_input_to_verify>...</user_input_to_verify>`) inside the LLM system prompt.
   - System prompts must strictly enforce output formatting via JSON Schema.

4. **User Preference Alignment (Research-Backed)**:
   - 64.1% of users prefer a **short summary with expandable details and explicit sources**.
   - Design UI with an expandable accordion/tabs for technical reasoning, indicators, and source links.

---

## 2. Brand Identity, Design Tokens & Color Palette (Strict Consistency)

All pages, headers, buttons, and cards MUST adhere strictly to the **Confere Aí Design System**:

| Token Name | Hex Code | Tailwind Class | Application / Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand (Emerald Teal)** | `#0D9488` | `bg-teal-600`, `text-teal-600` | Header Logo Icon, Primary CTA Buttons, Active Icons, Brand Accent. |
| **Brand Dark (Deep Charcoal)** | `#111827` | `text-gray-900`, `bg-gray-900` | Logo Text, Page Headings, High-Contrast Body Text (WCAG AA). |
| **Secondary Mint (Light Teal)** | `#E6FFFA` | `bg-teal-50`, `border-teal-200` | Guidance Cards ("O que fazer agora"), Privacy Badges, Accordion Highlights. |
| **Alert Amber (Suspicious)** | `#FEF3C7` / `#D97706` | `bg-amber-50`, `text-amber-800`, `border-amber-300` | Status Banner for `SUSPEITO` / `ALTO_RISCO` (Non-panic, high legibility). |
| **Safe Emerald (Low Risk)** | `#D1FAE5` / `#059669` | `bg-emerald-50`, `text-emerald-800`, `border-emerald-300` | Status Banner for `BAIXO_RISCO` / Verified content. |
| **Neutral Background** | `#FFFFFF` / `#F8FAFC` | `bg-white`, `bg-slate-50` | Clean background ensuring high contrast and minimal visual clutter. |

### Typography & Accessibility Standards
- **Font**: Inter, Roboto, or system sans-serif with high x-height.
- **Font Size**: Minimum `16px` (`text-base`) for inputs and body text to prevent mobile zoom and assist users with lower digital literacy / vision impairment.
- **Touch Targets**: All clickable buttons and icons must have a minimum touch area of `48px x 48px`.

---

## 3. Tech Stack & Engineering Guidelines

- **Framework**: Next.js 14+ (App Router, Server Actions / API Routes).
- **Language**: TypeScript (`strict: true`).
- **Styling**: Tailwind CSS, Mobile-First responsive layout, Lucide React Icons.
- **State Management**: React `useState` / `useTransition` for loading states and step-by-step progress indicators.
- **UI Components**: Shadcn UI or custom Tailwind components with WCAG 2.1 AA accessibility compliance.

---

## 4. Project File Structure Standards

```
confere-ai/
├── GEMINI.md                     # Active workspace rules for Antigravity
├── .agents/
│   └── rules/
│       └── confere-ai.md         # Modular rule definitions
├── docs/                         # Project specs, research and UI mocks
├── app/
│   ├── page.tsx                  # Main verification screen (Mobile-first)
│   ├── layout.tsx                # Root layout with accessibility metadata
│   └── api/
│       └── analyze/
│           └── route.ts          # API Route executing PII scrub + RAG + LLM
├── components/
│   ├── Header.tsx                # Unified Header with Confere Aí Logo & Shield Checkmark Icon
│   ├── InputContainer.tsx        # Multimodal input (Text, Link, File upload)
│   ├── ProgressStepper.tsx       # Live status stepper (Scrubbing -> Checking -> Result)
│   ├── ResultView.tsx            # Short summary + Status Badge (Amber/Emerald)
│   ├── AccordionDetails.tsx      # Expandable technical details, sources & indicators
│   └── EducationalFooter.tsx     # Practical steps ("O que fazer agora")
├── lib/
│   ├── piiSanitizer.ts           # RegEx & Scrubbing logic for CPFs, Emails, Pix
│   ├── factCheckApi.ts           # Google Fact Check Tools API client
│   └── llmEngine.ts              # OpenAI / Gemini API call with JSON Schema
└── types/
    └── analysis.ts               # TypeScript interfaces matching SDD JSON Schema
```

---

## 5. API & Data Contract (`/api/analyze`)

The API MUST return JSON matching the following TypeScript interface:

```typescript
export type RiskLevel = 'BAIXO_RISCO' | 'SUSPEITO' | 'ALTO_RISCO' | 'INCONCLUSIVO';

export interface Indicator {
  type: 'URGENCIA' | 'TYPOSQUATTING' | 'DADOS_INCOERENTES' | 'PADRAO_GOLPE' | 'INFORMACAO_FALSA';
  description: string;
  severity: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface FactCheckSource {
  title: string;
  publisher: string;
  url: string;
  rating: string;
}

export interface AnalysisResponse {
  risk_level: RiskLevel;
  badge_label: string;
  short_summary: string;
  indicators: Indicator[];
  sources: FactCheckSource[];
  detailed_explanation: string;
  actionable_advice: string[];
  pii_redacted_count: number;
}
```

---

## 6. Implementation Rules for Antigravity Agent

When generating or editing code for this project:

1. **Unified Header Component**:
   - Create a reusable `Header.tsx` component that renders the **Confere Aí** logo with the `#0D9488` Emerald Teal shield checkmark on ALL screens.
2. **Step-by-Step Execution**:
   - Implement `lib/piiSanitizer.ts` first and include unit tests for CPF, Phone, Email, and Pix redaction.
   - Implement `types/analysis.ts` to ensure end-to-end type safety.
   - Implement `app/api/analyze/route.ts` ensuring error handling and JSON validation.
   - Implement UI components (`Header`, `InputContainer`, `ResultView`, `AccordionDetails`) using exact Tailwind color tokens.

3. **UX & Micro-Interactions**:
   - Display a step-by-step progress indicator during analysis:
     1. *"Removendo dados pessoais por privacidade..."*
     2. *"Analisando padrões e consultando bases de checagem..."*
     3. *"Sintetizando explicação pedagógica..."*
   - Avoid long loading screens without feedback.

4. **Error Handling**:
   - If the API times out or external APIs fail, degrade gracefully to `risk_level: "INCONCLUSIVO"` with a message advising manual caution and listing official channels.

---

## 7. Definition of Done (DoD) Checklist

- [ ] PII Sanitizer strips all personal data before calling LLM.
- [ ] LLM system prompt uses strict `<user_input_to_verify>` containment and JSON Schema output.
- [ ] UI shows short summary first, with details hidden inside an accordion ("Ver detalhes").
- [ ] All pages use the exact same Emerald Teal (`#0D9488`) branding, header, and typography.
- [ ] No label or UI text uses "100% Seguro".
- [ ] Mobile-first UI passes accessibility standards (touch targets ≥ 48px, readable contrast).
- [ ] TypeScript compiles with 0 errors.

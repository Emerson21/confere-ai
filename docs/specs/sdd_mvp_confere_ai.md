# Especificação de Requisitos Funcionais (SDD - Spec Driven Development)
## Projeto: Confere Aí — MVP WebApp (Tech4Change FIAP 2026)

---

### 1. Visão Geral do Produto e Contexto (PRD Core)

#### 1.1. Problema e Oportunidade
O **Confere Aí** é um assistente de Inteligência Artificial focado em combate à desinformação e fraudes digitais, projetado para orientar pessoas — especialmente com menor familiaridade digital — a analisar textos, links, cobranças e mídias suspeitas antes de agir.

* **Evidências de Pesquisa (Grounded Input)**:
  * **89,7%** das pessoas relatam dúvidas frequentes sobre veracidade nos últimos 3 meses [77].
  * **43,6%** das situações duvidosas possuem partes verdadeiras mas carecem de contexto [77].
  * **38,5%** temem expor informações pessoais na verificação [78].
  * **64,1%** preferem explicações em **texto curto com opção de expandir detalhes e fontes** [78].
  * **84,6%** não pagariam por assinatura B2C individual [78], direcionando o produto para um modelo B2B2C / API As a Service [2].

#### 1.2. Objetivos do MVP
1. Entregar um **Web App mobile-first** sem necessidade de download [81].
2. Abstrair a engenharia de prompt para o usuário final através de um **Pipeline de Orquestração Antifraude**.
3. Garantir **sanitização de PII (dados pessoais)** antes do envio para modelos de linguagem [78, 85].
4. Exibir vereditos contextualizados, sinalizadores de risco, fontes consultáveis e guia de ação [80, 81, 82].
5. **Nunca emitir declarações absolutas** ("100% seguro") e admitir incertezas explicitamente quando faltarem evidências [72, 82].

---

### 2. Arquitetura e Stack Tecnológica

* **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend**: Next.js API Routes (Serverless) / Node.js.
* **Engine de IA & RAG**:
  * **LLM**: Gemini 1.5 Flash / GPT-4o-mini (Orquestração e Síntese de Veredito).
  * **OCR**: Tesseract.js / Google Vision API (para boletos, comprovantes e capturas de tela) [72, 80].
  * **Busca de Fatos**: Google Fact Check Tools API [84] + SerpAPI / Bing Search API.
* **Segurança**: RegEx & NER para remoção de CPF, CNPJ, telefones, e-mails e chaves Pix.

---

### 3. Requisitos Funcionais (User Stories & Critérios de Aceite)

#### **US-01: Entrada Multimodal de Conteúdo**
* **Como** usuário com dúvida sobre um conteúdo,
* **Quero** colar um texto, link ou fazer upload de uma imagem/boleto,
* **Para que** a ferramenta analise sem que eu precise escrever um prompt.
* **Critérios de Aceite**:
  * Campo de texto com suporte a colar textos longos ou URLs.
  * Botão de upload para arquivos de imagem (`.png`, `.jpg`, `.jpeg`, `.pdf`).
  * Indicador visual de limpeza automática de dados de privacidade.

#### **US-02: Sanitização Transparente de Dados (PII Scrubbing)**
* **Como** usuário preocupado com a privacidade dos meus dados,
* **Quero** que meus dados pessoais (CPF, telefone, nome, conta bancária) sejam apagados antes da análise,
* **Para que** eu não corra o risco de vazamento de informações sensíveis.
* **Critérios de Aceite**:
  * O sistema executa filtro via RegEx/NER identificando padrões de CPF (`xxx.xxx.xxx-xx`), telefones, e-mails e chaves Pix, substituindo-os por `[DADO_OCULTO]`.
  * Exibição de um selo de "Dados Pessoais Protegidos" na interface.

#### **US-03: Pipeline de Análise e Verificação (RAG & Fact Check)**
* **Como** sistema de verificação,
* **Quero** orquestrar OCR, checagem de domínio, busca em APIs de fact-checking e detecção de urgência,
* **Para que** o modelo de IA receba contexto estruturado e não alucine.
* **Critérios de Aceite**:
  * Extração de texto via OCR caso o input seja imagem.
  * Consulta à Google Fact Check Tools API com as palavras-chave extraídas.
  * Validação de domínios (verificação de caracteres mascarados/typosquatting).
  * Análise de gatilhos psicológicos (pressão por tempo, promessa de dinheiro fácil, tom de ameaça) [74, 83].

#### **US-04: Exibição Estruturada do Resultado (Mobile-First UI)**
* **Como** usuário final,
* **Quero** ver um resumo claro do veredito com opção de aprofundar,
* **Para que** eu tome uma decisão rápida e entenda os motivos.
* **Critérios de Aceite**:
  * **Badge de Status**: *Atenção aos Sinais de Risco*, *Informação Falsa / Golpe Provável*, *Partes Verdadeiras sem Contexto*, ou *Sem Evidências Suficientes* [82].
  * **Sinais Encontrados**: Lista de marcadores em bullets (ex: "Urgência excessiva", "Chave Pix em nome de terceiro").
  * **Explicação Resumida**: Texto de 2 a 3 parágrafos em linguagem simples e acessível.
  * **Accordion (Ver Detalhes)**: Seção expansível contendo a análise detalhada e histórico de checagens.
  * **Fontes Consultadas**: Lista com links clicáveis de agências de checagem e portais oficiais [81].
  * **O que fazer agora (Guia Prático)**: Passos recomendados (ex: "Não pague este boleto", "Confirme no app oficial do banco") [80, 83].

#### **US-05: Gestão de Incerteza e Trava de Segurança**
* **Como** guardião de segurança do sistema,
* **Quero** que o sistema declare explicitamente quando não houver dados conclusivos,
* **Para que** não seja gerada uma falsa sensação de segurança.
* **Critérios de Aceite**:
  * NUNCA exibir termos como "100% Seguro" ou "Totalmente Confiável" [72].
  * Quando não houver registros suficientes nas APIs de checagem, retornar a mensagem: *"Não encontramos evidências suficientes para concluir. Recomendamos checar nos canais oficiais antes de agir"* [82].

---

### 4. Especificação de Engenharia de Prompt e Pipeline de IA

#### 4.1. System Prompt da Orquestração (Kernel Prompt)

```text
Você é o assistente antifraude e checador de fatos do "Confere Aí". Sua missão é proteger e educar o usuário de forma neutra, transparente e pedagógica.

REGRAS INVIOLÁVEIS:
1. JAMAIS declare que um conteúdo é "100% seguro" ou "completamente confiável".
2. Trabalhe estritamente com as evidências fornecidas e os dados de checagem recuperados.
3. Se os dados forem insuficientes ou ambíguos, declare explicitamente: "Não encontramos evidências suficientes para concluir".
4. Destaque os gatilhos de engenharia social (urgência, ameaça de bloqueio, ofertas irrealistas, inconsistências de remetente/Pix).
5. Retorne a resposta ESTRITAMENTE no formato JSON especificado.

FORMATO DE SAÍDA (JSON SCHEMA):
{
  "verdict_type": "HIGH_RISK_SCAM" | "MISLEADING_CONTEXT" | "VERIFIED_FACT" | "INSUFFICIENT_EVIDENCE",
  "verdict_title": "string (ex: Atenção: Indícios de Golpe de Cobrança)",
  "short_summary": "string (2-3 frases claras e diretas)",
  "risk_signals": ["string"],
  "detailed_analysis": "string (texto explicativo formatado em markdown)",
  "sources_consulted": [{"title": "string", "url": "string"}],
  "recommended_next_steps": ["string"],
  "educational_tip": "string (dica para o usuário aprender a identificar no futuro)"
}
```

---

### 5. Contratos de API (JSON Schemas)

#### `POST /api/analyze`

**Request Body**:
```json
{
  "content_type": "text" | "url" | "image_base64",
  "payload": "string",
  "user_consent_anonymization": true
}
```

**Response Body (200 OK)**:
```json
{
  "id": "uuid-v4",
  "timestamp": "2026-09-15T18:50:00Z",
  "sanitized_input_preview": "string",
  "analysis": {
    "verdict_type": "HIGH_RISK_SCAM",
    "verdict_title": "Atenção: Indícios de Golpe de Cobrança",
    "short_summary": "Identificamos sinais típicos de falsificação na mensagem recebida. A cobrança pressiona por um pagamento imediato e o recebedor do Pix não corresponde à empresa citada.",
    "risk_signals": [
      "Tom de extrema urgência e ameaça de negativar nome em poucas horas",
      "Chave Pix vinculada a CPF/Pessoa Física em vez da razão social da empresa",
      "Link de acesso diferente do domínio oficial da instituição"
    ],
    "detailed_analysis": "A mensagem utiliza técnicas conhecidas de engenharia social para induzir ao erro sob pressão. Embora o nome da empresa seja citado corretamente, os canais de pagamento indicados são irregulares...",
    "sources_consulted": [
      {
        "title": "Alerta de Golpes de Cobrança - CERT.br",
        "url": "https://cartilha.cert.br/golpes/"
      }
    ],
    "recommended_next_steps": [
      "Não faça transferências ou pagamentos por esta chave Pix.",
      "Acesse o aplicativo oficial da empresa ou banco diretamente pela loja de apps para verificar pendências.",
      "Bloqueie o remetente suspeito."
    ],
    "educational_tip": "Lembre-se: empresas legítimas não enviam cobranças com ameaças de bloqueio imediato exigindo Pix para pessoa física."
  }
}
```

---

### 6. Especificação de Componentes UI/UX (Frontend Specs)

1. **Header**:
   * Logo "Confere Aí" + Tagline *"Antes de acreditar, clicar ou compartilhar, confira"* [73].
   * Badge de status: *"Sessão Privada & Dados Protegidos"*.
2. **Input Area (Componente Principal)**:
   * Textarea expansível com placeholder: *"Cole aqui a mensagem, link ou chave Pix que gerou dúvida..."*
   * Botão de anexo/upload para foto de boleto ou print screen.
   * Botão primário de ação: **"Conferir Agora"**.
3. **Loading / Processing State**:
   * Animação com etapas de progresso para transparência pedagógica:
     1. 🔒 *Removendo dados pessoais por privacidade...*
     2. 🔍 *Consultando bases de checagem e reputação...*
     3. 🤖 *Analisando padrões e sinais de risco...*
4. **Result Container**:
   * **Banner de Veredito**: Cor codificada (Vermelho = Alto Risco; Amarelo = Faltam Dados/Atenção; Verde = Verificado em Fontes).
   * **Lista de Sinais**: Cards/Bullets em destaque visual.
   * **Accordion "Ver Análise Completa"**: Expande o texto explicativo detalhado [78, 81].
   * **Bloco de Fontes**: Links clicáveis com ícones externos.
   * **Card de Próximos Passos**: Caixa com checklist de ações seguras [80].

---

### 7. Requisitos Não Funcionais (NFR)

* **Privacidade**: Retenção zero de textos e PII de usuários nos servidores do banco de dados (armazenamento apenas de logs anônimos de telemetria) [78, 85].
* **Performance**: Tempo de resposta do pipeline completo < 3.5 segundos.
* **Acessibilidade (WCAG 2.1 AA)**:
  * Fonte mínima de 16px para facilitar leitura em celulares.
  * Contraste de cores elevado e suporte a leitores de tela [73].
* **Segurança contra Prompt Injection**: O input do usuário deve ser envelopado em uma tag delimitadora `<user_input_to_verify>` e tratado estritamente como dado passivo pelo LLM, impedindo a execução de comandos embutidos [85].

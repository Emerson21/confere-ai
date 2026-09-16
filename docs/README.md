# Confere Aí — Documentação do Projeto

Bem-vindo à central de documentação e engenharia do **Confere Aí** (Tech4Change FIAP 2026).

---

## 📂 Estrutura de Documentos

### 1. Especificações Técnicas e Arquitetura (`specs/`)
* **[sdd_mvp_confere_ai.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/sdd_mvp_confere_ai.md)**:
  * Especificação de Requisitos Funcionais (SDD - Spec Driven Development).
  * Contém: Visão do produto, User Stories (US-01 a US-05), pipeline de orquestração RAG/Fact-checking, System Prompt, contratos de API (`POST /api/analyze`) e requisitos não-funcionais (NFRs).
* **[antigravity_rules.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/antigravity_rules.md)**:
  * Regras do agente de IA, design tokens (cores hexadecimais), tipografia, acessibilidade (WCAG AA), e Definition of Done (DoD).
  * *Espelhado na raiz como [`GEMINI.md`](file:///c:/Users/alons/fiap/confere-ai/GEMINI.md).*

### 2. Telas e Protótipos de UI (`ui-mocks/`)
* **[input_screen.png](file:///c:/Users/alons/fiap/confere-ai/docs/ui-mocks/input_screen.png)**:
  * Protótipo de alta fidelidade da tela inicial / entrada de dados (mobile viewport).
  * Componentes: Header institucional, textarea de entrada, ações de gravação de áudio e upload de imagem/boleto, CTA "VERIFICAR MENSAGEM" e selo de privacidade garantida.
* **[result_screen.png](file:///c:/Users/alons/fiap/confere-ai/docs/ui-mocks/result_screen.png)**:
  * Protótipo de alta fidelidade da tela de resultado / veredito.
  * Componentes: Banner de alerta categorizado (*ATENÇÃO: Suspeita de Golpe*), resumo executivo em linguagem simples, accordion expansível *"Ver Detalhes e Fontes"*, seção *"O que fazer agora?"* e botão para *"NOVA VERIFICAÇÃO"*.

### 3. Pesquisa e Modelo de Negócio (`research/`)
* **[Confere_Ai_Proposta.pdf](file:///c:/Users/alons/fiap/confere-ai/docs/research/Confere_Ai_Proposta.pdf)**:
  * Relatório consolidado da proposta de solução com dados da pesquisa com usuários (39 respondentes).
  * Métricas-chave: 89,7% de dúvida frequente; 64,1% de preferência por resumo curto + expansão; viabilidade técnica e financeira preliminar.
* **[Modelos_de_Receita_Checagem_de_Fatos.pdf](file:///c:/Users/alons/fiap/confere-ai/docs/research/Modelos_de_Receita_Checagem_de_Fatos.pdf)**:
  * Benchmark detalhado de modelos de receita no ecossistema de fact-checking e combate a desinformação (Aos Fatos, Agência Lupa, NewsGuard, Full Fact).

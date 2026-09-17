# Matriz de Alinhamento aos Critérios de Avaliação — FIAP Tech4Change 2026
## Projeto: Confere Aí

Este documento demonstra como o **Confere Aí** atende rigorosamente e com excelência aos **5 critérios oficiais de avaliação da banca** (válidos para a Seleção Top 10, Seleção Top 3 e Classificação Final).

---

## Tabela de Correspondência com a Banca Avaliadora

| Critério Oficial da Banca | Como o Confere Aí Atende | Evidência Técnica / Documental |
| :--- | :--- | :--- |
| **1. Alinhamento com o tema "Potencializando o ser humano com IA"** | O *Confere Aí* atua como um copiloto de amplificação cognitiva: não substitui o livre arbítrio do cidadão nem promete certezas absolutas, mas capacita pessoas (especialmente vulneráveis e com menor letramento digital) a identificar táticas de engenharia social, fraudes e fake news antes de clicarem ou transferirem dinheiro. | • *Princípio Inviolável:* Sem falsas garantias (nunca diz "100% seguro").<br>• *Pedagogia:* Explicação em linguagem simples com checklist "O que fazer agora".<br>• *Inclusão:* Entrada multimodal por texto, foto e áudio gravado via microfone. |
| **2. Viabilidade técnica e mercadológica do produto** | **Técnica:** Solução 100% construída e funcional em Next.js 14, Clean Architecture, TDD com 27 testes automatizados, conteinerizada em Docker e hospedada no Google Cloud Run com latência sub-segundo.<br>**Mercadológica:** Mercado de segurança pessoal em hiper-expansão no Brasil diante de mais de R$ 10 bilhões perdidos em golpes Pix e engenharia social anualmente. | • Repositório público no GitHub com CI/CD e testes passando.<br>• URL ativa no Google Cloud Run.<br>• Pipeline híbrido resiliente: Sanitizador de PII + Heurísticas Locais + RAG Google Fact Check + LLM Gemini Flash. |
| **3. Sustentabilidade financeira e operacional da proposta** | Modelo de negócio viável e sustentável inspirado nos bureaus de crédito (**Serasa / SPC Brasil**):<br>• **Pay-per-Query B2C (Créditos de Consulta):** 3 consultas iniciais de cortesia; consultas avulsas a R$ 1,99 via Pix ou pacotes econômicos (10 consultas por R$ 9,90).<br>• **Margem Bruta > 95%:** Custo técnico por consulta de ~R$ 0,0007 a R$ 0,02 com Gemini Flash.<br>• **B2B API:** Licenciamento de inteligência de ameaças para bancos, seguradoras e varejistas. | • Estudo em `docs/research/Modelos_de_Receita_Checagem_de_Fatos.pdf`.<br>• Unit economics detalhados no Pitch Deck e Documento Central.<br>• Escalabilidade sem custo fixo em infraestrutura serverless (Google Cloud Run com escala a zero). |
| **4. Originalidade e grau de inovação da ideia** | • **Privacy-by-Design:** Única solução que sanitiza e mascara CPFs, telefones, e-mails e chaves Pix **antes** que qualquer dado saia para APIs externas ou prompts de LLM.<br>• **Blindagem contra Prompt Injection:** Isolamento estrito de tags XML `<user_input_to_verify>` e saída restrita via JSON Schema.<br>• **Explicabilidade com RAG Auditável:** Não apenas diz se é suspeito, mas aponta indicadores concretos e links de checagem jornalística de fatos. | • Implementação de `RegexPiiSanitizer` e `SafetyInvariants`.<br>• Integração com Google Fact Check Tools API.<br>• Modo de fallback heurístico local que opera mesmo se a IA estiver indisponível. |
| **5. Evidências de validação junto a potenciais usuários ou clientes** | Pesquisa de campo quantitativa e qualitativa estruturada com **39 respondentes reais**, comprovando dor aguda e direcionando as decisões de arquitetura e UX do produto. | • 89,7% dos entrevistados relataram dúvida frequente sobre veracidade de mensagens.<br>• 64,1% exigiram formato de resumo conciso com detalhes e fontes expansíveis.<br>• `docs/research/relatorio_validacao_aprendizados.md` detalhando cada aprendizado e as mudanças feitas no MVP. |

---

## Síntese de Valor para a Banca

1. **Impacto Social Concreto:** Combate uma dor que afeta famílias e idosos diariamente no Brasil.
2. **Engenharia de Software de Alto Nível:** Clean Architecture, SOLID, tipagem estrita em TypeScript, Docker, Test-Driven Development (TDD).
3. **Inteligência Artificial Responsável:** Governança de dados, anonimização prévia de PII e ausência de alucinações por meio de RAG.
4. **Negócio Rentável e Autossustentável:** Não depende de doações; gera receita direta no momento de maior dor do usuário (prevenção de fraudes financeiras).

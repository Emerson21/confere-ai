# Confere Aí — Central de Documentação do Projeto
## FIAP Tech4Change 2026 | "Potencializando o Ser Humano com Inteligência Artificial"

Bem-vindo à central de documentação e engenharia do **Confere Aí**. Esta pasta reúne todas as especificações técnicas, evidências de validação de mercado, materiais de apresentação e o pacote oficial de entrega para a banca avaliadora.

---

## 📂 Estrutura de Documentos

### 1. Pacote Oficial de Entrega (`entrega/`)
* **[Tech4Change_Documento_Central.md](file:///c:/Users/alons/fiap/confere-ai/docs/entrega/Tech4Change_Documento_Central.md)**:
  * Documento unificado formatado para gerar o arquivo central de entrega em PDF (`Tech4Change_ConfereAi_NomeDoGrupo.pdf`).
  * Contém todos os links canônicos (MVP no Cloud Run, Vídeo no YouTube, Repositório GitHub), folha de rosto, integrantes, pitch deck e guia de teste.

### 2. Apresentação e Pitch (`pitch/`)
* **[pitch_deck_tech4change.md](file:///c:/Users/alons/fiap/confere-ai/docs/pitch/pitch_deck_tech4change.md)**:
  * Apresentação executiva com os **11 slides obrigatórios** do regulamento (Problema, Público, Solução, Proposta de Valor, MVP, Tecnologias, Modelo de Negócio, Validação, Diferenciais, Impactos e Próximos Passos), incluindo notas do apresentador.
* **[video_pitch_script_5min.md](file:///c:/Users/alons/fiap/confere-ai/docs/pitch/video_pitch_script_5min.md)**:
  * Roteiro cronometrado segundo a segundo (0:00 a 5:00) para gravação do vídeo do YouTube, cobrindo os 6 tópicos formais exigidos pela FIAP com orientações de tela e falas.

### 3. Especificações Técnicas e Avaliação (`specs/`)
* **[matriz_criterios_banca.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/matriz_criterios_banca.md)**:
  * Tabela de correspondência com os **5 critérios oficiais de avaliação** da banca avaliadora (Top 10, Top 3 e Final), demonstrando o atendimento com nota máxima.
* **[guia_testes_mvp_banca.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/guia_testes_mvp_banca.md)**:
  * Roteiro de testes práticos com 4 casos de teste reais (phishing, benefício social falso, mensagem legítima e texto inconclusivo) prontos para a banca copiar e colar.
* **[sdd_mvp_confere_ai.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/sdd_mvp_confere_ai.md)**:
  * Software Design Document (SDD) com visão arquitetural, contratos de API (`POST /api/analyze`), regras de sanitização de PII e User Stories.
* **[architecture_and_guidelines.md](file:///c:/Users/alons/fiap/confere-ai/docs/specs/architecture_and_guidelines.md)**:
  * Diretrizes de engenharia, Clean Architecture, princípios SOLID e padrões de TDD.

### 4. Pesquisa de Mercado e Validação (`research/`)
* **[relatorio_validacao_aprendizados.md](file:///c:/Users/alons/fiap/confere-ai/docs/research/relatorio_validacao_aprendizados.md)**:
  * Relatório consolidado da pesquisa de campo com **39 respondentes**, contendo métricas, depoimentos qualitativos, síntese de aprendizados e a matriz de rastreabilidade das mudanças implementadas no MVP.
* **[Confere_Ai_Proposta.pdf](file:///c:/Users/alons/fiap/confere-ai/docs/research/Confere_Ai_Proposta.pdf)**:
  * Relatório preliminar da proposta de solução e pesquisa quantitativa inicial.
* **[Modelos_de_Receita_Checagem_de_Fatos.pdf](file:///c:/Users/alons/fiap/confere-ai/docs/research/Modelos_de_Receita_Checagem_de_Fatos.pdf)**:
  * Benchmark comparativo de sustentabilidade financeira no ecossistema de fact-checking e segurança digital (Aos Fatos, Lupa, Serasa, Full Fact).

### 5. Implantação e Infraestrutura (`deployment/`)
* **[google_cloud_run.md](file:///c:/Users/alons/fiap/confere-ai/docs/deployment/google_cloud_run.md)**:
  * Passo a passo de conteinerização Docker e deploy serverless da aplicação no Google Cloud Run.

### 6. Protótipos de Interface (`ui-mocks/`)
* **[input_screen.png](file:///c:/Users/alons/fiap/confere-ai/docs/ui-mocks/input_screen.png)**: Tela inicial com entrada multimodal (texto, upload e microfone).
* **[result_screen.png](file:///c:/Users/alons/fiap/confere-ai/docs/ui-mocks/result_screen.png)**: Tela de veredito com resumo executivo, badge de risco e acordeão de fontes.

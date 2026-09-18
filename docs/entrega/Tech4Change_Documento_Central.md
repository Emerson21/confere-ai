# FIAP Tech4Change 2026 — Documento Oficial de Entrega
## Nome do Projeto: Confere Aí
### Nome do Grupo: Grupo 23
**Tema Oficial:** "Potencializando o Ser Humano com Inteligência Artificial"

---

## 1. Informações Canônicas e Links Obrigatórios

| Item Obrigatório da Entrega | Link de Acesso | Observações / Permissões |
| :--- | :--- | :--- |
| **Aplicação / MVP Funcional** | `https://confere-ai-65825316137.southamerica-east1.run.app` | Acesso público imediato no Google Cloud Run, sem login ou barreiras. |
| **Vídeo do Pitch (Até 5 min)** | `https://youtu.be/[INSERIR_LINK_AQUI]` | Vídeo no YouTube (público/não listado) cobrindo os 6 tópicos do regulamento. |
| **Repositório do Código (GitHub)** | `https://github.com/Emerson21/confere-ai` | Repositório público com código-fonte, suíte de testes automatizados e histórico. |

---

## 2. Integrantes da Equipe e Contribuições

| Nome Completo | RM | Papel / Especialidade | Principais Contribuições no Projeto |
| :--- | :--- | :--- | :--- |
| **Mônica Mazzochi Hillman** | RM 375183 | Head de Produto | Concepção e aplicação da pesquisa de campo (39 respondentes), validação de requisitos de produto e modelagem Pay-per-Query. |
| **Emerson da Silva Alonso Haraguchi** | RM 376499 | Head of AI Engineering | Concepção da solução, engenharia de prompts, integração com Google Gemini e Fact Check APIs. |
| **Daniel Britto da Graça** | RM 370691 | Frontend / DevOps & Cloud Engineer | Interface mobile-first (Next.js/Tailwind), áudio Web Speech API, conteinerização Docker e deploy no Google Cloud Run. |

---

## 3. Resumo Executivo da Solução

O **Confere Aí** é um assistente digital inteligente projetado para orientar pessoas — especialmente idosos, cidadãos com menor familiaridade digital e microempreendedores — a identificar mensagens falsas, tentativas de golpe via WhatsApp/SMS e boletos fraudulentos antes de realizarem qualquer clique ou transferência financeira.

Operando sob o princípio de **amplificação cognitiva** (tema do Tech4Change), o sistema não busca substituir o julgamento humano nem cria uma falsa sensação de segurança com rótulos infalíveis. Em vez disso, higieniza dados pessoais por privacidade (*Privacy-by-Design*), cruza dados com APIs de checagem jornalística de fatos e modelos de IA de alta eficiência (Gemini Flash), entregando um veredito em linguagem simples acompanhado de fontes comprovadas e de um guia preventivo de ação imediata.

---

## 4. Demonstração do MVP Funcional

### A. Fluxo Principal da Solução
1. **Entrada Sem Atrito:** O usuário digita, cola o texto suspeito, anexa uma imagem/comprovante ou simplesmente grava um áudio pelo microfone;
2. **Sanitização de Privacidade:** O sistema detecta e mascara CPFs (`***.***.***-**`), telefones, e-mails e chaves Pix locais antes que qualquer informação seja enviada para os modelos de IA;
3. **Checagem em Tempo Real:** Consulta a base do Google Fact Check Tools e submete o texto higienizado a um prompt blindado contra injeção;
4. **Veredito Pedagógico:** Apresentação do nível de risco (`BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`), resumo executivo legível em 5 segundos, acordeão expansível com indicadores técnicos e checklist prático "O que fazer agora".

### B. Cenários de Teste Prontos para a Banca Avaliadora

* **Cenário 1 (Golpe de Urgência Bancária):**
  > *"URGENTE: Prezado cliente, sua conta no Banco do Brasil foi bloqueada devido a movimentações suspeitas de R$ 1.500,00. Regularize pelo link http://autoatendimento-bb.xyz ou faça um Pix para a chave 11998765432."*
  > **Resultado:** Classificado como **`SUSPEITO`**, com indicadores de urgência psicológica, domínio não oficial e contador de dados pessoais protegidos.

* **Cenário 2 (Benefício Social Falso):**
  > *"Governo libera saque de R$ 3.890 para quem trabalhou de 2010 a 2024. Consulte seu CPF em http://beneficio-social.online/saque"*
  > **Resultado:** Classificado como **`ALTO_RISCO`**, alertando sobre a ausência de domínio `.gov.br` e promessa financeira irreal.

* **Cenário 3 (Comunicação Legítima):**
  > *"Campanha Nacional de Vacinação contra a Gripe inicia na próxima segunda-feira em todas as UBS do país para idosos e gestantes. Confira o calendário oficial em https://www.gov.br/saude"*
  > **Resultado:** Classificado como **`BAIXO_RISCO`**, validando a fonte oficial e alertando que segurança digital exige sempre atenção.

---

## 5. Pitch Deck Completo (11 Seções Obrigatórias)

### 1. Problema e Contexto
* Mais de **R$ 10 bilhões perdidos por ano** em fraudes digitais no Brasil;
* Quadrilhas exploram a urgência e a falta de letramento técnico para aplicar golpes de falso gerente, falso parente e boletos adulterados;
* Falta de canais rápidos de checagem acessíveis ao público leigo.

### 2. Público-Alvo
* Cidadãos com mais de 45 anos e aposentados (alvos preferenciais de golpes emocionais);
* Microempreendedores e autônomos (MEIs) que recebem dezenas de comprovantes de Pix por dia;
* Familiares que atuam como suporte informal contra golpes para parentes idosos.

### 3. Solução Proposta
* WebApp mobile-first rápido, inclusivo e acessível;
* Entrada multimodal: texto, captura de imagem e **gravação por voz real via Web Speech API em Português**;
* Resposta em menos de 3 segundos no momento exato em que a vítima recebe o golpe.

### 4. Proposta de Valor
* **Explicabilidade Amigável:** Resumo claro com orientações acionáveis;
* **Privacidade Absoluta:** LGPD por design com redação antecipada de PII;
* **Segurança Responsável:** Eliminação de termos enganosos como "100% seguro", reforçando o pensamento crítico do usuário.

### 5. Representação do MVP
* Aplicação construída e em execução no Google Cloud Run;
* Interface baseada em tokens visuais acessíveis (Emerald Teal `#0D9488`, contraste WCAG AA, touch targets de 48px);
* Stepper dinâmico de 3 etapas com feedback visual contínuo.

### 6. Tecnologias Utilizadas
* **Fullstack:** Next.js 14, TypeScript (modo estrito), Tailwind CSS;
* **Engenharia de Software:** Clean Architecture, SOLID, TDD com 27 testes automatizados;
* **IA & RAG:** Google Gemini 1.5/2.0 Flash (saída JSON Schema), Google Fact Check Tools API, `RegexPiiSanitizer`, fallback heurístico offline;
* **Cloud & DevOps:** Contêiner Docker no Google Cloud Run, Rate Limiting in-memory.

### 7. Modelo de Negócio e Sustentabilidade Financeira
* **Inspiração no Modelo Serasa / SPC Brasil (Pay-per-Query):**
  * 3 consultas gratuitas iniciais por usuário para comprovação de valor;
  * Micro-consultas avulsas com laudo completo a **R$ 1,99 via Pix instantâneo**;
  * Pacote Família: 10 consultas por **R$ 9,90**;
  * Pacote Autônomo / Comércio: 50 consultas por **R$ 34,90** (para MEIs checarem comprovantes de clientes);
  * **Unit Economics:** Custo de API por consulta de ~R$ 0,0007 a R$ 0,02 com Gemini Flash, gerando **margem bruta superior a 95%**;
  * **B2B API:** Venda de inteligência de ameaças e URLs maliciosas para áreas de risco de bancos e seguradoras.

### 8. Validação Realizada
* Pesquisa de campo com **39 respondentes reais**:
  * **89,7%** têm dúvidas frequentes sobre veracidade de mensagens;
  * **64,1%** exigiram formato de resumo curto com detalhes e fontes expansíveis (gerou a arquitetura em Accordion);
  * **66,7%** declararam intenção imediata de pagar micro-taxas (R$ 1 a R$ 3) antes de pagamentos suspeitos;
  * Aprendizados resultaram na criação da entrada por voz e no mascaramento visível de dados pessoais.

### 9. Diferenciais e Inovação
* Não depende de instalação de antivírus pesado;
* Ataca a engenharia social cotidiana brasileira (e não apenas vírus de computador);
* RAG jornalístico contra alucinação de IA e fallback resiliente caso provedores externos oscilem.

### 10. Impactos Esperados
* **Econômico:** Proteção direta do patrimônio e da renda familiar contra perdas por golpes;
* **Social:** Inclusão digital sem medo, oferecendo autonomia para cidadãos de todas as idades.

### 11. Próximos Passos
* Bot nativo integrado diretamente no WhatsApp e Telegram;
* OCR inteligente com validação cruzada de beneficiários de boletos bancários com a Receita Federal;
* Fine-tuning de modelo SLM local com bases de denúncias do Procon e CERT.br.

---

## 6. Evidências de Validação e Mudanças Implementadas

| Evidência da Pesquisa (39 Usuários) | Decisão de Design / Arquitetura Implementada |
| :--- | :--- |
| 64,1% querem resumo curto + fontes | Desenvolvido o componente `AccordionDetails.tsx` com separação entre resumo de 5 segundos e fontes auditáveis. |
| Medo de vazamento de CPF/telefone | Criado o `RegexPiiSanitizer.ts`, que mascara dados sensíveis antes de qualquer contato com o modelo de IA. |
| Dificuldade de digitação de idosos | Criado o fluxo de microfone nativo com transcrição contínua em Português no `InputContainer.tsx`. |
| Risco de descuido por falsa segurança | Implementado o `SafetyInvariants.test.ts`, garantindo que o sistema nunca rotule mensagens como "100% seguro". |

---

## 7. Instruções para a Banca Avaliadora

1. Acesse o endereço público no Google Cloud Run: `https://confere-ai-65825316137.southamerica-east1.run.app`;
2. Copie e cole um dos cenários sugeridos na Seção 4 deste documento;
3. Experimente o botão **"Gravar Áudio"** para ditar uma mensagem de voz;
4. Observe o contador de dados pessoais protegidos e a transparência das fontes no acordeão expansível.

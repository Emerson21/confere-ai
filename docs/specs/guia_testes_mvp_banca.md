# Guia de Demonstração e Testes do MVP — Confere Aí
## Instruções para a Banca Avaliadora (Tech4Change FIAP 2026)

Este guia foi elaborado para orientar os professores avaliadores no teste prático do **Confere Aí**, demonstrando o funcionamento em tempo real do pipeline de Inteligência Artificial, a sanitização de privacidade (PII) e o motor pedagógico de explicação de risco.

---

## 1. Informações de Acesso ao MVP

* **Aplicação em Nuvem (Google Cloud Run):** `https://confere-ai-65825316137.southamerica-east1.run.app` *(ou URL atualizada no painel Cloud Run do projeto)*
* **Execução Local (Caso deseje rodar via terminal):**
  1. Clonar e instalar dependências:
     ```bash
     git clone https://github.com/Emerson21/confere-ai.git
     cd confere-ai
     npm install
     ```
  2. Criar o arquivo `.env.local` a partir do modelo e informar a chave de API do Gemini (obtida gratuitamente no [Google AI Studio](https://aistudio.google.com/)):
     ```bash
     cp .env.example .env.local
     ```
     Abra o `.env.local` e defina sua chave:
     ```env
     GEMINI_API_KEY=sua_chave_do_gemini_aqui
     ```
  3. Iniciar o servidor de desenvolvimento:
     ```bash
     npm run dev
     # Acesse: http://localhost:3000
     ```
* **Credenciais de Acesso:** A aplicação é pública e **não exige login prévio nem senhas**, assegurando zero atrito para a banca e para os usuários finais.

---

## 2. Funcionalidades Disponíveis no MVP

1. **Entrada Multimodal:**
   * **Texto livre e links:** Aceita mensagens completas coladas do WhatsApp, SMS, e-mails ou URLs de notícias/boletos.
   * **Entrada de Áudio Real (Microfone):** Captura a voz do usuário e transcreve continuamente em Português (`pt-BR`) direto no campo de texto usando a Web Speech API nativa.
   * **Upload de Imagens/Arquivos:** Anexo de capturas de tela e comprovantes para análise contextual.
2. **Pipeline em 3 Etapas com Feedback Visual:**
   * *Etapa 1:* Sanitização e mascaramento estrito de dados pessoais sensíveis (CPFs, telefones, e-mails, chaves Pix).
   * *Etapa 2:* Checagem cruzada de fatos com APIs jornalísticas (Google Fact Check Tools) e análise contextual por IA (Google Gemini Flash).
   * *Etapa 3:* Síntese pedagógica estruturada via JSON Schema.
3. **Tela de Resultados Orientada à Decisão Humana:**
   * **Badge de Risco Sem Certezas Falsas:** Classificações estritamente baseadas em probabilidade (`BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`). O sistema **nunca** rotula nada como "100% seguro".
   * **Resumo Executivo Curto:** Leitura em 5 segundos, acessível para pessoas com baixa instrução digital.
   * **Acordeão Expansível de Detalhes e Fontes:** Indicadores concretos detectados (urgência, typosquatting, inconsistência) e links de checagens oficiais.
   * **Guia Prático "O que fazer agora":** Instruções preventivas acionáveis (contatar canal oficial, não clicar em links, registrar boletim se necessário).

---

## 3. Cenários de Teste Prontos para a Banca (Copie e Cole)

Para comprovar a precisão e robustez do sistema, sugerimos testar os 4 cenários a seguir:

### Cenário 1: Golpe Típico de Engenharia Social / Urgência Bancária
> **Texto para copiar e colar:**
> ```
> URGENTE: Prezado cliente, sua conta no Banco do Brasil foi bloqueada devido a movimentações suspeitas de R$ 1.500,00. Para regularizar imediatamente e evitar o cancelamento definitivo, acesse o link de autoatendimento https://regulariza-bb-seguro.xyz ou realize uma transferência de validação para a chave Pix 11998765432.
> ```
* **Resultado Esperado:** 
  * Nível de Risco: **`SUSPEITO`** ou **`ALTO_RISCO`** (Banner Âmbar/Vermelho);
  * Indicadores detectados: Sensação de urgência artificial, domínio suspeito (`.xyz`), pedido de transferência Pix;
  * Contador de PII: Redação do telefone/chave Pix e valor.

---

### Cenário 2: Desinformação / Boato sobre Benefício Governamental
> **Texto para copiar e colar:**
> ```
> Saiu o novo decreto do Governo Federal liberando saque extraordinário de R$ 3.890 para quem trabalhou com carteira assinada entre 2010 e 2024. O dinheiro está liberado hoje. Consulte seu CPF pelo link: http://consulta-beneficio-cidadao.online/saque
> ```
* **Resultado Esperado:** 
  * Nível de Risco: **`SUSPEITO`** ou **`ALTO_RISCO`**;
  * Resumo: Alerta de promessa irrealista e link não-governamental (ausência do domínio oficial `.gov.br`);
  * Fontes: Evidências jornalísticas de desmentidos de boatos similares.

---

### Cenário 3: Mensagem Institucional Legítima de Utilidade Pública
> **Texto para copiar e colar:**
> ```
> Campanha Nacional de Vacinação contra a Gripe: postos de saúde de todo o Brasil estarão abertos a partir de segunda-feira para imunização gratuita de idosos e gestantes. Leve documento com foto e caderneta de vacinação. Mais informações no portal oficial: https://www.gov.br/saude
> ```
* **Resultado Esperado:** 
  * Nível de Risco: **`BAIXO_RISCO`** (Banner Verde Esmeralda);
  * Resumo: Mensagem informativa condizente com campanhas públicas, apontando para domínio governamental oficial auditável;
  * Disclaimer: O sistema lembra que segurança digital requer atenção contínua.

---

### Cenário 4: Mensagem Amígua ou Sem Contexto Suficiente
> **Texto para copiar e colar:**
> ```
> Oi, tudo bem? Me liga assim que puder, preciso falar com você urgente sobre aquele assunto de ontem.
> ```
* **Resultado Esperado:** 
  * Nível de Risco: **`INCONCLUSIVO`**;
  * Resumo pedagógico: A IA explica que faltam elementos técnicos para confirmar ou refutar a mensagem e orienta o usuário a confirmar a identidade do remetente por ligação de voz ou outro canal seguro antes de agir.

---

## 4. Teste de Proteção de Dados Pessoais (Sanitização de PII)

O Confere Aí implementa o princípio de **Privacy-by-Design**. Para testar:
1. Cole uma mensagem contendo um CPF fictício e telefone:
   > *"Favor confirmar o pagamento para o CPF 123.456.789-00 no WhatsApp (11) 98765-4321"*
2. Observe na tela de resultado o indicador de privacidade:
   > *"Dados Pessoais Protegidos: 2 dados foram anonimizados antes do envio."*
3. Nenhum dado pessoal do usuário foi transmitido ao provedor do modelo de IA ou gravado em banco de dados.

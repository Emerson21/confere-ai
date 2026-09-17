# Pitch Deck Executivo — Confere Aí
## Tech4Change FIAP 2026 | "Potencializando o Ser Humano com Inteligência Artificial"

Este documento apresenta a estrutura completa dos **11 slides oficiais do Pitch Deck**, concebidos rigorosamente de acordo com as diretrizes do **Tech4Change**, integrando visual tokens da marca, métricas de validação e notas de apresentação.

---

### Slide 1: Capa & Identidade Institucional
* **Título:** Confere Aí
* **Subtítulo:** O copiloto inteligente contra fraudes e desinformação digital.
* **Tagline:** *"Antes de acreditar, clicar ou pagar: confira."*
* **Tema FIAP:** Potencializando o Ser Humano com Inteligência Artificial
* **Equipe:** [Nome do Grupo / Integrantes e RMs]
* **Notas do Apresentador:**
  > *"Boa noite, banca avaliadora. Todos os dias, milhões de brasileiros recebem mensagens no WhatsApp e SMS com ameaças de bloqueio de conta, promessas milagrosas de benefícios sociais ou pedidos urgentes de Pix. Hoje apresentamos o Confere Aí: uma inteligência artificial criada para agir como um copiloto cognitivo e proteger o cidadão comum no momento mais crítico da decisão digital."*

---

### Slide 2: Problema e Contexto
* **Título:** A Epidemia da Engenharia Social no Brasil
* **Dados de Mercado & Impacto Humano:**
  * **R$ 10+ Bilhões:** Prejuízo anual estimado em golpes digitais e fraudes de engenharia social no Brasil (dados Febraban / Fórum Brasileiro de Segurança Pública).
  * **7 em cada 10 brasileiros:** Já foram alvo de tentativas de fraude via Pix ou mensagens falsas.
  * **Vulnerabilidade Focal:** Idosos e pessoas com menor letramento digital são as principais vítimas da pressa e do medo gerados por mensagens alarmistas.
* **A Dor Central:** A pessoa comum não tem a quem recorrer em tempo real quando recebe uma cobrança duvidosa. O suporte dos bancos é lento e as ferramentas de segurança existentes são complexas ou corporativas.
* **Notas do Apresentador:**
  > *"No Brasil, o cibercrime não precisa hackear computadores; ele hackeia pessoas. A urgência psicológica de um 'sua conta será bloqueada em 2 horas' faz a vítima agir antes de pensar. O problema não é falta de inteligência do cidadão, é o desbalanceamento cognitivo contra quadrilhas digitais especializadas."*

---

### Slide 3: Público-Alvo
* **Título:** Quem Nós Protegemos
* **Segmentos Primários:**
  1. **Cidadãos com Baixo a Médio Letramento Digital:** Usuários de smartphones com mais de 45 anos, aposentados e beneficiários de programas sociais que dependem do WhatsApp para seu dia a dia.
  2. **Microempreendedores e Autônomos (MEIs):** Lojistas, prestadores de serviços e comerciantes que recebem dezenas de comprovantes de Pix por dia e são frequentemente lesados por comprovantes falsificados e boletos adulterados.
  3. **Familiares Protetores:** Filhos e netos que atuam como o "suporte técnico informal" da família e precisam de uma ferramenta simples para que seus pais e avós possam checar mensagens com autonomia.
* **Notas do Apresentador:**
  > *"Nosso público não é o especialista em TI. É a dona Maria, de 62 anos, que recebeu um Pix do suposto filho que trocou de número. É o Seu João, dono da oficina mecânica, que recebeu um comprovante de agendamento de Pix falso de um cliente."*

---

### Slide 4: Solução Proposta
* **Título:** Confere Aí — Seu Guardião Digital Acessível
* **O que é:** Um WebApp mobile-first de verificação imediata, que combina Inteligência Artificial Generativa, sanitização de dados pessoais e checagem cruzada de fontes oficiais.
* **Experiência em 3 Passos Simples:**
  1. **Entrada Sem Atrito:** O usuário cola o texto, fala a dúvida pelo microfone ou envia um comprovante/boleto.
  2. **Análise Protetora Invisível:** O sistema remove dados pessoais, consulta bases de checagem e avalia gatilhos de golpe.
  3. **Veredito Pedagógico e Acolhedor:** Resposta em 5 segundos, sem termos técnicos indecifráveis, indicando o nível de risco e exatamente o que fazer.
* **Notas do Apresentador:**
  > *"O Confere Aí funciona como aquele sobrinho de confiança que entende de tecnologia, disponível 24 horas por dia no bolso do cidadão. Ele não complica, não assusta e não exige que a pessoa entenda de cibersegurança."*

---

### Slide 5: Proposta de Valor
* **Título:** Inteligência Artificial que Empodera, Sem Criar Falsas Ilusões
* **Pilares de Valor:**
  * **Linguagem Simples & Acessível:** Resumo executivo de fácil compreensão, com checklist de ação preventiva ("O que fazer agora").
  * **Privacidade Absoluta (Privacy-by-Design):** Sanitização automática de CPFs, telefones e chaves Pix antes do processamento pela IA. Nenhum dado pessoal do usuário é armazenado.
  * **Transparência Auditável:** Acordeão expansível com indicadores concretos de fraude (sensação de urgência, domínio falso) e fontes de agências de checagem.
  * **Invariante Ética Inviolável:** **Nunca dizemos "100% seguro"**. A IA classifica níveis de risco (`BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`) e estimula a consciência crítica do usuário.
* **Notas do Apresentador:**
  > *"Nosso maior valor ético é a responsabilidade. Prometer que uma mensagem é '100% segura' geraria descuido. O Confere Aí amplia a capacidade humana de discernimento sem tirar do usuário o controle de suas decisões financeiras."*

---

### Slide 6: Demonstração do MVP
* **Título:** O Produto na Prática: Simples, Rápido e Seguro
* **Elementos da Interface (Mobile-First):**
  * **Header Institucional:** Identidade acolhedora com paleta *Emerald Teal* (`#0D9488`).
  * **Entrada Multimodal:** Caixa de texto, upload de imagem/boleto e **gravação real por microfone com transcrição em tempo real em Português (`pt-BR`)**.
  * **Stepper de Progresso Transparente:** Informa ao usuário cada fase (Higienizando dados -> Consultando bases -> Gerando veredito).
  * **Card de Resultado:** Badge claro de risco, resumo em destaque, acordeão de fontes e checklist acionável.
* **Aplicação em Nuvem:** MVP funcional e disponível no Google Cloud Run.
* **Notas do Apresentador:**
  > *"Aqui está o nosso MVP funcionando em produção. O usuário pode simplesmente apertar o microfone e dizer: 'Recebi um SMS dizendo que minha CNH foi suspensa'. Em menos de 3 segundos, o Confere Aí anonimiza a menção a qualquer documento, consulta os dados oficiais e entrega o veredito alertando sobre o golpe."*

---

### Slide 7: Tecnologias Utilizadas
* **Título:** Arquitetura Robusta, Resiliente e Escalável
* **Stack Tecnológica:**
  * **Frontend & Backend Integrados:** Next.js 14 (App Router) + TypeScript com tipagem estrita e Tailwind CSS.
  * **Arquitetura de Software:** **Clean Architecture + princípios SOLID** (Entidades de domínio, Gateways desacoplados e Casos de Uso com injeção de dependência).
  * **Inteligência Artificial:** Google Gemini 1.5/2.0 Flash via SDK oficial (`@google/genai`), com saída estruturada via JSON Schema e Prompt Injection Isolation (`<user_input_to_verify>`).
  * **RAG & Fact-Checking:** Google Fact Check Tools API para consulta a mais de 200 mil checagens de agências certificadas (Lupa, Aos Fatos, AFP).
  * **Mecanismos de Segurança:** `RegexPiiSanitizer` (LGPD por design), fallback heurístico local e `InMemoryRateLimiter` contra ataques de negação de serviço.
  * **Infraestrutura Cloud:** Contêiner Docker implantado no **Google Cloud Run** com auto-scaling de 0 a N instâncias.
* **Notas do Apresentador:**
  > *"Construímos o Confere Aí com padrões de engenharia de nível corporativo. Usamos Clean Architecture com TDD — são 27 testes automatizados validando regras de negócio e sanitização de dados. Se a conexão externa falhar, nosso motor heurístico local assume e garante o veredito sem deixar o usuário na mão."*

---

### Slide 8: Modelo de Negócio e Sustentabilidade Financeira
* **Título:** Sustentabilidade Operacional: O Modelo Pay-per-Query (Estilo Serasa / SPC)
* **Como Garantimos Viabilidade e Lucratividade:**
  1. **Aquisição Sem Barreiras (Trial Amigável):**
     * 3 consultas iniciais gratuitas por dispositivo/IP para gerar confiança imediata e atração viral.
  2. **Micro-pagamento por Consulta (Pay-per-Query via Pix):**
     * **Consulta Avulsa com Laudo Antifraude:** **R$ 1,99** via Pix instantâneo (liberação em 2 segundos).
     * **Pacote Proteção Familiar (10 consultas):** **R$ 9,90** (~R$ 0,99/consulta).
     * **Pacote Autônomo / Comércio (50 consultas):** **R$ 34,90** (para MEIs e lojistas que validam comprovantes diários de Pix de clientes).
  3. **Unit Economics & Margem Bruta Superior a 95%:**
     * Custo técnico por consulta (Gemini Flash + Cloud Run + taxa gateway Pix): **~R$ 0,02 a R$ 0,05**.
     * Receita por consulta: **R$ 1,99**.
     * **Margem Bruta:** **> 95%**, garantindo sustentabilidade financeira mesmo em alto volume.
  4. **B2B Threat Intelligence API (Bancos e Seguradoras):**
     * Venda de feed anonimizado de URLs maliciosas e novas fraudes ativas para os setores antifraude de instituições financeiras (consultas B2B a R$ 0,30 - R$ 0,50/chamada).
* **Notas do Apresentador:**
  > *"Nossa sustentabilidade financeira é baseada no modelo consolidado de bureaus como o Serasa e SPC. Quando uma pessoa está prestes a transferir R$ 1.500 no Pix para um suposto parente, pagar R$ 1,99 por uma checagem definitiva com laudo é um investimento insignificante frente ao risco de perder todo o salário."*

---

### Slide 9: Validação Realizada
* **Título:** Validado com Quem Vive o Problema na Pele
* **Pesquisa de Campo com 39 Respondentes Reais:**
  * **89,7%** relataram incerteza frequente sobre a legitimidade de mensagens e cobranças.
  * **71,8%** conhecem familiares próximos que já caíram ou quase caíram em golpes recentes.
  * **64,1% exigiram:** Resumo curto e direto com opção de abrir detalhes e fontes auditáveis *(orientou a criação do nosso Accordion UI)*.
  * **66,7%** declararam intenção imediata de pagar micro-taxas (R$ 1 a R$ 3) antes de efetuar transações arriscadas.
* **Aprendizados que Transformaram o Produto:**
  * Criação do botão de áudio por voz devido à dificuldade de idosos digitarem no celular;
  * Inserção do contador visual de dados pessoais protegidos para vencer a barreira de desconfiança;
  * Eliminação do termo "100% seguro" para evitar falso senso de proteção.
* **Notas do Apresentador:**
  > *"Não construímos o Confere Aí no vácuo. Nossa pesquisa com 39 pessoas provou que o usuário não quer um relatório de cinco páginas; ele quer um veredito confiável em 5 segundos, acompanhado de provas e uma lista clara de passos para não perder dinheiro."*

---

### Slide 10: Diferenciais e Inovação
* **Título:** Por Que o Confere Aí É Único
* **Quadro Comparativo:**
  * **Vs. Antivírus Tradicionais:** Focam em arquivos binários infectados e vírus; ignoram completamente a engenharia social, conversas persuasivas de WhatsApp e comprovantes falsos.
  * **Vs. ChatGPT / LLMs Genéricas:** Exigem contas pagas, prompt complexo, vazam dados pessoais para treinamento de IA e alucinam sem citar fontes oficiais.
  * **Vs. Agências de Fact-Checking Manuais:** Levam horas ou dias para desmentir um boato; o Confere Aí responde em **3 segundos** no momento exato em que a vítima recebe o golpe.
* **Blindagem Tecnológica:** Sanitização LGPD pré-LLM, RAG híbrido com Google Fact Check Tools e fallback heurístico offline.
* **Notas do Apresentador:**
  > *"A maioria dos golpes hoje não tem vírus. Tem persuasão. Enquanto o antivírus tradicional procura malwares, o Confere Aí analisa a psicologia da mensagem: urgência artificial, ameaça de prejuízo e inconsistência de dados cadastrais."*

---

### Slide 11: Impactos Esperados & Próximos Passos
* **Título:** O Futuro do Confere Aí: Cidadania e Segurança em Escala
* **Impactos Esperados:**
  * **Econômico:** Redução direta das perdas financeiras familiares com golpes de Pix e boletos falsos.
  * **Social & Inclusão:** Proteção ativa de populações vulneráveis, reduzindo a exclusão e o medo de utilizar serviços bancários digitais.
* **Roadmap de Próximos Passos:**
  1. **Bot Nativo no WhatsApp e Telegram:** Permissão para encaminhar a mensagem diretamente para um contato verificado do Confere Aí.
  2. **OCR Avançado de Boletos:** Leitura de código de barras e validação cruzada do CNPJ do beneficiário com a base da Receita Federal.
  3. **Fine-Tuning de SLM com Bases Nacionais:** Treinamento de modelo local (Gemma 2 / Llama 3 8B) com históricos de denúncias do Procon e CERT.br para identificar gírias e golpes locais em frações de milissegundo.
* **Notas do Apresentador:**
  > *"O Confere Aí começou como um projeto acadêmico de excelência na FIAP e está pronto para se tornar a principal camada de imunidade digital do cidadão brasileiro. Agradecemos a atenção da banca avaliadora e convidamos a todos para testarem a aplicação!"*

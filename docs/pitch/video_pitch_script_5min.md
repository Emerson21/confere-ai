# Roteiro Oficial do Vídeo de Pitch (Até 5 Minutos) — Confere Aí
## Tech4Change FIAP 2026 | "Potencializando o Ser Humano com Inteligência Artificial"

Este roteiro foi cronometrado para gravação do vídeo oficial de pitch para submissão no YouTube (duração máxima: 5 minutos). Ele contempla obrigatoriamente todos os 6 pontos exigidos pelo regulamento da FIAP.

---

### Visão Geral de Tempo e Conteúdo Obrigatório

| Bloco de Tempo | Tópico do Regulamento FIAP | O que Mostrar na Tela |
| :--- | :--- | :--- |
| **0:00 – 0:45** | **1. A Dor ou Problema Identificado** | Slide 2 (Epidemia da Engenharia Social) + Manchetes de jornais sobre golpes Pix |
| **0:45 – 1:15** | **2. O Público Impactado** | Slide 3 (Perfis de público: idosos, MEIs e famílias) |
| **1:15 – 2:15** | **3. A Solução Proposta & Demonstração do MVP** | **Gravação ao vivo da tela do MVP** (Input por voz, análise em tempo real e resultado pedagógico) |
| **2:15 – 3:00** | **4. O Diferencial da Solução & Tecnologia** | Slide 5 e 7 (Privacy-by-Design, Clean Architecture, RAG e Invariantes de Segurança) |
| **3:00 – 3:45** | **5. Modelo de Negócio & Validação de Mercado** | Slide 8 e 9 (Modelo Pay-per-Query Serasa + Dados da pesquisa de 39 respondentes) |
| **3:45 – 5:00** | **6. Resultados, Impactos Esperados & Conclusão** | Slide 10 e 11 (Impacto social, Roadmap e fechamento com visão de futuro) |

---

## Roteiro Cronometrado Passo a Passo (Falas e Telas)

### Bloco 1: Introdução & O Problema Real (0:00 – 0:45)
* **Visual:** Slide 1 (Capa Confere Aí), cortando para manchetes reais de golpes de Pix e WhatsApp.
* **Fala do Apresentador:**
  > *"Olá, professores e membros da banca do Tech4Change 2026. Meu nome é [Seu Nome], representando a equipe do **Confere Aí**.*
  > 
  > *No Brasil, os golpes digitais não dependem mais de vírus complexos; eles exploram a psicologia humana. Em 2024, mais de 10 bilhões de reais foram drenados do bolso de trabalhadores e aposentados por meio de engenharia social: mensagens com ameaças de contas bloqueadas, falsos comprovantes de Pix e links maliciosos.*
  > 
  > *O cidadão comum, ao receber uma mensagem alarmista no WhatsApp, não tem a quem recorrer em tempo real. Ele se vê sozinho contra quadrilhas organizadas."*

---

### Bloco 2: O Público Impactado (0:45 – 1:15)
* **Visual:** Slide 3 (Público-Alvo com fotos dos 3 arquétipos de usuários).
* **Fala do Apresentador:**
  > *"Quem mais sofre com essa epidemia são pessoas com menor letramento digital: nossos pais, mães e idosos, que dependem do celular mas têm receio contínuo de cair em armadilhas.*
  > 
  > *Também impacta duramente os microempreendedores e comerciantes — que recebem dezenas de comprovantes de Pix por dia e acabam entregando mercadorias com base em comprovantes falsos — e os próprios filhos, que vivem sobrecarregados sendo o 'suporte técnico' de emergência da família."*

---

### Bloco 3: A Solução Proposta & Demonstração do MVP Funcional (1:15 – 2:15)
* **Visual:** Transição direta para o **Screencast ao vivo do Confere Aí rodando no Google Cloud Run**.
* **Ação na Tela:**
  1. Mostrar a interface limpa e amigável no smartphone/viewport mobile;
  2. Clicar no botão **"Gravar Áudio"** e ditar uma dúvida: *"Recebi um Pix urgente do meu suposto sobrinho pedindo 800 reais hoje sem falta"*;
  3. Mostrar o texto transcrevendo em tempo real;
  4. Clicar em **"VERIFICAR MENSAGEM"**;
  5. Mostrar o stepper de 3 fases (Sanitizando dados -> Consultando bases -> Gerando veredito);
  6. Exibir o resultado com o selo **`SUSPEITO`**, o resumo em 2 linhas, o contador de dados pessoais protegidos e a expansão do acordeão com fontes.
* **Fala do Apresentador:**
  > *"Para resolver essa dor, criamos o **Confere Aí**: um copiloto inteligente e acessível que atua no exato momento da dúvida.*
  > 
  > *Vejam o nosso MVP em funcionamento. A pessoa não precisa digitar se tiver dificuldade: basta apertar o microfone e falar. Nosso sistema transcreve o áudio nativamente, sanitiza qualquer CPF ou telefone por privacidade e processa a mensagem em menos de 3 segundos.*
  > 
  > *O resultado não é um jargão técnico assustador: é um resumo claro, o nível de risco e um passo a passo acolhedor do que fazer."*

---

### Bloco 4: Os Diferenciais e a Arquitetura Tecnológica (2:15 – 3:00)
* **Visual:** Slide 7 (Diagrama de Clean Architecture + Pipeline de IA e Segurança).
* **Fala do Apresentador:**
  > *"O que torna o Confere Aí único? Primeiro, o compromisso ético com a segurança: **nós nunca dizemos que algo é 100% seguro**. A IA atua estimulando o espírito crítico, nunca gerando descuido.*
  > 
  > *Segundo, nosso princípio de **Privacy-by-Design**: removemos dados pessoais sensíveis antes de qualquer contato com o modelo de IA.*
  > 
  > *Sob o capô, desenvolvemos o projeto em **Clean Architecture e TDD**, com 27 testes automatizados, TypeScript estrito, integração de RAG com a API do Google Fact Check Tools e inteligência generativa com o Google Gemini Flash, tudo rodando em contêiner Docker serverless no Google Cloud Run."*

---

### Bloco 5: Modelo de Negócio & Validação de Mercado (3:00 – 3:45)
* **Visual:** Slide 8 e 9 (Tabela de preços Serasa / Pay-per-Query + Gráficos da pesquisa de 39 pessoas).
* **Fala do Apresentador:**
  > *"Para garantir sustentabilidade financeira sem criar barreiras sociais, adotamos o modelo consagrado dos grandes bureaus como o **Serasa e SPC Brasil: o Pay-per-Query**.*
  > 
  > *O usuário ganha 3 consultas gratuitas de experimentação. Depois, se vai transferir 1.500 reais no Pix ou pagar um boleto alto, paga uma taxa simbólica de **R$ 1,99 via Pix** para obter um laudo antifraude completo, ou pacotes com desconto para comerciantes.*
  > 
  > *Nosso custo técnico de processamento com Gemini Flash é de menos de 5 centavos por consulta, gerando uma **margem bruta superior a 95%**.*
  > 
  > *Validamos esse modelo em pesquisa de campo com **39 respondentes**: 89,7% relataram ter dúvidas frequentes e 64,1% exigiram exatamente o formato de resumo com detalhes expansíveis que implementamos."*

---

### Bloco 6: Impacto Esperado & Conclusão (3:45 – 5:00)
* **Visual:** Slide 10 e 11 (Roadmap futuro, bot de WhatsApp, fotos de impacto social) e encerramento com os contatos da equipe.
* **Fala do Apresentador:**
  > *"Nosso impacto é direto na preservação da renda familiar e na inclusão digital. O Confere Aí devolve a tranquilidade para quem quer usar a tecnologia bancária sem medo.*
  > 
  > *Nossos próximos passos incluem levar o Confere Aí para dentro do WhatsApp como um contato verificado, adicionar OCR inteligente para ler códigos de barras de boletos em PDF e realizar o fine-tuning de modelos locais com as bases do CERT.br e Procon.*
  > 
  > *O Confere Aí materializa o propósito do Tech4Change: utilizar Inteligência Artificial de ponta não para substituir as pessoas, mas para potencializar o discernimento e a segurança de cada cidadão brasileiro.*
  > 
  > *Muito obrigado e aguardamos os feedbacks da banca!"*

---

## Dicas para a Gravação do Vídeo

1. **Gravação da Tela do MVP:** Use OBS Studio ou gravação de tela nativa em resolução 1080p.
2. **Áudio do Apresentador:** Utilize fone com microfone lapela ou headset para garantir voz clara e sem eco.
3. **Plataforma:** Subir no YouTube como **"Não Listado" (Unlisted)** ou **"Público"**.
4. **Inserção do Link:** Copie a URL do vídeo do YouTube e insira no documento central da entrega (`Tech4Change_Documento_Central.md`).

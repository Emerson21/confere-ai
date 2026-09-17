# Relatório Consolidado de Evidências de Validação e Aprendizados
## Projeto: Confere Aí (Tech4Change FIAP 2026)

Este documento consolida os dados da pesquisa de campo, entrevistas e testes de usabilidade realizados com potenciais usuários do **Confere Aí**, apresentando a metodologia empregada, as métricas obtidas, a síntese de aprendizados e a rastreabilidade das mudanças implementadas no produto final.

---

## 1. Metodologia de Validação

* **Instrumento:** Pesquisa estruturada via formulário on-line quanti-qualitativo e entrevistas semiestruturadas em profundidade.
* **Amostra:** **39 respondentes** de diferentes faixas etárias, perfis sociodemográficos e níveis de letramento digital (com foco em adultos acima de 40 anos e familiares que atuam como "suporte técnico informal" de parentes idosos).
* **Objetivo:** Validar a frequência da exposição a golpes digitais, as maiores dores cognitivas ao receber mensagens suspeitas, a disposição a pagar por proteção e a preferência de formato para o veredito de segurança.

---

## 2. Métricas e Resultados Obtidos

### A. Frequência da Exposição e Insegurança Digital
* **89,7% dos entrevistados** relataram já ter recebido mensagens, e-mails ou cobranças e ficado em **dúvida genuína se eram reais ou golpe**.
* **71,8% dos participantes** afirmaram que familiares próximos (especialmente pais ou avós) já caíram ou quase caíram em fraudes via WhatsApp ou Pix falso.
* **Canais mais comuns de ataque relatados:**
  1. WhatsApp (mensagens de urgência simulando familiares ou bancos): **82,1%**;
  2. SMS com links maliciosos encurtados: **69,2%**;
  3. Boletos de cobrança adulterados (IPVA, condomínio, faturas): **53,8%**.

### B. Preferência de Formato de Resposta do Assistente de IA
Quando questionados sobre como preferem receber o resultado da checagem:
* **64,1% escolheram:** *"Um resumo curto e direto de 2 linhas dizendo o nível de risco, com a opção de abrir detalhes e ver as fontes comprovando o veredito."*
* **23,1% escolheram:** *"Apenas um selo visual rápido de 'Suspeito' ou 'Baixo Risco'."*
* **12,8% escolheram:** *"Um texto longo e detalhado explicando tecnicamente o que aconteceu."*

### C. Validação da Disposição de Pagamento (Modelo de Negócio)
* **66,7% dos entrevistados** afirmaram que pagariam uma taxa simbólica avulsa (entre **R$ 1,00 e R$ 3,00 via Pix**) para ter um laudo confiável antes de realizar um pagamento suspeito de alto valor (como um boleto acima de R$ 500 ou um Pix urgente).
* A analogia com o **Serasa / SPC** foi espontaneamente mencionada por respondentes autônomos que precisam validar comprovantes de pagamentos recebidos de clientes.

---

## 3. Síntese dos Principais Aprendizados

1. **A Paralisia por Excesso de Texto:** Usuários sob estresse de um golpe não leem laudos técnicos longos. Textos extensos geram confusão e abandono da ferramenta.
2. **O Risco da Falsa Sensação de Segurança:** Se uma ferramenta disser que uma mensagem é "100% segura", o usuário baixa a guarda e pode cair em um golpe sutil de desvio posterior. A IA deve ensinar o usuário a manter cautela contínua.
3. **Privacidade é um Pré-requisito de Confiança:** Mais de 60% dos respondentes hesitam em colar dados que contenham seu próprio CPF ou número de telefone em ferramentas desconhecidas na internet. A proteção desses dados precisa ser demonstrada visualmente.
4. **Dificuldade de Digitação em Celulares:** Usuários idosos relataram dificuldade em selecionar e colar textos longos, demonstrando forte preferência por gravar áudio explicando o que receberam.

---

## 4. Mudanças Realizadas na Solução a partir da Validação

A tabela abaixo detalha como cada aprendizado da pesquisa orientou diretamente uma decisão de engenharia e design no MVP:

| Aprendizado da Pesquisa | Hipótese Inicial | Mudança Concreta Implementada no MVP |
| :--- | :--- | :--- |
| **64,1% querem resumo curto + fontes expansíveis** | O sistema retornaria um artigo explicativo completo gerado pela LLM. | **Implementação do Accordion:** A tela exibe primeiro um resumo de 2 linhas legível em 5 segundos, seguido de um acordeão colapsável *"Ver Detalhes e Fontes"* com links clicáveis de agências de checagem. |
| **Falsa certeza causa descaso cognitivo** | Exibir selos simplistas como "Seguro" e "Perigoso". | **Invariante de Segurança Inviolável:** Eliminação de qualquer rótulo "100% seguro". Uso exclusivo de níveis probabilísticos (`BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`) e disclaimer educativo mandatório. |
| **Preocupação com vazamento de dados pessoais** | O texto do usuário seria enviado diretamente para o prompt da LLM. | **Sanitizador Regex de PII Antecipado:** Mascaramento de CPFs, telefones e Pix antes do envio à API, com badge visual na tela informando ao usuário quantos dados pessoais foram protegidos. |
| **Dificuldade de digitação / acessibilidade mobile** | Entrada exclusivamente via digitação em textarea. | **Entrada Multimodal por Voz Real:** Adição do botão *"Gravar Áudio"* integrado à Web Speech API nativa em Português (`pt-BR`), permitindo que a pessoa fale a mensagem e a veja transcrita instantaneamente. |
| **Sustentabilidade Financeira Viável** | Modelo dependente de doações ou assinatura mensal fixa com login. | **Modelo Pay-per-Query estilo Serasa/SPC:** 3 consultas cortesia para atração, seguidas de pacotes acessíveis de R$ 1,99 por consulta via Pix ou pacotes comerciais para autônomos. |

---

## 5. Conclusão da Validação

A validação com 39 respondentes comprovou que o **Confere Aí** ataca uma dor real, generalizada e urgente no cotidiano do brasileiro. As adaptações realizadas garantiram uma solução centrada nas necessidades humanas, unindo alta tecnologia de IA à simplicidade pedagógica e à proteção de privacidade.

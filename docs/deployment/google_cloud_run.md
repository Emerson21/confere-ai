# Guia de Deploy no Google Cloud Run - Confere Aí

Este guia orienta o processo de implantação da aplicação **Confere Aí** no **Google Cloud Run**, permitindo que a banca avaliadora e os usuários acessem a plataforma por uma URL pública e segura (`https://...`).

---

## 1. Pré-requisitos

1. Conta ativa no [Google Cloud Console](https://console.cloud.google.com/).
2. Projeto criado no Google Cloud (ex: `confere-ai-fiap` ou similar).
3. Repositório no GitHub atualizado com o código da aplicação.
4. Chave de API do Gemini (`GEMINI_API_KEY`) obtida no [Google AI Studio](https://aistudio.google.com/).

---

## 2. Opção A: Deploy Automático via Console Web (Recomendado)

Esta é a opção mais simples e direta, dispensando a instalação de qualquer ferramenta no seu computador.

### Passo 1: Conectar o Repositório GitHub
1. Acesse o console do Google Cloud e pesquise por **Cloud Run** na barra superior (ou acesse [console.cloud.google.com/run](https://console.cloud.google.com/run)).
2. Clique no botão **Criar Serviço (Create Service)**.
3. Escolha a opção: **"Fazer a implantação contínua a partir de um repositório" (Continuously deploy from a repository)** e clique em **Configurar com o Cloud Build**.
4. Selecione o provedor **GitHub**, autorize sua conta e escolha o repositório `Emerson21/confere-ai`.
5. Em **Tipo de Build**, selecione **Dockerfile** (o Cloud Run detectará automaticamente o `Dockerfile` na raiz do projeto).

### Passo 2: Configurar o Serviço
1. **Nome do Serviço:** `confere-ai`
2. **Região:** `southamerica-east1` (São Paulo) ou `us-central1` (Iowa, EUA - com menor latência e custo).
3. **Autenticação:** Marque obrigatoriamente **"Permitir invocações não autenticadas" (Allow unauthenticated invocations)** para que a banca e os usuários acessem livremente.
4. Em **Escalonamento (Autoscaling)**:
   - Mínimo de instâncias: `0` (garante custo zero quando ninguém estiver acessando).
   - Máximo de instâncias: `5` ou `10`.

### Passo 3: Adicionar Variáveis de Ambiente
1. Expanda a seção **"Contêiner(es), Volumes, Rede, Segurança"**.
2. Na aba **Contêiner**, procure por **Variáveis de ambiente (Environment variables)**.
3. Clique em **Adicionar variável**:
   - `GEMINI_API_KEY` = `[Sua chave do Gemini]`
   - `NODE_ENV` = `production`
   - `FACT_CHECK_API_KEY` = `[Sua chave opcional do Fact Check, se houver]`

### Passo 4: Criar e Publicar
1. Clique em **Criar (Create)**.
2. O Google Cloud Build iniciará o processo de build do contêiner automaticamente.
3. Após 2 a 4 minutos, o Cloud Run exibirá a **URL pública do serviço** (ex: `https://confere-ai-xxxxxxxx-uc.a.run.app`).

---

## 3. Opção B: Deploy via Linha de Comando (`gcloud CLI`)

Se você preferir utilizar o terminal:

1. Instale o [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Autentique-se e selecione seu projeto:
   ```bash
   gcloud auth login
   gcloud config set project SEU_PROJECT_ID
   ```
3. Execute o comando de deploy a partir da raiz do projeto:
   ```bash
   gcloud run deploy confere-ai \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="SUA_CHAVE_AQUI",NODE_ENV="production"
   ```

---

## 4. Testes e Validação pela Banca

1. Abra a URL gerada no navegador mobile e desktop.
2. Cole um texto suspeito de teste (exemplo de tentativa de golpe via WhatsApp ou Pix falso).
3. Verifique se o pipeline de 3 passos é executado:
   - Sanitização de dados pessoais (PII).
   - Verificação contextual e heurística com Gemini.
   - Apresentação do veredito com resumo executivo e acordeão de detalhes.

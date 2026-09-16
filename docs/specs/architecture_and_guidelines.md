# Diretrizes de Arquitetura e Engenharia: Confere Aí

Este documento define os padrões arquiteturais, princípios de design de software (**Clean Architecture** + **SOLID**), regras inegociáveis de segurança e privacidade, e a estratégia de testes (**TDD**) para o desenvolvimento do **Confere Aí**.

---

## 1. Clean Architecture: Estrutura em Camadas

A arquitetura é dividida em quatro círculos concêntricos para garantir isolamento e alta testabilidade:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. CAMADA DE DOMÍNIO (Domain Layer)                                       │
│    Local: src/domain/                                                     │
│    - Entidades puras, Value Objects e Enums.                              │
│    - Regras essenciais de verificação e classificação de risco.           │
│    - Independência absoluta: ZERO dependências de frameworks, banco ou IO.│
└─────────────────────────────────────▲─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┴─────────────────────────────────────┐
│ 2. CAMADA DE APLICAÇÃO (Application Layer)                                │
│    Local: src/application/                                                │
│    - Casos de Uso (Use Cases) e Orquestradores de Negócio.                │
│    - Portas/Interfaces (Gateways, Repositórios e Serviços).              │
│    - Define as operações sem saber quem as implementa (Inversão de Dep.). │
└─────────────────────────────────────▲─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┴─────────────────────────────────────┐
│ 3. CAMADA DE ADAPTADORES / APRESENTAÇÃO (Interface Adapters)              │
│    Local: src/adapters/ & app/api/                                        │
│    - Controllers de API (Next.js App Router handlers).                    │
│    - Validadores de entrada e DTOs (Zod Schemas).                         │
│    - Presenters e Componentes de UI (React / Tailwind).                   │
└─────────────────────────────────────▲─────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┴─────────────────────────────────────┐
│ 4. CAMADA DE INFRAESTRUTURA (Infrastructure Layer)                        │
│    Local: src/infrastructure/                                             │
│    - Implementações de Gateways externos:                                 │
│      * GoogleFactCheckApiAdapter (Google Fact Check Tools API)            │
│      * GeminiLlmAdapter (Gemini API via SDK com JSON Schema)              │
│      * RegexPiiSanitizerAdapter (Sanitização com Expressões Regulares)    │
│      * InMemoryRateLimiterAdapter (Controle de fluxo e anti-abuso)        │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Princípios SOLID & Regras de Qualidade

1. **S - Single Responsibility Principle (Responsabilidade Única)**:
   - Cada classe ou módulo deve ter apenas um motivo para mudar.
   - `PiiSanitizer`: Somente limpa dados sensíveis.
   - `FactCheckGateway`: Somente se comunica com provedores de fact-checking.
   - `VerifyContentUseCase`: Somente orquestra o fluxo de verificação.

2. **O - Open/Closed Principle (Aberto para Extensão, Fechado para Modificação)**:
   - Novas fontes de checagem ou novos provedores de IA devem ser adicionados criando novos adaptadores que implementam a mesma interface (`IFactCheckGateway`, `ILlmGateway`), sem alterar os Casos de Uso existentes.

3. **L - Liskov Substitution Principle (Substituição de Liskov)**:
   - Qualquer implementação de gateway (por exemplo, um `MockFactCheckGateway` nos testes) deve ser intercambiável com a implementação real sem quebrar o comportamento do sistema.

4. **I - Interface Segregation Principle (Segregação de Interfaces)**:
   - Interfaces pequenas e coesas. Nenhum cliente deve ser forçado a depender de métodos que não utiliza:
     - `IPiiSanitizer`: `sanitize(rawText: string): SanitizedResult`
     - `IFactCheckGateway`: `searchFactChecks(query: string): Promise<FactCheckSource[]>`
     - `ILlmGateway`: `analyzeRisks(input: SanitizedInput, context: FactCheckContext): Promise<LlmRiskAnalysis>`
     - `IRateLimiter`: `checkLimit(clientIdentifier: string): Promise<RateLimitResult>`

5. **D - Dependency Inversion Principle (Inversão de Dependência)**:
   - Módulos de alto nível (Casos de Uso) não devem depender de módulos de baixo nível (APIs, bibliotecas externas). Ambos devem depender de abstrações (Interfaces).

6. **DRY (Don't Repeat Yourself)**:
   - Tipos e contratos de domínio unificados em `src/domain/types/`.
   - Builders e fixtures compartilhados para testes em `tests/fixtures/`.
   - Utilitários de formatação e visualização centralizados em `src/shared/`.

---

## 3. Diretrizes Inegociáveis de Segurança, Privacidade e Segredos

### 3.1. Sigilo Absoluto de Chaves e Credenciais
- **PROIBIÇÃO**: Nenhuma chave de API, secret ou credencial (`GEMINI_API_KEY`, tokens) pode ser incluída em código, documentação pública, logs ou respostas de API.
- Todas as variáveis sensíveis são injetadas estritamente via `process.env` no servidor (Node.js/Next.js Server Actions e API Routes).
- O arquivo `.gitignore` bloqueia `.env`, `.env.local`, `.env.*.local`.

### 3.2. Retenção Zero de Dados Pessoais (Zero-Data Retention)
- O texto submetido pelo usuário é processado **exclusivamente em memória**.
- Não há persistência de entradas de texto em banco de dados ou sistemas de armazenamento temporário.
- Toda informação pessoal identificável (PII) é sanitizada antes de qualquer requisição externa (LLM, APIs de busca).

### 3.3. Proteção contra Abuso (Rate Limiting & Validação de Borda)
- Limitação de taxa de requisições por IP / token para mitigar ataques de negação de serviço e esgotamento de cotas.
- Validação estrita de payloads com schemas Zod:
  - Tamanho máximo de texto: 5.000 caracteres.
  - Bloqueio de requisições malformadas ou com propriedades não declaradas.
- Sanitização contra Prompt Injection: Delimitação estrita do conteúdo via tags `<user_input_to_verify>...</user_input_to_verify>` e instrução ao LLM para tratar o conteúdo estritamente como dado passivo.

### 3.4. Gestão de Incerteza (Trava de Falsa Segurança)
- **NUNCA** classificar um conteúdo como "100% Seguro", "Garantido" ou "Livre de Riscos".
- Os status permitidos são: `BAIXO_RISCO`, `SUSPEITO`, `ALTO_RISCO`, `INCONCLUSIVO`.

---

## 4. Estrutura de Testes e Metodologia TDD

### Estrutura de Diretórios de Teste
```
tests/
├── unit/
│   ├── domain/                  # Testes das entidades, value objects e regras puras
│   ├── application/             # Testes dos Casos de Uso com gateways mockados
│   └── infrastructure/          # Testes dos adaptadores (Regex, formatadores)
├── integration/
│   └── api/                     # Testes das rotas HTTP (/api/analyze)
└── components/                  # Testes de componentes React (renderização e acessibilidade)
```

### Ciclo Red-Green-Refactor
1. **Red**: Escrever o teste para o requisito da User Story antes de criar o código de produção. Executar e confirmar a falha esperada.
2. **Green**: Escrever a implementação estritamente necessária para satisfazer o teste e torná-lo verde.
3. **Refactor**: Aprimorar o design, eliminar duplicações, melhorar tipagem e clareza sem alterar o comportamento verificado pelos testes.

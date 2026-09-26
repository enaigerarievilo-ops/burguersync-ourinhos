📘 SOP Mestre: BurguerSync
Status: Inicialização & Engenharia de Execução | Versão: 2.5.5  
Ambiente Alvo: Produção Serverless / Realtime (Web App + Firebase Firestore + GitHub Pages)
---
1. Visão Geral e Objetivo Principal
O BurguerSync é uma plataforma de autoatendimento e controle de pedidos para hamburguerias artesanais (estilo iFood com visual Dark Mode neon), integrada a um sistema de exibição de cozinha (Kitchen Display System - KDS) em tempo real.
Problema Resolvido
Elimina o atraso e erros de anotação manual entre pedidos de balcão/delivery e a chapa da cozinha.
Substitui comandas de papel por sincronização instantânea e reativa sem necessidade de recarregar a tela (zero refresh / F5).
Garante total consistência dos dados financeiros (subtotal, frete fixo de R$ 5,00 e cálculo automático de troco).
---
2. Arquitetura do Projeto em 3 Camadas (Tri-Layer Pattern)
```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1: Diretivas & Negócio (SOP, Regras, Schema, Design)      │
│  - directives/design/design.md (Tokens visuais, UI/UX)           │
│  - Validações de carrinho, taxação e máquina de estados KDS      │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ Interpretação & Coordenação
┌────────────────────────────────▼─────────────────────────────────┐
│  Layer 2: Orquestração (Agente IA / Gemini Sênior)               │
│  - Pipeline de automação, roteamento e resolução de dependências │
│  - Isolamento de builds transitórios em .tmp/                    │
│  - Monitor de integridade e acionamento de Self-Annealing        │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ Chamadas Determinísticas
┌────────────────────────────────▼─────────────────────────────────┐
│  Layer 3: Execução & Determinismo                                │
│  - SDK Web Firebase v10 (Firestore addDoc, onSnapshot, updateDoc)│
│  - Bundler / Minificador (Vite ou Rollup determinístico)         │
│  - Scripts CLI (deploy.js, validate-env.js, executar.bat)        │
└──────────────────────────────────────────────────────────────────┘
```
Layer 1 (Diretivas & Lógica de Negócio pura): Define o que deve ser feito. Não contém código executável. Centraliza o esquema do banco, valores fiscais, transições válidas de status e diretrizes de design visual (`design.md`).
Layer 2 (Orquestração IA / Pipeline): O agente orquestrador coordena o ciclo de vida: lê as diretivas, prepara variáveis, executa etapas de validação e direciona artefatos transitórios para `.tmp/`.
Layer 3 (Execução & Determinismo puro): Código de execução livre de decisões de negócio arbitrárias. Scripts desacoplados em ESM/Vanilla JS que consomem a API do Firebase, validam o DOM e realizam testes unitários e de integração.
---
3. Escopo Tecnológico & Requisitos (Tech Stack)
Front-End: HTML5 Semântico, CSS3 Moderno (Custom Properties, Flexbox, Grid, Animações com Glow Neon), Vanilla JavaScript (ESM nativo sem dependência de frameworks pesados).
Backend-as-a-Service (BaaS): Firebase SDK Web v10 (Firestore NoSQL em modo Realtime via CDN/ESM).
Gerenciamento de Segredos & Configuração: `.env` local para chaves do projeto (Firebase apiKey, authDomain, projectId) injetado em tempo de montagem.
Isolamento Transitório: Diretório `.tmp/` no `.gitignore` para builds, caches de testes, logs de auditoria e bundles intermediários.
Entregáveis em Nuvem:
Banco de Dados: Firebase Firestore (GCP).
Hospedagem e CI/CD: GitHub Pages (via GitHub Actions) ou Firebase Hosting.
---
4. Diretrizes de UX/UI e Referências Visuais
Padrão Estético: Especificado integralmente em `directives/design/design.md`. Dark Mode profundo (`#0A0A0C`), superfícies em tons de ardósia (`#1A1A1E`), destaques em Laranja Neon (`#FF9E00`), avisos de observação em Amarelo (`#FFD000`) e confirmações em Verde Vibrante (`#04D361`).
Navegação: Alternância instantânea via tabs entre as visões:
`🛍️ Cardápio / Checkout` (Cliente).
`👨‍🍳 Cozinha KDS` (Operação).
Mobile-First & Responsividade: Layout fluido de 1 coluna em telas `< 640px` até grade expansível de 3 colunas para tablets e desktops KDS.
---
5. Fluxo Operacional de Execução
```
[Kickoff: ideia-projeto.md] 
       │
       ▼
[Validação do SOP Mestre (Layer 1)]
       │
       ▼
[Geração dos Módulos Determinísticos em .tmp/src/ (Layer 3)]
       │ ├── firebase-config.js
       │ ├── cart-controller.js
       │ └── kds-realtime.js
       │
       ▼
[Auditoria Automatizada & Testes em .tmp/test-runner.js]
       │
   [Sucesso?] ──► NÃO ──► [Loop de Self-Annealing (Máx. 3 tentativas)]
       │
      SIM
       ▼
[Publicação do Build em Nuvem (GitHub Pages / Firebase Hosting)]
```
Passo a Passo Detalhado
Kickoff & Verificação de Ambiente:
Conferência do arquivo `.env` para validação das credenciais do Firebase.
Criação garantida do diretório transitório `.tmp/`.
Separação de Módulos Determinísticos (Layer 3):
Implementação do cliente Firestore desacoplado da interface gráfica.
Implementação das regras de validação do formulário (regex de telefone, checagem de carrinho não vazio).
Isolamento Transitório:
Todos os testes headless, logs e relatórios de auditoria são gerados exclusivamente em `.tmp/reports/`.
Deploy em Nuvem:
O branch de publicação (`gh-pages` ou comando `firebase deploy`) consome apenas a versão validada e testada.
---
6. Definição de Sucesso (Deliverables)
Entregáveis em Nuvem & Raiz
Repositório GitHub: Código-fonte limpo sem arquivos temporários residuais.
Web App Ativo: Aplicação funcional acessível publicamente via URL em nuvem.
Banco Operacional: Coleção `pedidos` do Firestore com regras de segurança ativas.
Arquivos de Suporte Obrigatórios
`README.md`: Documentação executiva bilíngue (PT-BR / EN), prints da aplicação e instruções de clonagem.
`instruction.md`: Guia direto de terminal com comandos para desenvolvedores (instalação de dependências e deploy).
`executar.bat`: Script de inicialização para Windows que verifica dependências, inicializa servidor local HTTP e abre o navegador automaticamente.
---
7. Tratamento de Erros, Resiliência e Self-Annealing
Para garantir que o fluxo de build e execução seja autônomo e resiliente, o sistema implementa um ciclo fechado de autocorreção (Self-Annealing Loop):
```
       ┌───────────────────────────────┐
       │   Falha Detectada no Step     │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │ 1. Isolamento do Erro         │
       │    Gravação do log em:        │
       │    .tmp/errors/last_trace.log │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │ 2. Diagnóstico Categórico     │
       │    [ENV / NETWORK / SCHEMA /  │
       │     SYNTAX / FIRESTORE-RULES] │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │ 3. Patch Determinístico       │
       │    Execução de correção       │
       │    sem alterar regras de L1   │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │ 4. Re-teste em Sandbox        │
       │    Verificação via .tmp/      │
       └──────────────┬────────────────┘
                      │
         [Resolvido?] ┴─────────┐
             │ SIM              │ NÃO (Tentativas < 3)
             ▼                  ▼
     [Prosseguir Deploy]   [Loop Retry #N+1]
                                │ NÃO (Tentativas >= 3)
                                ▼
                           [Halt com Relatório Crítico]
```
Regras do Self-Annealing
Fallback de Credenciais: Se as variáveis do `.env` estiverem ausentes durante testes locais, o sistema aciona automaticamente o mock estático em `.tmp/mock-firestore.js` para não travar a validação de UI.
Resiliência de Rede no Realtime: O listener `onSnapshot` deve conter callback de erro explícito com reconexão automática exponencial (backoff de 1s, 2s, 4s até 16s).
Regra de Não-Regressão de L1: O agente de autocorreção não pode alterar as diretivas de negócio (ex.: alterar o valor da taxa de entrega ou remover a obrigatoriedade de campos) para resolver erros de código determinístico.
Trilha de Auditoria: Toda autocorreção é sintetizada em `.tmp/annealing_log.md` antes da entrega final.
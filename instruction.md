# 📖 Instruções Técnicas para Desenvolvedores - BurguerSync Ourinhos

Este documento contém os comandos diretos para execução, testes, validação e deploy do projeto **BurguerSync Ourinhos**.

---

## 🛠️ 1. Pré-requisitos
- **Node.js**: v18+ (testado na v24)
- **Git**: Configurado com credenciais do GitHub
- **Navegador Moderno**: Chrome / Edge com suporte a ES Modules

---

## ⚡ 2. Execução Local Rápida (Windows)

Dê um duplo clique no arquivo:
```cmd
executar.bat
```
Ou execute via terminal:
```powershell
npx -y serve -s . -l 3000
```
Acesse em seu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🧪 3. Execução de Testes Automatizados (Determinísticos)

Para validar a integridade dos cálculos do carrinho, regras fiscais e transições de status da cozinha:
```bash
node execution/test-runner.js
```

---

## 🔍 4. Validação de Variáveis de Ambiente (.env)

Para verificar se as chaves do Firebase e do GitHub estão configuradas:
```bash
node execution/validate-env.js
```

---

## 🚀 5. Deploy Automatizado no GitHub

Para publicar ou sincronizar o projeto no repositório remoto:
```bash
node execution/github-publisher.js
```

---

## 📂 6. Estrutura do Repositório
```
├── Directives/             # Camada 1: Diretivas de Negócio, SOPs e Design Tokens
├── frontend/               # Camada 3: Interface SPA, Controladores e Estilização
│   ├── js/
│   │   ├── app.js          # Orquestrador da Interface
│   │   ├── cart-controller.js # Carrinho & Checkout
│   │   ├── kds-controller.js  # Cozinha em Tempo Real (onSnapshot)
│   │   ├── firebase-config.js # Conexão Firebase v10
│   │   └── products-data.js   # Catálogo Gastronômico
│   ├── style.css           # Design System Dark Neon (Google Stitch)
│   └── index.html          # Ponto de Entrada da Interface
├── execution/              # Camada 3: Scripts Determinísticos de Suporte
│   ├── test-runner.js      # Suíte de Testes
│   ├── validate-env.js     # Validador de .env
│   └── github-publisher.js # Publicador GitHub API
├── documentation/          # Camada 2: Documentação & Rastreabilidade de Prompts
│   ├── architecture.md     # Detalhes da Arquitetura
│   └── promptHistory.md    # Log Integral de Prompts da Sessão
├── index.html              # Ponto de Entrada Raiz (GitHub Pages)
├── executar.bat            # Script de Execução Windows
├── instruction.md          # Este Manual de Terminal
└── README.md               # Apresentação Bilíngue do Projeto
```

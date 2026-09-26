<div align="center">

# 🍔 BurguerSync Ourinhos
### *Plataforma de Autoatendimento & Kitchen Display System (KDS) em Tempo Real*

[![Google Antigravity](https://img.shields.io/badge/Developed%20With-Google%20Antigravity-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google)
[![Google Stitch](https://img.shields.io/badge/UI%2FUX-Google%20Stitch-FF9E00?style=for-the-badge&logo=materialdesign&logoColor=black)](https://stitch.withgoogle.com)
[![Firebase Firestore](https://img.shields.io/badge/Database-Firebase%20Firestore%20v10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![JavaScript](https://img.shields.io/badge/Architecture-ESM%20Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org)
[![License](https://img.shields.io/badge/License-MIT-04D361?style=for-the-badge)](LICENSE)

<p align="center">
  <b>🇧🇷 Português do Brasil</b> | <b>🇺🇸 English</b>
</p>

</div>

---

## 🇧🇷 Português (Brasil)

### 📌 Sobre o Projeto
O **BurguerSync Ourinhos** é uma solução completa e de alta performance desenvolvida para hamburguerias artesanais. O sistema resolve o problema clássico de atrasos e erros de anotação manual ao unificar em uma única Single Page Application (SPA):
1. **🛍️ Visão do Cliente (Autoatendimento & Checkout):** Cardápio visual com fotos gastronômicas de alta resolução, seleção de adicionais e observações personalizadas por item, cálculo automático de subtotal e taxa de entrega fixa (R$ 5,00), e formas de pagamento flexíveis (⚡ Pix Imediato, 💳 Cartão e 💵 Dinheiro com cálculo de troco).
2. **👨‍🍳 Visão da Cozinha (KDS - Kitchen Display System):** Sincronização reativa instantânea (*zero refresh / sem F5*) via `onSnapshot` do Firebase Firestore, contadores por status operacional, avisos destacados de observações e botões de fluxo de produção (*Recebido ➔ Em Preparo ➔ Saiu para Entrega ➔ Entregue*).

---

### 🤖 Inteligência Artificial & Ferramental
Este projeto foi concebido, arquitetado e orquestrado utilizando o ecossistema avançado de IA:
- **Google Antigravity (Advanced Agentic IDE):** Orquestração determinística em 3 camadas (*Directives, Orchestration, Execution*).
- **Google Stitch:** Concepção do design system moderno em *Dark Mode High-Contrast Neon* com superfícies de ardósia, tipografia *Outfit* / *Plus Jakarta Sans* e efeitos de iluminação âmbar/neon.
- **Skill Packs Utilizados:**
  - `@orchestrator`: Gestão do ciclo de vida e orquestração determinística.
  - `@frontend-specialist` & `@frontend-design`: Construção da interface com máxima fidelidade visual.
  - `@app-builder` & `@clean-code`: Engenharia de código limpo, desacoplado e manutenível.
  - `@powershell-windows`: Automação determinística para ambiente Windows.

---

### 🏗️ Arquitetura em 3 Camadas (*Tri-Layer Pattern*)
```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1: Diretivas & Negócio (SOP, Regras, Schema, Design)      │
│  - Directives/projeto.md, Directives/desing/desing.md            │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  Layer 2: Orquestração (Google Antigravity)                      │
│  - Coordenação, validação e auto-recuperação (Self-Annealing)    │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  Layer 3: Execução & Determinismo                                │
│  - Firebase Web SDK v10 (Firestore NoSQL Realtime)               │
│  - Scripts em execution/ (test-runner, validate-env, publisher)  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 🚀 Como Executar Localmente

#### Opção 1: Inicializador Rápido no Windows
Basta clicar duas vezes no arquivo `executar.bat` na raiz do projeto.

#### Opção 2: Via Terminal
```bash
# 1. Executar testes determinísticos
node execution/test-runner.js

# 2. Iniciar servidor local
npx -y serve -s . -l 3000
```
Abra seu navegador em: `http://localhost:3000`

---

## 🇺🇸 English

### 📌 About the Project
**BurguerSync Ourinhos** is a full-stack real-time ordering and Kitchen Display System (KDS) engineered for modern gourmet burger kitchens. It eliminates communication gaps between the counter and grill by providing:
1. **🛍️ Customer View (Catalog & Checkout):** High-impact dark neon visual menu, itemized customizations/notes, automated tax and delivery fee calculations, and instant checkout with multiple payment methods.
2. **👨‍🍳 Kitchen View (KDS):** Zero-refresh, real-time reactive updates via Google Firebase Cloud Firestore (`onSnapshot`), status pipelines (*Received ➔ In Prep ➔ Dispatched ➔ Delivered*), and audio alert triggers for new tickets.

---

### 🤖 AI Engineering & Stack
- **Google Antigravity IDE**: Multi-agent orchestration, deterministic layer execution, and self-annealing quality assurance.
- **Google Stitch**: High-contrast OLED dark mode design system with glowing cybernetic accents.
- **Firebase Firestore v10**: Real-time cloud database syncing orders across devices instantly.

---

### 💻 Quick Start
```bash
# Run deterministic test suite
node execution/test-runner.js

# Start local server
npx -y serve -s . -l 3000
```
Open your browser at `http://localhost:3000`.

---

<div align="center">
  <sub>Desenvolvido com excelência técnica utilizando <b>Google Antigravity</b> • Edição SENAI Ourinhos</sub>
</div>

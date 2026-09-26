# 📐 Arquitetura do Sistema: BurguerSync Ourinhos

## 1. Visão Geral
O **BurguerSync Ourinhos** é uma plataforma de autoatendimento e exibição de pedidos na cozinha (KDS - Kitchen Display System) em tempo real, projetada no padrão de 3 Camadas (*Tri-Layer Pattern*):

```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1: Diretivas & Negócio (SOP, Regras, Schema, Design)      │
│  - Directives/projeto.md, ideia-projeto.md, desing.md            │
│  - Regras de cálculo (Taxa de entrega R$ 5,00, Subtotal, Troco)  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  Layer 2: Orquestração (Google Antigravity / Gemini)             │
│  - Pipeline de automação e validação de ambiente                 │
│  - Integração com Google Stitch (UI/UX) e Firebase Firestore    │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  Layer 3: Execução & Determinismo                                │
│  - Frontend SPA com Firebase SDK v10 (Realtime onSnapshot)       │
│  - Scripts de validação e publicação no GitHub                   │
└──────────────────────────────────────────────────────────────────┘
```

## 2. Estrutura do Banco de Dados (Firebase Firestore)
- **Coleção:** `pedidos`
- **Campos por Documento:**
  - `cliente`: `{ nome, celular, endereco, referencia }`
  - `itens`: `[ { id, nome, preco, quantidade, obsItem, subtotal } ]`
  - `pagamento`: `{ metodo, troco }`
  - `valores`: `{ subtotal, taxaEntrega: 5.0, total }`
  - `status`: `"Recebido"` | `"Em Preparo"` | `"Saiu para Entrega"` | `"Entregue"`
  - `horario`: `serverTimestamp()`

Diretriz de UI/UX & Design System: BurguerSync Ourinhos
Documento de especificação técnica e de design para a aplicação web BurguerSync Ourinhos. A interface adota o paradigma Dark Mode High-Contrast inspirado em apps modernos de delivery (estilo iFood/Rappi), combinando superfícies escuras, destaques em neon e microinterações fluidas orientadas a conversão e legibilidade operacional.
---
1. Fundamentos Visuais & Paleta de Cores (Hexadecimal)
O sistema de cores utiliza uma escala estrita de superfícies escuras para contraste profundo, combinada com acentos cromáticos de alto impacto para chamadas de ação (CTA) e sinalizações de estado.
Token de Design	Código Hex	Função / Aplicação
`--bg-canvas`	`#0A0A0C`	Fundo principal da página (Deep Black)
`--bg-surface`	`#121214`	Fundo dos containers, cabeçalhos e painéis
`--bg-card`	`#1A1A1E`	Fundo de cards de produtos e cards de pedidos
`--bg-card-hover`	`#24242A`	Estado de hover de cards e itens de lista
`--border-subtle`	`#2E2E36`	Bordas divisórias de cards, tabelas e inputs
`--border-focus`	`#FFA200`	Borda ativa de inputs, tabs e seleções
`--accent-neon`	`#FF9E00`	Laranja Neon primário (Ações, preços, destaques)
`--accent-yellow`	`#FFD000`	Amarelo Neon secundário (Observações, avisos)
`--accent-green`	`#04D361`	Verde Vibrante (Confirmações, checkout, status pronto)
`--accent-red`	`#FF4949`	Vermelho Carmim (Remover item, cancelar, erro)
`--accent-blue`	`#00B4D8`	Azul Elétrico (Status 'Saiu para Entrega')
`--text-primary`	`#F5F5F7`	Títulos e textos de alta ênfase
`--text-secondary`	`#A1A1AA`	Descrições de itens, legendas e rótulos auxiliares
`--text-muted`	`#63636E`	Placeholders e elementos desabilitados
Variáveis CSS Prontas para Consumo (:root)
```css
:root {
  /* Cores Base / Dark Mode */
  --bg-canvas: #0A0A0C;
  --bg-surface: #121214;
  --bg-card: #1A1A1E;
  --bg-card-hover: #24242A;
  --border-subtle: #2E2E36;
  --border-focus: #FFA200;

  /* Cores de Acento e Neon */
  --accent-neon: #FF9E00;
  --accent-neon-glow: rgba(255, 158, 0, 0.35);
  --accent-yellow: #FFD000;
  --accent-yellow-glow: rgba(255, 208, 0, 0.3);
  --accent-green: #04D361;
  --accent-green-glow: rgba(4, 211, 97, 0.35);
  --accent-red: #FF4949;
  --accent-blue: #00B4D8;
  --accent-blue-glow: rgba(0, 180, 216, 0.35);

  /* Tipografia & Contrastes */
  --text-primary: #F5F5F7;
  --text-secondary: #A1A1AA;
  --text-muted: #63636E;

  /* Espaçamentos & Raios */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-pill: 9999px;
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```
---
2. Tipografia & Hierarquia Visual
A tipografia recomendada combina Inter ou Plus Jakarta Sans (Sans-Serif moderna e altamente legível em telas OLED/LCD).
Nível Hierárquico	Elemento	Tamanho / Peso	Line-Height	Uso no BurguerSync
Display / H1	`<h1>`	`2.25rem` (36px) / Bold 800	1.15	Nome da Hamburgueria no topo
Seção / H2	`<h2>`	`1.50rem` (24px) / SemiBold 700	1.25	Títulos das seções ("Cardápio", "Checkout", "Cozinha")
Card / H3	`<h3>`	`1.125rem` (18px) / SemiBold 600	1.30	Nomes dos Hambúrgueres e Título do Card do Pedido
Preços & Destaques	`.preco`	`1.25rem` (20px) / Bold 700	1.20	Valores monetários (`R$ 28,00`) com cor `--accent-neon`
Corpo Principal	`<p>`, `label`	`0.938rem` (15px) / Regular 400	1.50	Descrições dos lanches e campos do formulário
Auxiliar / Badges	`.badge`, `small`	`0.75rem` (12px) / Medium 500	1.40	Status de pedidos, tempo estimado e tags nutricionais
---
3. Estrutura HTML5 Semântica com Classes e IDs Essenciais
Abaixo está o esqueleto base contendo a alternância de visões (Visão do Cliente e Visão da Cozinha) com os seletores mandatórios para manipulação de DOM.
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BurguerSync Ourinhos</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="dark-theme">

  <!-- Cabeçalho Principal & Navegação entre Modos -->
  <header class="app-header">
    <div class="header-container">
      <div class="logo-wrapper">
        <span class="logo-icon">🍔</span>
        <h1 class="logo-title">BurguerSync <span class="badge-city">Ourinhos</span></h1>
      </div>
      <nav class="mode-selector" aria-label="Seleção de Painel">
        <button id="btnModoCliente" class="btn-tab active" type="button">🛍️ Cardápio</button>
        <button id="btnModoCozinha" class="btn-tab" type="button">👨‍🍳 Cozinha <span id="contadorPedidosCozinha" class="badge-count">0</span></button>
      </nav>
    </div>
  </header>

  <!-- Container Principal -->
  <main class="main-layout">

    <!-- ==================== 1. VISÃO DO CLIENTE ==================== -->
    <section id="visaoCliente" class="view-section active">
      <div class="client-grid">
        
        <!-- Vitrine de Produtos -->
        <div class="catalog-column">
          <header class="section-heading">
            <h2>Lanches Artesanais</h2>
            <p class="subtitle">Feitos na brasa, entregues na temperatura ideal.</p>
          </header>

          <div id="gradeLanches" class="products-grid">
            <!-- Card de Exemplo -->
            <article class="product-card" data-id="1">
              <div class="product-image-container">
                <img src="images/smash.jpg" alt="Ourinhos Smash Burguer" class="product-image" loading="lazy">
                <span class="badge-tag">Mais Vendido</span>
              </div>
              <div class="product-info">
                <h3 class="product-name">Ourinhos Smash Burguer</h3>
                <p class="product-description">Pão brioche tostado, 2x smash 80g, queijo cheddar derretido e bacon crocante artesanal.</p>
                <div class="product-bottom">
                  <span class="product-price">R$ 28,00</span>
                  <button class="btn-add-cart" type="button" data-id="1">+ Adicionar</button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Coluna Lateral: Carrinho & Checkout -->
        <aside class="order-sidebar">
          
          <!-- Seção do Carrinho -->
          <section id="carrinho" class="checkout-panel">
            <h2 class="panel-title">Seu Pedido</h2>
            
            <ul id="listaItensCarrinho" class="cart-items-list">
              <!-- Item injetado via JS -->
              <li class="cart-item">
                <div class="cart-item-header">
                  <span class="cart-item-title">1x Ourinhos Smash Burguer</span>
                  <span class="cart-item-subtotal">R$ 28,00</span>
                </div>
                <input type="text" class="input-obs-item" placeholder="Obs: Ex. Sem picles, bem passado..." aria-label="Observações do item">
                <div class="cart-item-actions">
                  <div class="qty-counter">
                    <button type="button" class="btn-qty" aria-label="Diminuir">-</button>
                    <span class="qty-value">1</span>
                    <button type="button" class="btn-qty" aria-label="Aumentar">+</button>
                  </div>
                  <button type="button" class="btn-remove-item">Remover</button>
                </div>
              </li>
            </ul>

            <!-- Resumo Financeiro -->
            <div class="price-summary">
              <div class="summary-line">
                <span>Subtotal</span>
                <span id="subtotalPedido">R$ 28,00</span>
              </div>
              <div class="summary-line">
                <span>Taxa de Entrega</span>
                <span id="taxaEntrega">R$ 5,00</span>
              </div>
              <div class="summary-line total-line">
                <strong>Total Geral</strong>
                <strong id="totalPedido">R$ 33,00</strong>
              </div>
            </div>

            <!-- Dados de Entrega e Pagamento -->
            <form id="formCheckout" class="checkout-form">
              <fieldset class="form-group">
                <legend class="form-legend">Dados para Entrega</legend>
                <input type="text" id="nomeCliente" name="nomeCliente" class="input-field" placeholder="Nome Completo" required>
                <input type="tel" id="telefoneCliente" name="telefoneCliente" class="input-field" placeholder="WhatsApp / Telefone" required>
                <input type="text" id="enderecoCliente" name="enderecoCliente" class="input-field" placeholder="Rua, Número e Bairro" required>
                <input type="text" id="referenciaEntrega" name="referenciaEntrega" class="input-field" placeholder="Ponto de Referência ou Apto">
              </fieldset>

              <fieldset class="form-group">
                <legend class="form-legend">Forma de Pagamento</legend>
                <div class="payment-options">
                  <label class="radio-card">
                    <input type="radio" name="tipoPagamento" value="pix" checked>
                    <span class="radio-content">⚡ Pix Imediato</span>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="tipoPagamento" value="cartao">
                    <span class="radio-content">💳 Cartão na Entrega</span>
                  </label>
                  <label class="radio-card">
                    <input type="radio" name="tipoPagamento" value="dinheiro">
                    <span class="radio-content">💵 Dinheiro</span>
                  </label>
                </div>
                
                <!-- Condicional Dinheiro / Troco -->
                <div id="trocoContainer" class="troco-wrapper hidden">
                  <input type="text" id="valorTroco" class="input-field" placeholder="Troco para quanto?">
                </div>
              </fieldset>

              <button id="btnFinalizarPedido" type="submit" class="btn-cta-submit">
                <span>Confirmar e Enviar Pedido</span>
                <span class="icon-arrow">➔</span>
              </button>
            </form>
          </section>

        </aside>
      </div>
    </section>

    <!-- ==================== 2. VISÃO DA COZINHA (KDS) ==================== -->
    <section id="visaoCozinha" class="view-section hidden">
      <header class="kds-header">
        <div>
          <h2>Painel de Comandas da Cozinha</h2>
          <p class="subtitle">Atualização em tempo real das comandas e despachos.</p>
        </div>
        <div class="kds-filter">
          <span class="pulse-indicator"></span> Transmissão Ativa
        </div>
      </header>

      <!-- Lista / Grid de Pedidos Recebidos -->
      <div id="listaPedidos" class="kds-grid">
        <!-- Card de Pedido Cozinha (Exemplo) -->
        <article class="order-kds-card" data-order-id="101">
          <header class="order-kds-header">
            <div>
              <span class="order-number">Pedido #101</span>
              <span class="order-time">19:42 (há 5 min)</span>
            </div>
            <span class="status-badge status-recebido">Recebido</span>
          </header>

          <div class="order-kds-body">
            <div class="customer-data">
              <strong>Carlos Eduardo</strong> (14) 99881-2233<br>
              <small class="address-text">Rua Floriano Peixoto, 450 - Centro</small>
            </div>

            <ul class="order-items-checklist">
              <li>
                <strong>1x</strong> Ourinhos Smash Burguer
                <span class="item-alert-obs">⚠️ Obs: Sem cebola, caprichar no cheddar.</span>
              </li>
              <li>
                <strong>1x</strong> Batata Rústica Suprema
              </li>
            </ul>
          </div>

          <footer class="order-kds-actions">
            <button type="button" class="btn-step" data-next="preparo">Iniciar Preparo ➔</button>
            <button type="button" class="btn-step hidden" data-next="entrega">Despachar 🛵</button>
            <button type="button" class="btn-step hidden" data-next="finalizado">Finalizar Entrega ✅</button>
          </footer>
        </article>
      </div>
    </section>

  </main>

  <!-- Notificação Flutuante (Toast) -->
  <aside id="toastNotification" class="toast-container hidden" role="status" aria-live="polite"></aside>

</body>
</html>
```
---
4. Estilização CSS3 Moderna & Efeitos Neon
O código abaixo implementa a estética Dark Mode com microinterações, desfoque de fundo (glassmorphism pontual) e iluminação neon funcional para status operacionais.
```css
/* ==========================================================================
   RESET & CONFIGURAÇÃO GLOBAL
   ========================================================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body.dark-theme {
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* ==========================================================================
   CABEÇALHO & BOTÕES DE MODO
   ========================================================================== */
.app-header {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.badge-city {
  background-color: rgba(255, 158, 0, 0.15);
  color: var(--accent-neon);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 158, 0, 0.3);
}

.mode-selector {
  display: flex;
  background-color: var(--bg-canvas);
  padding: 0.25rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
}

.btn-tab {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-tab.active {
  background-color: var(--bg-card-hover);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.badge-count {
  background-color: var(--accent-neon);
  color: #000;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-pill);
}

/* ==========================================================================
   LAYOUT GRID RESPONSIVO (MOBILE-FIRST)
   ========================================================================== */
.main-layout {
  max-width: 1320px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
}

.view-section.hidden {
  display: none !important;
}

.client-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Desktop Breakpoint */
@media (min-width: 1024px) {
  .client-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    align-items: start;
  }
}

/* ==========================================================================
   VITRINE DE LANCHES (CARDS & HOVER)
   ========================================================================== */
.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 1.25rem;
}

@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.product-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-neon);
  box-shadow: 0 10px 24px -10px var(--accent-neon-glow);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: var(--bg-surface);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(6px);
  color: var(--accent-yellow);
  border: 1px solid rgba(255, 208, 0, 0.4);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.product-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  flex-grow: 1;
  margin-bottom: 1.25rem;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--accent-neon);
}

/* Botão de Adicionar ao Carrinho */
.btn-add-cart {
  background-color: transparent;
  color: var(--accent-neon);
  border: 1px solid var(--accent-neon);
  padding: 0.6rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-add-cart:hover {
  background-color: var(--accent-neon);
  color: #000;
  box-shadow: 0 0 16px var(--accent-neon-glow);
}

/* ==========================================================================
   CARRINHO & FORMULÁRIO DE ENTREGA
   ========================================================================== */
.checkout-panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  position: sticky;
  top: 5rem;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 0.75rem;
}

.cart-items-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.cart-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 0.875rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.938rem;
}

.input-obs-item {
  width: 100%;
  background-color: var(--bg-canvas);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.6rem;
  color: var(--accent-yellow);
  font-size: 0.813rem;
}

.input-obs-item::placeholder {
  color: var(--text-muted);
}

.cart-item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qty-counter {
  display: flex;
  align-items: center;
  background-color: var(--bg-canvas);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.btn-qty {
  background: transparent;
  color: var(--text-primary);
  border: none;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-weight: bold;
}

.qty-value {
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.btn-remove-item {
  background: none;
  border: none;
  color: var(--accent-red);
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: underline;
}

.price-summary {
  background-color: var(--bg-canvas);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.summary-line.total-line {
  color: var(--text-primary);
  font-size: 1.125rem;
  border-top: 1px solid var(--border-subtle);
  padding-top: 0.5rem;
  margin-top: 0.25rem;
}

/* Formulários e Inputs */
.form-group {
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.form-legend {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.input-field {
  width: 100%;
  background-color: var(--bg-canvas);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-field:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 2px var(--accent-neon-glow);
}

/* Opções de Pagamento */
.payment-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.radio-card {
  display: flex;
  align-items: center;
  background-color: var(--bg-canvas);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.85rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.radio-card input {
  margin-right: 0.65rem;
  accent-color: var(--accent-neon);
}

.radio-card:has(input:checked) {
  border-color: var(--accent-neon);
  background-color: rgba(255, 158, 0, 0.05);
}

/* Botão de Confirmação (CTA Verde Vibrante com Glow) */
.btn-cta-submit {
  width: 100%;
  background: linear-gradient(135deg, #04D361 0%, #03A04A 100%);
  color: #000;
  border: none;
  padding: 1.1rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 18px var(--accent-green-glow);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.btn-cta-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(4, 211, 97, 0.5);
}

.btn-cta-submit:active {
  transform: translateY(0);
}

/* ==========================================================================
   PAINEL DA COZINHA (KDS) & BADGES NEON
   ========================================================================== */
.kds-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 1rem;
}

.pulse-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--accent-green);
  box-shadow: 0 0 8px var(--accent-green);
  margin-right: 0.4rem;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.kds-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .kds-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .kds-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.order-kds-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-left: 4px solid var(--accent-neon);
}

.order-kds-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-number {
  font-size: 1.125rem;
  font-weight: 800;
  display: block;
}

.order-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Badges Neon Operacionais */
.status-badge {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-pill);
  letter-spacing: 0.05em;
}

.status-recebido {
  background-color: rgba(255, 158, 0, 0.15);
  color: var(--accent-neon);
  border: 1px solid var(--accent-neon);
  box-shadow: 0 0 10px var(--accent-neon-glow);
}

.status-preparo {
  background-color: rgba(255, 208, 0, 0.15);
  color: var(--accent-yellow);
  border: 1px solid var(--accent-yellow);
  box-shadow: 0 0 10px var(--accent-yellow-glow);
}

.status-entrega {
  background-color: rgba(0, 180, 216, 0.15);
  color: var(--accent-blue);
  border: 1px solid var(--accent-blue);
  box-shadow: 0 0 10px var(--accent-blue-glow);
}

.status-concluido {
  background-color: rgba(4, 211, 97, 0.15);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
  box-shadow: 0 0 10px var(--accent-green-glow);
}

.customer-data {
  font-size: 0.875rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--border-subtle);
}

.order-items-checklist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.938rem;
}

.item-alert-obs {
  display: block;
  font-size: 0.813rem;
  color: var(--accent-yellow);
  margin-top: 0.2rem;
  background-color: rgba(255, 208, 0, 0.08);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.order-kds-actions {
  margin-top: auto;
  padding-top: 0.5rem;
}

.btn-step {
  width: 100%;
  background-color: var(--bg-card-hover);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-step:hover {
  border-color: var(--accent-neon);
  background-color: var(--accent-neon);
  color: #000;
  box-shadow: 0 0 12px var(--accent-neon-glow);
}
```
---
5. Matriz de Responsividade & Comportamento (Mobile-First)
Viewport	Range de Resolução	Disposição do Cardápio	Disposição do Checkout / Carrinho	Disposição do KDS (Cozinha)
Mobile	`< 640px`	1 Card por linha, imagem horizontal ou topo compacto	Drawer / Seção empilhada abaixo ou botão flutuante	Coluna única, foco em botões de toque largo (`min 44px`)
Tablet	`640px - 1023px`	Grid de 2 colunas para cards de hambúrguer	Seção empilhada abaixo com formulário em 2 colunas	Grid de 2 colunas de comandas
Desktop	`>= 1024px`	Grid de 2 a 3 colunas na área central	Sidebar fixa à direita com `position: sticky; top: 5rem;`	Grid de 3 colunas dinâmico
---
6. Boas Práticas e Regras de Implementação para o Time de Engenharia
Sanitização de Inputs: O campo `#valorTroco` deve aceitar apenas caracteres numéricos e vírgulas, sendo exibido via classe utilitária `.hidden` controlada pela seleção do rádio `#tipoPagamento[value="dinheiro"]`.
Acessibilidade (a11y): Todos os seletores de quantidade (`.btn-qty`) possuem atributos `aria-label` explícitos. O contraste de texto em todos os botões com efeito neon obedece à razão mínima de 4.5:1 (WCAG AA).
Imagens Otimizadas: As imagens dos lanches devem ser carregadas via `<img loading="lazy">` com aspect ratio fixo (`16:9` ou container com `height: 180px; object-fit: cover`) para evitar Cumulative Layout Shift (CLS).
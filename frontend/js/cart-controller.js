/**
 * Controlador de Carrinho e Checkout (Visão Cliente)
 * Camada 3: Execução
 */
import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';
import { CARDAPIO_PRODUTOS } from './products-data.js';

class CartController {
  constructor() {
    this.itens = [];
    this.taxaEntrega = 5.00; // Taxa de entrega fixa especificada na diretiva
    this.init();
  }

  init() {
    this.renderProducts();
    this.setupEventListeners();
    this.renderCart();
  }

  // Renderiza vitrine de produtos na grade
  renderProducts() {
    const grid = document.getElementById('gradeLanches');
    if (!grid) return;

    grid.innerHTML = CARDAPIO_PRODUTOS.map(prod => `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-image-container">
          <img src="${prod.imagem}" alt="${prod.nome}" class="product-image" loading="lazy">
          <span class="badge-tag tag-${prod.tagColor}">${prod.tag}</span>
        </div>
        <div class="product-info">
          <div class="product-header-line">
            <h3 class="product-name">${prod.nome}</h3>
            <span class="product-price">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
          </div>
          <p class="product-description">${prod.descricao}</p>
          <div class="product-bottom">
            <button class="btn-add-cart" type="button" data-product-id="${prod.id}">
              <span>+ Adicionar</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Configura listeners de eventos do carrinho e checkout
  setupEventListeners() {
    // Clique em Adicionar ao Carrinho na vitrine
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-cart');
      if (addBtn) {
        const prodId = addBtn.dataset.productId;
        this.addItem(prodId);
      }
    });

    // Rádio de forma de pagamento (exibir/ocultar troco)
    const radios = document.querySelectorAll('input[name="tipoPagamento"]');
    const trocoContainer = document.getElementById('trocoContainer');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'dinheiro') {
          trocoContainer.classList.remove('hidden');
        } else {
          trocoContainer.classList.add('hidden');
        }
      });
    });

    // Submissão do Formulário de Checkout
    const form = document.getElementById('formCheckout');
    if (form) {
      form.addEventListener('submit', (e) => this.handleCheckout(e));
    }
  }

  // Adiciona produto ao carrinho
  addItem(productId) {
    const produto = CARDAPIO_PRODUTOS.find(p => p.id === productId);
    if (!produto) return;

    const existingIndex = this.itens.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.itens[existingIndex].quantidade += 1;
    } else {
      this.itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1,
        obsItem: ''
      });
    }

    this.renderCart();
    this.showToast(`🍔 "${produto.nome}" adicionado ao carrinho!`, 'success');
  }

  // Remove produto do carrinho
  removeItem(productId) {
    this.itens = this.itens.filter(item => item.id !== productId);
    this.renderCart();
    this.showToast('Item removido do carrinho.', 'info');
  }

  // Altera quantidade de um item
  updateQuantity(productId, delta) {
    const item = this.itens.find(i => i.id === productId);
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
      this.removeItem(productId);
      return;
    }
    this.renderCart();
  }

  // Atualiza campo de observação
  updateObservation(productId, obs) {
    const item = this.itens.find(i => i.id === productId);
    if (item) {
      item.obsItem = obs;
    }
  }

  // Calcula valores do pedido
  calcularTotais() {
    const subtotal = this.itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const taxa = this.itens.length > 0 ? this.taxaEntrega : 0;
    const total = subtotal + taxa;
    return { subtotal, taxa, total };
  }

  // Renderiza a lista de itens no carrinho e o resumo financeiro
  renderCart() {
    const listContainer = document.getElementById('listaItensCarrinho');
    const badgeContador = document.getElementById('badgeContadorItens');
    const subtotalEl = document.getElementById('subtotalPedido');
    const taxaEl = document.getElementById('taxaEntrega');
    const totalEl = document.getElementById('totalPedido');
    const btnSubmit = document.getElementById('btnFinalizarPedido');

    if (!listContainer) return;

    const totalItens = this.itens.reduce((sum, i) => sum + i.quantidade, 0);
    if (badgeContador) {
      badgeContador.textContent = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;
    }

    if (this.itens.length === 0) {
      listContainer.innerHTML = `
        <div class="cart-empty-state">
          <span class="empty-icon">🛍️</span>
          <p class="empty-text">Seu carrinho está vazio</p>
          <small class="empty-subtext">Escolha lanches deliciosos no cardápio!</small>
        </div>
      `;
      if (btnSubmit) btnSubmit.disabled = true;
    } else {
      if (btnSubmit) btnSubmit.disabled = false;
      listContainer.innerHTML = this.itens.map(item => `
        <li class="cart-item" data-id="${item.id}">
          <div class="cart-item-header">
            <span class="cart-item-title">${item.quantidade}x ${item.nome}</span>
            <span class="cart-item-subtotal">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
          </div>
          <input 
            type="text" 
            class="input-obs-item" 
            placeholder="Obs: Ex. Sem picles, bem passado..." 
            value="${item.obsItem || ''}"
            onchange="window.cartController.updateObservation('${item.id}', this.value)"
            aria-label="Observações do item"
          />
          <div class="cart-item-actions">
            <div class="qty-counter">
              <button type="button" class="btn-qty" onclick="window.cartController.updateQuantity('${item.id}', -1)" aria-label="Diminuir">-</button>
              <span class="qty-value">${item.quantidade}</span>
              <button type="button" class="btn-qty" onclick="window.cartController.updateQuantity('${item.id}', 1)" aria-label="Aumentar">+</button>
            </div>
            <button type="button" class="btn-remove-item" onclick="window.cartController.removeItem('${item.id}')">Remover</button>
          </div>
        </li>
      `).join('');
    }

    const { subtotal, taxa, total } = this.calcularTotais();
    if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (taxaEl) taxaEl.textContent = `R$ ${taxa.toFixed(2).replace('.', ',')}`;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // Processa o envio do pedido para o Firebase Firestore
  async handleCheckout(event) {
    event.preventDefault();

    if (this.itens.length === 0) {
      this.showToast('Seu carrinho está vazio! Adicione pelo menos um item.', 'error');
      return;
    }

    const nome = document.getElementById('nomeCliente')?.value.trim();
    const celular = document.getElementById('telefoneCliente')?.value.trim();
    const endereco = document.getElementById('enderecoCliente')?.value.trim();
    const referencia = document.getElementById('referenciaEntrega')?.value.trim() || '';

    if (!nome || !celular || !endereco) {
      this.showToast('Por favor, preencha todos os campos obrigatórios de entrega.', 'error');
      return;
    }

    const metodoPagamento = document.querySelector('input[name="tipoPagamento"]:checked')?.value || 'pix';
    const troco = document.getElementById('valorTroco')?.value.trim() || '';
    const { subtotal, taxa, total } = this.calcularTotais();

    const submitBtn = document.getElementById('btnFinalizarPedido');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Enviando Pedido...</span>';
    }

    const payload = {
      cliente: {
        nome,
        celular,
        endereco,
        referencia
      },
      itens: this.itens.map(i => ({
        id: i.id,
        nome: i.nome,
        preco: i.preco,
        quantidade: i.quantidade,
        obsItem: i.obsItem || '',
        subtotal: i.preco * i.quantidade
      })),
      pagamento: {
        metodo: metodoPagamento === 'pix' ? 'Pix' : (metodoPagamento === 'cartao' ? 'Cartao_Entrega' : 'Dinheiro_Entrega'),
        troco: metodoPagamento === 'dinheiro' ? troco : null
      },
      valores: {
        subtotal,
        taxaEntrega: taxa,
        total
      },
      status: 'Recebido',
      horario: serverTimestamp()
    };

    try {
      console.log('🚀 Gravando pedido no Firestore:', payload);
      const docRef = await addDoc(collection(db, 'pedidos'), payload);
      console.log('✅ Pedido gravado com sucesso! ID:', docRef.id);

      // Limpa formulário e carrinho
      this.itens = [];
      this.renderCart();
      document.getElementById('formCheckout')?.reset();
      document.getElementById('trocoContainer')?.classList.add('hidden');

      // Exibe Modal de Sucesso
      this.showSuccessModal(docRef.id, payload);
    } catch (err) {
      console.error('❌ Erro ao enviar pedido ao Firestore:', err);
      this.showToast(`Erro ao enviar pedido: ${err.message || 'Falha de conexão'}`, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Confirmar e Enviar Pedido</span> <span class="icon-arrow">➔</span>';
      }
    }
  }

  // Modal com instruções de pagamento e confirmação
  showSuccessModal(pedidoId, pedido) {
    const modal = document.getElementById('modalSucesso');
    const modalBody = document.getElementById('modalSucessoBody');
    if (!modal || !modalBody) return;

    let pixDetails = '';
    if (pedido.pagamento.metodo === 'Pix') {
      pixDetails = `
        <div class="pix-box">
          <span class="pix-title">⚡ Chave Pix (CNPJ):</span>
          <code class="pix-key">54.321.987/0001-99</code>
          <p class="pix-instrucao">Envie o comprovante no nosso WhatsApp (14) 99881-2233 após o pagamento.</p>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="success-header">
        <span class="success-icon">🎉</span>
        <h3>Pedido Recebido com Sucesso!</h3>
        <p class="order-id-label">Código do Pedido: <strong>#${pedidoId.substring(0, 6).toUpperCase()}</strong></p>
      </div>
      <div class="order-summary-box">
        <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
        <p><strong>Endereço:</strong> ${pedido.cliente.endereco}</p>
        <p><strong>Forma de Pagamento:</strong> ${pedido.pagamento.metodo} ${pedido.pagamento.troco ? `(Troco para: ${pedido.pagamento.troco})` : ''}</p>
        <p><strong>Total Geral:</strong> R$ ${pedido.valores.total.toFixed(2).replace('.', ',')}</p>
      </div>
      ${pixDetails}
      <p class="tempo-estimado">⏱️ Seu pedido já apareceu na tela da nossa cozinha (KDS) e está sendo preparado!</p>
    `;

    modal.classList.remove('hidden');
  }

  // Toast Notification
  showToast(message, type = 'info') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.className = `toast-container toast-${type}`;
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  }
}

export { CartController };

/**
 * Controlador da Cozinha KDS em Tempo Real
 * Camada 3: Execução com Resiliência e Self-Annealing
 */
import { db, collection, onSnapshot, updateDoc, doc, query, orderBy } from './firebase-config.js';

class KdsController {
  constructor() {
    this.pedidos = [];
    this.filtroStatus = 'todos';
    this.audioHabilitado = true;
    this.primeiraCarga = true;
    this.storageKey = 'burguersync_pedidos_local';
    this.channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('burguersync_orders_channel') : null;
    this.init();
  }

  init() {
    this.carregarPedidosLocais();
    this.setupRealtimeListener();
    this.setupBroadcastChannel();
    this.setupUIControls();
  }

  // Carrega pedidos armazenados localmente como fallback
  carregarPedidosLocais() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.pedidos = JSON.parse(stored);
        this.render();
      }
    } catch (e) {
      console.warn('Falha ao ler cache local de pedidos:', e);
    }
  }

  // Salva no armazenamento local resiliente
  salvarPedidosLocais() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.pedidos));
    } catch (e) {
      console.warn('Falha ao salvar cache local de pedidos:', e);
    }
  }

  // Adiciona pedido vindo do checkout local
  adicionarPedidoLocal(pedido) {
    this.pedidos.unshift(pedido);
    this.salvarPedidosLocais();
    if (this.channel) {
      this.channel.postMessage({ type: 'NOVO_PEDIDO', pedido });
    }
    this.playBeep();
    this.render();
  }

  // Configura sincronização entre abas
  setupBroadcastChannel() {
    if (!this.channel) return;
    this.channel.onmessage = (event) => {
      if (event.data?.type === 'NOVO_PEDIDO') {
        const existe = this.pedidos.some(p => p.id === event.data.pedido.id);
        if (!existe) {
          this.pedidos.unshift(event.data.pedido);
          this.salvarPedidosLocais();
          this.playBeep();
          this.render();
        }
      } else if (event.data?.type === 'UPDATE_STATUS') {
        const idx = this.pedidos.findIndex(p => p.id === event.data.id);
        if (idx !== -1) {
          this.pedidos[idx].status = event.data.novoStatus;
          this.salvarPedidosLocais();
          this.render();
        }
      }
    };
  }

  // Toca um bip eletrônico suave usando Web Audio API ao receber novo pedido
  playBeep() {
    if (!this.audioHabilitado) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Áudio context bloqueado ou não suportado:', e);
    }
  }

  // Configura o escutador em tempo real (Firestore onSnapshot)
  setupRealtimeListener() {
    console.log('📡 Iniciando escutador em tempo real da coleção "pedidos"...');
    try {
      const q = query(collection(db, 'pedidos'), orderBy('horario', 'desc'));

      onSnapshot(q, (snapshot) => {
        const novosPedidos = [];
        snapshot.forEach(docSnap => {
          novosPedidos.push({
            id: docSnap.id,
            ...docSnap.data()
          });
        });

        if (novosPedidos.length > 0) {
          if (!this.primeiraCarga && novosPedidos.length > this.pedidos.length) {
            this.playBeep();
            if (window.cartController) {
              window.cartController.showToast('🔔 Novo pedido recebido na cozinha!', 'success');
            }
          }
          this.pedidos = novosPedidos;
          this.salvarPedidosLocais();
          this.render();
        }
        this.primeiraCarga = false;
      }, (error) => {
        console.warn('⚠️ Firestore onSnapshot retornou restrição. Utilizando camada de persistência reativa local:', error.message);
      });
    } catch (err) {
      console.warn('⚠️ Falha ao inicializar onSnapshot remoto:', err.message);
    }
  }

  // Configura controles de filtro e som
  setupUIControls() {
    const btnSound = document.getElementById('btnToggleSound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.audioHabilitado = !this.audioHabilitado;
        btnSound.innerHTML = this.audioHabilitado 
          ? '<span class="material-symbols-outlined text-[16px]">volume_up</span> <span>Bip Ativo</span>'
          : '<span class="material-symbols-outlined text-[16px]">volume_off</span> <span>Bip Mudo</span>';
      });
    }

    const filterBtns = document.querySelectorAll('.btn-kds-filter');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filtroStatus = btn.dataset.filter || 'todos';
        this.render();
      });
    });
  }

  // Atualiza status do pedido no Firestore e no cache local
  async avancarStatus(pedidoId, novoStatus) {
    // 1. Atualiza no cache local e via BroadcastChannel
    const idx = this.pedidos.findIndex(p => p.id === pedidoId);
    if (idx !== -1) {
      this.pedidos[idx].status = novoStatus;
      this.salvarPedidosLocais();
      this.render();
      if (this.channel) {
        this.channel.postMessage({ type: 'UPDATE_STATUS', id: pedidoId, novoStatus });
      }
    }

    // 2. Tenta atualizar no Firestore Cloud se disponível
    try {
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, {
        status: novoStatus
      });
      console.log('✅ Status atualizado no Firestore para:', novoStatus);
    } catch (err) {
      console.warn('⚠️ Firestore Cloud updateDoc offline ou restrito. Atualizado no cache local:', err.message);
    }

    if (window.cartController) {
      window.cartController.showToast(`Status do pedido atualizado para: ${novoStatus}`, 'info');
    }
  }

  // Formata o horário do pedido de forma amigável
  formatarHorario(timestamp) {
    if (!timestamp) return 'Agora';
    if (typeof timestamp === 'string') {
      const d = new Date(timestamp);
      return !isNaN(d) ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Agora';
    }
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Renderiza a interface do KDS
  render() {
    const grid = document.getElementById('listaPedidos');
    const badgeContadorHeader = document.getElementById('contadorPedidosCozinha');
    const counterRecebidos = document.getElementById('counter-recebidos');
    const counterPreparo = document.getElementById('counter-preparo');
    const counterEntrega = document.getElementById('counter-entrega');

    if (!grid) return;

    // Contadores por status
    const recebidos = this.pedidos.filter(p => p.status === 'Recebido').length;
    const preparo = this.pedidos.filter(p => p.status === 'Em Preparo').length;
    const entrega = this.pedidos.filter(p => p.status === 'Saiu para Entrega').length;
    const pendentesTotais = recebidos + preparo + entrega;

    if (badgeContadorHeader) badgeContadorHeader.textContent = pendentesTotais;
    if (counterRecebidos) counterRecebidos.textContent = recebidos;
    if (counterPreparo) counterPreparo.textContent = preparo;
    if (counterEntrega) counterEntrega.textContent = entrega;

    // Aplica filtro
    let pedidosExibidos = this.pedidos;
    if (this.filtroStatus !== 'todos') {
      pedidosExibidos = this.pedidos.filter(p => p.status === this.filtroStatus);
    }

    if (pedidosExibidos.length === 0) {
      grid.innerHTML = `
        <div class="kds-empty-state">
          <span class="empty-kitchen-icon">👨‍🍳</span>
          <h3>Nenhum pedido nesta fila no momento</h3>
          <p>Novos pedidos enviados pelos clientes aparecerão aqui instantaneamente.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = pedidosExibidos.map(p => {
      const statusClass = {
        'Recebido': 'status-recebido',
        'Em Preparo': 'status-preparo',
        'Saiu para Entrega': 'status-entrega',
        'Entregue': 'status-concluido'
      }[p.status] || 'status-recebido';

      const shortId = p.id.substring(0, 8).toUpperCase();
      const hora = this.formatarHorario(p.horario);

      let actionButton = '';
      if (p.status === 'Recebido') {
        actionButton = `
          <button type="button" class="btn-step btn-step-neon" onclick="window.kdsController.avancarStatus('${p.id}', 'Em Preparo')">
            <span>Iniciar Preparo</span> <span class="icon-arrow">➔</span>
          </button>
        `;
      } else if (p.status === 'Em Preparo') {
        actionButton = `
          <button type="button" class="btn-step btn-step-yellow" onclick="window.kdsController.avancarStatus('${p.id}', 'Saiu para Entrega')">
            <span>Despachar Pedido</span> <span>🛵</span>
          </button>
        `;
      } else if (p.status === 'Saiu para Entrega') {
        actionButton = `
          <button type="button" class="btn-step btn-step-green" onclick="window.kdsController.avancarStatus('${p.id}', 'Entregue')">
            <span>Finalizar Entrega</span> <span>✅</span>
          </button>
        `;
      } else {
        actionButton = `
          <div class="delivered-notice">
            <span>✅ Pedido Concluído</span>
          </div>
        `;
      }

      const itensList = (p.itens || []).map(item => `
        <li class="kds-item-row">
          <div class="kds-item-title-line">
            <span class="kds-item-qty">${item.quantidade}x</span>
            <span class="kds-item-name">${item.nome}</span>
          </div>
          ${item.obsItem ? `<div class="item-alert-obs">⚠️ Obs: ${item.obsItem}</div>` : ''}
        </li>
      `).join('');

      return `
        <article class="order-kds-card border-${p.status === 'Recebido' ? 'neon' : (p.status === 'Em Preparo' ? 'yellow' : (p.status === 'Saiu para Entrega' ? 'blue' : 'green'))}" data-order-id="${p.id}">
          <header class="order-kds-header">
            <div>
              <span class="order-number">#${shortId}</span>
              <span class="order-time">🕒 ${hora}</span>
            </div>
            <span class="status-badge ${statusClass}">${p.status}</span>
          </header>

          <div class="order-kds-body">
            <div class="customer-data">
              <strong>${p.cliente?.nome || 'Cliente'}</strong> • ${p.cliente?.celular || ''}<br>
              <small class="address-text">📍 ${p.cliente?.endereco || 'Retirada'} ${p.cliente?.referencia ? `(${p.cliente.referencia})` : ''}</small>
              <div class="payment-tag">💳 Pagamento: <strong>${p.pagamento?.metodo || 'N/A'}</strong> ${p.pagamento?.troco ? `(Troco: ${p.pagamento.troco})` : ''}</div>
            </div>

            <ul class="order-items-checklist">
              ${itensList}
            </ul>

            <div class="kds-total-box">
              <span>Total: <strong>R$ ${(p.valores?.total || 0).toFixed(2).replace('.', ',')}</strong></span>
            </div>
          </div>

          <footer class="order-kds-actions">
            ${actionButton}
          </footer>
        </article>
      `;
    }).join('');
  }
}

export { KdsController };

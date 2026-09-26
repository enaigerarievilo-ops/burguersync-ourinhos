/**
 * Aplicação Principal BurguerSync Ourinhos
 * Orquestração e Inicialização
 */
import { CartController } from './cart-controller.js';
import { KdsController } from './kds-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🍔 Inicializando BurguerSync Ourinhos...');

  // Inicializa controladores
  const cartController = new CartController();
  const kdsController = new KdsController();

  // Expõe no escopo global para manipulação de eventos inline
  window.cartController = cartController;
  window.kdsController = kdsController;

  // Alternância de Abas (Cardápio / Cozinha)
  const btnModoCliente = document.getElementById('btnModoCliente');
  const btnModoCozinha = document.getElementById('btnModoCozinha');
  const visaoCliente = document.getElementById('visaoCliente');
  const visaoCozinha = document.getElementById('visaoCozinha');

  function alternarVisao(modo) {
    if (modo === 'cliente') {
      btnModoCliente?.classList.add('active');
      btnModoCozinha?.classList.remove('active');
      visaoCliente?.classList.remove('hidden');
      visaoCozinha?.classList.add('hidden');
    } else {
      btnModoCliente?.classList.remove('active');
      btnModoCozinha?.classList.add('active');
      visaoCliente?.classList.add('hidden');
      visaoCozinha?.classList.remove('hidden');
    }
  }

  btnModoCliente?.addEventListener('click', () => alternarVisao('cliente'));
  btnModoCozinha?.addEventListener('click', () => alternarVisao('cozinha'));

  // Fechamento do Modal de Sucesso
  const btnCloseModal = document.getElementById('btnFecharModal');
  const modal = document.getElementById('modalSucesso');
  btnCloseModal?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  console.log('✅ BurguerSync Ourinhos pronto para receber e processar pedidos!');
});

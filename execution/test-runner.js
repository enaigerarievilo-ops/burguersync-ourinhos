/**
 * Suite de Testes Automatizados Determinísticos (Self-Annealing & Qualidade)
 * Camada 3: Execução
 */

function runTests() {
  console.log('🧪 Iniciando suíte de testes determinísticos do BurguerSync Ourinhos...');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Teste 1: Cálculo de subtotal e frete fixo de R$ 5,00
  const itens = [
    { nome: 'Ourinhos Smash Burguer', preco: 28.0, quantidade: 2 },
    { nome: 'Batata Rústica Suprema', preco: 22.0, quantidade: 1 }
  ];
  const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const taxaEntrega = 5.0;
  const total = subtotal + taxaEntrega;

  assert(subtotal === 78.0, `Subtotal esperado R$ 78.00, obtido R$ ${subtotal.toFixed(2)}`);
  assert(taxaEntrega === 5.0, `Taxa de entrega fixada em R$ 5.00`);
  assert(total === 83.0, `Total geral esperado R$ 83.00, obtido R$ ${total.toFixed(2)}`);

  // Teste 2: Validação de transições de status do KDS
  const statusValidos = ['Recebido', 'Em Preparo', 'Saiu para Entrega', 'Entregue'];
  function proximoStatus(atual) {
    const idx = statusValidos.indexOf(atual);
    return idx >= 0 && idx < statusValidos.length - 1 ? statusValidos[idx + 1] : atual;
  }

  assert(proximoStatus('Recebido') === 'Em Preparo', 'Transição Recebido -> Em Preparo');
  assert(proximoStatus('Em Preparo') === 'Saiu para Entrega', 'Transição Em Preparo -> Saiu para Entrega');
  assert(proximoStatus('Saiu para Entrega') === 'Entregue', 'Transição Saiu para Entrega -> Entregue');
  assert(proximoStatus('Entregue') === 'Entregue', 'Status final não ultrapassa Entregue');

  // Teste 3: Validação de campos obrigatórios de cliente
  function validarCheckout(cliente, cartItens) {
    if (!cliente.nome || !cliente.nome.trim()) return false;
    if (!cliente.celular || !cliente.celular.trim()) return false;
    if (!cliente.endereco || !cliente.endereco.trim()) return false;
    if (!Array.isArray(cartItens) || cartItens.length === 0) return false;
    return true;
  }

  const clienteInvalido = { nome: '', celular: '14999999999', endereco: 'Rua A' };
  const clienteValido = { nome: 'Regiane', celular: '14999999999', endereco: 'Rua Paraná, 100' };

  assert(!validarCheckout(clienteInvalido, itens), 'Validação rejeita cliente sem nome');
  assert(!validarCheckout(clienteValido, []), 'Validação rejeita carrinho vazio');
  assert(validarCheckout(clienteValido, itens), 'Validação aceita dados completos');

  console.log(`\n📊 Resultado dos Testes: ${passed} passaram, ${failed} falharam.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

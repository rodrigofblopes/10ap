// SCRIPT SIMPLES PARA CONSOLE - COLE NO F12
console.log('🔍 ===== DIAGNÓSTICO RÁPIDO =====');

// Função para verificar dados da planilha
function verificarPlanilha() {
  console.log('📊 VERIFICANDO PLANILHA...');
  
  // Tentar diferentes formas de acessar os dados
  const dados = window.orçamentoStore?.getState()?.itens || 
                window.itens5D || 
                [];
  
  console.log(`📋 Total de itens: ${dados.length}`);
  
  // Buscar item 1.1
  const item1_1 = dados.find(item => item.id === '1.1');
  if (item1_1) {
    console.log('🏗️ ITEM 1.1 ENCONTRADO:');
    console.log('   - Descrição:', item1_1.descricao);
    console.log('   - Elementos3D:', item1_1.elementos3D);
    console.log('   - Array:', item1_1.elementos3D?.split(',').map(el => el.trim()));
  } else {
    console.log('❌ Item 1.1 NÃO encontrado');
    console.log('📋 Itens disponíveis:', dados.map(item => item.id).slice(0, 10));
  }
  
  return dados;
}

// Função para verificar elementos GLB
function verificarGLB() {
  console.log('📦 VERIFICANDO MODELO GLB...');
  
  const elementos = window.glbElements || [];
  console.log(`📦 Total de elementos: ${elementos.length}`);
  
  // Elementos 1.1_
  const vigas = elementos.filter(el => el.startsWith('1.1_'));
  console.log(`🏗️ Vigas (1.1_): ${vigas.length}`);
  console.log('🏗️ Lista:', vigas.sort());
  
  // Primeiros 10 elementos
  console.log('📋 Primeiros 10:', elementos.slice(0, 10));
  
  return elementos;
}

// Função para testar correspondência
function testarCorrespondencia() {
  console.log('🎯 TESTANDO CORRESPONDÊNCIA...');
  
  const dados = verificarPlanilha();
  const elementos = verificarGLB();
  
  if (!dados.length || !elementos.length) {
    console.log('❌ Dados não disponíveis');
    return;
  }
  
  // Testar elemento específico
  const elementoTeste = '1.1_.031';
  console.log(`🔍 Testando: "${elementoTeste}"`);
  
  const existe = elementos.includes(elementoTeste);
  console.log(existe ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
  
  // Mostrar similares
  const similares = elementos.filter(el => el.includes('1.1_')).slice(0, 5);
  console.log('🔍 Similares:', similares);
}

// Executar tudo
testarCorrespondencia();

console.log('💡 FUNÇÕES DISPONÍVEIS:');
console.log('- verificarPlanilha()');
console.log('- verificarGLB()');
console.log('- testarCorrespondencia()');

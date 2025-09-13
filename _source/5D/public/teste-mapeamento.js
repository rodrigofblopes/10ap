// TESTE DO MAPEAMENTO DE ELEMENTOS
// Cole este código no console do navegador

console.log('🗺️ ===== TESTE DO MAPEAMENTO DE ELEMENTOS =====');

// Função para testar o mapeamento
function testarMapeamento() {
  console.log('📊 TESTANDO MAPEAMENTO...');
  
  // Verificar se o mapeamento foi carregado
  const mapeamento = window.mapeamentoElementos;
  if (!mapeamento) {
    console.log('❌ Mapeamento não carregado!');
    return;
  }
  
  console.log('✅ Mapeamento carregado:', mapeamento);
  
  // Verificar elementos GLB disponíveis
  const elementosGLB = window.glbElements || [];
  console.log('📦 Elementos GLB disponíveis:', elementosGLB.length);
  console.log('📦 Primeiros 10 elementos:', elementosGLB.slice(0, 10));
  
  // Testar mapeamento para item 1.1
  const item1_1 = mapeamento['1.1'];
  if (item1_1) {
    console.log('🏗️ ===== TESTE ITEM 1.1 (VIGAS) =====');
    console.log('🏗️ Descrição:', item1_1.descricao);
    console.log('🏗️ Subcoleções no mapeamento:', item1_1.colecoes);
    
    // Verificar quais subcoleções existem no GLB
    let subcolecoesEncontradas = 0;
    if (item1_1.colecoes) {
      item1_1.colecoes.forEach(nomeSubcolecao => {
        const existe = elementosGLB.includes(nomeSubcolecao);
        console.log(`${existe ? '✅' : '❌'} ${nomeSubcolecao}: ${existe ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
        if (existe) subcolecoesEncontradas++;
      });
      
      console.log(`🎯 RESULTADO: ${subcolecoesEncontradas}/${item1_1.colecoes.length} subcoleções encontradas`);
      
      if (subcolecoesEncontradas > 0) {
        console.log('🎉 SUCESSO: Algumas subcoleções foram encontradas via mapeamento!');
      } else {
        console.log('❌ PROBLEMA: Nenhuma subcoleção foi encontrada via mapeamento');
        console.log('💡 VERIFICAÇÃO: Confirme se as subcoleções estão renomeadas corretamente no Blender');
      }
    } else {
      console.log('❌ Subcoleções não definidas no mapeamento');
    }
  } else {
    console.log('❌ Mapeamento para item 1.1 não encontrado');
  }
}

// Função para simular busca com mapeamento
function simularBuscaComMapeamento() {
  console.log('🔍 SIMULANDO BUSCA COM MAPEAMENTO...');
  
  const mapeamento = window.mapeamentoElementos;
  const elementosGLB = window.glbElements || [];
  
  if (!mapeamento || !elementosGLB.length) {
    console.log('❌ Dados não disponíveis para simulação');
    return;
  }
  
  // Simular item 1.1
  const itemId = '1.1';
  const mapeamentoItem = mapeamento[itemId];
  
  if (!mapeamentoItem) {
    console.log('❌ Mapeamento não encontrado para item:', itemId);
    return;
  }
  
  console.log('📋 Simulando busca para item:', itemId);
  console.log('🗺️ Usando mapeamento:', mapeamentoItem);
  
  // Buscar subcoleções GLB que correspondem ao mapeamento
  const matchingElements = [];
  if (mapeamentoItem.colecoes) {
    mapeamentoItem.colecoes.forEach(nomeSubcolecao => {
      if (elementosGLB.includes(nomeSubcolecao)) {
        matchingElements.push(nomeSubcolecao);
        console.log(`✅ Encontrado: "${nomeSubcolecao}"`);
      } else {
        console.log(`❌ Não encontrado: "${nomeSubcolecao}"`);
      }
    });
  }
  
  console.log('🎯 Elementos que seriam destacados:', matchingElements.length);
  console.log('🎯 Lista:', matchingElements);
  
  // Atualizar elementos destacados globalmente
  window.highlightedElements = matchingElements;
  window.debugData = {
    ...window.debugData,
    highlightedElements: matchingElements,
    selectedItem: { id: itemId, descricao: mapeamentoItem.descricao },
    highlightTimestamp: new Date().toISOString()
  };
  
  console.log('✅ Elementos destacados atualizados globalmente');
}

// Função para verificar todos os itens do mapeamento
function verificarTodosItens() {
  console.log('📋 VERIFICANDO TODOS OS ITENS DO MAPEAMENTO...');
  
  const mapeamento = window.mapeamentoElementos;
  const elementosGLB = window.glbElements || [];
  
  if (!mapeamento) {
    console.log('❌ Mapeamento não carregado');
    return;
  }
  
  Object.keys(mapeamento).forEach(itemId => {
    const item = mapeamento[itemId];
    console.log(`\n📋 Item ${itemId}: ${item.descricao}`);
    
    let encontrados = 0;
    if (item.colecoes) {
      item.colecoes.forEach(nomeSubcolecao => {
        if (elementosGLB.includes(nomeSubcolecao)) {
          encontrados++;
        }
      });
      console.log(`   🎯 ${encontrados}/${item.colecoes.length} subcoleções encontradas`);
    } else {
      console.log(`   ❌ Subcoleções não definidas`);
    }
  });
}

// Executar testes
testarMapeamento();
simularBuscaComMapeamento();
verificarTodosItens();

console.log('🏁 ===== TESTES CONCLUÍDOS =====');
console.log('💡 PRÓXIMOS PASSOS:');
console.log('1. Verifique se o mapeamento foi carregado corretamente');
console.log('2. Confirme se os nomes dos elementos GLB coincidem com o mapeamento');
console.log('3. Teste clicando na linha 1.1 da planilha');
console.log('4. Observe se os elementos são destacados em laranja');

console.log('📋 FUNÇÕES DISPONÍVEIS:');
console.log('- testarMapeamento()');
console.log('- simularBuscaComMapeamento()');
console.log('- verificarTodosItens()');

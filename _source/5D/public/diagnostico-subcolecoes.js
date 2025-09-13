// DIAGNÓSTICO ESPECÍFICO PARA SUBCOLEÇÕES
// Cole este código no console do navegador

console.log('🔍 ===== DIAGNÓSTICO DE SUBCOLEÇÕES =====');

function diagnosticarSubcolecoes() {
  console.log('📊 DIAGNOSTICANDO SUBCOLEÇÕES...');
  
  // Verificar elementos GLB disponíveis
  const elementosGLB = window.glbElements || [];
  console.log('📦 Total de elementos GLB:', elementosGLB.length);
  
  // Filtrar apenas elementos que parecem ser subcoleções
  const subcolecoes = elementosGLB.filter(el => 
    el.includes('1.1_') || 
    el.includes('1.2_') || 
    el.includes('2.1_') || 
    el.includes('2.2_') || 
    el.includes('2.3_') || 
    el.includes('3.1_') || 
    el.includes('3.2_')
  );
  
  console.log('🏗️ Subcoleções encontradas:', subcolecoes.length);
  console.log('🏗️ Lista de subcoleções:', subcolecoes);
  
  // Verificar especificamente as subcoleções do item 1.1
  const subcolecoes1_1 = subcolecoes.filter(el => el.startsWith('1.1_'));
  console.log('🏗️ Subcoleções 1.1_ encontradas:', subcolecoes1_1.length);
  console.log('🏗️ Lista subcoleções 1.1_:', subcolecoes1_1);
  
  // Verificar mapeamento
  const mapeamento = window.mapeamentoElementos;
  if (mapeamento && mapeamento['1.1']) {
    const mapeamento1_1 = mapeamento['1.1'].colecoes;
    console.log('🗺️ Mapeamento 1.1 esperado:', mapeamento1_1);
    
    // Verificar correspondências
    let correspondencias = 0;
    mapeamento1_1.forEach(nomeEsperado => {
      const existe = subcolecoes1_1.includes(nomeEsperado);
      console.log(`${existe ? '✅' : '❌'} ${nomeEsperado}: ${existe ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
      if (existe) correspondencias++;
    });
    
    console.log(`🎯 CORRESPONDÊNCIAS: ${correspondencias}/${mapeamento1_1.length}`);
    
    if (correspondencias === mapeamento1_1.length) {
      console.log('🎉 SUCESSO: Todas as subcoleções foram encontradas!');
    } else if (correspondencias > 0) {
      console.log('⚠️ PARCIAL: Algumas subcoleções foram encontradas');
    } else {
      console.log('❌ PROBLEMA: Nenhuma subcoleção foi encontrada');
    }
  } else {
    console.log('❌ Mapeamento não carregado');
  }
  
  // Mostrar todos os elementos para debug
  console.log('📋 TODOS OS ELEMENTOS GLB:');
  elementosGLB.forEach((el, index) => {
    console.log(`${index + 1}. "${el}"`);
  });
}

function testarHighlighting() {
  console.log('🎨 TESTANDO HIGHLIGHTING...');
  
  const mapeamento = window.mapeamentoElementos;
  const elementosGLB = window.glbElements || [];
  
  if (!mapeamento || !elementosGLB.length) {
    console.log('❌ Dados não disponíveis');
    return;
  }
  
  // Simular seleção do item 1.1
  const item1_1 = mapeamento['1.1'];
  if (item1_1 && item1_1.colecoes) {
    const elementosParaDestacar = item1_1.colecoes.filter(nome => elementosGLB.includes(nome));
    
    console.log('🎯 Elementos que seriam destacados:', elementosParaDestacar.length);
    console.log('🎯 Lista:', elementosParaDestacar);
    
    // Atualizar globalmente
    window.highlightedElements = elementosParaDestacar;
    window.debugData = {
      ...window.debugData,
      highlightedElements: elementosParaDestacar,
      selectedItem: { id: '1.1', descricao: item1_1.descricao },
      highlightTimestamp: new Date().toISOString()
    };
    
    console.log('✅ Elementos destacados atualizados globalmente');
    console.log('💡 Agora teste clicando na linha 1.1 da planilha');
  }
}

// Executar diagnóstico
diagnosticarSubcolecoes();
testarHighlighting();

console.log('🏁 ===== DIAGNÓSTICO CONCLUÍDO =====');
console.log('📋 FUNÇÕES DISPONÍVEIS:');
console.log('- diagnosticarSubcolecoes()');
console.log('- testarHighlighting()');

// DIAGNÓSTICO COMPLETO PARA LINKING GLB-CSV
// Cole este código no console do navegador

console.log('🔍 ===== DIAGNÓSTICO COMPLETO DE LINKING =====');

function diagnosticarCompleto() {
  console.log('📊 INICIANDO DIAGNÓSTICO COMPLETO...');
  
  // 1. Verificar dados da planilha
  console.log('\n📋 ===== DADOS DA PLANILHA =====');
  const itens5D = window.itens5D || [];
  console.log('📊 Total de itens 5D:', itens5D.length);
  
  if (itens5D.length > 0) {
    const item1_1 = itens5D.find(item => item.id === '1.1');
    if (item1_1) {
      console.log('✅ Item 1.1 encontrado na planilha:', item1_1);
      console.log('📋 Elementos3D do item 1.1:', item1_1.elementos3D);
    } else {
      console.log('❌ Item 1.1 NÃO encontrado na planilha');
    }
  } else {
    console.log('❌ Nenhum item 5D carregado');
  }
  
  // 2. Verificar elementos GLB
  console.log('\n📦 ===== ELEMENTOS GLB =====');
  const elementosGLB = window.glbElements || [];
  console.log('📦 Total de elementos GLB:', elementosGLB.length);
  
  if (elementosGLB.length > 0) {
    console.log('📦 Primeiros 20 elementos:', elementosGLB.slice(0, 20));
    
    // Filtrar subcoleções 1.1_
    const subcolecoes1_1 = elementosGLB.filter(el => el.startsWith('1.1_'));
    console.log('🏗️ Subcoleções 1.1_ encontradas:', subcolecoes1_1.length);
    console.log('🏗️ Lista subcoleções 1.1_:', subcolecoes1_1);
    
    // Filtrar todas as subcoleções
    const todasSubcolecoes = elementosGLB.filter(el => 
      el.includes('1.1_') || el.includes('1.2_') || el.includes('2.1_') || 
      el.includes('2.2_') || el.includes('2.3_') || el.includes('3.1_') || el.includes('3.2_')
    );
    console.log('🏗️ Todas as subcoleções:', todasSubcolecoes.length);
    console.log('🏗️ Lista todas subcoleções:', todasSubcolecoes);
  } else {
    console.log('❌ Nenhum elemento GLB carregado');
  }
  
  // 3. Verificar mapeamento
  console.log('\n🗺️ ===== MAPEAMENTO =====');
  const mapeamento = window.mapeamentoElementos;
  if (mapeamento) {
    console.log('✅ Mapeamento carregado');
    console.log('🗺️ Mapeamento completo:', mapeamento);
    
    if (mapeamento['1.1']) {
      console.log('✅ Mapeamento para item 1.1 encontrado');
      console.log('🗺️ Subcoleções esperadas:', mapeamento['1.1'].colecoes);
    } else {
      console.log('❌ Mapeamento para item 1.1 NÃO encontrado');
    }
  } else {
    console.log('❌ Mapeamento NÃO carregado');
  }
  
  // 4. Verificar correspondências
  console.log('\n🎯 ===== CORRESPONDÊNCIAS =====');
  if (mapeamento && mapeamento['1.1'] && elementosGLB.length > 0) {
    const mapeamento1_1 = mapeamento['1.1'].colecoes;
    let correspondencias = 0;
    
    mapeamento1_1.forEach(nomeEsperado => {
      const existe = elementosGLB.includes(nomeEsperado);
      console.log(`${existe ? '✅' : '❌'} ${nomeEsperado}: ${existe ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
      if (existe) correspondencias++;
    });
    
    console.log(`🎯 TOTAL: ${correspondencias}/${mapeamento1_1.length} correspondências`);
    
    if (correspondencias === 0) {
      console.log('❌ PROBLEMA: Nenhuma correspondência encontrada!');
      console.log('💡 POSSÍVEIS CAUSAS:');
      console.log('   1. Subcoleções não foram renomeadas no Blender');
      console.log('   2. Nomes das subcoleções não coincidem com o mapeamento');
      console.log('   3. Modelo GLB não foi atualizado após renomeação');
    } else if (correspondencias < mapeamento1_1.length) {
      console.log('⚠️ PARCIAL: Algumas correspondências encontradas');
    } else {
      console.log('🎉 SUCESSO: Todas as correspondências encontradas!');
    }
  }
  
  // 5. Verificar estado atual do highlighting
  console.log('\n🎨 ===== ESTADO DO HIGHLIGHTING =====');
  const highlightedElements = window.highlightedElements || [];
  console.log('🎨 Elementos destacados atualmente:', highlightedElements.length);
  console.log('🎨 Lista elementos destacados:', highlightedElements);
  
  // 6. Mostrar todos os elementos GLB para debug
  console.log('\n📋 ===== TODOS OS ELEMENTOS GLB (DEBUG) =====');
  if (elementosGLB.length > 0) {
    elementosGLB.forEach((el, index) => {
      const isHighlighted = highlightedElements.includes(el);
      console.log(`${index + 1}. "${el}" ${isHighlighted ? '🎨' : ''}`);
    });
  }
}

function testarLinkingManual() {
  console.log('\n🧪 ===== TESTE MANUAL DE LINKING =====');
  
  const mapeamento = window.mapeamentoElementos;
  const elementosGLB = window.glbElements || [];
  
  if (!mapeamento || !elementosGLB.length) {
    console.log('❌ Dados não disponíveis para teste manual');
    return;
  }
  
  // Simular seleção do item 1.1
  const item1_1 = mapeamento['1.1'];
  if (item1_1 && item1_1.colecoes) {
    console.log('🧪 Simulando seleção do item 1.1...');
    
    const elementosParaDestacar = item1_1.colecoes.filter(nome => elementosGLB.includes(nome));
    
    console.log('🎯 Elementos que seriam destacados:', elementosParaDestacar.length);
    console.log('🎯 Lista:', elementosParaDestacar);
    
    if (elementosParaDestacar.length > 0) {
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
    } else {
      console.log('❌ Nenhum elemento para destacar');
    }
  }
}

// Executar diagnóstico completo
diagnosticarCompleto();
testarLinkingManual();

console.log('\n🏁 ===== DIAGNÓSTICO CONCLUÍDO =====');
console.log('📋 FUNÇÕES DISPONÍVEIS:');
console.log('- diagnosticarCompleto()');
console.log('- testarLinkingManual()');

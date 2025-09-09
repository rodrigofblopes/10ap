// SCRIPT DE DIAGNÓSTICO COMPLETO PARA VINCULAÇÃO GLB-CSV
// Cole este código no console do navegador para debugar

console.log('🔍 ===== DIAGNÓSTICO DE VINCULAÇÃO GLB-CSV =====');

// 1. VERIFICAR DADOS DA PLANILHA CSV
function debugPlanilhaData() {
  console.log('📊 1. VERIFICANDO DADOS DA PLANILHA');
  
  // Tentar acessar os dados do store Zustand
  let itens = [];
  
  // Método 1: Tentar acessar via React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('🔧 React DevTools detectado');
  }
  
  // Método 2: Tentar acessar via variáveis globais
  if (window.itens5D) {
    itens = window.itens5D;
    console.log('✅ Dados encontrados via window.itens5D');
  } else if (window.orçamentoStore) {
    itens = window.orçamentoStore.getState().itens;
    console.log('✅ Dados encontrados via store Zustand');
  } else {
    console.log('⚠️ Dados não encontrados via variáveis globais');
    console.log('💡 Tente acessar via React DevTools ou aguarde o carregamento');
    return;
  }
  
  console.log(`📋 Total de itens carregados: ${itens.length}`);
  
  // Verificar item 1.1 especificamente
  const item1_1 = itens.find(item => item.id === '1.1' || item.codigo === '1.1');
  if (item1_1) {
    console.log('🏗️ ITEM 1.1 (VIGAS) ENCONTRADO:');
    console.log('   - ID:', item1_1.id);
    console.log('   - Código:', item1_1.codigo);
    console.log('   - Descrição:', item1_1.descricao);
    console.log('   - Elementos3D (RAW):', item1_1.elementos3D);
    console.log('   - Elementos3D (ARRAY):', item1_1.elementos3D?.split(',').map(el => el.trim()));
  } else {
    console.log('❌ Item 1.1 NÃO ENCONTRADO na planilha!');
    console.log('📋 Itens disponíveis:', itens.map(item => item.id).slice(0, 10));
  }
  
  // Verificar todos os itens que têm elementos3D preenchidos
  const itensComElementos3D = itens.filter(item => item.elementos3D && item.elementos3D.trim() !== '');
  console.log(`📈 Itens com elementos3D preenchidos: ${itensComElementos3D.length}`);
  
  itensComElementos3D.slice(0, 5).forEach((item, index) => {
    console.log(`📋 Item ${index + 1}:`, {
      id: item.id,
      descricao: item.descricao?.substring(0, 30) + '...',
      elementos3D: item.elementos3D
    });
  });
  
  return itens;
}

// 2. VERIFICAR ELEMENTOS DO MODELO GLB
function debugModeloGLB() {
  console.log('📦 2. VERIFICANDO ELEMENTOS DO MODELO GLB');
  
  // Tentar acessar os elementos GLB
  let glbElements = [];
  
  if (window.glbElements) {
    glbElements = window.glbElements;
    console.log('✅ Elementos GLB encontrados via window.glbElements');
  } else {
    console.log('⚠️ Elementos GLB não encontrados via variáveis globais');
    console.log('💡 Aguarde o carregamento do modelo 3D ou verifique o console da aplicação');
    return [];
  }
  
  console.log(`📦 Total de elementos GLB: ${glbElements.length}`);
  
  // Verificar elementos que começam com 1.1_
  const elementos1_1 = glbElements.filter(el => el.startsWith('1.1_'));
  console.log(`🏗️ Elementos 1.1_ (VIGAS): ${elementos1_1.length}`);
  console.log('🏗️ Lista completa:', elementos1_1.sort());
  
  // Verificar padrões dos elementos
  const patterns = {
    'com_underscore': glbElements.filter(el => el.includes('_')).length,
    'com_ponto': glbElements.filter(el => el.includes('.')).length,
    'numeros_3_digitos': glbElements.filter(el => /\.\d{3}$/.test(el)).length,
    'formato_1_1_': glbElements.filter(el => /^1\.1_/.test(el)).length
  };
  
  console.log('📊 Padrões dos elementos GLB:', patterns);
  
  // Mostrar primeiros 20 elementos para análise
  console.log('📋 Primeiros 20 elementos GLB:', glbElements.slice(0, 20));
  
  return glbElements;
}

// 3. TESTAR CORRESPONDÊNCIA MANUAL
function testCorrespondencia() {
  console.log('🎯 3. TESTANDO CORRESPONDÊNCIA MANUAL');
  
  const itens = debugPlanilhaData();
  const elementosGLB = debugModeloGLB();
  
  if (!itens || !elementosGLB) {
    console.log('❌ Não foi possível obter dados para teste');
    return;
  }
  
  // Elementos de teste baseados na sua imagem
  const elementosCSV = ['1.1_.031', '1.1_.032', '1.1_.033', '1.1_.034'];
  
  elementosCSV.forEach(elementoCSV => {
    console.log(`🔍 Testando elemento CSV: "${elementoCSV}"`);
    
    // Teste 1: Correspondência exata
    const exactMatch = elementosGLB.find(glbEl => glbEl === elementoCSV);
    if (exactMatch) {
      console.log(`✅ EXATA: "${elementoCSV}" → "${exactMatch}"`);
      return;
    }
    
    // Teste 2: Case insensitive
    const caseMatch = elementosGLB.find(glbEl => 
      glbEl.toLowerCase() === elementoCSV.toLowerCase()
    );
    if (caseMatch) {
      console.log(`✅ CASE: "${elementoCSV}" → "${caseMatch}"`);
      return;
    }
    
    // Teste 3: Correspondência parcial
    const partialMatches = elementosGLB.filter(glbEl => 
      glbEl.includes(elementoCSV) || elementoCSV.includes(glbEl)
    );
    if (partialMatches.length > 0) {
      console.log(`✅ PARCIAL: "${elementoCSV}" → [${partialMatches.join(', ')}]`);
      return;
    }
    
    // Teste 4: Elementos similares (mesmo padrão)
    const similarElements = elementosGLB.filter(el => {
      const elParts = el.split('_');
      const targetParts = elementoCSV.split('_');
      return elParts.length === targetParts.length && 
             elParts[0] === targetParts[0];
    });
    
    console.log(`❌ NÃO ENCONTRADO: "${elementoCSV}"`);
    if (similarElements.length > 0) {
      console.log(`🔍 Similares: [${similarElements.slice(0, 10).join(', ')}]`);
    }
  });
}

// 4. VERIFICAR PROCESSO DE HIGHLIGHTING
function debugHighlighting() {
  console.log('🎨 4. VERIFICANDO PROCESSO DE HIGHLIGHTING');
  
  // Verificar se os elementos destacados estão sendo aplicados
  const highlightedElements = window.highlightedElements || [];
  console.log(`🟠 Elementos em destaque: ${highlightedElements.length}`);
  console.log('🟠 Lista:', highlightedElements);
  
  // Verificar se existem meshes no modelo 3D
  const scene = window.scene; // Ajuste conforme sua variável global
  if (scene) {
    let totalMeshes = 0;
    let meshesComNome = 0;
    
    scene.traverse((child) => {
      if (child.isMesh) {
        totalMeshes++;
        if (child.name && child.name.trim() !== '') {
          meshesComNome++;
        }
      }
    });
    
    console.log(`📦 Total de meshes no modelo: ${totalMeshes}`);
    console.log(`📝 Meshes com nome: ${meshesComNome}`);
  } else {
    console.log('❌ Scene não encontrada');
  }
}

// 5. EXECUTAR TODOS OS TESTES
function executarDiagnosticoCompleto() {
  console.log('🚀 INICIANDO DIAGNÓSTICO COMPLETO...');
  
  debugPlanilhaData();
  debugModeloGLB();
  testCorrespondencia();
  debugHighlighting();
  
  console.log('🏁 ===== DIAGNÓSTICO CONCLUÍDO =====');
  console.log('💡 PRÓXIMOS PASSOS:');
  console.log('1. Verifique se a coluna elementos3D está na posição correta (8ª coluna)');
  console.log('2. Confirme se os formatos dos nomes coincidem exatamente');
  console.log('3. Verifique se não há caracteres especiais ou espaços extras');
  console.log('4. Teste manualmente um elemento conhecido');
}

// FUNÇÃO AUXILIAR PARA TESTAR UM ELEMENTO ESPECÍFICO
function testarElementoEspecifico(elementoCSV) {
  console.log(`🎯 TESTE ESPECÍFICO: "${elementoCSV}"`);
  
  const glbElements = window.glbElements || [];
  const itens = window.itens5D || window.orçamentoStore?.getState()?.itens || [];
  
  // Verificar se existe na planilha
  const itemNaPlanilha = itens.find(item => 
    item.elementos3D && item.elementos3D.includes(elementoCSV)
  );
  
  if (itemNaPlanilha) {
    console.log('✅ Elemento encontrado na planilha:', itemNaPlanilha.id, itemNaPlanilha.descricao);
  } else {
    console.log('❌ Elemento NÃO encontrado na planilha');
  }
  
  // Verificar se existe no GLB
  const existeNoGLB = glbElements.includes(elementoCSV);
  console.log(existeNoGLB ? '✅ Elemento EXISTE no GLB' : '❌ Elemento NÃO EXISTE no GLB');
  
  // Mostrar elementos similares no GLB
  const similares = glbElements.filter(el => 
    el.includes('1.1_') || el.startsWith('1.1')
  ).slice(0, 10);
  console.log('🔍 Elementos similares no GLB:', similares);
}

// FUNÇÃO PARA AGUARDAR CARREGAMENTO E EXECUTAR
function aguardarCarregamento() {
  console.log('⏳ Aguardando carregamento dos dados...');
  
  let tentativas = 0;
  const maxTentativas = 30; // 30 segundos
  
  const verificar = () => {
    tentativas++;
    
    const temDados = window.itens5D || window.orçamentoStore?.getState()?.itens?.length > 0;
    const temGLB = window.glbElements?.length > 0;
    
    if (temDados && temGLB) {
      console.log('✅ Dados carregados! Executando diagnóstico...');
      executarDiagnosticoCompleto();
    } else if (tentativas < maxTentativas) {
      console.log(`⏳ Tentativa ${tentativas}/${maxTentativas} - Aguardando...`);
      setTimeout(verificar, 1000);
    } else {
      console.log('❌ Timeout: Dados não carregaram em 30 segundos');
      console.log('💡 Execute manualmente: executarDiagnosticoCompleto()');
    }
  };
  
  verificar();
}

// EXECUTAR O DIAGNÓSTICO AUTOMATICAMENTE
aguardarCarregamento();

console.log('📋 FUNÇÕES DISPONÍVEIS:');
console.log('- executarDiagnosticoCompleto()');
console.log('- testarElementoEspecifico("1.1_.031")');
console.log('- debugPlanilhaData()');
console.log('- debugModeloGLB()');
console.log('- testCorrespondencia()');
console.log('- debugHighlighting()');
console.log('- aguardarCarregamento()');

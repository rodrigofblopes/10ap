// DIAGNÓSTICO COMPLETO PARA IDENTIFICAR POR QUE OS ELEMENTOS NÃO SÃO DESTACADOS
// Cole este código no console do navegador

console.log('🔍 ===== DIAGNÓSTICO COMPLETO - ELEMENTOS NÃO DESTACADOS =====');

// Função para verificar se os dados estão carregados
function verificarDadosCarregados() {
  console.log('📊 1. VERIFICANDO DADOS CARREGADOS...');
  
  // Verificar dados da planilha
  const dadosPlanilha = window.itens5D || window.debugData?.itens || [];
  console.log('📋 Dados da planilha:', dadosPlanilha.length, 'itens');
  
  if (dadosPlanilha.length === 0) {
    console.log('❌ PROBLEMA: Nenhum dado da planilha encontrado!');
    return false;
  }
  
  // Verificar item 1.1 específico
  const item1_1 = dadosPlanilha.find(item => item.id === '1.1');
  if (!item1_1) {
    console.log('❌ PROBLEMA: Item 1.1 não encontrado na planilha!');
    console.log('📋 Itens disponíveis:', dadosPlanilha.map(item => item.id).slice(0, 10));
    return false;
  }
  
  console.log('✅ Item 1.1 encontrado:', item1_1);
  console.log('🏗️ Elementos3D:', item1_1.elementos3D);
  
  if (!item1_1.elementos3D || item1_1.elementos3D.trim() === '') {
    console.log('❌ PROBLEMA: Item 1.1 não possui elementos3D!');
    return false;
  }
  
  return true;
}

// Função para verificar elementos GLB
function verificarElementosGLB() {
  console.log('📦 2. VERIFICANDO ELEMENTOS GLB...');
  
  const elementosGLB = window.glbElements || window.debugData?.glbElements || [];
  console.log('📦 Elementos GLB:', elementosGLB.length, 'elementos');
  
  if (elementosGLB.length === 0) {
    console.log('❌ PROBLEMA: Nenhum elemento GLB encontrado!');
    return false;
  }
  
  // Verificar elementos 1.1_
  const elementos1_1 = elementosGLB.filter(el => el.startsWith('1.1_'));
  console.log('🏗️ Elementos 1.1_ encontrados:', elementos1_1.length);
  console.log('🏗️ Lista:', elementos1_1.sort());
  
  if (elementos1_1.length === 0) {
    console.log('❌ PROBLEMA: Nenhum elemento 1.1_ encontrado no modelo GLB!');
    console.log('📋 Primeiros 20 elementos GLB:', elementosGLB.slice(0, 20));
    return false;
  }
  
  return true;
}

// Função para testar correspondência manual
function testarCorrespondenciaManual() {
  console.log('🎯 3. TESTANDO CORRESPONDÊNCIA MANUAL...');
  
  const dadosPlanilha = window.itens5D || [];
  const elementosGLB = window.glbElements || [];
  
  const item1_1 = dadosPlanilha.find(item => item.id === '1.1');
  if (!item1_1) {
    console.log('❌ Item 1.1 não encontrado para teste');
    return;
  }
  
  const elementos3D = item1_1.elementos3D;
  if (!elementos3D) {
    console.log('❌ Elementos3D não encontrado para teste');
    return;
  }
  
  // Converter string em array
  const elementosArray = elementos3D.split(',').map(el => el.trim()).filter(el => el !== '');
  console.log('📋 Elementos da planilha (array):', elementosArray);
  console.log('📋 Quantidade:', elementosArray.length);
  
  // Testar cada elemento
  let correspondencias = 0;
  elementosArray.forEach(elemento => {
    const existe = elementosGLB.includes(elemento);
    console.log(`${existe ? '✅' : '❌'} ${elemento}: ${existe ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
    if (existe) correspondencias++;
  });
  
  console.log(`🎯 RESULTADO: ${correspondencias}/${elementosArray.length} correspondências`);
  
  if (correspondencias === elementosArray.length) {
    console.log('✅ SUCESSO: Todos os elementos foram encontrados!');
  } else {
    console.log('❌ PROBLEMA: Alguns elementos não foram encontrados');
    
    // Mostrar elementos não encontrados
    const naoEncontrados = elementosArray.filter(el => !elementosGLB.includes(el));
    console.log('❌ Elementos não encontrados:', naoEncontrados);
    
    // Mostrar elementos similares
    const similares = elementosGLB.filter(el => el.includes('1.1_')).slice(0, 10);
    console.log('🔍 Elementos similares no GLB:', similares);
  }
}

// Função para verificar highlighting
function verificarHighlighting() {
  console.log('🎨 4. VERIFICANDO HIGHLIGHTING...');
  
  const elementosDestacados = window.highlightedElements || window.debugData?.highlightedElements || [];
  console.log('🟠 Elementos destacados:', elementosDestacados.length);
  console.log('🟠 Lista:', elementosDestacados);
  
  if (elementosDestacados.length === 0) {
    console.log('❌ PROBLEMA: Nenhum elemento está destacado!');
    console.log('💡 Isso pode indicar que:');
    console.log('   1. A função findMatchingElements não está funcionando');
    console.log('   2. Os elementos não estão sendo encontrados');
    console.log('   3. O highlighting não está sendo aplicado');
  } else {
    console.log('✅ Elementos estão sendo destacados');
  }
}

// Função para simular clique na planilha
function simularCliquePlanilha() {
  console.log('🖱️ 5. SIMULANDO CLIQUE NA PLANILHA...');
  
  const dadosPlanilha = window.itens5D || [];
  const item1_1 = dadosPlanilha.find(item => item.id === '1.1');
  
  if (!item1_1) {
    console.log('❌ Item 1.1 não encontrado para simulação');
    return;
  }
  
  console.log('📋 Simulando clique no item:', item1_1);
  
  // Simular a função findMatchingElements
  const elementosGLB = window.glbElements || [];
  const elementos3D = item1_1.elementos3D || '';
  
  if (!elementos3D) {
    console.log('❌ Elementos3D vazio');
    return;
  }
  
  const elementos3DArray = elementos3D.split(',').map(el => el.trim()).filter(el => el !== '');
  let matchingElements = [];
  
  elementos3DArray.forEach(elemento3D => {
    const exactMatch = elementosGLB.find(glbEl => glbEl === elemento3D);
    if (exactMatch) {
      matchingElements.push(exactMatch);
      console.log(`✅ Encontrado: ${elemento3D}`);
    } else {
      console.log(`❌ Não encontrado: ${elemento3D}`);
    }
  });
  
  console.log('🎯 Elementos que seriam destacados:', matchingElements.length);
  console.log('🎯 Lista:', matchingElements);
  
  // Atualizar elementos destacados globalmente
  window.highlightedElements = matchingElements;
  window.debugData = {
    ...window.debugData,
    highlightedElements: matchingElements,
    selectedItem: item1_1,
    highlightTimestamp: new Date().toISOString()
  };
  
  console.log('✅ Elementos destacados atualizados globalmente');
}

// Função para verificar se o modelo 3D está carregado
function verificarModelo3D() {
  console.log('🎮 6. VERIFICANDO MODELO 3D...');
  
  // Verificar se há elementos no DOM do Three.js
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    console.log('❌ Canvas 3D não encontrado');
    return false;
  }
  
  console.log('✅ Canvas 3D encontrado');
  
  // Verificar se há meshes no modelo
  const scene = window.scene;
  if (!scene) {
    console.log('❌ Scene não encontrada');
    return false;
  }
  
  console.log('✅ Scene encontrada');
  
  let totalMeshes = 0;
  let meshesComNome = 0;
  let meshes1_1 = 0;
  
  scene.traverse((child) => {
    if (child.isMesh) {
      totalMeshes++;
      if (child.name && child.name.trim() !== '') {
        meshesComNome++;
        if (child.name.startsWith('1.1_')) {
          meshes1_1++;
        }
      }
    }
  });
  
  console.log('📦 Total de meshes:', totalMeshes);
  console.log('📝 Meshes com nome:', meshesComNome);
  console.log('🏗️ Meshes 1.1_:', meshes1_1);
  
  if (meshes1_1 === 0) {
    console.log('❌ PROBLEMA: Nenhum mesh 1.1_ encontrado no modelo 3D!');
    return false;
  }
  
  return true;
}

// Função principal de diagnóstico
function executarDiagnosticoCompleto() {
  console.log('🚀 INICIANDO DIAGNÓSTICO COMPLETO...');
  
  const dadosOk = verificarDadosCarregados();
  const glbOk = verificarElementosGLB();
  const modeloOk = verificarModelo3D();
  
  testarCorrespondenciaManual();
  verificarHighlighting();
  simularCliquePlanilha();
  
  console.log('🏁 ===== DIAGNÓSTICO CONCLUÍDO =====');
  
  if (dadosOk && glbOk && modeloOk) {
    console.log('✅ TODOS OS DADOS ESTÃO CORRETOS');
    console.log('💡 O problema pode estar na aplicação do highlighting');
    console.log('💡 Tente clicar na linha 1.1 da planilha novamente');
  } else {
    console.log('❌ PROBLEMAS IDENTIFICADOS:');
    if (!dadosOk) console.log('   - Dados da planilha não carregados');
    if (!glbOk) console.log('   - Elementos GLB não encontrados');
    if (!modeloOk) console.log('   - Modelo 3D não carregado corretamente');
  }
}

// Executar diagnóstico
executarDiagnosticoCompleto();

console.log('📋 FUNÇÕES DISPONÍVEIS:');
console.log('- executarDiagnosticoCompleto()');
console.log('- verificarDadosCarregados()');
console.log('- verificarElementosGLB()');
console.log('- testarCorrespondenciaManual()');
console.log('- verificarHighlighting()');
console.log('- simularCliquePlanilha()');
console.log('- verificarModelo3D()');

// Script para identificar os nomes reais dos agrupamentos de coleções pai no modelo GLB
// Execute este script no console do navegador após carregar o modelo 3D

console.log('🔍 ===== IDENTIFICANDO AGRUPAMENTOS DE COLEÇÕES PAI =====');

if (typeof window !== 'undefined' && window.sceneArquitetura) {
  const scene = window.sceneArquitetura;
  
  const agrupamentosPai = {};
  const elementosPorAgrupamento = {};
  const todosObjetos = [];
  
  console.log('📊 Analisando hierarquia completa do modelo...');
  
  scene.traverse((child) => {
    if (child.name && child.name.trim() !== '') {
      todosObjetos.push({
        nome: child.name,
        tipo: child.constructor.name,
        temFilhos: child.children && child.children.length > 0,
        numFilhos: child.children ? child.children.length : 0
      });
      
      // Identificar agrupamentos pai (objetos que têm filhos e são coleções principais)
      if (child.children && child.children.length > 0) {
        
        // Verificar se é um agrupamento relevante baseado no nome
        const nome = child.name.toLowerCase();
        
        // Procurar por padrões de agrupamentos principais
        if (nome.includes('parede') || nome.includes('wall') || 
            nome.includes('piso') || nome.includes('floor') ||
            nome.includes('revestimento') || nome.includes('coating') ||
            nome.includes('forro') || nome.includes('ceiling') ||
            nome.includes('esquadria') || nome.includes('window') ||
            nome.includes('pintura') || nome.includes('paint') ||
            nome.includes('instalacao') || nome.includes('installation') ||
            nome.includes('servico') || nome.includes('service') ||
            nome.includes('1.1') || nome.includes('1.2') || nome.includes('1.3') ||
            nome.includes('1.4') || nome.includes('1.5') || nome.includes('1.6') ||
            nome.includes('1.7') || nome.includes('1.8') || nome.includes('1.9') ||
            nome.includes('1.10') || nome.includes('1.11') ||
            nome.includes('2.1') || nome.includes('2.2') || nome.includes('2.3') ||
            nome.includes('2.4') || nome.includes('2.5') || nome.includes('2.6')) {
          
          agrupamentosPai[child.name] = child;
          elementosPorAgrupamento[child.name] = child.children.map(c => c.name);
          
          console.log(`📁 AGRUPAMENTO PAI ENCONTRADO: "${child.name}"`);
          console.log(`   Tipo: ${child.constructor.name}`);
          console.log(`   Filhos: ${child.children.length}`);
          console.log(`   Primeiros 5 filhos:`, child.children.slice(0, 5).map(c => c.name));
        }
      }
    }
  });
  
  console.log('📊 ===== RESULTADOS DA ANÁLISE =====');
  console.log(`📊 Total de objetos encontrados: ${todosObjetos.length}`);
  console.log(`📊 Total de agrupamentos pai encontrados: ${Object.keys(agrupamentosPai).length}`);
  
  console.log('📊 ===== AGRUPAMENTOS PAI IDENTIFICADOS =====');
  Object.keys(agrupamentosPai).forEach(agrupamento => {
    console.log(`📁 "${agrupamento}": ${elementosPorAgrupamento[agrupamento].length} elementos`);
  });
  
  console.log('📊 ===== TODOS OS OBJETOS COM FILHOS =====');
  const objetosComFilhos = todosObjetos.filter(obj => obj.temFilhos);
  objetosComFilhos.forEach(obj => {
    console.log(`📁 "${obj.nome}" (${obj.tipo}): ${obj.numFilhos} filhos`);
  });
  
  // Gerar mapeamento para CSV
  console.log('📋 ===== MAPEAMENTO PARA CSV (elementos3D) =====');
  const mapeamentoCSV = {};
  Object.keys(agrupamentosPai).forEach(agrupamento => {
    mapeamentoCSV[agrupamento] = agrupamento; // Usar o nome do agrupamento como valor
    console.log(`"${agrupamento}" → "${agrupamento}"`);
  });
  
  // Expor resultados globalmente
  window.agrupamentosPaiArquitetura = agrupamentosPai;
  window.elementosPorAgrupamentoArquitetura = elementosPorAgrupamento;
  window.mapeamentoCSVAgrupamentos = mapeamentoCSV;
  window.todosObjetosArquitetura = todosObjetos;
  
  console.log('✅ Resultados expostos globalmente:');
  console.log('   - window.agrupamentosPaiArquitetura');
  console.log('   - window.elementosPorAgrupamentoArquitetura');
  console.log('   - window.mapeamentoCSVAgrupamentos');
  console.log('   - window.todosObjetosArquitetura');
  
  console.log('🎯 ===== INSTRUÇÕES PARA ATUALIZAR CSV =====');
  console.log('Use os nomes dos agrupamentos pai encontrados acima na coluna elementos3D:');
  Object.keys(agrupamentosPai).forEach(agrupamento => {
    console.log(`   ${agrupamento}`);
  });
  
} else {
  console.log('❌ Scene arquitetônica não encontrada!');
  console.log('   Certifique-se de que o modelo 3D foi carregado e a scene está exposta como window.sceneArquitetura');
}

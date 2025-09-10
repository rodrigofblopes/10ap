// Script para identificar os nomes reais das coleções pai do Blender no modelo GLB
// Execute este script no console do navegador após carregar o modelo 3D

console.log('🔍 ===== IDENTIFICANDO COLECÇÕES PAI DO BLENDER =====');

if (typeof window !== 'undefined' && window.sceneArquitetura) {
  const scene = window.sceneArquitetura;
  
  const colecoesPaiBlender = {};
  const elementosPorColecao = {};
  const todosObjetos = [];
  
  console.log('📊 Analisando hierarquia completa do modelo GLB...');
  
  scene.traverse((child) => {
    if (child.name && child.name.trim() !== '') {
      todosObjetos.push({
        nome: child.name,
        tipo: child.constructor.name,
        temFilhos: child.children && child.children.length > 0,
        numFilhos: child.children ? child.children.length : 0,
        parent: child.parent ? child.parent.name : 'ROOT'
      });
      
      // Identificar coleções pai (objetos que têm filhos)
      if (child.children && child.children.length > 0) {
        
        // Verificar se é uma coleção pai relevante
        const nome = child.name;
        
        // Procurar por padrões de coleções pai do Blender
        // Coleções pai são objetos que contêm outros objetos como filhos
        if (nome.includes('1.1') || nome.includes('1.2') || nome.includes('1.3') ||
            nome.includes('1.4') || nome.includes('1.5') || nome.includes('1.6') ||
            nome.includes('1.7') || nome.includes('1.8') || nome.includes('1.9') ||
            nome.includes('1.10') || nome.includes('1.11') ||
            nome.includes('2.1') || nome.includes('2.2') || nome.includes('2.3') ||
            nome.includes('2.4') || nome.includes('2.5') || nome.includes('2.6') ||
            nome.includes('Parede') || nome.includes('Piso') ||
            nome.includes('Revestimento') || nome.includes('Forro') ||
            nome.includes('Esquadria') || nome.includes('Pintura') ||
            nome.includes('Instalacao') || nome.includes('Servico') ||
            nome.includes('Collection') || nome.includes('Group') ||
            nome.includes('_') || nome.includes('-')) {
          
          colecoesPaiBlender[nome] = child;
          elementosPorColecao[nome] = child.children.map(c => c.name);
          
          console.log(`📁 COLECÇÃO PAI BLENDER: "${nome}"`);
          console.log(`   Tipo: ${child.constructor.name}`);
          console.log(`   Filhos: ${child.children.length}`);
          console.log(`   Primeiros 5 filhos:`, child.children.slice(0, 5).map(c => c.name));
        }
      }
    }
  });
  
  console.log('📊 ===== RESULTADOS DA ANÁLISE =====');
  console.log(`📊 Total de objetos encontrados: ${todosObjetos.length}`);
  console.log(`📊 Total de coleções pai encontradas: ${Object.keys(colecoesPaiBlender).length}`);
  
  console.log('📊 ===== COLECÇÕES PAI DO BLENDER IDENTIFICADAS =====');
  Object.keys(colecoesPaiBlender).forEach(colecao => {
    console.log(`📁 "${colecao}": ${elementosPorColecao[colecao].length} elementos`);
  });
  
  console.log('📊 ===== TODOS OS OBJETOS COM FILHOS =====');
  const objetosComFilhos = todosObjetos.filter(obj => obj.temFilhos);
  objetosComFilhos.forEach(obj => {
    console.log(`📁 "${obj.nome}" (${obj.tipo}): ${obj.numFilhos} filhos`);
  });
  
  // Gerar mapeamento para CSV
  console.log('📋 ===== MAPEAMENTO PARA CSV (elementos3D) =====');
  const mapeamentoCSV = {};
  Object.keys(colecoesPaiBlender).forEach(colecao => {
    mapeamentoCSV[colecao] = colecao; // Usar o nome exato da coleção pai
    console.log(`"${colecao}" → "${colecao}"`);
  });
  
  // Expor resultados globalmente
  window.colecoesPaiBlenderArquitetura = colecoesPaiBlender;
  window.elementosPorColecaoBlenderArquitetura = elementosPorColecao;
  window.mapeamentoCSVBlender = mapeamentoCSV;
  window.todosObjetosBlenderArquitetura = todosObjetos;
  
  console.log('✅ Resultados expostos globalmente:');
  console.log('   - window.colecoesPaiBlenderArquitetura');
  console.log('   - window.elementosPorColecaoBlenderArquitetura');
  console.log('   - window.mapeamentoCSVBlender');
  console.log('   - window.todosObjetosBlenderArquitetura');
  
  console.log('🎯 ===== INSTRUÇÕES PARA ATUALIZAR CSV =====');
  console.log('Use os nomes exatos das coleções pai do Blender encontradas acima na coluna elementos3D:');
  Object.keys(colecoesPaiBlender).forEach(colecao => {
    console.log(`   ${colecao}`);
  });
  
  // Gerar lista para copiar e colar no CSV
  console.log('📋 ===== LISTA PARA COPIAR NO CSV =====');
  const listaCSV = Object.keys(colecoesPaiBlender).join(',');
  console.log(listaCSV);
  
} else {
  console.log('❌ Scene arquitetônica não encontrada!');
  console.log('   Certifique-se de que o modelo 3D foi carregado e a scene está exposta como window.sceneArquitetura');
}

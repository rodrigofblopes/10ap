// Script para analisar a estrutura do arquivo GLB do Blender e identificar coleções pai
// Execute este script no console do navegador após carregar o modelo 3D

console.log('🔍 ===== ANALISANDO ESTRUTURA GLB DO BLENDER =====');

if (typeof window !== 'undefined' && window.sceneArquitetura) {
  const scene = window.sceneArquitetura;
  
  const colecoesPaiBlender = {};
  const elementosPorColecao = {};
  const todosObjetos = [];
  const objetosComFilhos = [];
  
  console.log('📊 Analisando estrutura completa do arquivo GLB...');
  
  // Analisar a cena completa
  scene.traverse((child) => {
    if (child.name && child.name.trim() !== '') {
      const objInfo = {
        nome: child.name,
        tipo: child.constructor.name,
        temFilhos: child.children && child.children.length > 0,
        numFilhos: child.children ? child.children.length : 0,
        parent: child.parent ? child.parent.name : 'ROOT',
        uuid: child.uuid,
        visible: child.visible,
        userData: child.userData
      };
      
      todosObjetos.push(objInfo);
      
      // Identificar objetos que têm filhos (possíveis coleções pai)
      if (child.children && child.children.length > 0) {
        objetosComFilhos.push(objInfo);
        
        // Filtrar coleções pai baseado em critérios específicos do Blender
        const nome = child.name;
        
        // Critérios para identificar coleções pai do Blender:
        // 1. Objetos que têm muitos filhos (coleções)
        // 2. Objetos com nomes que indicam agrupamento
        // 3. Objetos que não são meshes individuais
        
        const isCollectionPai = (
          // Ter pelo menos 3 filhos (indicando agrupamento)
          child.children.length >= 3 &&
          // Não ser um mesh individual
          child.constructor.name !== 'Mesh' &&
          // Ter nome que indica agrupamento ou coleção
          (nome.includes('Collection') || 
           nome.includes('Group') || 
           nome.includes('_') || 
           nome.includes('-') ||
           nome.includes('1.') ||
           nome.includes('2.') ||
           nome.includes('Parede') ||
           nome.includes('Piso') ||
           nome.includes('Revestimento') ||
           nome.includes('Forro') ||
           nome.includes('Esquadria') ||
           nome.includes('Pintura') ||
           nome.includes('Instalacao') ||
           nome.includes('Servico') ||
           nome.includes('Wall') ||
           nome.includes('Floor') ||
           nome.includes('Ceiling') ||
           nome.includes('Window') ||
           nome.includes('Door') ||
           nome.includes('Paint') ||
           nome.includes('Installation'))
        );
        
        if (isCollectionPai) {
          colecoesPaiBlender[nome] = child;
          elementosPorColecao[nome] = child.children.map(c => ({
            nome: c.name,
            tipo: c.constructor.name,
            uuid: c.uuid
          }));
          
          console.log(`📁 COLECÇÃO PAI BLENDER IDENTIFICADA: "${nome}"`);
          console.log(`   Tipo: ${child.constructor.name}`);
          console.log(`   Filhos: ${child.children.length}`);
          console.log(`   UUID: ${child.uuid}`);
          console.log(`   Primeiros 5 filhos:`, child.children.slice(0, 5).map(c => `${c.name} (${c.constructor.name})`));
        }
      }
    }
  });
  
  console.log('📊 ===== RESULTADOS DA ANÁLISE =====');
  console.log(`📊 Total de objetos encontrados: ${todosObjetos.length}`);
  console.log(`📊 Total de objetos com filhos: ${objetosComFilhos.length}`);
  console.log(`📊 Total de coleções pai identificadas: ${Object.keys(colecoesPaiBlender).length}`);
  
  console.log('📊 ===== COLECÇÕES PAI DO BLENDER FILTRADAS =====');
  Object.keys(colecoesPaiBlender).forEach(colecao => {
    console.log(`📁 "${colecao}": ${elementosPorColecao[colecao].length} elementos`);
  });
  
  console.log('📊 ===== TODOS OS OBJETOS COM FILHOS (PARA REFERÊNCIA) =====');
  objetosComFilhos.forEach(obj => {
    console.log(`📁 "${obj.nome}" (${obj.tipo}): ${obj.numFilhos} filhos`);
  });
  
  // Gerar mapeamento para CSV
  console.log('📋 ===== MAPEAMENTO PARA CSV (elementos3D) =====');
  const mapeamentoCSV = {};
  Object.keys(colecoesPaiBlender).forEach(colecao => {
    mapeamentoCSV[colecao] = colecao;
    console.log(`"${colecao}" → "${colecao}"`);
  });
  
  // Expor resultados globalmente
  window.colecoesPaiBlenderFiltradas = colecoesPaiBlender;
  window.elementosPorColecaoBlenderFiltrados = elementosPorColecao;
  window.mapeamentoCSVBlenderFiltrado = mapeamentoCSV;
  window.todosObjetosBlenderFiltrados = todosObjetos;
  window.objetosComFilhosBlender = objetosComFilhos;
  
  console.log('✅ Resultados expostos globalmente:');
  console.log('   - window.colecoesPaiBlenderFiltradas');
  console.log('   - window.elementosPorColecaoBlenderFiltrados');
  console.log('   - window.mapeamentoCSVBlenderFiltrado');
  console.log('   - window.todosObjetosBlenderFiltrados');
  console.log('   - window.objetosComFilhosBlender');
  
  console.log('🎯 ===== INSTRUÇÕES PARA ATUALIZAR CSV =====');
  console.log('Use os nomes das coleções pai do Blender filtradas acima na coluna elementos3D:');
  Object.keys(colecoesPaiBlender).forEach(colecao => {
    console.log(`   ${colecao}`);
  });
  
  // Gerar lista para copiar e colar no CSV
  console.log('📋 ===== LISTA PARA COPIAR NO CSV =====');
  const listaCSV = Object.keys(colecoesPaiBlender).join(',');
  console.log(listaCSV);
  
  // Estatísticas adicionais
  console.log('📊 ===== ESTATÍSTICAS ADICIONAIS =====');
  const tiposObjetos = {};
  todosObjetos.forEach(obj => {
    tiposObjetos[obj.tipo] = (tiposObjetos[obj.tipo] || 0) + 1;
  });
  
  console.log('📊 Tipos de objetos encontrados:');
  Object.keys(tiposObjetos).forEach(tipo => {
    console.log(`   ${tipo}: ${tiposObjetos[tipo]} objetos`);
  });
  
} else {
  console.log('❌ Scene arquitetônica não encontrada!');
  console.log('   Certifique-se de que o modelo 3D foi carregado e a scene está exposta como window.sceneArquitetura');
}

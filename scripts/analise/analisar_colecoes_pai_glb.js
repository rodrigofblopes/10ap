// Script para analisar coleções pai no modelo GLB arquitetônico
// Execute este script no console do navegador após carregar o modelo 3D

console.log('🔍 ===== ANÁLISE DE COLEÇÕES PAI GLB ARQUITETÔNICO =====');

// Verificar se a scene está disponível
if (typeof window !== 'undefined' && window.sceneArquitetura) {
  const scene = window.sceneArquitetura;
  console.log('✅ Scene arquitetônica encontrada:', scene);
  
  // Analisar hierarquia completa
  const colecoesPai = {};
  const elementosPorColecao = {};
  const todosElementos = [];
  
  scene.traverse((child) => {
    if (child.name && child.name.trim() !== '') {
      todosElementos.push(child.name);
      
      // Identificar coleções pai (padrão: X.Y)
      const colecaoPaiMatch = child.name.match(/^(\d+\.\d+)$/);
      if (colecaoPaiMatch) {
        const nomeColecao = child.name;
        colecoesPai[nomeColecao] = child;
        console.log(`📁 COLECÇÃO PAI ENCONTRADA: "${nomeColecao}"`);
      }
      
      // Identificar elementos que pertencem a coleções pai
      // Procurar por padrões como: Parede_básica_Alvenaria_cerâmica_-_15cm_2618265
      if (child.name.includes('Parede_básica_Alvenaria_cerâmica') || 
          child.name.includes('Piso_Laje_revestida') ||
          child.name.includes('Revestimento') ||
          child.name.includes('Forro') ||
          child.name.includes('Esquadria') ||
          child.name.includes('Pintura') ||
          child.name.includes('Instalacao')) {
        
        // Tentar identificar a qual coleção pai pertence
        // Baseado no padrão de nomenclatura
        let colecaoPai = null;
        if (child.name.includes('Parede_básica_Alvenaria_cerâmica')) {
          colecaoPai = '1.1'; // PAREDES
        } else if (child.name.includes('Piso_Laje_revestida')) {
          colecaoPai = '1.2'; // PISO
        } else if (child.name.includes('Revestimento')) {
          colecaoPai = '1.3'; // REVESTIMENTO PAREDES
        } else if (child.name.includes('Forro')) {
          colecaoPai = '1.4'; // FORRO
        } else if (child.name.includes('Esquadria')) {
          colecaoPai = '1.5'; // ESQUADRIAS
        } else if (child.name.includes('Pintura')) {
          colecaoPai = '1.6'; // PINTURA
        } else if (child.name.includes('Instalacao_Hidraulica')) {
          colecaoPai = '1.7'; // INSTALAÇÕES HIDRÁULICAS
        } else if (child.name.includes('Instalacao_Eletrica')) {
          colecaoPai = '1.8'; // INSTALAÇÕES ELÉTRICAS
        } else if (child.name.includes('Instalacao_Sanitaria')) {
          colecaoPai = '1.9'; // INSTALAÇÕES SANITÁRIAS
        } else if (child.name.includes('Instalacao_Gas')) {
          colecaoPai = '1.10'; // INSTALAÇÕES DE GÁS
        } else if (child.name.includes('Servico_Complementar')) {
          colecaoPai = '1.11'; // SERVIÇOS COMPLEMENTARES
        }
        
        if (colecaoPai) {
          if (!elementosPorColecao[colecaoPai]) {
            elementosPorColecao[colecaoPai] = [];
          }
          elementosPorColecao[colecaoPai].push(child.name);
        }
      }
    }
  });
  
  console.log('📊 ===== RESULTADOS DA ANÁLISE =====');
  console.log(`📊 Total de elementos encontrados: ${todosElementos.length}`);
  console.log(`📊 Total de coleções pai encontradas: ${Object.keys(colecoesPai).length}`);
  console.log('📊 Coleções pai:', Object.keys(colecoesPai));
  
  console.log('📊 ===== ELEMENTOS POR COLECÇÃO PAI =====');
  Object.keys(elementosPorColecao).forEach(colecao => {
    console.log(`📁 ${colecao}: ${elementosPorColecao[colecao].length} elementos`);
    console.log(`   Primeiros 5:`, elementosPorColecao[colecao].slice(0, 5));
  });
  
  // Gerar mapeamento para CSV
  console.log('📋 ===== MAPEAMENTO PARA CSV =====');
  const mapeamentoCSV = {};
  Object.keys(elementosPorColecao).forEach(colecao => {
    mapeamentoCSV[colecao] = elementosPorColecao[colecao].join(',');
    console.log(`${colecao}: ${elementosPorColecao[colecao].length} elementos`);
  });
  
  // Expor resultados globalmente
  window.colecoesPaiArquitetura = colecoesPai;
  window.elementosPorColecaoArquitetura = elementosPorColecao;
  window.mapeamentoCSVArquitetura = mapeamentoCSV;
  
  console.log('✅ Resultados expostos globalmente:');
  console.log('   - window.colecoesPaiArquitetura');
  console.log('   - window.elementosPorColecaoArquitetura');
  console.log('   - window.mapeamentoCSVArquitetura');
  
} else {
  console.log('❌ Scene arquitetônica não encontrada!');
  console.log('   Certifique-se de que o modelo 3D foi carregado e a scene está exposta como window.sceneArquitetura');
}
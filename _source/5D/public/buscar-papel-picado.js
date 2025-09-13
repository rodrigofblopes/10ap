console.log('🔍 ===== BUSCA POR PAPEL PICADO =====');

// Função para buscar elementos com material "Papel Picado"
function buscarPapelPicado() {
  console.log('🎨 Procurando por elementos com material "Papel Picado"...');
  
  // Verificar se temos acesso ao modelo 3D
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    console.log('✅ Scene GLB disponível:', scene.name);
    
    let elementosEncontrados = [];
    let totalElementos = 0;
    
    // Traversar toda a scene
    scene.traverse((child) => {
      totalElementos++;
      
      if (child.material) {
        // Verificar se é um array de materiais ou material único
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach((material, index) => {
          // Verificar propriedades do material que podem conter "Papel Picado"
          if (material.name && material.name.toLowerCase().includes('papel picado')) {
            elementosEncontrados.push({
              objeto: child.name,
              materialNome: material.name,
              materialIndex: index,
              tipo: material.type,
              cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
              posicao: `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
            });
            console.log(`🎨 ENCONTRADO: ${child.name} - Material: ${material.name}`);
          }
          
          // Verificar também outras propriedades do material
          const propriedadesTexto = [
            material.userData?.materialName,
            material.userData?.name,
            material.userData?.description,
            material.map?.name,
            material.map?.image?.src
          ];
          
          propriedadesTexto.forEach(prop => {
            if (prop && typeof prop === 'string' && prop.toLowerCase().includes('papel picado')) {
              elementosEncontrados.push({
                objeto: child.name,
                propriedade: prop,
                materialIndex: index,
                tipo: material.type,
                posicao: `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
              });
              console.log(`🎨 ENCONTRADO por propriedade: ${child.name} - ${prop}`);
            }
          });
        });
      }
      
      // Verificar também o nome do objeto
      if (child.name && child.name.toLowerCase().includes('papel picado')) {
        elementosEncontrados.push({
          objeto: child.name,
          tipo: 'nome do objeto',
          posicao: `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
        });
        console.log(`📦 ENCONTRADO por nome: ${child.name}`);
      }
      
      // Verificar userData do objeto
      if (child.userData) {
        Object.entries(child.userData).forEach(([key, value]) => {
          if (value && typeof value === 'string' && value.toLowerCase().includes('papel picado')) {
            elementosEncontrados.push({
              objeto: child.name,
              userData: `${key}: ${value}`,
              posicao: `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
            });
            console.log(`📋 ENCONTRADO em userData: ${child.name} - ${key}: ${value}`);
          }
        });
      }
    });
    
    console.log(`\n📊 ===== RESULTADO DA BUSCA =====`);
    console.log(`📦 Total de objetos analisados: ${totalElementos}`);
    console.log(`🎨 Elementos com "Papel Picado" encontrados: ${elementosEncontrados.length}`);
    
    if (elementosEncontrados.length > 0) {
      console.log('\n📋 ===== DETALHES DOS ELEMENTOS ENCONTRADOS =====');
      elementosEncontrados.forEach((elemento, index) => {
        console.log(`\n${index + 1}. ${elemento.objeto}`);
        if (elemento.materialNome) console.log(`   Material: ${elemento.materialNome}`);
        if (elemento.propriedade) console.log(`   Propriedade: ${elemento.propriedade}`);
        if (elemento.userData) console.log(`   UserData: ${elemento.userData}`);
        if (elemento.tipo) console.log(`   Tipo: ${elemento.tipo}`);
        if (elemento.cor) console.log(`   Cor: ${elemento.cor}`);
        console.log(`   Posição: ${elemento.posicao}`);
      });
      
      // Expor resultados globalmente
      window.papelPicadoResults = elementosEncontrados;
      console.log('\n💾 Resultados salvos em: window.papelPicadoResults');
    } else {
      console.log('\n❌ Nenhum elemento com "Papel Picado" foi encontrado');
      console.log('💡 Possíveis motivos:');
      console.log('   - Material não está nomeado como "Papel Picado"');
      console.log('   - Material está em propriedades não verificadas');
      console.log('   - Elementos não foram carregados ainda');
    }
    
    return elementosEncontrados;
    
  } else {
    console.log('❌ Scene GLB não disponível');
    console.log('💡 Certifique-se de que:');
    console.log('   1. O modelo 3D foi carregado');
    console.log('   2. A página está totalmente carregada');
    console.log('   3. Execute este script no Dashboard 5D');
    return [];
  }
}

// Função para buscar também nos elementos GLB por nome
function buscarNosElementosGLB() {
  console.log('\n🔍 ===== BUSCA NOS ELEMENTOS GLB =====');
  
  if (typeof window !== 'undefined' && window.glbElements) {
    const glbElements = window.glbElements;
    console.log(`📦 Total de elementos GLB: ${glbElements.length}`);
    
    const elementosPapelPicado = glbElements.filter(elemento => 
      elemento.toLowerCase().includes('papel') || 
      elemento.toLowerCase().includes('picado')
    );
    
    console.log(`🎨 Elementos com "papel" ou "picado": ${elementosPapelPicado.length}`);
    
    if (elementosPapelPicado.length > 0) {
      console.log('📋 Lista de elementos encontrados:');
      elementosPapelPicado.forEach((elemento, index) => {
        console.log(`   ${index + 1}. ${elemento}`);
      });
    } else {
      console.log('❌ Nenhum elemento GLB com "papel" ou "picado" no nome');
    }
    
    return elementosPapelPicado;
  } else {
    console.log('❌ Elementos GLB não disponíveis');
    return [];
  }
}

// Função para buscar materiais únicos no modelo
function listarTodosMateriais() {
  console.log('\n🎨 ===== LISTANDO TODOS OS MATERIAIS =====');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    const materiaisUnicos = new Set();
    
    scene.traverse((child) => {
      if (child.material) {
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach(material => {
          if (material.name) {
            materiaisUnicos.add(material.name);
          }
        });
      }
    });
    
    const listaMateriais = Array.from(materiaisUnicos).sort();
    console.log(`📦 Total de materiais únicos: ${listaMateriais.length}`);
    
    console.log('\n📋 Lista de todos os materiais:');
    listaMateriais.forEach((material, index) => {
      console.log(`   ${index + 1}. ${material}`);
    });
    
    // Buscar materiais que possam ser relacionados a papel
    const materiaisPapel = listaMateriais.filter(material =>
      material.toLowerCase().includes('papel') ||
      material.toLowerCase().includes('picado') ||
      material.toLowerCase().includes('paper') ||
      material.toLowerCase().includes('cardboard') ||
      material.toLowerCase().includes('wall') ||
      material.toLowerCase().includes('parede')
    );
    
    if (materiaisPapel.length > 0) {
      console.log('\n🎨 Materiais relacionados a papel/parede:');
      materiaisPapel.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material}`);
      });
    }
    
    window.todosMateriais = listaMateriais;
    window.materiaisPapel = materiaisPapel;
    
    return listaMateriais;
  }
  
  return [];
}

// Executar todas as buscas
console.log('🚀 Iniciando busca por "Papel Picado"...');

const resultadosScene = buscarPapelPicado();
const resultadosGLB = buscarNosElementosGLB();
const todosMateriais = listarTodosMateriais();

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💡 Para mais detalhes, verifique:');
console.log('   - window.papelPicadoResults (elementos encontrados)');
console.log('   - window.todosMateriais (todos os materiais)');
console.log('   - window.materiaisPapel (materiais relacionados a papel)');

// Expor função para chamada manual
window.buscarPapelPicado = buscarPapelPicado;
window.listarTodosMateriais = listarTodosMateriais;

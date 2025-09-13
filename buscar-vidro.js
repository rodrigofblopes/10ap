console.log('🪟 ===== BUSCA POR ELEMENTOS COM VIDRO =====');

// Função para buscar elementos com material vidro
function buscarElementosVidro() {
  console.log('🔍 Procurando por elementos com material vidro...');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    console.log('✅ Scene GLB disponível:', scene.name);
    
    let elementosVidro = [];
    let totalElementos = 0;
    
    // Traversar toda a scene
    scene.traverse((child) => {
      totalElementos++;
      
      if (child.material) {
        // Verificar se é um array de materiais ou material único
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach((material, index) => {
          let isVidro = false;
          let tipoDeteccao = '';
          
          // Verificar propriedades típicas de vidro
          if (material.transparent || material.opacity < 1.0) {
            isVidro = true;
            tipoDeteccao = 'transparência';
          }
          
          // Verificar se o nome do material contém "vidro", "glass", etc.
          if (material.name && material.name.toLowerCase().includes('vidro')) {
            isVidro = true;
            tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + nome` : 'nome do material';
          }
          
          if (material.name && (
            material.name.toLowerCase().includes('glass') ||
            material.name.toLowerCase().includes('cristal') ||
            material.name.toLowerCase().includes('vitro') ||
            material.name.toLowerCase().includes('transparente')
          )) {
            isVidro = true;
            tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + nome` : 'nome do material';
          }
          
          // Verificar se o nome do objeto indica vidro
          if (child.name && (
            child.name.toLowerCase().includes('vidro') ||
            child.name.toLowerCase().includes('glass') ||
            child.name.toLowerCase().includes('janela') ||
            child.name.toLowerCase().includes('porta') ||
            child.name.toLowerCase().includes('esquadria')
          )) {
            // Verificar se tem propriedades típicas de vidro
            if (material.transparent || material.opacity < 0.9 || material.transmission > 0) {
              isVidro = true;
              tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + nome objeto` : 'nome do objeto';
            }
          }
          
          if (isVidro) {
            elementosVidro.push({
              objeto: child.name,
              materialNome: material.name || 'Sem nome',
              materialIndex: index,
              tipo: material.type,
              deteccao: tipoDeteccao,
              propriedades: {
                transparent: material.transparent,
                opacity: material.opacity,
                transmission: material.transmission || 0,
                roughness: material.roughness,
                metalness: material.metalness,
                ior: material.ior || 'N/A',
                thickness: material.thickness || 'N/A',
                envMapIntensity: material.envMapIntensity,
                cor: material.color ? `#${material.color.getHexString()}` : 'N/A'
              },
              posicao: `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
            });
            console.log(`🪟 VIDRO ENCONTRADO: ${child.name} - ${tipoDeteccao}`);
          }
        });
      }
    });
    
    console.log(`\n📊 ===== RESULTADO DA BUSCA =====`);
    console.log(`📦 Total de objetos analisados: ${totalElementos}`);
    console.log(`🪟 Elementos com vidro encontrados: ${elementosVidro.length}`);
    
    if (elementosVidro.length > 0) {
      console.log('\n🪟 ===== DETALHES DOS ELEMENTOS COM VIDRO =====');
      elementosVidro.forEach((elemento, index) => {
        console.log(`\n${index + 1}. ${elemento.objeto}`);
        console.log(`   Material: ${elemento.materialNome}`);
        console.log(`   Tipo: ${elemento.tipo}`);
        console.log(`   Detectado por: ${elemento.deteccao}`);
        console.log(`   Propriedades:`);
        console.log(`     - Transparente: ${elemento.propriedades.transparent}`);
        console.log(`     - Opacidade: ${elemento.propriedades.opacity}`);
        console.log(`     - Transmissão: ${elemento.propriedades.transmission}`);
        console.log(`     - Roughness: ${elemento.propriedades.roughness}`);
        console.log(`     - Metalness: ${elemento.propriedades.metalness}`);
        console.log(`     - IOR: ${elemento.propriedades.ior}`);
        console.log(`     - Thickness: ${elemento.propriedades.thickness}`);
        console.log(`     - Env Map Intensity: ${elemento.propriedades.envMapIntensity}`);
        console.log(`     - Cor: ${elemento.propriedades.cor}`);
        console.log(`   Posição: ${elemento.posicao}`);
      });
      
      // Agrupar por tipo de detecção
      const grupos = {};
      elementosVidro.forEach(el => {
        if (!grupos[el.deteccao]) grupos[el.deteccao] = [];
        grupos[el.deteccao].push(el);
      });
      
      console.log('\n📋 ===== AGRUPAMENTO POR TIPO DE DETECÇÃO =====');
      Object.entries(grupos).forEach(([tipo, elementos]) => {
        console.log(`\n🏷️ ${tipo.toUpperCase()}: ${elementos.length} elementos`);
        elementos.forEach((el, i) => {
          console.log(`   ${i + 1}. ${el.objeto} (${el.materialNome})`);
        });
      });
      
      // Expor resultados globalmente
      window.elementosVidro = elementosVidro;
      window.gruposVidro = grupos;
      console.log('\n💾 Resultados salvos em: window.elementosVidro e window.gruposVidro');
    } else {
      console.log('\n❌ Nenhum elemento com vidro foi encontrado');
      console.log('💡 Possíveis motivos:');
      console.log('   - Materiais não têm propriedades de transparência');
      console.log('   - Materiais não estão nomeados como vidro');
      console.log('   - Elementos não foram carregados ainda');
    }
    
    return elementosVidro;
    
  } else {
    console.log('❌ Scene GLB não disponível');
    console.log('💡 Certifique-se de que:');
    console.log('   1. O modelo 3D foi carregado');
    console.log('   2. A página está totalmente carregada');
    console.log('   3. Execute este script no Dashboard 5D');
    return [];
  }
}

// Função para buscar nos elementos GLB por nome
function buscarVidroNosElementosGLB() {
  console.log('\n🔍 ===== BUSCA NOS ELEMENTOS GLB =====');
  
  if (typeof window !== 'undefined' && window.glbElements) {
    const glbElements = window.glbElements;
    console.log(`📦 Total de elementos GLB: ${glbElements.length}`);
    
    const elementosVidro = glbElements.filter(elemento => {
      const nome = elemento.toLowerCase();
      return nome.includes('vidro') || 
             nome.includes('glass') || 
             nome.includes('cristal') ||
             nome.includes('transparente') ||
             nome.includes('janela') ||
             nome.includes('porta') ||
             nome.includes('esquadria');
    });
    
    console.log(`🪟 Elementos com possível vidro: ${elementosVidro.length}`);
    
    if (elementosVidro.length > 0) {
      console.log('📋 Lista de elementos encontrados:');
      
      // Agrupar por tipo
      const janelas = elementosVidro.filter(el => el.toLowerCase().includes('janela'));
      const portas = elementosVidro.filter(el => el.toLowerCase().includes('porta'));
      const esquadrias = elementosVidro.filter(el => el.toLowerCase().includes('esquadria'));
      const vidros = elementosVidro.filter(el => 
        el.toLowerCase().includes('vidro') || 
        el.toLowerCase().includes('glass') || 
        el.toLowerCase().includes('cristal')
      );
      
      if (janelas.length > 0) {
        console.log(`\n🪟 JANELAS (${janelas.length}):`);
        janelas.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      if (portas.length > 0) {
        console.log(`\n🚪 PORTAS (${portas.length}):`);
        portas.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      if (esquadrias.length > 0) {
        console.log(`\n🏠 ESQUADRIAS (${esquadrias.length}):`);
        esquadrias.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      if (vidros.length > 0) {
        console.log(`\n🪟 VIDROS DIRETOS (${vidros.length}):`);
        vidros.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      window.elementosVidroGLB = {
        todos: elementosVidro,
        janelas,
        portas,
        esquadrias,
        vidros
      };
      
    } else {
      console.log('❌ Nenhum elemento GLB relacionado a vidro encontrado');
    }
    
    return elementosVidro;
  } else {
    console.log('❌ Elementos GLB não disponíveis');
    return [];
  }
}

// Função para analisar materiais transparentes
function analisarMateriaisTransparentes() {
  console.log('\n🔍 ===== ANÁLISE DE MATERIAIS TRANSPARENTES =====');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    const materiaisTransparentes = [];
    const materiaisUnicos = new Map();
    
    scene.traverse((child) => {
      if (child.material) {
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach(material => {
          const key = material.uuid;
          
          if (!materiaisUnicos.has(key)) {
            const isTransparente = material.transparent || 
                                 material.opacity < 1.0 || 
                                 (material.transmission && material.transmission > 0);
            
            if (isTransparente) {
              materiaisTransparentes.push({
                nome: material.name || 'Sem nome',
                tipo: material.type,
                transparent: material.transparent,
                opacity: material.opacity,
                transmission: material.transmission || 0,
                roughness: material.roughness,
                metalness: material.metalness,
                ior: material.ior || 'N/A',
                cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
                objetos: []
              });
            }
            
            materiaisUnicos.set(key, {
              material,
              isTransparente,
              objetos: []
            });
          }
          
          // Adicionar objeto à lista
          materiaisUnicos.get(key).objetos.push(child.name);
        });
      }
    });
    
    console.log(`🔍 Materiais transparentes encontrados: ${materiaisTransparentes.length}`);
    
    if (materiaisTransparentes.length > 0) {
      materiaisTransparentes.forEach((mat, i) => {
        console.log(`\n${i + 1}. ${mat.nome}`);
        console.log(`   Tipo: ${mat.tipo}`);
        console.log(`   Transparent: ${mat.transparent}`);
        console.log(`   Opacity: ${mat.opacity}`);
        console.log(`   Transmission: ${mat.transmission}`);
        console.log(`   Roughness: ${mat.roughness}`);
        console.log(`   Metalness: ${mat.metalness}`);
        console.log(`   IOR: ${mat.ior}`);
        console.log(`   Cor: ${mat.cor}`);
      });
      
      window.materiaisTransparentes = materiaisTransparentes;
    }
    
    return materiaisTransparentes;
  }
  
  return [];
}

// Executar todas as buscas
console.log('🚀 Iniciando busca por elementos com vidro...');

const resultadosScene = buscarElementosVidro();
const resultadosGLB = buscarVidroNosElementosGLB();
const materiaisTransparentes = analisarMateriaisTransparentes();

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💡 Para mais detalhes, verifique:');
console.log('   - window.elementosVidro (elementos da scene)');
console.log('   - window.elementosVidroGLB (elementos GLB)');
console.log('   - window.materiaisTransparentes (materiais transparentes)');
console.log('   - window.gruposVidro (agrupamento por detecção)');

// Expor funções para chamada manual
window.buscarElementosVidro = buscarElementosVidro;
window.buscarVidroNosElementosGLB = buscarVidroNosElementosGLB;
window.analisarMateriaisTransparentes = analisarMateriaisTransparentes;

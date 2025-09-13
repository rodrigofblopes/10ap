console.log('🏠 ===== BUSCA POR ELEMENTOS COM FIBROCIMENTO =====');

// Função para buscar elementos com material fibrocimento
function buscarElementosFibrocimento() {
  console.log('🔍 Procurando por elementos com material fibrocimento...');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    console.log('✅ Scene GLB disponível:', scene.name);
    
    let elementosFibrocimento = [];
    let totalElementos = 0;
    
    // Traversar toda a scene
    scene.traverse((child) => {
      totalElementos++;
      
      if (child.material) {
        // Verificar se é um array de materiais ou material único
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach((material, index) => {
          let isFibrocimento = false;
          let tipoDeteccao = '';
          
          // Verificar se o nome do material contém "fibrocimento", "fiber", "cement", etc.
          if (material.name && (
            material.name.toLowerCase().includes('fibrocimento') ||
            material.name.toLowerCase().includes('fiber') ||
            material.name.toLowerCase().includes('cement') ||
            material.name.toLowerCase().includes('amianto') ||
            material.name.toLowerCase().includes('telha') ||
            material.name.toLowerCase().includes('tile')
          )) {
            isFibrocimento = true;
            tipoDeteccao = 'nome do material';
          }
          
          // Verificar se o nome do objeto indica fibrocimento/telha
          if (child.name && (
            child.name.toLowerCase().includes('fibrocimento') ||
            child.name.toLowerCase().includes('fiber') ||
            child.name.toLowerCase().includes('cement') ||
            child.name.toLowerCase().includes('telha') ||
            child.name.toLowerCase().includes('telhado') ||
            child.name.toLowerCase().includes('roof') ||
            child.name.toLowerCase().includes('tile') ||
            child.name.toLowerCase().includes('2.6_') // Elemento de telhado da planilha
          )) {
            isFibrocimento = true;
            tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + nome objeto` : 'nome do objeto';
          }
          
          // Verificar userData do objeto
          if (child.userData) {
            Object.entries(child.userData).forEach(([key, value]) => {
              if (value && typeof value === 'string' && (
                value.toLowerCase().includes('fibrocimento') ||
                value.toLowerCase().includes('fiber') ||
                value.toLowerCase().includes('cement') ||
                value.toLowerCase().includes('telha')
              )) {
                isFibrocimento = true;
                tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + userData` : 'userData';
              }
            });
          }
          
          if (isFibrocimento) {
            elementosFibrocimento.push({
              objeto: child.name,
              materialNome: material.name || 'Sem nome',
              materialIndex: index,
              tipo: material.type,
              deteccao: tipoDeteccao,
              propriedades: {
                cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
                roughness: material.roughness,
                metalness: material.metalness,
                envMapIntensity: material.envMapIntensity,
                transparent: material.transparent,
                opacity: material.opacity,
                emissive: material.emissive ? `#${material.emissive.getHexString()}` : 'N/A',
                emissiveIntensity: material.emissiveIntensity
              },
              posicao: `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
            });
            console.log(`🏠 FIBROCIMENTO ENCONTRADO: ${child.name} - ${tipoDeteccao}`);
          }
        });
      }
    });
    
    console.log(`\n📊 ===== RESULTADO DA BUSCA =====`);
    console.log(`📦 Total de objetos analisados: ${totalElementos}`);
    console.log(`🏠 Elementos com fibrocimento encontrados: ${elementosFibrocimento.length}`);
    
    if (elementosFibrocimento.length > 0) {
      console.log('\n🏠 ===== DETALHES DOS ELEMENTOS COM FIBROCIMENTO =====');
      elementosFibrocimento.forEach((elemento, index) => {
        console.log(`\n${index + 1}. ${elemento.objeto}`);
        console.log(`   Material: ${elemento.materialNome}`);
        console.log(`   Tipo: ${elemento.tipo}`);
        console.log(`   Detectado por: ${elemento.deteccao}`);
        console.log(`   Propriedades:`);
        console.log(`     - Cor: ${elemento.propriedades.cor}`);
        console.log(`     - Roughness: ${elemento.propriedades.roughness}`);
        console.log(`     - Metalness: ${elemento.propriedades.metalness}`);
        console.log(`     - Env Map Intensity: ${elemento.propriedades.envMapIntensity}`);
        console.log(`     - Transparente: ${elemento.propriedades.transparent}`);
        console.log(`     - Opacidade: ${elemento.propriedades.opacity}`);
        console.log(`   Posição: ${elemento.posicao}`);
      });
      
      // Agrupar por tipo de detecção
      const grupos = {};
      elementosFibrocimento.forEach(el => {
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
      window.elementosFibrocimento = elementosFibrocimento;
      window.gruposFibrocimento = grupos;
      console.log('\n💾 Resultados salvos em: window.elementosFibrocimento e window.gruposFibrocimento');
    } else {
      console.log('\n❌ Nenhum elemento com fibrocimento foi encontrado');
      console.log('💡 Possíveis motivos:');
      console.log('   - Materiais não estão nomeados como fibrocimento');
      console.log('   - Elementos de telhado não foram identificados');
      console.log('   - Elementos não foram carregados ainda');
    }
    
    return elementosFibrocimento;
    
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
function buscarFibrocimentoNosElementosGLB() {
  console.log('\n🔍 ===== BUSCA NOS ELEMENTOS GLB =====');
  
  if (typeof window !== 'undefined' && window.glbElements) {
    const glbElements = window.glbElements;
    console.log(`📦 Total de elementos GLB: ${glbElements.length}`);
    
    const elementosFibrocimento = glbElements.filter(elemento => {
      const nome = elemento.toLowerCase();
      return nome.includes('fibrocimento') || 
             nome.includes('fiber') || 
             nome.includes('cement') ||
             nome.includes('telha') ||
             nome.includes('telhado') ||
             nome.includes('roof') ||
             nome.includes('tile') ||
             nome.includes('2.6_'); // Elemento específico de telhado
    });
    
    console.log(`🏠 Elementos com possível fibrocimento: ${elementosFibrocimento.length}`);
    
    if (elementosFibrocimento.length > 0) {
      console.log('📋 Lista de elementos encontrados:');
      
      // Agrupar por tipo
      const telhados = elementosFibrocimento.filter(el => 
        el.toLowerCase().includes('telhado') || 
        el.toLowerCase().includes('roof') ||
        el.toLowerCase().includes('2.6_')
      );
      const telhas = elementosFibrocimento.filter(el => 
        el.toLowerCase().includes('telha') || 
        el.toLowerCase().includes('tile')
      );
      const fibrocimentos = elementosFibrocimento.filter(el => 
        el.toLowerCase().includes('fibrocimento') || 
        el.toLowerCase().includes('fiber') || 
        el.toLowerCase().includes('cement')
      );
      
      if (telhados.length > 0) {
        console.log(`\n🏠 TELHADOS (${telhados.length}):`);
        telhados.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      if (telhas.length > 0) {
        console.log(`\n🏠 TELHAS (${telhas.length}):`);
        telhas.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      if (fibrocimentos.length > 0) {
        console.log(`\n🏠 FIBROCIMENTO DIRETO (${fibrocimentos.length}):`);
        fibrocimentos.forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
      }
      
      window.elementosFibrocimentoGLB = {
        todos: elementosFibrocimento,
        telhados,
        telhas,
        fibrocimentos
      };
      
    } else {
      console.log('❌ Nenhum elemento GLB relacionado a fibrocimento encontrado');
    }
    
    return elementosFibrocimento;
  } else {
    console.log('❌ Elementos GLB não disponíveis');
    return [];
  }
}

// Função para verificar elementos específicos da planilha
function verificarElementosTelhado() {
  console.log('\n📋 ===== VERIFICANDO ELEMENTOS DE TELHADO DA PLANILHA =====');
  
  // Elementos de telhado conforme a planilha (2.6 TELHADO)
  const elementosTelhado = [
    '2.6 Telhado.001', '2.6 Telhado.002', '2.6 Telhado.003', '2.6 Telhado.004',
    '2.6 Telhado.005', '2.6 Telhado.006', '2.6 Telhado.007', '2.6 Telhado.008',
    '2.6 Telhado.009', '2.6 Telhado.010', '2.6 Telhado.011', '2.6 Telhado.012'
  ];
  
  console.log(`🎯 Procurando por ${elementosTelhado.length} elementos de telhado específicos...`);
  
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let encontrados = 0;
  let detalhes = [];
  
  elementosTelhado.forEach(nomeTelhado => {
    let encontrou = false;
    
    scene.traverse((child) => {
      if (child.name === nomeTelhado) {
        encontrou = true;
        encontrados++;
        
        const detalhe = {
          nome: nomeTelhado,
          posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`,
          material: null
        };
        
        if (child.material) {
          const material = Array.isArray(child.material) ? child.material[0] : child.material;
          detalhe.material = {
            nome: material.name || 'Sem nome',
            tipo: material.type,
            cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
            roughness: material.roughness
          };
        }
        
        detalhes.push(detalhe);
        console.log(`✅ ${nomeTelhado} encontrado`);
      }
    });
    
    if (!encontrou) {
      console.log(`❌ ${nomeTelhado} não encontrado`);
    }
  });
  
  console.log(`\n📊 Resumo dos elementos de telhado:`);
  console.log(`   Total esperados: ${elementosTelhado.length}`);
  console.log(`   Encontrados: ${encontrados}`);
  
  if (detalhes.length > 0) {
    console.log('\n📋 Detalhes dos elementos encontrados:');
    detalhes.forEach((detalhe, i) => {
      console.log(`${i + 1}. ${detalhe.nome}`);
      console.log(`   Posição: ${detalhe.posicao}`);
      if (detalhe.material) {
        console.log(`   Material: ${detalhe.material.nome} (${detalhe.material.tipo})`);
        console.log(`   Cor: ${detalhe.material.cor}`);
        console.log(`   Roughness: ${detalhe.material.roughness}`);
      }
    });
  }
  
  window.elementosTelhadoPlanilha = detalhes;
  
  return {
    esperados: elementosTelhado.length,
    encontrados,
    detalhes
  };
}

// Executar todas as buscas
console.log('🚀 Iniciando busca por elementos com fibrocimento...');

const resultadosScene = buscarElementosFibrocimento();
const resultadosGLB = buscarFibrocimentoNosElementosGLB();
const elementosTelhado = verificarElementosTelhado();

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💡 Para mais detalhes, verifique:');
console.log('   - window.elementosFibrocimento (elementos da scene)');
console.log('   - window.elementosFibrocimentoGLB (elementos GLB)');
console.log('   - window.elementosTelhadoPlanilha (elementos específicos da planilha)');
console.log('   - window.gruposFibrocimento (agrupamento por detecção)');

// Expor funções para chamada manual
window.buscarElementosFibrocimento = buscarElementosFibrocimento;
window.buscarFibrocimentoNosElementosGLB = buscarFibrocimentoNosElementosGLB;
window.verificarElementosTelhado = verificarElementosTelhado;

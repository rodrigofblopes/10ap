console.log('🏗️ ===== BUSCA POR ELEMENTOS COM CONCRETO =====');

// Função para buscar elementos com material concreto
function buscarElementosConcreto() {
  console.log('🔍 Procurando por elementos com material concreto...');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    console.log('✅ Scene GLB disponível:', scene.name);
    
    let elementosConcreto = [];
    let totalElementos = 0;
    
    // Traversar toda a scene
    scene.traverse((child) => {
      totalElementos++;
      
      if (child.material) {
        // Verificar se é um array de materiais ou material único
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach((material, index) => {
          let isConcreto = false;
          let tipoDeteccao = '';
          
          // Verificar se o nome do material contém "concreto", "concrete", etc.
          if (material.name && (
            material.name.toLowerCase().includes('concreto') ||
            material.name.toLowerCase().includes('concrete') ||
            material.name.toLowerCase().includes('cement') ||
            material.name.toLowerCase().includes('cimento') ||
            material.name.toLowerCase().includes('estrutural') ||
            material.name.toLowerCase().includes('structural')
          )) {
            isConcreto = true;
            tipoDeteccao = 'nome do material';
          }
          
          // Verificar se o nome do objeto indica concreto/estrutura
          if (child.name && (
            child.name.toLowerCase().includes('concreto') ||
            child.name.toLowerCase().includes('concrete') ||
            child.name.toLowerCase().includes('parede') ||
            child.name.toLowerCase().includes('wall') ||
            child.name.toLowerCase().includes('pilar') ||
            child.name.toLowerCase().includes('viga') ||
            child.name.toLowerCase().includes('laje') ||
            child.name.toLowerCase().includes('fundacao') ||
            child.name.toLowerCase().includes('foundation') ||
            child.name.toLowerCase().includes('estrutural') ||
            child.name.toLowerCase().includes('1.1_') || // Paredes térreo
            child.name.toLowerCase().includes('2.1_') || // Paredes superior
            child.name.toLowerCase().includes('3.') ||   // Elementos estruturais fundação
            child.name.toLowerCase().includes('4.') ||   // Elementos estruturais térreo
            child.name.toLowerCase().includes('5.')      // Elementos estruturais superior
          )) {
            isConcreto = true;
            tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + nome objeto` : 'nome do objeto';
          }
          
          // Verificar userData do objeto
          if (child.userData) {
            Object.entries(child.userData).forEach(([key, value]) => {
              if (value && typeof value === 'string' && (
                value.toLowerCase().includes('concreto') ||
                value.toLowerCase().includes('concrete') ||
                value.toLowerCase().includes('estrutural') ||
                value.toLowerCase().includes('structural')
              )) {
                isConcreto = true;
                tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + userData` : 'userData';
              }
            });
          }
          
          if (isConcreto) {
            elementosConcreto.push({
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
            console.log(`🏗️ CONCRETO ENCONTRADO: ${child.name} - ${tipoDeteccao}`);
          }
        });
      }
    });
    
    console.log(`\n📊 ===== RESULTADO DA BUSCA =====`);
    console.log(`📦 Total de objetos analisados: ${totalElementos}`);
    console.log(`🏗️ Elementos com concreto encontrados: ${elementosConcreto.length}`);
    
    if (elementosConcreto.length > 0) {
      console.log('\n🏗️ ===== DETALHES DOS ELEMENTOS COM CONCRETO =====');
      elementosConcreto.forEach((elemento, index) => {
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
      elementosConcreto.forEach(el => {
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
      window.elementosConcreto = elementosConcreto;
      window.gruposConcreto = grupos;
      console.log('\n💾 Resultados salvos em: window.elementosConcreto e window.gruposConcreto');
    } else {
      console.log('\n❌ Nenhum elemento com concreto foi encontrado');
      console.log('💡 Possíveis motivos:');
      console.log('   - Materiais não estão nomeados como concreto');
      console.log('   - Elementos estruturais não foram identificados');
      console.log('   - Elementos não foram carregados ainda');
    }
    
    return elementosConcreto;
    
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
function buscarConcretoNosElementosGLB() {
  console.log('\n🔍 ===== BUSCA NOS ELEMENTOS GLB =====');
  
  if (typeof window !== 'undefined' && window.glbElements) {
    const glbElements = window.glbElements;
    console.log(`📦 Total de elementos GLB: ${glbElements.length}`);
    
    const elementosConcreto = glbElements.filter(elemento => {
      const nome = elemento.toLowerCase();
      return nome.includes('concreto') || 
             nome.includes('concrete') || 
             nome.includes('parede') ||
             nome.includes('wall') ||
             nome.includes('pilar') ||
             nome.includes('viga') ||
             nome.includes('laje') ||
             nome.includes('fundacao') ||
             nome.includes('foundation') ||
             nome.includes('estrutural') ||
             nome.includes('1.1_') || // Paredes térreo
             nome.includes('2.1_') || // Paredes superior
             nome.includes('3.') ||   // Estruturais fundação
             nome.includes('4.') ||   // Estruturais térreo
             nome.includes('5.');     // Estruturais superior
    });
    
    console.log(`🏗️ Elementos com possível concreto: ${elementosConcreto.length}`);
    
    if (elementosConcreto.length > 0) {
      console.log('📋 Lista de elementos encontrados:');
      
      // Agrupar por tipo
      const paredes = elementosConcreto.filter(el => 
        el.toLowerCase().includes('parede') || 
        el.toLowerCase().includes('wall') ||
        el.toLowerCase().includes('1.1_') ||
        el.toLowerCase().includes('2.1_')
      );
      const pilares = elementosConcreto.filter(el => 
        el.toLowerCase().includes('pilar') ||
        el.includes('3.2_') || el.includes('4.2_') || el.includes('5.2_')
      );
      const vigas = elementosConcreto.filter(el => 
        el.toLowerCase().includes('viga') ||
        el.includes('3.1_') || el.includes('4.1_') || el.includes('5.1_')
      );
      const lajes = elementosConcreto.filter(el => 
        el.toLowerCase().includes('laje') ||
        el.includes('4.3_') || el.includes('5.3_')
      );
      const fundacoes = elementosConcreto.filter(el => 
        el.toLowerCase().includes('fundacao') || 
        el.toLowerCase().includes('foundation') ||
        el.includes('3.3_')
      );
      
      if (paredes.length > 0) {
        console.log(`\n🧱 PAREDES DE CONCRETO (${paredes.length}):`);
        paredes.slice(0, 10).forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
        if (paredes.length > 10) console.log(`   ... e mais ${paredes.length - 10}`);
      }
      
      if (pilares.length > 0) {
        console.log(`\n🏗️ PILARES (${pilares.length}):`);
        pilares.slice(0, 8).forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
        if (pilares.length > 8) console.log(`   ... e mais ${pilares.length - 8}`);
      }
      
      if (vigas.length > 0) {
        console.log(`\n🏗️ VIGAS (${vigas.length}):`);
        vigas.slice(0, 8).forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
        if (vigas.length > 8) console.log(`   ... e mais ${vigas.length - 8}`);
      }
      
      if (lajes.length > 0) {
        console.log(`\n🏗️ LAJES (${lajes.length}):`);
        lajes.slice(0, 8).forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
        if (lajes.length > 8) console.log(`   ... e mais ${lajes.length - 8}`);
      }
      
      if (fundacoes.length > 0) {
        console.log(`\n🏗️ FUNDAÇÕES (${fundacoes.length}):`);
        fundacoes.slice(0, 8).forEach((elemento, index) => {
          console.log(`   ${index + 1}. ${elemento}`);
        });
        if (fundacoes.length > 8) console.log(`   ... e mais ${fundacoes.length - 8}`);
      }
      
      window.elementosConcretoGLB = {
        todos: elementosConcreto,
        paredes,
        pilares,
        vigas,
        lajes,
        fundacoes
      };
      
    } else {
      console.log('❌ Nenhum elemento GLB relacionado a concreto encontrado');
    }
    
    return elementosConcreto;
  } else {
    console.log('❌ Elementos GLB não disponíveis');
    return [];
  }
}

// Função para verificar elementos estruturais específicos da planilha
function verificarElementosEstruturais() {
  console.log('\n📋 ===== VERIFICANDO ELEMENTOS ESTRUTURAIS DA PLANILHA =====');
  
  // Elementos estruturais conforme a planilha
  const categoriasEstruturais = {
    'Paredes Térreo': ['1.1 Paredes Térreo.001', '1.1 Paredes Térreo.002', '1.1 Paredes Térreo.003'],
    'Paredes Superior': ['2.1 Paredes Superior.001', '2.1 Paredes Superior.002', '2.1 Paredes Superior.003'],
    'Vigas Fundação': ['3.1 Vigas.001', '3.1 Vigas.002', '3.1 Vigas.003'],
    'Pilares Fundação': ['3.2 Pilares.001', '3.2 Pilares.002', '3.2 Pilares.003'],
    'Fundações': ['3.3 Fundações.001', '3.3 Fundações.002', '3.3 Fundações.003'],
    'Vigas Térreo': ['4.1 Vigas.001', '4.1 Vigas.002', '4.1 Vigas.003'],
    'Pilares Térreo': ['4.2 Pilares.001', '4.2 Pilares.002', '4.2 Pilares.003'],
    'Lajes': ['5.3 Lajes.001', '5.3 Lajes.002', '5.3 Lajes.003']
  };
  
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let resumo = {};
  
  Object.entries(categoriasEstruturais).forEach(([categoria, elementos]) => {
    console.log(`\n🏷️ ${categoria}:`);
    let encontrados = 0;
    let detalhes = [];
    
    elementos.forEach(nomeElemento => {
      let encontrou = false;
      
      scene.traverse((child) => {
        if (child.name.includes(nomeElemento.split('.')[0])) {
          encontrou = true;
          encontrados++;
          
          const detalhe = {
            nome: child.name,
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
        }
      });
      
      if (encontrou) {
        console.log(`   ✅ ${nomeElemento} (encontrado)`);
      } else {
        console.log(`   ❌ ${nomeElemento} (não encontrado)`);
      }
    });
    
    resumo[categoria] = {
      esperados: elementos.length,
      encontrados,
      detalhes
    };
  });
  
  console.log(`\n📊 Resumo geral dos elementos estruturais:`);
  Object.entries(resumo).forEach(([categoria, dados]) => {
    console.log(`   ${categoria}: ${dados.encontrados}/${dados.esperados} encontrados`);
  });
  
  window.elementosEstruturaisPlanilha = resumo;
  
  return resumo;
}

// Executar todas as buscas
console.log('🚀 Iniciando busca por elementos com concreto...');

const resultadosScene = buscarElementosConcreto();
const resultadosGLB = buscarConcretoNosElementosGLB();
const elementosEstruturais = verificarElementosEstruturais();

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💡 Para mais detalhes, verifique:');
console.log('   - window.elementosConcreto (elementos da scene)');
console.log('   - window.elementosConcretoGLB (elementos GLB por categoria)');
console.log('   - window.elementosEstruturaisPlanilha (elementos específicos da planilha)');
console.log('   - window.gruposConcreto (agrupamento por detecção)');

// Expor funções para chamada manual
window.buscarElementosConcreto = buscarElementosConcreto;
window.buscarConcretoNosElementosGLB = buscarConcretoNosElementosGLB;
window.verificarElementosEstruturais = verificarElementosEstruturais;

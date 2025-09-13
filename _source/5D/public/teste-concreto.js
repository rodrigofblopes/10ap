// ===== TESTE DA TEXTURA CONCRETO =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🏗️ ===== TESTE DA TEXTURA CONCRETO =====');

function testarTexturaConcreto() {
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let elementosConcreto = [];
  let totalElementos = 0;
  
  console.log('🔍 Analisando elementos com textura de concreto...');
  
  scene.traverse((child) => {
    totalElementos++;
    
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach((material, index) => {
        // Verificar se é o material de concreto (características específicas)
        const isConcreto = material.map && 
                          material.normalMap &&
                          material.roughness >= 0.3 && 
                          material.metalness === 0 && 
                          material.envMapIntensity <= 0.5;
        
        if (isConcreto) {
          elementosConcreto.push({
            nome: child.name,
            posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`,
            material: {
              tipo: material.type,
              cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
              roughness: material.roughness,
              metalness: material.metalness,
              envMapIntensity: material.envMapIntensity,
              temTextura: !!material.map,
              temNormalMap: !!material.normalMap,
              normalScale: material.normalScale ? `(${material.normalScale.x}, ${material.normalScale.y})` : 'N/A',
              emissive: material.emissive ? `#${material.emissive.getHexString()}` : 'N/A',
              emissiveIntensity: material.emissiveIntensity,
              opacity: material.opacity
            }
          });
        }
        
        // Verificar também elementos estruturais especificamente
        const nome = child.name.toLowerCase();
        if (nome.includes('parede') || nome.includes('pilar') || nome.includes('viga') ||
            nome.includes('laje') || nome.includes('fundacao') ||
            nome.includes('1.1_') || nome.includes('2.1_') ||
            nome.includes('3.') || nome.includes('4.') || nome.includes('5.')) {
          console.log(`🏗️ Elemento estrutural encontrado: ${child.name}`);
          console.log(`   Material tipo: ${material.type}`);
          console.log(`   Roughness: ${material.roughness}`);
          console.log(`   Metalness: ${material.metalness}`);
          console.log(`   Env Map Intensity: ${material.envMapIntensity}`);
          console.log(`   Cor: ${material.color ? '#' + material.color.getHexString() : 'N/A'}`);
          console.log(`   Tem textura: ${!!material.map}`);
          console.log(`   Tem normal map: ${!!material.normalMap}`);
          if (material.normalScale) {
            console.log(`   Normal scale: (${material.normalScale.x}, ${material.normalScale.y})`);
          }
        }
      });
    }
  });
  
  console.log(`\n📊 ===== RESULTADOS =====`);
  console.log(`📦 Total de elementos analisados: ${totalElementos}`);
  console.log(`🏗️ Elementos com textura concreto: ${elementosConcreto.length}`);
  
  if (elementosConcreto.length > 0) {
    console.log('\n🏗️ ===== ELEMENTOS COM CONCRETO =====');
    elementosConcreto.forEach((elemento, i) => {
      console.log(`\n${i + 1}. ${elemento.nome}`);
      console.log(`   Posição: ${elemento.posicao}`);
      console.log(`   ===== Propriedades do Material =====`);
      console.log(`   Tipo: ${elemento.material.tipo}`);
      console.log(`   Cor: ${elemento.material.cor}`);
      console.log(`   Roughness: ${elemento.material.roughness}`);
      console.log(`   Metalness: ${elemento.material.metalness}`);
      console.log(`   Env Map Intensity: ${elemento.material.envMapIntensity}`);
      console.log(`   Normal Scale: ${elemento.material.normalScale}`);
      console.log(`   Emissive: ${elemento.material.emissive}`);
      console.log(`   Emissive Intensity: ${elemento.material.emissiveIntensity}`);
      console.log(`   Opacity: ${elemento.material.opacity}`);
      console.log(`   Textura seamless: ${elemento.material.temTextura ? '✅' : '❌'}`);
      console.log(`   Normal Map: ${elemento.material.temNormalMap ? '✅' : '❌'}`);
    });
    
    window.elementosConcreto = elementosConcreto;
    console.log('\n💾 Resultados salvos em: window.elementosConcreto');
  } else {
    console.log('\n❌ Nenhum elemento com textura concreto encontrado');
    console.log('💡 Verifique se:');
    console.log('   - O modelo foi carregado completamente');
    console.log('   - Os elementos estruturais existem no modelo');
    console.log('   - Os materiais foram aplicados corretamente');
  }
  
  return elementosConcreto;
}

// Função para verificar especificamente elementos estruturais da planilha
function verificarEstruturaisPlanilha() {
  console.log('\n🔍 ===== VERIFICANDO ESTRUTURAIS DA PLANILHA =====');
  
  const categoriasEstruturais = {
    'Paredes Térreo': ['1.1 Paredes Térreo'],
    'Paredes Superior': ['2.1 Paredes Pav. Superior'],
    'Vigas Fundação': ['3.1 Vigas'],
    'Pilares Fundação': ['3.2 Pilares'],
    'Fundações': ['3.3 Fundações'],
    'Vigas Térreo': ['4.1 Vigas'],
    'Pilares Térreo': ['4.2 Pilares'],
    'Lajes Térreo': ['4.3 Lajes'],
    'Vigas Superior': ['5.1 Vigas'],
    'Pilares Superior': ['5.2 Pilares'],
    'Lajes Superior': ['5.3 Lajes']
  };
  
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let resumoGeral = {};
  let totalEncontrados = 0;
  let totalComConcreto = 0;
  
  Object.entries(categoriasEstruturais).forEach(([categoria, prefixos]) => {
    console.log(`\n🏷️ ${categoria}:`);
    let encontrados = 0;
    let comConcreto = 0;
    let exemplos = [];
    
    scene.traverse((child) => {
      prefixos.forEach(prefixo => {
        if (child.name.includes(prefixo)) {
          encontrados++;
          
          if (child.material) {
            const material = Array.isArray(child.material) ? child.material[0] : child.material;
            if (material.map && material.normalMap && material.roughness >= 0.3) {
              comConcreto++;
              totalComConcreto++;
            }
          }
          
          if (exemplos.length < 3) {
            exemplos.push(child.name);
          }
        }
      });
    });
    
    totalEncontrados += encontrados;
    resumoGeral[categoria] = { encontrados, comConcreto, exemplos };
    
    console.log(`   Encontrados: ${encontrados}`);
    console.log(`   Com textura concreto: ${comConcreto}`);
    if (exemplos.length > 0) {
      console.log(`   Exemplos: ${exemplos.join(', ')}`);
    }
  });
  
  console.log(`\n📊 Resumo geral:`);
  console.log(`   Total de elementos estruturais: ${totalEncontrados}`);
  console.log(`   Com textura de concreto: ${totalComConcreto}`);
  
  const percentual = totalEncontrados > 0 ? (totalComConcreto / totalEncontrados * 100).toFixed(1) : '0';
  console.log(`   Percentual com concreto: ${percentual}%`);
  
  window.resumoEstruturais = resumoGeral;
  
  return {
    totalEncontrados,
    totalComConcreto,
    percentual,
    detalhes: resumoGeral
  };
}

// Função para comparar propriedades ideais de concreto
function compararPropriedadesConcreto() {
  console.log('\n📊 ===== PROPRIEDADES IDEAIS CONCRETO =====');
  
  const propriedadesIdeais = {
    'Paredes': {
      cor: '#7A7A7A (cinza médio)',
      roughness: '0.85 (rugoso fosco)',
      normalScale: '(0.4, 0.4)',
      envMapIntensity: '0.25'
    },
    'Pisos': {
      cor: '#808080 (cinza médio claro)',
      roughness: '0.3 (polido)',
      normalScale: '(0.2, 0.2)',
      envMapIntensity: '0.4'
    },
    'Pilares/Vigas': {
      cor: '#707070 (cinza médio escuro)',
      roughness: '0.8 (estrutural rugoso)',
      normalScale: '(0.5, 0.5)',
      envMapIntensity: '0.3'
    },
    'Geral': {
      metalness: '0.0 (sem metalicidade)',
      textura: 'Seamless 1024x1024px',
      normalMap: 'Rugosidade sutil',
      emissiveIntensity: '0.01 (muito sutil)',
      variações: 'Tonais naturais + poros + agregados'
    }
  };
  
  console.log('🎯 Propriedades ideais por tipo de elemento:');
  Object.entries(propriedadesIdeais).forEach(([tipo, props]) => {
    console.log(`\n📋 ${tipo}:`);
    Object.entries(props).forEach(([prop, valor]) => {
      console.log(`   ${prop}: ${valor}`);
    });
  });
  
  return propriedadesIdeais;
}

// Função para analisar características da textura
function analisarTexturaConcreto() {
  console.log('\n🎨 ===== ANÁLISE DA TEXTURA CONCRETO =====');
  
  console.log('🏗️ Características da textura de concreto:');
  console.log('   - Base: Cinza médio #808080');
  console.log('   - Variações tonais: 80 áreas sutis');
  console.log('   - Poros: 4000 poros sutis');
  console.log('   - Imperfeições: 300 marcas de moldagem');
  console.log('   - Linhas moldagem: 12 horizontais + 8 verticais');
  console.log('   - Agregados: 2000 pedriscos pequenos');
  console.log('   - Manchas desgaste: 100 muito sutis');
  console.log('   - Textura granulada: 12000 pontos foscos');
  console.log('   - Cristalização: 600 padrões sutis');
  console.log('   - Normal map: 2000 variações + 8 linhas + 800 poros');
  console.log('   - Repetição: Seamless 1x1');
  
  return {
    resolucao: '1024x1024px',
    base: '#808080',
    variacoes: 80,
    poros: 4000,
    imperfeicoes: 300,
    agregados: 2000,
    manchas: 100,
    granulos: 12000,
    cristalizacao: 600,
    normalVariacoes: 2000,
    normalPoros: 800
  };
}

// Executar todos os testes
const resultados = testarTexturaConcreto();
const estruturais = verificarEstruturaisPlanilha();
const propriedadesIdeais = compararPropriedadesConcreto();
const analiseTextura = analisarTexturaConcreto();

console.log('\n✅ ===== TESTE CONCLUÍDO =====');
console.log('💡 Para repetir os testes:');
console.log('   - testarTexturaConcreto()');
console.log('   - verificarEstruturaisPlanilha()');
console.log('   - compararPropriedadesConcreto()');
console.log('   - analisarTexturaConcreto()');

// Expor funções globalmente
window.testarTexturaConcreto = testarTexturaConcreto;
window.verificarEstruturaisPlanilha = verificarEstruturaisPlanilha;
window.compararPropriedadesConcreto = compararPropriedadesConcreto;
window.analisarTexturaConcreto = analisarTexturaConcreto;

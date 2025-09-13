// ===== TESTE DA TEXTURA FIBROCIMENTO =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🏠 ===== TESTE DA TEXTURA FIBROCIMENTO =====');

function testarTexturaFibrocimento() {
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let elementosFibrocimento = [];
  let totalElementos = 0;
  
  console.log('🔍 Analisando elementos com textura de fibrocimento...');
  
  scene.traverse((child) => {
    totalElementos++;
    
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach((material, index) => {
        // Verificar se é o material de fibrocimento (características específicas)
        const isFibrocimento = material.roughness >= 0.9 && 
                              material.metalness === 0 && 
                              material.envMapIntensity <= 0.2 &&
                              material.map && 
                              material.normalMap;
        
        if (isFibrocimento) {
          elementosFibrocimento.push({
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
              flatShading: material.flatShading
            }
          });
        }
        
        // Verificar também elementos de telhado especificamente
        const nome = child.name.toLowerCase();
        if (nome.includes('2.6_') || nome.includes('telhado') || 
            nome.includes('telha') || nome.includes('fibrocimento') ||
            nome.includes('roof') || nome.includes('tile')) {
          console.log(`🏠 Elemento de telhado encontrado: ${child.name}`);
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
  console.log(`🏠 Elementos com textura fibrocimento: ${elementosFibrocimento.length}`);
  
  if (elementosFibrocimento.length > 0) {
    console.log('\n🏠 ===== ELEMENTOS COM FIBROCIMENTO =====');
    elementosFibrocimento.forEach((elemento, i) => {
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
      console.log(`   Flat Shading: ${elemento.material.flatShading}`);
      console.log(`   Textura corrugada: ${elemento.material.temTextura ? '✅' : '❌'}`);
      console.log(`   Normal Map: ${elemento.material.temNormalMap ? '✅' : '❌'}`);
    });
    
    window.elementosFibrocimento = elementosFibrocimento;
    console.log('\n💾 Resultados salvos em: window.elementosFibrocimento');
  } else {
    console.log('\n❌ Nenhum elemento com textura fibrocimento encontrado');
    console.log('💡 Verifique se:');
    console.log('   - O modelo foi carregado completamente');
    console.log('   - Os elementos de telhado existem no modelo');
    console.log('   - Os materiais foram aplicados corretamente');
  }
  
  return elementosFibrocimento;
}

// Função para verificar especificamente elementos de telhado da planilha
function verificarTelhadosPlanilha() {
  console.log('\n🔍 ===== VERIFICANDO TELHADOS DA PLANILHA =====');
  
  const telhadosEsperados = [
    '2.6 Telhado.001', '2.6 Telhado.002', '2.6 Telhado.003', '2.6 Telhado.004',
    '2.6 Telhado.005', '2.6 Telhado.006', '2.6 Telhado.007', '2.6 Telhado.008',
    '2.6 Telhado.009', '2.6 Telhado.010', '2.6 Telhado.011', '2.6 Telhado.012'
  ];
  
  console.log(`🎯 Procurando por ${telhadosEsperados.length} elementos de telhado específicos...`);
  
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let encontrados = 0;
  let comFibrocimento = 0;
  
  telhadosEsperados.forEach(nomeTelhado => {
    let encontrou = false;
    
    scene.traverse((child) => {
      if (child.name === nomeTelhado) {
        encontrou = true;
        encontrados++;
        
        console.log(`✅ ${nomeTelhado} encontrado`);
        
        if (child.material) {
          const materiais = Array.isArray(child.material) ? child.material : [child.material];
          
          materiais.forEach(material => {
            if (material.roughness >= 0.9 && material.map && material.normalMap) {
              comFibrocimento++;
              console.log(`   🏠 Material de fibrocimento aplicado!`);
              console.log(`   📊 Roughness: ${material.roughness}`);
              console.log(`   📊 Normal Scale: ${material.normalScale ? `(${material.normalScale.x}, ${material.normalScale.y})` : 'N/A'}`);
              console.log(`   📊 Cor: ${material.color ? '#' + material.color.getHexString() : 'N/A'}`);
            } else {
              console.log(`   ⚠️ Material: ${material.type} (não é fibrocimento otimizado)`);
              console.log(`   📊 Roughness: ${material.roughness}`);
              console.log(`   📊 Tem textura: ${!!material.map}`);
            }
          });
        }
      }
    });
    
    if (!encontrou) {
      console.log(`❌ ${nomeTelhado} não encontrado`);
    }
  });
  
  console.log(`\n📊 Resumo dos telhados:`);
  console.log(`   Total esperados: ${telhadosEsperados.length}`);
  console.log(`   Encontrados: ${encontrados}`);
  console.log(`   Com fibrocimento: ${comFibrocimento}`);
  
  const percentual = (comFibrocimento / telhadosEsperados.length * 100).toFixed(1);
  console.log(`   Percentual com fibrocimento: ${percentual}%`);
  
  return {
    esperados: telhadosEsperados.length,
    encontrados,
    comFibrocimento,
    percentual
  };
}

// Função para comparar propriedades ideais de fibrocimento
function compararPropriedadesFibrocimento() {
  console.log('\n📊 ===== PROPRIEDADES IDEAIS FIBROCIMENTO =====');
  
  const propriedadesIdeais = {
    cor: '#C5C5C5 (cinza claro)',
    roughness: '>= 0.95 (muito rugoso/fosco)',
    metalness: '0.0 (sem metalicidade)',
    envMapIntensity: '<= 0.1 (pouca reflexão)',
    textura: 'Corrugada 1024x1024px',
    normalMap: 'Ondulações pronunciadas',
    normalScale: '(0.8, 0.8)',
    emissiveIntensity: '0.01 (muito sutil)',
    aparencia: 'Desgastada com poros'
  };
  
  console.log('🎯 Propriedades ideais para fibrocimento corrugado:');
  Object.entries(propriedadesIdeais).forEach(([prop, valor]) => {
    console.log(`   ${prop}: ${valor}`);
  });
  
  return propriedadesIdeais;
}

// Função para analisar padrão corrugado
function analisarPadraoCorreugado() {
  console.log('\n📐 ===== ANÁLISE DO PADRÃO CORRUGADO =====');
  
  console.log('🌊 Características do padrão corrugado:');
  console.log('   - Ondulações horizontais: 16 ondas por textura');
  console.log('   - Altura da onda: 32px (escala 1024px)');
  console.log('   - Repetição: 2x horizontal, 1x vertical');
  console.log('   - Normal map: Simula profundidade das ondulações');
  console.log('   - Gradientes: Luz/sombra nas cristas e vales');
  console.log('   - Poros: 3000 poros microscópicos');
  console.log('   - Desgaste: 150 manchas + 200 riscos');
  console.log('   - Fibras: 500 fibras simuladas do cimento');
  console.log('   - Textura granulada: 8000 pontos para aspecto fosco');
  
  return {
    ondulacoes: 16,
    alturaOnda: '32px',
    repeticao: '2x1',
    poros: 3000,
    manchas: 150,
    riscos: 200,
    fibras: 500,
    granulos: 8000
  };
}

// Executar todos os testes
const resultados = testarTexturaFibrocimento();
const telhados = verificarTelhadosPlanilha();
const propriedadesIdeais = compararPropriedadesFibrocimento();
const padraoCorreugado = analisarPadraoCorreugado();

console.log('\n✅ ===== TESTE CONCLUÍDO =====');
console.log('💡 Para repetir os testes:');
console.log('   - testarTexturaFibrocimento()');
console.log('   - verificarTelhadosPlanilha()');
console.log('   - compararPropriedadesFibrocimento()');
console.log('   - analisarPadraoCorreugado()');

// Expor funções globalmente
window.testarTexturaFibrocimento = testarTexturaFibrocimento;
window.verificarTelhadosPlanilha = verificarTelhadosPlanilha;
window.compararPropriedadesFibrocimento = compararPropriedadesFibrocimento;
window.analisarPadraoCorreugado = analisarPadraoCorreugado;

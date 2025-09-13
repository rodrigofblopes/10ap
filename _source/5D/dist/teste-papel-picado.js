// ===== TESTE DA TEXTURA PAPEL PICADO =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🎨 ===== TESTE DA TEXTURA PAPEL PICADO =====');

function testarTexturasPapelPicado() {
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let elementosPapelPicado = [];
  let totalElementos = 0;
  
  console.log('🔍 Analisando elementos com textura de papel picado...');
  
  scene.traverse((child) => {
    totalElementos++;
    
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach((material, index) => {
        // Verificar se é o material de papel picado
        if (material.map && material.normalMap && material.roughness > 0.8) {
          // Características do material papel picado
          const isPapelPicado = material.roughness >= 0.85 && 
                               material.metalness === 0 && 
                               material.envMapIntensity <= 0.2;
          
          if (isPapelPicado) {
            elementosPapelPicado.push({
              nome: child.name,
              posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`,
              material: {
                cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
                roughness: material.roughness,
                metalness: material.metalness,
                envMapIntensity: material.envMapIntensity,
                temTextura: !!material.map,
                temNormalMap: !!material.normalMap,
                emissive: material.emissive ? `#${material.emissive.getHexString()}` : 'N/A'
              }
            });
          }
        }
        
        // Verificar também por nome do elemento (1.3_ e 2.3_)
        const nome = child.name.toLowerCase();
        if (nome.includes('1.3_') || nome.includes('2.3_')) {
          console.log(`🎨 Elemento de revestimento encontrado: ${child.name}`);
          console.log(`   Material tipo: ${material.type}`);
          console.log(`   Roughness: ${material.roughness}`);
          console.log(`   Metalness: ${material.metalness}`);
          console.log(`   Cor: ${material.color ? '#' + material.color.getHexString() : 'N/A'}`);
          console.log(`   Tem textura: ${!!material.map}`);
          console.log(`   Tem normal map: ${!!material.normalMap}`);
        }
      });
    }
  });
  
  console.log(`\n📊 ===== RESULTADOS =====`);
  console.log(`📦 Total de elementos analisados: ${totalElementos}`);
  console.log(`🎨 Elementos com textura papel picado: ${elementosPapelPicado.length}`);
  
  if (elementosPapelPicado.length > 0) {
    console.log('\n🎨 ===== ELEMENTOS COM PAPEL PICADO =====');
    elementosPapelPicado.forEach((elemento, i) => {
      console.log(`\n${i + 1}. ${elemento.nome}`);
      console.log(`   Posição: ${elemento.posicao}`);
      console.log(`   Cor: ${elemento.material.cor}`);
      console.log(`   Roughness: ${elemento.material.roughness}`);
      console.log(`   Metalness: ${elemento.material.metalness}`);
      console.log(`   Env Map Intensity: ${elemento.material.envMapIntensity}`);
      console.log(`   Textura: ${elemento.material.temTextura ? '✅' : '❌'}`);
      console.log(`   Normal Map: ${elemento.material.temNormalMap ? '✅' : '❌'}`);
      console.log(`   Emissive: ${elemento.material.emissive}`);
    });
    
    window.elementosPapelPicado = elementosPapelPicado;
    console.log('\n💾 Resultados salvos em: window.elementosPapelPicado');
  } else {
    console.log('\n❌ Nenhum elemento com textura papel picado encontrado');
    console.log('💡 Verifique se:');
    console.log('   - O modelo foi carregado completamente');
    console.log('   - Os elementos 1.3_ e 2.3_ existem no modelo');
    console.log('   - Os materiais foram aplicados corretamente');
  }
  
  return elementosPapelPicado;
}

// Função para verificar especificamente elementos 1.3_ e 2.3_
function verificarElementosRevestimento() {
  console.log('\n🔍 ===== VERIFICANDO ELEMENTOS DE REVESTIMENTO =====');
  
  if (!window.glbElements) {
    console.log('❌ Elementos GLB não disponíveis');
    return;
  }
  
  const elementosRevestimento = window.glbElements.filter(el => 
    el.includes('1.3_') || el.includes('2.3_')
  );
  
  console.log(`📦 Elementos de revestimento encontrados: ${elementosRevestimento.length}`);
  
  if (elementosRevestimento.length > 0) {
    console.log('\n📋 Lista de elementos de revestimento:');
    elementosRevestimento.forEach((elemento, i) => {
      console.log(`   ${i + 1}. ${elemento}`);
    });
    
    // Verificar se estão na scene
    const scene = window.glbScene;
    if (scene) {
      let encontradosNaScene = 0;
      scene.traverse((child) => {
        if (elementosRevestimento.includes(child.name)) {
          encontradosNaScene++;
          console.log(`✅ ${child.name} encontrado na scene`);
        }
      });
      
      console.log(`\n📊 Elementos encontrados na scene: ${encontradosNaScene}/${elementosRevestimento.length}`);
    }
  } else {
    console.log('❌ Nenhum elemento de revestimento (1.3_ ou 2.3_) encontrado');
  }
  
  return elementosRevestimento;
}

// Executar testes
const resultados = testarTexturasPapelPicado();
const elementosRevestimento = verificarElementosRevestimento();

console.log('\n✅ ===== TESTE CONCLUÍDO =====');
console.log('💡 Para repetir o teste, execute: testarTexturasPapelPicado()');

// Expor funções globalmente
window.testarTexturasPapelPicado = testarTexturasPapelPicado;
window.verificarElementosRevestimento = verificarElementosRevestimento;

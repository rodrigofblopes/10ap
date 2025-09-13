// ===== TESTE DA TEXTURA VIDRO AVANÇADO =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🪟 ===== TESTE DA TEXTURA VIDRO AVANÇADO =====');

function testarTexturaVidroAvancado() {
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let elementosVidroAvancado = [];
  let totalElementos = 0;
  
  console.log('🔍 Analisando elementos com textura de vidro avançado...');
  
  scene.traverse((child) => {
    totalElementos++;
    
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach((material, index) => {
        // Verificar se é o novo material MeshPhysicalMaterial com propriedades de vidro
        const isVidroAvancado = material.type === 'MeshPhysicalMaterial' &&
                               material.transparent &&
                               material.transmission > 0.9 &&
                               material.ior === 1.52;
        
        if (isVidroAvancado) {
          elementosVidroAvancado.push({
            nome: child.name,
            posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`,
            material: {
              tipo: material.type,
              cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
              opacity: material.opacity,
              transmission: material.transmission,
              thickness: material.thickness,
              ior: material.ior,
              roughness: material.roughness,
              metalness: material.metalness,
              reflectivity: material.reflectivity,
              clearcoat: material.clearcoat,
              clearcoatRoughness: material.clearcoatRoughness,
              envMapIntensity: material.envMapIntensity,
              sheen: material.sheen,
              sheenColor: material.sheenColor ? `#${material.sheenColor.getHexString()}` : 'N/A',
              emissive: material.emissive ? `#${material.emissive.getHexString()}` : 'N/A',
              emissiveIntensity: material.emissiveIntensity,
              temTextura: !!material.map,
              temNormalMap: !!material.normalMap,
              specularIntensity: material.specularIntensity,
              specularColor: material.specularColor ? `#${material.specularColor.getHexString()}` : 'N/A'
            }
          });
        }
        
        // Verificar também elementos de esquadrias especificamente
        const nome = child.name.toLowerCase();
        if (nome.includes('1.5_') || nome.includes('2.5_') || 
            nome.includes('esquadria') || nome.includes('janela') || nome.includes('porta')) {
          console.log(`🪟 Elemento de esquadria encontrado: ${child.name}`);
          console.log(`   Material tipo: ${material.type}`);
          console.log(`   Transparent: ${material.transparent}`);
          console.log(`   Opacity: ${material.opacity}`);
          console.log(`   Transmission: ${material.transmission || 'N/A'}`);
          console.log(`   IOR: ${material.ior || 'N/A'}`);
          console.log(`   Thickness: ${material.thickness || 'N/A'}`);
          console.log(`   Roughness: ${material.roughness}`);
          console.log(`   Reflectivity: ${material.reflectivity || 'N/A'}`);
          console.log(`   Clearcoat: ${material.clearcoat || 'N/A'}`);
          console.log(`   Env Map Intensity: ${material.envMapIntensity}`);
          console.log(`   Cor: ${material.color ? '#' + material.color.getHexString() : 'N/A'}`);
          console.log(`   Tem textura: ${!!material.map}`);
          console.log(`   Tem normal map: ${!!material.normalMap}`);
        }
      });
    }
  });
  
  console.log(`\n📊 ===== RESULTADOS =====`);
  console.log(`📦 Total de elementos analisados: ${totalElementos}`);
  console.log(`🪟 Elementos com vidro avançado: ${elementosVidroAvancado.length}`);
  
  if (elementosVidroAvancado.length > 0) {
    console.log('\n🪟 ===== ELEMENTOS COM VIDRO AVANÇADO =====');
    elementosVidroAvancado.forEach((elemento, i) => {
      console.log(`\n${i + 1}. ${elemento.nome}`);
      console.log(`   Posição: ${elemento.posicao}`);
      console.log(`   ===== Propriedades do Material =====`);
      console.log(`   Tipo: ${elemento.material.tipo}`);
      console.log(`   Cor base: ${elemento.material.cor}`);
      console.log(`   Opacity: ${elemento.material.opacity}`);
      console.log(`   Transmission: ${elemento.material.transmission}`);
      console.log(`   Thickness: ${elemento.material.thickness}`);
      console.log(`   IOR (Índice de Refração): ${elemento.material.ior}`);
      console.log(`   Roughness: ${elemento.material.roughness}`);
      console.log(`   Metalness: ${elemento.material.metalness}`);
      console.log(`   Reflectivity: ${elemento.material.reflectivity}`);
      console.log(`   Clearcoat: ${elemento.material.clearcoat}`);
      console.log(`   Clearcoat Roughness: ${elemento.material.clearcoatRoughness}`);
      console.log(`   Env Map Intensity: ${elemento.material.envMapIntensity}`);
      console.log(`   Sheen: ${elemento.material.sheen}`);
      console.log(`   Sheen Color: ${elemento.material.sheenColor}`);
      console.log(`   Emissive: ${elemento.material.emissive}`);
      console.log(`   Emissive Intensity: ${elemento.material.emissiveIntensity}`);
      console.log(`   Specular Intensity: ${elemento.material.specularIntensity}`);
      console.log(`   Specular Color: ${elemento.material.specularColor}`);
      console.log(`   Textura avançada: ${elemento.material.temTextura ? '✅' : '❌'}`);
      console.log(`   Normal Map: ${elemento.material.temNormalMap ? '✅' : '❌'}`);
    });
    
    window.elementosVidroAvancado = elementosVidroAvancado;
    console.log('\n💾 Resultados salvos em: window.elementosVidroAvancado');
  } else {
    console.log('\n❌ Nenhum elemento com vidro avançado encontrado');
    console.log('💡 Verifique se:');
    console.log('   - O modelo foi carregado completamente');
    console.log('   - Os elementos de esquadrias existem no modelo');
    console.log('   - Os materiais MeshPhysicalMaterial foram aplicados');
  }
  
  return elementosVidroAvancado;
}

// Função para verificar especificamente elementos de esquadrias
function verificarEsquadriasVidro() {
  console.log('\n🔍 ===== VERIFICANDO ESQUADRIAS COM VIDRO =====');
  
  const esquadriasEsperadas = [
    '1.5 Esquadrias Térreo.001', '1.5 Esquadrias Térreo.002',
    '1.5 Esquadrias Térreo.003', '1.5 Esquadrias Térreo.004',
    '2.5 Esquadrias Pav. Superior.001', '2.5 Esquadrias Pav. Superior.002',
    '2.5 Esquadrias Pav. Superior.003', '2.5 Esquadrias Pav. Superior.004'
  ];
  
  console.log(`🎯 Procurando por ${esquadriasEsperadas.length} esquadrias específicas...`);
  
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let encontradas = 0;
  let comVidroAvancado = 0;
  
  esquadriasEsperadas.forEach(nomeEsquadria => {
    let encontrou = false;
    
    scene.traverse((child) => {
      if (child.name === nomeEsquadria) {
        encontrou = true;
        encontradas++;
        
        console.log(`✅ ${nomeEsquadria} encontrada`);
        
        if (child.material) {
          const materiais = Array.isArray(child.material) ? child.material : [child.material];
          
          materiais.forEach(material => {
            if (material.type === 'MeshPhysicalMaterial' && material.transmission > 0.9) {
              comVidroAvancado++;
              console.log(`   🪟 Material de vidro avançado aplicado!`);
              console.log(`   📊 Transmission: ${material.transmission}`);
              console.log(`   📊 IOR: ${material.ior}`);
              console.log(`   📊 Opacity: ${material.opacity}`);
            } else {
              console.log(`   ⚠️ Material: ${material.type} (não é vidro avançado)`);
            }
          });
        }
      }
    });
    
    if (!encontrou) {
      console.log(`❌ ${nomeEsquadria} não encontrada`);
    }
  });
  
  console.log(`\n📊 Resumo das esquadrias:`);
  console.log(`   Total esperadas: ${esquadriasEsperadas.length}`);
  console.log(`   Encontradas: ${encontradas}`);
  console.log(`   Com vidro avançado: ${comVidroAvancado}`);
  
  const percentual = (comVidroAvancado / esquadriasEsperadas.length * 100).toFixed(1);
  console.log(`   Percentual com vidro avançado: ${percentual}%`);
  
  return {
    esperadas: esquadriasEsperadas.length,
    encontradas,
    comVidroAvancado,
    percentual
  };
}

// Função para comparar propriedades de vidro
function compararPropriedadesVidro() {
  console.log('\n📊 ===== COMPARAÇÃO DE PROPRIEDADES IDEAIS =====');
  
  const propriedadesIdeais = {
    tipo: 'MeshPhysicalMaterial',
    transmission: '>= 0.95',
    ior: '1.52',
    opacity: '<= 0.15',
    roughness: '0.0',
    reflectivity: '>= 0.9',
    clearcoat: '1.0',
    envMapIntensity: '>= 8.0'
  };
  
  console.log('🎯 Propriedades ideais para vidro realista:');
  Object.entries(propriedadesIdeais).forEach(([prop, valor]) => {
    console.log(`   ${prop}: ${valor}`);
  });
  
  return propriedadesIdeais;
}

// Executar todos os testes
const resultados = testarTexturaVidroAvancado();
const esquadrias = verificarEsquadriasVidro();
const propriedadesIdeais = compararPropriedadesVidro();

console.log('\n✅ ===== TESTE CONCLUÍDO =====');
console.log('💡 Para repetir os testes:');
console.log('   - testarTexturaVidroAvancado()');
console.log('   - verificarEsquadriasVidro()');
console.log('   - compararPropriedadesVidro()');

// Expor funções globalmente
window.testarTexturaVidroAvancado = testarTexturaVidroAvancado;
window.verificarEsquadriasVidro = verificarEsquadriasVidro;
window.compararPropriedadesVidro = compararPropriedadesVidro;

// ===== TESTE DA TEXTURA TINTA CINZA =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🎨 ===== TESTE DA TEXTURA TINTA CINZA =====');

function testarTexturaTintaCinza() {
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let elementosTintaCinza = [];
  let totalElementos = 0;
  
  console.log('🔍 Analisando elementos com textura de tinta cinza...');
  
  scene.traverse((child) => {
    totalElementos++;
    
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach((material, index) => {
        // Verificar se é o material de tinta cinza (características específicas)
        const isTintaCinza = material.map && 
                            material.normalMap &&
                            material.roughness <= 0.3 && 
                            material.metalness === 0 && 
                            material.envMapIntensity >= 0.3 &&
                            material.envMapIntensity <= 0.4;
        
        if (isTintaCinza) {
          elementosTintaCinza.push({
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
        
        // Verificar também elementos com nomes relacionados a cinza/tinta
        const nome = child.name.toLowerCase();
        if (nome.includes('cinza') || nome.includes('gray') || nome.includes('grey') ||
            nome.includes('tinta') || nome.includes('paint') || nome.includes('pintura')) {
          console.log(`🎨 Elemento com material cinza/tinta encontrado: ${child.name}`);
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
        
        // Verificar elementos com cores cinza
        if (material.color) {
          const cor = material.color;
          const r = cor.r;
          const g = cor.g;
          const b = cor.b;
          
          // Verificar se é um tom de cinza
          const isGrayTone = Math.abs(r - g) < 0.1 && Math.abs(g - b) < 0.1 && Math.abs(r - b) < 0.1;
          
          if (isGrayTone && r > 0.2 && r < 0.8) {
            console.log(`🎨 Elemento com cor cinza encontrado: ${child.name}`);
            console.log(`   Cor: #${material.color.getHexString()} (${(r*255).toFixed(0)}, ${(g*255).toFixed(0)}, ${(b*255).toFixed(0)})`);
            console.log(`   Classificação: ${r < 0.4 ? 'Cinza Escuro' : r > 0.6 ? 'Cinza Claro' : 'Cinza Médio'}`);
          }
        }
      });
    }
  });
  
  console.log(`\n📊 ===== RESULTADOS =====`);
  console.log(`📦 Total de elementos analisados: ${totalElementos}`);
  console.log(`🎨 Elementos com textura tinta cinza: ${elementosTintaCinza.length}`);
  
  if (elementosTintaCinza.length > 0) {
    console.log('\n🎨 ===== ELEMENTOS COM TINTA CINZA =====');
    elementosTintaCinza.forEach((elemento, i) => {
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
      console.log(`   Textura tinta: ${elemento.material.temTextura ? '✅' : '❌'}`);
      console.log(`   Normal Map: ${elemento.material.temNormalMap ? '✅' : '❌'}`);
    });
    
    window.elementosTintaCinza = elementosTintaCinza;
    console.log('\n💾 Resultados salvos em: window.elementosTintaCinza');
  } else {
    console.log('\n❌ Nenhum elemento com textura tinta cinza encontrado');
    console.log('💡 Verifique se:');
    console.log('   - O modelo foi carregado completamente');
    console.log('   - Existem elementos com material cinza no modelo');
    console.log('   - Os materiais foram aplicados corretamente');
  }
  
  return elementosTintaCinza;
}

// Função para analisar tons de cinza no modelo
function analisarTonsCinza() {
  console.log('\n🎨 ===== ANÁLISE DE TONS DE CINZA =====');
  
  if (!window.glbScene) {
    console.log('❌ Scene GLB não disponível');
    return;
  }
  
  const scene = window.glbScene;
  let tonsDeGinza = [];
  
  scene.traverse((child) => {
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach(material => {
        if (material.color) {
          const cor = material.color;
          const r = cor.r;
          const g = cor.g;
          const b = cor.b;
          
          // Verificar se é um tom de cinza
          const isGrayTone = Math.abs(r - g) < 0.1 && Math.abs(g - b) < 0.1 && Math.abs(r - b) < 0.1;
          
          if (isGrayTone && r > 0.15 && r < 0.85) {
            const brilho = (r + g + b) / 3;
            const classificacao = brilho < 0.3 ? 'Cinza Escuro' : 
                                 brilho > 0.7 ? 'Cinza Claro' : 'Cinza Médio';
            
            tonsDeGinza.push({
              objeto: child.name,
              material: material.name || 'Sem nome',
              cor: {
                hex: `#${material.color.getHexString()}`,
                rgb: `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`,
                brilho: brilho.toFixed(3),
                classificacao
              },
              propriedades: {
                roughness: material.roughness,
                metalness: material.metalness,
                envMapIntensity: material.envMapIntensity
              }
            });
          }
        }
      });
    }
  });
  
  // Ordenar por brilho
  tonsDeGinza.sort((a, b) => parseFloat(a.cor.brilho) - parseFloat(b.cor.brilho));
  
  console.log(`🎨 Elementos com tons de cinza encontrados: ${tonsDeGinza.length}`);
  
  if (tonsDeGinza.length > 0) {
    console.log('\n📋 Lista ordenada por brilho (escuro → claro):');
    tonsDeGinza.forEach((item, i) => {
      console.log(`${i + 1}. ${item.objeto}`);
      console.log(`   Cor: ${item.cor.hex} (${item.cor.rgb})`);
      console.log(`   Classificação: ${item.cor.classificacao}`);
      console.log(`   Brilho: ${item.cor.brilho}`);
      console.log(`   Material: ${item.material}`);
    });
    
    // Agrupar por classificação
    const grupos = {
      'Cinza Escuro': tonsDeGinza.filter(t => t.cor.classificacao === 'Cinza Escuro'),
      'Cinza Médio': tonsDeGinza.filter(t => t.cor.classificacao === 'Cinza Médio'),
      'Cinza Claro': tonsDeGinza.filter(t => t.cor.classificacao === 'Cinza Claro')
    };
    
    console.log('\n📊 Agrupamento por tom:');
    Object.entries(grupos).forEach(([tom, elementos]) => {
      if (elementos.length > 0) {
        console.log(`   ${tom}: ${elementos.length} elementos`);
      }
    });
    
    window.tonsDeGinza = tonsDeGinza;
    window.gruposTonsGinza = grupos;
  }
  
  return tonsDeGinza;
}

// Função para comparar propriedades ideais de tinta cinza
function compararPropriedadesTintaCinza() {
  console.log('\n📊 ===== PROPRIEDADES IDEAIS TINTA CINZA =====');
  
  const propriedadesIdeais = {
    cor: '#888888 (cinza médio)',
    roughness: '0.25 (relativamente lisa)',
    metalness: '0.0 (sem metalicidade)',
    envMapIntensity: '0.35 (reflexão moderada)',
    normalScale: '(0.1, 0.1) (muito sutil)',
    emissiveIntensity: '0.005 (quase imperceptível)',
    textura: 'Pinceladas sutis 1024x1024px',
    normalMap: 'Superfície lisa com marcas mínimas',
    aparencia: 'Tinta seca com variações tonais sutis'
  };
  
  console.log('🎯 Propriedades ideais para tinta cinza:');
  Object.entries(propriedadesIdeais).forEach(([prop, valor]) => {
    console.log(`   ${prop}: ${valor}`);
  });
  
  return propriedadesIdeais;
}

// Função para analisar características da textura
function analisarTexturaTintaCinza() {
  console.log('\n🎨 ===== ANÁLISE DA TEXTURA TINTA CINZA =====');
  
  console.log('🖌️ Características da textura de tinta cinza:');
  console.log('   - Base: Cinza médio #888888');
  console.log('   - Variações sutis: 60 pinceladas');
  console.log('   - Textura pincel: 200 marcas sutis');
  console.log('   - Imperfeições: 1500 pequenos pontos');
  console.log('   - Cobertura: 80 variações de área');
  console.log('   - Textura fina: 8000 pontos para aspecto seco');
  console.log('   - Marcas rolo/pincel: 15 muito sutis');
  console.log('   - Normal map: 800 variações + 30 marcas pincel');
  console.log('   - Repetição: Seamless 1x1');
  console.log('   - Acabamento: Lisa com brilho sutil');
  
  return {
    resolucao: '1024x1024px',
    base: '#888888',
    pinceladas: 60,
    marcasPincel: 200,
    imperfeicoes: 1500,
    variacoesArea: 80,
    texturaFina: 8000,
    marcasRolo: 15,
    normalVariacoes: 800,
    normalMarcas: 30
  };
}

// Executar todos os testes
const resultados = testarTexturaTintaCinza();
const tonsGinza = analisarTonsCinza();
const propriedadesIdeais = compararPropriedadesTintaCinza();
const analiseTextura = analisarTexturaTintaCinza();

console.log('\n✅ ===== TESTE CONCLUÍDO =====');
console.log('💡 Para repetir os testes:');
console.log('   - testarTexturaTintaCinza()');
console.log('   - analisarTonsCinza()');
console.log('   - compararPropriedadesTintaCinza()');
console.log('   - analisarTexturaTintaCinza()');

// Expor funções globalmente
window.testarTexturaTintaCinza = testarTexturaTintaCinza;
window.analisarTonsCinza = analisarTonsCinza;
window.compararPropriedadesTintaCinza = compararPropriedadesTintaCinza;
window.analisarTexturaTintaCinza = analisarTexturaTintaCinza;

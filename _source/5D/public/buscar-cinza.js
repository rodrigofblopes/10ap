console.log('🎨 ===== BUSCA POR ELEMENTOS COM MATERIAL CINZA =====');

// Função para buscar elementos com material cinza
function buscarElementosCinza() {
  console.log('🔍 Procurando por elementos com material cinza...');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    console.log('✅ Scene GLB disponível:', scene.name);
    
    let elementosCinza = [];
    let totalElementos = 0;
    
    // Traversar toda a scene
    scene.traverse((child) => {
      totalElementos++;
      
      if (child.material) {
        // Verificar se é um array de materiais ou material único
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach((material, index) => {
          let isCinza = false;
          let tipoDeteccao = '';
          
          // Verificar se o nome do material contém "cinza", "gray", "grey", etc.
          if (material.name && (
            material.name.toLowerCase().includes('cinza') ||
            material.name.toLowerCase().includes('gray') ||
            material.name.toLowerCase().includes('grey') ||
            material.name.toLowerCase().includes('tinta') ||
            material.name.toLowerCase().includes('paint') ||
            material.name.toLowerCase().includes('pintura')
          )) {
            isCinza = true;
            tipoDeteccao = 'nome do material';
          }
          
          // Verificar se o nome do objeto indica material cinza
          if (child.name && (
            child.name.toLowerCase().includes('cinza') ||
            child.name.toLowerCase().includes('gray') ||
            child.name.toLowerCase().includes('grey') ||
            child.name.toLowerCase().includes('tinta') ||
            child.name.toLowerCase().includes('paint') ||
            child.name.toLowerCase().includes('pintura')
          )) {
            isCinza = true;
            tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + nome objeto` : 'nome do objeto';
          }
          
          // Verificar cor do material (tons de cinza)
          if (material.color) {
            const cor = material.color;
            const r = cor.r;
            const g = cor.g;
            const b = cor.b;
            
            // Verificar se é um tom de cinza (R, G, B próximos entre si)
            const isGrayTone = Math.abs(r - g) < 0.1 && Math.abs(g - b) < 0.1 && Math.abs(r - b) < 0.1;
            
            if (isGrayTone && r > 0.2 && r < 0.8) { // Evitar preto puro e branco puro
              isCinza = true;
              tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + cor cinza` : 'cor cinza';
            }
          }
          
          // Verificar userData do objeto
          if (child.userData) {
            Object.entries(child.userData).forEach(([key, value]) => {
              if (value && typeof value === 'string' && (
                value.toLowerCase().includes('cinza') ||
                value.toLowerCase().includes('gray') ||
                value.toLowerCase().includes('grey') ||
                value.toLowerCase().includes('tinta') ||
                value.toLowerCase().includes('paint')
              )) {
                isCinza = true;
                tipoDeteccao = tipoDeteccao ? `${tipoDeteccao} + userData` : 'userData';
              }
            });
          }
          
          if (isCinza) {
            elementosCinza.push({
              objeto: child.name,
              materialNome: material.name || 'Sem nome',
              materialIndex: index,
              tipo: material.type,
              deteccao: tipoDeteccao,
              propriedades: {
                cor: material.color ? {
                  hex: `#${material.color.getHexString()}`,
                  rgb: `rgb(${Math.round(material.color.r * 255)}, ${Math.round(material.color.g * 255)}, ${Math.round(material.color.b * 255)})`,
                  valores: `(${material.color.r.toFixed(3)}, ${material.color.g.toFixed(3)}, ${material.color.b.toFixed(3)})`
                } : 'N/A',
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
            console.log(`🎨 MATERIAL CINZA ENCONTRADO: ${child.name} - ${tipoDeteccao}`);
          }
        });
      }
    });
    
    console.log(`\n📊 ===== RESULTADO DA BUSCA =====`);
    console.log(`📦 Total de objetos analisados: ${totalElementos}`);
    console.log(`🎨 Elementos com material cinza encontrados: ${elementosCinza.length}`);
    
    if (elementosCinza.length > 0) {
      console.log('\n🎨 ===== DETALHES DOS ELEMENTOS COM MATERIAL CINZA =====');
      elementosCinza.forEach((elemento, index) => {
        console.log(`\n${index + 1}. ${elemento.objeto}`);
        console.log(`   Material: ${elemento.materialNome}`);
        console.log(`   Tipo: ${elemento.tipo}`);
        console.log(`   Detectado por: ${elemento.deteccao}`);
        console.log(`   Propriedades:`);
        if (elemento.propriedades.cor !== 'N/A') {
          console.log(`     - Cor Hex: ${elemento.propriedades.cor.hex}`);
          console.log(`     - Cor RGB: ${elemento.propriedades.cor.rgb}`);
          console.log(`     - Valores: ${elemento.propriedades.cor.valores}`);
        } else {
          console.log(`     - Cor: N/A`);
        }
        console.log(`     - Roughness: ${elemento.propriedades.roughness}`);
        console.log(`     - Metalness: ${elemento.propriedades.metalness}`);
        console.log(`     - Env Map Intensity: ${elemento.propriedades.envMapIntensity}`);
        console.log(`     - Transparente: ${elemento.propriedades.transparent}`);
        console.log(`     - Opacidade: ${elemento.propriedades.opacity}`);
        console.log(`   Posição: ${elemento.posicao}`);
      });
      
      // Agrupar por tipo de detecção
      const grupos = {};
      elementosCinza.forEach(el => {
        if (!grupos[el.deteccao]) grupos[el.deteccao] = [];
        grupos[el.deteccao].push(el);
      });
      
      console.log('\n📋 ===== AGRUPAMENTO POR TIPO DE DETECÇÃO =====');
      Object.entries(grupos).forEach(([tipo, elementos]) => {
        console.log(`\n🏷️ ${tipo.toUpperCase()}: ${elementos.length} elementos`);
        elementos.forEach((el, i) => {
          const corInfo = el.propriedades.cor !== 'N/A' ? el.propriedades.cor.hex : 'sem cor';
          console.log(`   ${i + 1}. ${el.objeto} (${el.materialNome}) - ${corInfo}`);
        });
      });
      
      // Analisar tons de cinza
      const tonsDeGinza = elementosCinza.filter(el => el.propriedades.cor !== 'N/A');
      if (tonsDeGinza.length > 0) {
        console.log('\n🎨 ===== ANÁLISE DE TONS DE CINZA =====');
        tonsDeGinza.forEach(el => {
          const cor = el.propriedades.cor;
          console.log(`${el.objeto}: ${cor.hex} ${cor.rgb}`);
        });
      }
      
      // Expor resultados globalmente
      window.elementosCinza = elementosCinza;
      window.gruposCinza = grupos;
      console.log('\n💾 Resultados salvos em: window.elementosCinza e window.gruposCinza');
    } else {
      console.log('\n❌ Nenhum elemento com material cinza foi encontrado');
      console.log('💡 Possíveis motivos:');
      console.log('   - Materiais não estão nomeados como cinza');
      console.log('   - Cores não estão em tons de cinza');
      console.log('   - Elementos não foram carregados ainda');
    }
    
    return elementosCinza;
    
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
function buscarCinzaNosElementosGLB() {
  console.log('\n🔍 ===== BUSCA NOS ELEMENTOS GLB =====');
  
  if (typeof window !== 'undefined' && window.glbElements) {
    const glbElements = window.glbElements;
    console.log(`📦 Total de elementos GLB: ${glbElements.length}`);
    
    const elementosCinza = glbElements.filter(elemento => {
      const nome = elemento.toLowerCase();
      return nome.includes('cinza') || 
             nome.includes('gray') || 
             nome.includes('grey') ||
             nome.includes('tinta') ||
             nome.includes('paint') ||
             nome.includes('pintura');
    });
    
    console.log(`🎨 Elementos com possível material cinza: ${elementosCinza.length}`);
    
    if (elementosCinza.length > 0) {
      console.log('📋 Lista de elementos encontrados:');
      elementosCinza.forEach((elemento, index) => {
        console.log(`   ${index + 1}. ${elemento}`);
      });
      
      window.elementosCinzaGLB = elementosCinza;
      
    } else {
      console.log('❌ Nenhum elemento GLB relacionado a material cinza encontrado');
    }
    
    return elementosCinza;
  } else {
    console.log('❌ Elementos GLB não disponíveis');
    return [];
  }
}

// Função para analisar materiais com tons de cinza
function analisarMateriaisCinza() {
  console.log('\n🎨 ===== ANÁLISE DE MATERIAIS CINZA =====');
  
  if (typeof window !== 'undefined' && window.glbScene) {
    const scene = window.glbScene;
    const materiaisCinza = [];
    const materiaisUnicos = new Map();
    
    scene.traverse((child) => {
      if (child.material) {
        const materiais = Array.isArray(child.material) ? child.material : [child.material];
        
        materiais.forEach(material => {
          const key = material.uuid;
          
          if (!materiaisUnicos.has(key) && material.color) {
            const cor = material.color;
            const r = cor.r;
            const g = cor.g;
            const b = cor.b;
            
            // Verificar se é um tom de cinza
            const isGrayTone = Math.abs(r - g) < 0.1 && Math.abs(g - b) < 0.1 && Math.abs(r - b) < 0.1;
            
            if (isGrayTone && r > 0.15 && r < 0.85) {
              materiaisCinza.push({
                nome: material.name || 'Sem nome',
                tipo: material.type,
                cor: {
                  hex: `#${material.color.getHexString()}`,
                  rgb: `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`,
                  brilho: (r + g + b) / 3,
                  classificacao: r < 0.3 ? 'Cinza Escuro' : r > 0.7 ? 'Cinza Claro' : 'Cinza Médio'
                },
                roughness: material.roughness,
                metalness: material.metalness,
                objetos: []
              });
            }
            
            materiaisUnicos.set(key, {
              material,
              isGray: isGrayTone && r > 0.15 && r < 0.85,
              objetos: []
            });
          }
          
          // Adicionar objeto à lista
          if (materiaisUnicos.has(key)) {
            materiaisUnicos.get(key).objetos.push(child.name);
          }
        });
      }
    });
    
    console.log(`🎨 Materiais com tons de cinza encontrados: ${materiaisCinza.length}`);
    
    if (materiaisCinza.length > 0) {
      // Ordenar por brilho
      materiaisCinza.sort((a, b) => a.cor.brilho - b.cor.brilho);
      
      materiaisCinza.forEach((mat, i) => {
        console.log(`\n${i + 1}. ${mat.nome}`);
        console.log(`   Tipo: ${mat.tipo}`);
        console.log(`   Cor: ${mat.cor.hex} (${mat.cor.rgb})`);
        console.log(`   Classificação: ${mat.cor.classificacao}`);
        console.log(`   Brilho: ${mat.cor.brilho.toFixed(3)}`);
        console.log(`   Roughness: ${mat.roughness}`);
        console.log(`   Metalness: ${mat.metalness}`);
      });
      
      window.materiaisCinza = materiaisCinza;
    }
    
    return materiaisCinza;
  }
  
  return [];
}

// Executar todas as buscas
console.log('🚀 Iniciando busca por elementos com material cinza...');

const resultadosScene = buscarElementosCinza();
const resultadosGLB = buscarCinzaNosElementosGLB();
const materiaisCinza = analisarMateriaisCinza();

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💡 Para mais detalhes, verifique:');
console.log('   - window.elementosCinza (elementos da scene)');
console.log('   - window.elementosCinzaGLB (elementos GLB)');
console.log('   - window.materiaisCinza (materiais com tons de cinza)');
console.log('   - window.gruposCinza (agrupamento por detecção)');

// Expor funções para chamada manual
window.buscarElementosCinza = buscarElementosCinza;
window.buscarCinzaNosElementosGLB = buscarCinzaNosElementosGLB;
window.analisarMateriaisCinza = analisarMateriaisCinza;

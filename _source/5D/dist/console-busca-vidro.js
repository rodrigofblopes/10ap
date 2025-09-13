// ===== BUSCA RÁPIDA POR VIDRO =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🪟 ===== BUSCA RÁPIDA POR VIDRO =====');

// Função 1: Buscar em elementos GLB por nome
if (window.glbElements) {
  const glbElements = window.glbElements;
  console.log(`📦 Analisando ${glbElements.length} elementos GLB...`);
  
  // Termos relacionados a vidro
  const termosVidro = ['vidro', 'glass', 'cristal', 'transparente', 'janela', 'porta', 'esquadria'];
  
  const resultados = {};
  
  termosVidro.forEach(termo => {
    const encontrados = glbElements.filter(el => 
      el.toLowerCase().includes(termo.toLowerCase())
    );
    
    if (encontrados.length > 0) {
      resultados[termo] = encontrados;
      console.log(`\n🪟 Elementos com "${termo}": ${encontrados.length}`);
      encontrados.slice(0, 8).forEach((el, i) => {
        console.log(`   ${i+1}. ${el}`);
      });
      if (encontrados.length > 8) {
        console.log(`   ... e mais ${encontrados.length - 8} elementos`);
      }
    } else {
      console.log(`❌ Nenhum elemento com "${termo}"`);
    }
  });
  
  // Salvar resultados
  window.resultadosVidroGLB = resultados;
  
} else {
  console.log('❌ window.glbElements não disponível');
}

// Função 2: Analisar materiais transparentes na scene
if (window.glbScene) {
  console.log('\n🔍 ===== ANALISANDO MATERIAIS TRANSPARENTES =====');
  
  let materiaisTransparentes = [];
  let elementosComVidro = [];
  let totalObjetos = 0;
  
  window.glbScene.traverse((child) => {
    totalObjetos++;
    
    if (child.material && child.name) {
      const materiais = Array.isArray(child.material) ? child.material : [child.material];
      
      materiais.forEach((material, index) => {
        // Verificar transparência
        const isTransparente = material.transparent || material.opacity < 1.0;
        
        // Verificar nomes relacionados a vidro
        const nomeVidro = child.name.toLowerCase().includes('vidro') ||
                         child.name.toLowerCase().includes('glass') ||
                         child.name.toLowerCase().includes('janela') ||
                         child.name.toLowerCase().includes('porta') ||
                         child.name.toLowerCase().includes('esquadria');
        
        const materialVidro = material.name && (
          material.name.toLowerCase().includes('vidro') ||
          material.name.toLowerCase().includes('glass') ||
          material.name.toLowerCase().includes('cristal')
        );
        
        if (isTransparente || nomeVidro || materialVidro) {
          const elemento = {
            objeto: child.name,
            material: material.name || 'Sem nome',
            tipo: 'desconhecido',
            propriedades: {
              transparent: material.transparent,
              opacity: material.opacity,
              roughness: material.roughness,
              metalness: material.metalness,
              cor: material.color ? `#${material.color.getHexString()}` : 'N/A'
            },
            posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`
          };
          
          // Determinar tipo
          if (child.name.toLowerCase().includes('janela')) elemento.tipo = 'Janela';
          else if (child.name.toLowerCase().includes('porta')) elemento.tipo = 'Porta';
          else if (child.name.toLowerCase().includes('esquadria')) elemento.tipo = 'Esquadria';
          else if (isTransparente) elemento.tipo = 'Material Transparente';
          else if (nomeVidro || materialVidro) elemento.tipo = 'Vidro';
          
          elementosComVidro.push(elemento);
        }
        
        // Coletar materiais únicos transparentes
        if (isTransparente && material.name) {
          const existe = materiaisTransparentes.find(m => m.nome === material.name);
          if (!existe) {
            materiaisTransparentes.push({
              nome: material.name,
              opacity: material.opacity,
              transparent: material.transparent,
              roughness: material.roughness,
              metalness: material.metalness
            });
          }
        }
      });
    }
  });
  
  console.log(`📊 Analisados ${totalObjetos} objetos`);
  console.log(`🪟 Elementos com vidro/transparentes: ${elementosComVidro.length}`);
  console.log(`🎨 Materiais transparentes únicos: ${materiaisTransparentes.length}`);
  
  if (elementosComVidro.length > 0) {
    // Agrupar por tipo
    const grupos = {};
    elementosComVidro.forEach(el => {
      if (!grupos[el.tipo]) grupos[el.tipo] = [];
      grupos[el.tipo].push(el);
    });
    
    console.log('\n📋 ===== ELEMENTOS POR TIPO =====');
    Object.entries(grupos).forEach(([tipo, elementos]) => {
      console.log(`\n🏷️ ${tipo}: ${elementos.length} elementos`);
      elementos.slice(0, 5).forEach((el, i) => {
        console.log(`   ${i+1}. ${el.objeto}`);
        console.log(`      Material: ${el.material}`);
        console.log(`      Opacity: ${el.propriedades.opacity}`);
        console.log(`      Transparent: ${el.propriedades.transparent}`);
        console.log(`      Cor: ${el.propriedades.cor}`);
      });
      if (elementos.length > 5) {
        console.log(`   ... e mais ${elementos.length - 5} elementos`);
      }
    });
    
    window.elementosVidroScene = elementosComVidro;
    window.gruposVidroScene = grupos;
  }
  
  if (materiaisTransparentes.length > 0) {
    console.log('\n🎨 ===== MATERIAIS TRANSPARENTES =====');
    materiaisTransparentes.forEach((mat, i) => {
      console.log(`${i+1}. ${mat.nome} (opacity: ${mat.opacity})`);
    });
    
    window.materiaisTransparentes = materiaisTransparentes;
  }
  
} else {
  console.log('❌ window.glbScene não disponível');
}

// Função 3: Verificar elementos de esquadrias da planilha
console.log('\n📋 ===== ELEMENTOS DE ESQUADRIAS NA PLANILHA =====');
const esquadriasTerreo = [
  '1.5 Esquadrias Térreo.001',
  '1.5 Esquadrias Térreo.002', 
  '1.5 Esquadrias Térreo.003',
  '1.5 Esquadrias Térreo.004'
];

const esquadriasSuperior = [
  '2.5 Esquadrias Pav. Superior.001',
  '2.5 Esquadrias Pav. Superior.002',
  '2.5 Esquadrias Pav. Superior.003', 
  '2.5 Esquadrias Pav. Superior.004'
];

console.log('🏠 Esquadrias Térreo (4 elementos):');
esquadriasTerreo.forEach((el, i) => console.log(`   ${i+1}. ${el}`));

console.log('🏠 Esquadrias Pav. Superior (4 elementos):');
esquadriasSuperior.forEach((el, i) => console.log(`   ${i+1}. ${el}`));

// Verificar se existem na scene
if (window.glbScene) {
  const todosEsquadrias = [...esquadriasTerreo, ...esquadriasSuperior];
  let encontrados = 0;
  
  window.glbScene.traverse((child) => {
    if (todosEsquadrias.includes(child.name)) {
      encontrados++;
      console.log(`✅ ${child.name} encontrado na scene`);
    }
  });
  
  console.log(`\n📊 Esquadrias encontradas na scene: ${encontrados}/${todosEsquadrias.length}`);
}

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💾 Resultados salvos em:');
console.log('   - window.resultadosVidroGLB (elementos GLB)');
console.log('   - window.elementosVidroScene (elementos da scene)');
console.log('   - window.materiaisTransparentes (materiais transparentes)');
console.log('   - window.gruposVidroScene (grupos por tipo)');

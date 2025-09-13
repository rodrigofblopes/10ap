// ===== BUSCA RÁPIDA POR PAPEL PICADO =====
// Cole este código no console do navegador (F12) na página do Dashboard 5D

console.log('🔍 ===== BUSCA RÁPIDA POR PAPEL PICADO =====');

// Função 1: Buscar em elementos GLB
if (window.glbElements) {
  const glbElements = window.glbElements;
  console.log(`📦 Analisando ${glbElements.length} elementos GLB...`);
  
  // Buscar por "papel", "picado", "wall", "parede", "revestimento"
  const termosBusca = ['papel', 'picado', 'wall', 'parede', 'revestimento', 'tinta', 'pintura'];
  
  termosBusca.forEach(termo => {
    const encontrados = glbElements.filter(el => 
      el.toLowerCase().includes(termo.toLowerCase())
    );
    
    if (encontrados.length > 0) {
      console.log(`\n🎨 Elementos com "${termo}": ${encontrados.length}`);
      encontrados.slice(0, 10).forEach((el, i) => {
        console.log(`   ${i+1}. ${el}`);
      });
      if (encontrados.length > 10) {
        console.log(`   ... e mais ${encontrados.length - 10} elementos`);
      }
    } else {
      console.log(`❌ Nenhum elemento com "${termo}"`);
    }
  });
} else {
  console.log('❌ window.glbElements não disponível');
}

// Função 2: Buscar materiais na scene
if (window.glbScene) {
  console.log('\n🎨 ===== ANALISANDO MATERIAIS DA SCENE =====');
  
  let materiais = new Set();
  let totalObjetos = 0;
  let elementosPapelPicado = [];
  
  window.glbScene.traverse((child) => {
    totalObjetos++;
    
    // Verificar nome do objeto
    if (child.name) {
      const nome = child.name.toLowerCase();
      if (nome.includes('papel') || nome.includes('picado') || nome.includes('wall') || 
          nome.includes('parede') || nome.includes('revestimento')) {
        elementosPapelPicado.push({
          tipo: 'Nome do objeto',
          objeto: child.name,
          posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`
        });
      }
    }
    
    // Verificar materiais
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      
      mats.forEach(material => {
        if (material.name) {
          materiais.add(material.name);
          
          const nomeMaterial = material.name.toLowerCase();
          if (nomeMaterial.includes('papel') || nomeMaterial.includes('picado') || 
              nomeMaterial.includes('wall') || nomeMaterial.includes('parede') || 
              nomeMaterial.includes('revestimento')) {
            elementosPapelPicado.push({
              tipo: 'Material',
              objeto: child.name,
              material: material.name,
              cor: material.color ? `#${material.color.getHexString()}` : 'N/A',
              posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`
            });
          }
        }
      });
    }
  });
  
  console.log(`📊 Analisados ${totalObjetos} objetos`);
  console.log(`📦 Encontrados ${materiais.size} materiais únicos`);
  
  // Mostrar todos os materiais para referência
  const listaMateriais = Array.from(materiais).sort();
  console.log('\n📋 TODOS OS MATERIAIS ENCONTRADOS:');
  listaMateriais.forEach((mat, i) => {
    console.log(`   ${i+1}. ${mat}`);
  });
  
  // Resultados da busca por papel picado
  if (elementosPapelPicado.length > 0) {
    console.log(`\n🎨 ===== ENCONTRADOS ${elementosPapelPicado.length} ELEMENTOS =====`);
    elementosPapelPicado.forEach((el, i) => {
      console.log(`\n${i+1}. ${el.objeto}`);
      console.log(`   Tipo: ${el.tipo}`);
      if (el.material) console.log(`   Material: ${el.material}`);
      if (el.cor) console.log(`   Cor: ${el.cor}`);
      console.log(`   Posição: ${el.posicao}`);
    });
    
    // Salvar resultados
    window.resultadosPapelPicado = elementosPapelPicado;
    console.log('\n💾 Resultados salvos em: window.resultadosPapelPicado');
  } else {
    console.log('\n❌ Nenhum elemento relacionado a papel picado encontrado');
  }
  
  // Salvar todos os materiais
  window.todosMateriais3D = listaMateriais;
  console.log('💾 Todos os materiais salvos em: window.todosMateriais3D');
  
} else {
  console.log('❌ window.glbScene não disponível');
}

// Função 3: Analisar planilha CSV se disponível
if (window.itens5D) {
  console.log('\n📋 ===== ANALISANDO PLANILHA 5D =====');
  
  const itensRevestimento = window.itens5D.filter(item => 
    item.descricao && item.descricao.toLowerCase().includes('revestimento')
  );
  
  if (itensRevestimento.length > 0) {
    console.log(`🏠 Encontrados ${itensRevestimento.length} itens de revestimento:`);
    itensRevestimento.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.id} - ${item.descricao}`);
      if (item.elementos3D) {
        console.log(`      Elementos 3D: ${item.elementos3D}`);
      }
    });
  } else {
    console.log('❌ Nenhum item de revestimento encontrado na planilha');
  }
}

console.log('\n✅ ===== BUSCA CONCLUÍDA =====');
console.log('💡 Se elementos foram encontrados, verifique:');
console.log('   - window.resultadosPapelPicado (elementos encontrados)');
console.log('   - window.todosMateriais3D (todos os materiais)');
console.log('\n💡 Para reexecutar, cole este código novamente no console');

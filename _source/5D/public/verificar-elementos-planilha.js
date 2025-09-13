const fs = require('fs');
const path = require('path');

console.log('🔍 ===== VERIFICAÇÃO DE ELEMENTOS PLANILHA ↔ 3D =====');

// Função para ler e parsear CSV
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const items = [];
  
  for (let i = 2; i < lines.length; i++) { // Pular cabeçalho
    const line = lines[i].trim();
    if (line && !line.startsWith(';;;;') && !line.startsWith('"___')) {
      const columns = line.split(';');
      if (columns.length >= 9 && columns[0].trim() && columns[8]) {
        const item = {
          id: columns[0].trim(),
          descricao: columns[1].trim(),
          elementos3D: columns[8].trim()
        };
        
        if (item.elementos3D && item.elementos3D !== '') {
          items.push(item);
        }
      }
    }
  }
  
  return items;
}

// Ler planilha 5D.csv
try {
  console.log('📋 Lendo planilha 5D.csv...');
  const csvPath = path.join(__dirname, '5D.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const items = parseCSV(csvContent);
  
  console.log(`📊 Total de itens com Elementos3D: ${items.length}`);
  console.log('');
  
  // Extrair todos os elementos únicos da planilha
  const allElements = new Set();
  const itemsWithElements = [];
  
  items.forEach(item => {
    if (item.elementos3D && item.elementos3D.trim() !== '') {
      const elementos = item.elementos3D.split(',').map(el => el.trim()).filter(el => el !== '');
      elementos.forEach(el => allElements.add(el));
      
      itemsWithElements.push({
        ...item,
        elementosArray: elementos
      });
    }
  });
  
  console.log(`🎯 Total de elementos únicos na planilha: ${allElements.size}`);
  console.log('');
  
  // Mostrar elementos por item
  console.log('📋 ===== ELEMENTOS POR ITEM DA PLANILHA =====');
  itemsWithElements.forEach(item => {
    console.log(`\n📌 Item ${item.id}: ${item.descricao}`);
    console.log(`   Elementos (${item.elementosArray.length}): ${item.elementosArray.slice(0, 5).join(', ')}${item.elementosArray.length > 5 ? '...' : ''}`);
  });
  
  console.log('\n🔤 ===== LISTA COMPLETA DE ELEMENTOS DA PLANILHA =====');
  const sortedElements = Array.from(allElements).sort();
  sortedElements.forEach((element, index) => {
    console.log(`${(index + 1).toString().padStart(3, ' ')}: ${element}`);
  });
  
  // Agrupar por padrões
  console.log('\n📊 ===== ANÁLISE POR PADRÕES =====');
  const patterns = {
    'Paredes': sortedElements.filter(el => el.includes('Paredes')),
    'Piso': sortedElements.filter(el => el.includes('Piso')),
    'Esquadrias': sortedElements.filter(el => el.includes('Esquadrias')),
    'Telhado': sortedElements.filter(el => el.includes('Telhado')),
    'Vigas': sortedElements.filter(el => el.includes('Vigas')),
    'Pilares': sortedElements.filter(el => el.includes('Pilares')),
    'Lajes': sortedElements.filter(el => el.includes('Lajes')),
    'Fundações': sortedElements.filter(el => el.includes('Fundações'))
  };
  
  Object.entries(patterns).forEach(([pattern, elements]) => {
    if (elements.length > 0) {
      console.log(`\n🏗️ ${pattern}: ${elements.length} elementos`);
      elements.slice(0, 5).forEach(el => console.log(`   - ${el}`));
      if (elements.length > 5) {
        console.log(`   ... e mais ${elements.length - 5} elementos`);
      }
    }
  });
  
  // Salvar lista de elementos para verificação no 3D
  const outputData = {
    timestamp: new Date().toISOString(),
    totalItems: items.length,
    totalElements: allElements.size,
    elements: sortedElements,
    itemsWithElements: itemsWithElements,
    patterns: patterns
  };
  
  fs.writeFileSync('elementos-planilha-extraidos.json', JSON.stringify(outputData, null, 2));
  console.log('\n💾 Lista de elementos salva em: elementos-planilha-extraidos.json');
  
  console.log('\n✅ ===== VERIFICAÇÃO CONCLUÍDA =====');
  console.log('💡 Para verificar se estes elementos existem no modelo 3D:');
  console.log('   1. Abra o Dashboard 5D no navegador');
  console.log('   2. Abra o Console do desenvolvedor (F12)');
  console.log('   3. Digite: console.log(window.glbElements)');
  console.log('   4. Compare com a lista acima');

} catch (error) {
  console.error('❌ Erro ao processar:', error.message);
}

// Script para testar a funcionalidade de visibilidade
console.log('🧪 ===== TESTE DE VISIBILIDADE =====');

// Simular dados de teste
const testItem = {
  id: '1.1',
  codigo: '1.1',
  descricao: 'Paredes Térreo',
  elementos3D: '1.1 Paredes Térreo.001, 1.1 Paredes Térreo.002, 1.1 Paredes Térreo.003',
  isEtapaTotal: false
};

const testSubcollection = {
  id: '1.1_sub_1.1 Paredes Térreo.001',
  codigo: '1.1',
  descricao: 'Paredes Térreo',
  elementos3D: '1.1 Paredes Térreo.001',
  isSubcollection: true
};

console.log('📋 Item de teste:', testItem);
console.log('🔸 Subcoleção de teste:', testSubcollection);

// Simular elementos GLB disponíveis
const glbElements = [
  '1.1_001',
  '1.1_002', 
  '1.1_003',
  '1.1 Paredes Térreo.001',
  '1.1 Paredes Térreo.002',
  '1.1 Paredes Térreo.003',
  '2.1_001',
  '2.1_002'
];

console.log('📦 Elementos GLB disponíveis:', glbElements);

// Função de teste para mapeamento
function testFindMatchingElements(item) {
  console.log('🔍 Testando mapeamento para:', item);
  
  const elementos3D = item.elementos3D || '';
  let matchingElements = [];
  
  if (elementos3D && elementos3D.trim() !== '') {
    console.log('📋 Elementos3D:', elementos3D);
    
    if (elementos3D.includes('.')) {
      console.log('🔸 Subcoleção individual detectada');
      
      // Mapeamento direto
      const elementoExato = glbElements.find(el => el === elementos3D);
      if (elementoExato) {
        console.log('✅ Mapeamento exato encontrado:', elementoExato);
        return [elementoExato];
      }
      
      // Busca por padrões
      const partes = elementos3D.split('.');
      if (partes.length >= 2) {
        const prefixo = partes[0];
        const numeroFinal = partes[partes.length - 1];
        
        const padroesBusca = [
          `${prefixo.replace(/\s.*/, '').replace('.', '')}_\.${numeroFinal}`,
          `${prefixo.replace(/\s.*/, '').replace('.', '')}_.${numeroFinal}`,
        ];
        
        console.log('🔍 Padrões de busca:', padroesBusca);
        
        for (const padrao of padroesBusca) {
          const elementosEncontrados = glbElements.filter(el => 
            el.includes(padrao) || el.match(new RegExp(padrao.replace('.', '\\.')))
          );
          if (elementosEncontrados.length > 0) {
            console.log(`✅ Encontrados com padrão "${padrao}":`, elementosEncontrados);
            matchingElements = elementosEncontrados;
            break;
          }
        }
      }
    } else {
      console.log('🔸 Coleção completa detectada');
      
      // Buscar por código
      const codigoItem = item.id || item.codigo;
      const elementosPorCodigo = glbElements.filter(elemento => {
        const elementoLower = elemento.toLowerCase();
        const codigoLower = codigoItem.toLowerCase();
        
        return elementoLower.startsWith(codigoLower.replace('.', '') + '_') ||
               elementoLower.startsWith(codigoLower + '_') ||
               elementoLower === codigoLower.replace('.', '') ||
               elementoLower === codigoLower;
      });
      
      if (elementosPorCodigo.length > 0) {
        console.log(`✅ Encontrados ${elementosPorCodigo.length} elementos para código "${codigoItem}":`, elementosPorCodigo);
        matchingElements = elementosPorCodigo;
      }
    }
  }
  
  console.log(`🎯 Total encontrado: ${matchingElements.length}`);
  return matchingElements;
}

// Testar mapeamento
console.log('\n🧪 Testando item completo:');
const result1 = testFindMatchingElements(testItem);
console.log('Resultado:', result1);

console.log('\n🧪 Testando subcoleção individual:');
const result2 = testFindMatchingElements(testSubcollection);
console.log('Resultado:', result2);

// Simular toggle de visibilidade
function testToggleVisibility(item, hiddenElements) {
  console.log('\n👁️ Testando toggle de visibilidade:');
  console.log('Item:', item);
  console.log('Hidden elements atual:', Array.from(hiddenElements));
  
  const elementos = testFindMatchingElements(item);
  const hasHiddenElements = elementos.some(el => hiddenElements.has(el));
  
  console.log('Elementos encontrados:', elementos);
  console.log('Tem elementos ocultos?', hasHiddenElements);
  
  if (hasHiddenElements) {
    console.log('👁️ MOSTRANDO elementos');
    elementos.forEach(el => hiddenElements.delete(el));
  } else {
    console.log('👁️ OCULTANDO elementos');
    elementos.forEach(el => hiddenElements.add(el));
  }
  
  console.log('Hidden elements após toggle:', Array.from(hiddenElements));
  return hiddenElements;
}

// Testar toggle
const hiddenElements = new Set(['1.1_001']);
console.log('\n🧪 Testando toggle com elementos ocultos:');
testToggleVisibility(testItem, hiddenElements);

console.log('\n🧪 Testando toggle novamente (deve ocultar):');
testToggleVisibility(testItem, hiddenElements);

console.log('\n✅ Teste concluído!');

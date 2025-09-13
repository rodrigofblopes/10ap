console.log('🔍 ===== DEBUG SUBCOLEÇÕES =====');

// Verificar se temos elementos GLB disponíveis
if (typeof window !== 'undefined' && window.glbElements) {
  const glbElements = window.glbElements;
  console.log('📦 Total de elementos GLB:', glbElements.length);
  
  // Elementos que parecem ser subcoleções (contêm "_.")
  const subcolecoes = glbElements.filter(el => el.includes('_.'));
  console.log('\n🔸 Subcoleções encontradas (padrão _.):', subcolecoes.length);
  
  // Agrupar por prefixo
  const grupos = {};
  subcolecoes.forEach(el => {
    const match = el.match(/^(\d+\.?\d*)_/);
    if (match) {
      const prefixo = match[1];
      if (!grupos[prefixo]) grupos[prefixo] = [];
      grupos[prefixo].push(el);
    }
  });
  
  console.log('\n📊 Grupos por código:');
  Object.entries(grupos).forEach(([codigo, elementos]) => {
    console.log(`\n🏗️ Código ${codigo}: ${elementos.length} elementos`);
    console.log('   Primeiros 5:', elementos.slice(0, 5));
    
    // Exemplo de mapeamento para planilha
    const exemplo = elementos[0];
    if (exemplo) {
      const partes = exemplo.split('_.');
      if (partes.length >= 2) {
        const numero = partes[1];
        const planilhaFormat = `${codigo} Paredes Térreo.${numero}`;
        console.log(`   📋 Formato planilha seria: "${planilhaFormat}"`);
        console.log(`   🎯 GLB real: "${exemplo}"`);
      }
    }
  });
  
  // Verificar se há elementos com outros padrões
  const outrosPatroes = glbElements.filter(el => !el.includes('_.') && el.includes('.'));
  console.log('\n🔸 Outros padrões com ponto:', outrosPatroes.length);
  if (outrosPatroes.length > 0) {
    console.log('   Exemplos:', outrosPatroes.slice(0, 10));
  }
  
  // Função para testar mapeamento
  window.testSubcollectionMapping = function(planilhaElement) {
    console.log(`\n🧪 TESTE DE MAPEAMENTO: "${planilhaElement}"`);
    
    // Tentar encontrar correspondência
    const found = glbElements.find(el => el === planilhaElement);
    if (found) {
      console.log('✅ Mapeamento direto encontrado:', found);
      return found;
    }
    
    // Tentar conversão de formato
    if (planilhaElement.includes('.')) {
      const partes = planilhaElement.split('.');
      const prefixo = partes[0].replace(/\s.*/, '').replace('.', ''); // Ex: "1.1" -> "11"
      const numero = partes[partes.length - 1]; // Ex: "001"
      
      const padroes = [
        `${prefixo}_.${numero}`,
        `${prefixo}_\.${numero}`,
        `${prefixo}_.0${numero}`,
      ];
      
      console.log('🔍 Tentando padrões:', padroes);
      
      for (const padrao of padroes) {
        const matches = glbElements.filter(el => el.includes(padrao));
        if (matches.length > 0) {
          console.log(`✅ Encontrado com padrão "${padrao}":`, matches);
          return matches[0];
        }
      }
    }
    
    console.log('❌ Nenhuma correspondência encontrada');
    return null;
  };
  
  console.log('\n💡 Para testar um elemento da planilha, use:');
  console.log('   window.testSubcollectionMapping("1.1 Paredes Térreo.001")');
  
} else {
  console.log('❌ Elementos GLB não disponíveis');
  console.log('💡 Abra a página do Dashboard 5D e execute este script no console');
}

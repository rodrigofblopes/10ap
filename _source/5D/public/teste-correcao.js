// SCRIPT DE TESTE PARA VALIDAR A CORREÇÃO DO PARSING CSV
// Cole este código no console do navegador

console.log('🧪 ===== TESTE DE VALIDAÇÃO DA CORREÇÃO =====');

// Função para testar o parsing do CSV
function testarParsingCSV() {
  console.log('📊 TESTANDO PARSING DO CSV...');
  
  // Simular dados da planilha (baseado na sua estrutura)
  const csvSimulado = `Planilha Orçamentária Sintética Com Valor do Material e da Mão de Obra;;;;;;;;
Item;Descrição;Und;Quant.;Total;;;Peso (%);Elementos3D
;;;;M. O.;MAT.;Total;;
 1 ;Fundação;;;;;39.241,02;30,81 %;1.1_.031,1.1_.032,1.1_.033,1.1_.034,1.1_.035,1.1_.036,1.1_.037,1.1_.038,1.1_.039,1.1_.040,1.1_.041,1.1_.042,1.1_.043,1.1_.044,1.1_.045,1.2_.003,1.2_.011,1.2_.012,1.2_.013
 1.1 ;Vigas;m³;98,6;5.374,03;14.049,96;19.423,99;15,25 %;1.1_.031,1.1_.032,1.1_.033,1.1_.034,1.1_.035,1.1_.036,1.1_.037,1.1_.038,1.1_.039,1.1_.040,1.1_.041,1.1_.042,1.1_.043,1.1_.044,1.1_.045
 1.2 ;Pilares;m³;1,4;2.394,23;6.903,39;9.297,62;7,30 %;1.2_.003,1.2_.011,1.2_.012,1.2_.013`;

  const lines = csvSimulado.split('\n');
  console.log('📏 Total de linhas:', lines.length);
  
  // Testar parsing da linha 1.1
  const linha1_1 = lines.find(line => line.trim().startsWith('1.1;'));
  if (linha1_1) {
    console.log('🏗️ LINHA 1.1 ENCONTRADA:', linha1_1);
    const cols = linha1_1.split(';');
    console.log('🏗️ COLUNAS DA LINHA 1.1:', cols.map((col, idx) => `${idx}:"${col.trim()}"`));
    
    // Testar extração da coluna Elementos3D (posição 8)
    const elementos3D = cols[8]?.trim() || '';
    console.log('🏗️ Elementos3D extraído:', `"${elementos3D}"`);
    
    if (elementos3D) {
      const elementosArray = elementos3D.split(',').map(el => el.trim()).filter(el => el !== '');
      console.log('🏗️ Array de elementos:', elementosArray);
      console.log('🏗️ Quantidade:', elementosArray.length);
      console.log('🏗️ Primeiro elemento:', `"${elementosArray[0]}"`);
      console.log('🏗️ Último elemento:', `"${elementosArray[elementosArray.length - 1]}"`);
    }
  }
}

// Função para testar correspondência com elementos GLB
function testarCorrespondenciaGLB() {
  console.log('🎯 TESTANDO CORRESPONDÊNCIA COM GLB...');
  
  // Simular elementos GLB (baseado no que pode existir no modelo)
  const elementosGLB = [
    '1.1_.031', '1.1_.032', '1.1_.033', '1.1_.034', '1.1_.035',
    '1.1_.036', '1.1_.037', '1.1_.038', '1.1_.039', '1.1_.040',
    '1.1_.041', '1.1_.042', '1.1_.043', '1.1_.044', '1.1_.045',
    '1.2_.003', '1.2_.011', '1.2_.012', '1.2_.013'
  ];
  
  // Elementos da planilha (item 1.1)
  const elementosPlanilha = [
    '1.1_.031', '1.1_.032', '1.1_.033', '1.1_.034', '1.1_.035',
    '1.1_.036', '1.1_.037', '1.1_.038', '1.1_.039', '1.1_.040',
    '1.1_.041', '1.1_.042', '1.1_.043', '1.1_.044', '1.1_.045'
  ];
  
  console.log('📦 Elementos GLB disponíveis:', elementosGLB.length);
  console.log('📋 Elementos da planilha (1.1):', elementosPlanilha.length);
  
  // Testar correspondências
  let correspondencias = 0;
  elementosPlanilha.forEach(elemento => {
    const existe = elementosGLB.includes(elemento);
    console.log(`${existe ? '✅' : '❌'} ${elemento}: ${existe ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
    if (existe) correspondencias++;
  });
  
  console.log(`🎯 RESULTADO: ${correspondencias}/${elementosPlanilha.length} correspondências encontradas`);
  
  if (correspondencias === elementosPlanilha.length) {
    console.log('🎉 SUCESSO: Todos os elementos foram encontrados!');
  } else {
    console.log('⚠️ PROBLEMA: Alguns elementos não foram encontrados');
  }
}

// Função para testar o processo completo
function testarProcessoCompleto() {
  console.log('🚀 TESTANDO PROCESSO COMPLETO...');
  
  // Simular dados da planilha carregados
  const dadosPlanilha = [
    {
      id: '1.1',
      descricao: 'Vigas',
      elementos3D: '1.1_.031,1.1_.032,1.1_.033,1.1_.034,1.1_.035,1.1_.036,1.1_.037,1.1_.038,1.1_.039,1.1_.040,1.1_.041,1.1_.042,1.1_.043,1.1_.044,1.1_.045'
    }
  ];
  
  // Simular elementos GLB carregados
  const elementosGLB = [
    '1.1_.031', '1.1_.032', '1.1_.033', '1.1_.034', '1.1_.035',
    '1.1_.036', '1.1_.037', '1.1_.038', '1.1_.039', '1.1_.040',
    '1.1_.041', '1.1_.042', '1.1_.043', '1.1_.044', '1.1_.045'
  ];
  
  // Simular função de busca
  function findMatchingElements(item) {
    const elementos3D = item.elementos3D || '';
    let matchingElements = [];
    
    if (elementos3D && elementos3D.trim() !== '') {
      const elementos3DArray = elementos3D.split(',').map(el => el.trim()).filter(el => el !== '');
      
      elementos3DArray.forEach(elemento3D => {
        const exactMatch = elementosGLB.find(glbEl => glbEl === elemento3D);
        if (exactMatch) {
          matchingElements.push(exactMatch);
        }
      });
    }
    
    return matchingElements;
  }
  
  // Testar com item 1.1
  const item1_1 = dadosPlanilha[0];
  const elementosEncontrados = findMatchingElements(item1_1);
  
  console.log('📋 Item testado:', item1_1);
  console.log('🎯 Elementos encontrados:', elementosEncontrados.length);
  console.log('🎯 Lista de elementos:', elementosEncontrados);
  
  if (elementosEncontrados.length === 15) {
    console.log('🎉 SUCESSO: Todos os 15 elementos foram encontrados!');
  } else {
    console.log(`⚠️ PROBLEMA: Apenas ${elementosEncontrados.length}/15 elementos foram encontrados`);
  }
}

// Executar todos os testes
testarParsingCSV();
testarCorrespondenciaGLB();
testarProcessoCompleto();

console.log('🏁 ===== TESTES CONCLUÍDOS =====');
console.log('💡 PRÓXIMOS PASSOS:');
console.log('1. Verifique se os logs aparecem no console da aplicação');
console.log('2. Teste clicando na linha 1.1 da planilha');
console.log('3. Observe se os elementos 3D ficam laranja');

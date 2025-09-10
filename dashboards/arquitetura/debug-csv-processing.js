// Script de diagnóstico para verificar o processamento da planilha 5DARQ.csv
// Execute este script no console do navegador para diagnosticar problemas

function debugCSVProcessing() {
  console.log('🔍 ===== DIAGNÓSTICO DO PROCESSAMENTO CSV =====');
  
  // Simular o conteúdo da planilha
  const csvContent = `Planilha Orçamentária Sintética Com Valor do Material e da Mão de Obra;;;;;;;;;
Item;Descrição;Und;Quant.;Total;;;Peso (%);Elementos3D
;;;;M. O.;MAT.;Total;;
1;PAVIMENTO TÉRREO;;;67.392,92;132.731,35;200.124,27;47,16%;
 1.1 ;PAREDES;m²;384,06;33.689,73;37.357,52;71.047,25;16,74%;1.1_.001,1.1_.002,1.1_.003,1.1_.004,1.1_.005,1.1_.006,1.1_.007,1.1_.008,1.1_.009,1.1_.010,1.1_.011,1.1_.012,1.1_.013,1.1_.014,1.1_.015,1.1_.016,1.1_.017,1.1_.018,1.1_.019,1.1_.020,1.1_.021,1.1_.022,1.1_.023,
 1.2 ;PISO;m²;134,52;4.241,41;36.036,56;40.277,97;9,49%;1.2_.001,1.2_.002,1.2_.003,1.2_.004,1.2_.005,1.2_.006,1.2_.007,1.2_.008,1.2_.009,1.2_.010,1.2_.011,1.2_.012,1.2_.013,1.2_.014,1.2_.015,1.2_.016,1.2_.017,1.2_.018,1.2_.019
 1.3 ;REVESTIMENTO PAREDES;m²;768,12;21.441,68;35.382,07;56.823,75;13,39%;
 1.4 ;FORRO;m²;134,52;5.474,95;5.633,70;11.108,65;2,62%;
 1.5 ;ESQUADRIAS;unid;30;2.545,15;18.321,50;20.866,65;4,92%;
2;PAVIMENTO SUPERIOR;;;75.036,27;149.217,16;224.253,43;52,84%;
 2.1 ;PAREDES;m²;423,58;37.156,42;41.201,63;78.358,05;18,46%;2.1_.001,2.1_.002,2.1_.003,2.1_.004,2.1_.005,2.1_.006,2.1_.007,2.1_.008,2.1_.009,2.1_.010,2.1_.011,2.1_.012,2.1_.013,2.1_.014,2.1_.015,2.1_.016,2.1_.017,2.1_.018,2.1_.019,2.1_.020,2.1_.021,2.1_.022,2.1_.023
 2.2 ;PISO;m²;134,52;4.241,41;36.036,56;40.277,97;9,49%;2.2_,2.2_.001,2.2_.002,2.2_.003,2.2_.004,2.2_.005,2.2_.006,2.2_.007,2.2_.008,2.2_.009,2.2_.010,2.2_.011,2.2_.012,2.2_.013,2.2_.014,2.2_.015,2.2_.016,2.2_.017,2.2_.018,2.2_.019,
 2.3 ;REVESTIMENTO PAREDES;m²;847,16;23.265,93;38.283,62;61.549,55;14,50%;
 2.4 ;FORRO;m²;134,52;5.474,95;5.633,70;11.108,65;2,62%;
 2.5 ;ESQUADRIAS;unid;30;2.545,15;18.321,50;20.866,65;4,92%;
 2.6 ;TELHADO;m²;171,21;2.352,41;9.740,15;12.092,56;2,85%;2.6_
;;;;142.429,19;281.948,51;424.377,70;;
;;;;;424.377,70;;;`;

  const lines = csvContent.split('\n');
  console.log('📏 Total de linhas:', lines.length);
  
  // Verificar cada linha
  lines.forEach((line, index) => {
    if (line.trim()) {
      console.log(`Linha ${index + 1}:`, line);
      
      // Verificar se contém item 2.6
      if (line.includes('2.6')) {
        console.log('🎯 ENCONTRADO ITEM 2.6 na linha', index + 1);
        const columns = line.split(';');
        console.log('📊 Colunas da linha 2.6:', columns.map((col, i) => `${i}: "${col.trim()}"`));
      }
    }
  });
  
  // Simular o processamento
  console.log('\n🔧 ===== SIMULANDO PROCESSAMENTO =====');
  const dados = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line || line.startsWith(';') || line.includes('Total sem BDI') || line.includes('Total Geral')) {
      console.log(`⏭️ Pulando linha ${i + 1}: ${line.substring(0, 50)}...`);
      continue;
    }
    
    const columns = line.split(';');
    
    if (columns.length >= 8) {
      const item = columns[0]?.trim();
      const descricao = columns[1]?.trim();
      
      if (item && descricao) {
        console.log(`✅ Processando item ${item}: ${descricao}`);
        dados.push({ item, descricao });
        
        // Verificar se é o item 2.6
        if (item === '2.6') {
          console.log('🎯 ITEM 2.6 PROCESSADO COM SUCESSO!');
        }
      }
    } else {
      console.log(`❌ Linha ${i + 1} com colunas insuficientes (${columns.length}):`, line.substring(0, 50));
    }
  }
  
  console.log('\n📊 ===== RESULTADO FINAL =====');
  console.log('Total de itens processados:', dados.length);
  console.log('Itens encontrados:', dados.map(d => d.item).join(', '));
  
  // Verificar se 2.6 foi processado
  const item26 = dados.find(d => d.item === '2.6');
  if (item26) {
    console.log('✅ Item 2.6 foi processado corretamente:', item26);
  } else {
    console.log('❌ Item 2.6 NÃO foi processado!');
  }
}

// Executar o diagnóstico
debugCSVProcessing();

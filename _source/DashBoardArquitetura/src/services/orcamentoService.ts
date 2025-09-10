import { OrcamentoItem } from '../types/orcamento';
import * as XLSX from 'xlsx';
import { dadosOrcamento } from '../data/orcamentoData';

// Dados mockados removidos - sistema usa apenas dados reais da planilha CSV

export const carregarDados = async (): Promise<OrcamentoItem[]> => {
  try {
    // Carregar apenas o arquivo 5DARQ.csv (dados reais)
    console.log('🚀 ===== INICIANDO CARREGAMENTO DE DADOS =====');
    console.log('📁 Carregando dados reais da planilha 5DARQ.csv...');
    console.log('🌐 URL base:', window.location.origin);
    console.log('📂 Caminho atual:', window.location.pathname);
    
    // Tentar diferentes caminhos para o CSV
    const possiblePaths = ['/5DARQ.csv', './5DARQ.csv', '5DARQ.csv'];
    let csvResponse: Response | null = null;
    let csvPath = '';
    
    for (const path of possiblePaths) {
      try {
        console.log(`Tentando carregar CSV de: ${path}`);
        csvResponse = await fetch(path);
        if (csvResponse.ok) {
          csvPath = path;
          break;
        }
      } catch (e) {
        console.log(`Falha ao carregar de ${path}:`, e);
      }
    }
    
    if (!csvResponse || !csvResponse.ok) {
      throw new Error(`Erro ao carregar 5DARQ.csv de qualquer caminho. Status: ${csvResponse?.status}`);
    }
    
    console.log(`✅ CSV carregado com sucesso de: ${csvPath}`);
    console.log('📊 Status da resposta CSV:', csvResponse.status);
    console.log('📋 Headers da resposta:', Object.fromEntries(csvResponse.headers.entries()));
    
    const csvContent = await csvResponse.text();
    console.log('📄 CSV carregado, processando dados...');
    console.log('📝 Primeiras 500 caracteres do CSV:', csvContent.substring(0, 500));
    console.log('📏 Tamanho total do CSV:', csvContent.length);
    
    const dadosProcessados = processarDadosCSV5DARQ(csvContent);
    
    if (dadosProcessados.length === 0) {
      console.error('Nenhum dado processado. Conteúdo CSV:', csvContent);
      throw new Error('Nenhum dado válido encontrado na planilha CSV');
    }
    
    console.log('✅ Dados reais carregados:', dadosProcessados.length, 'itens');
    console.log('📊 Total geral:', dadosProcessados
      .filter(item => item.isEtapaTotal)
      .reduce((sum, item) => sum + item.total, 0)
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    
    return dadosProcessados;
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados da planilha:', error);
    console.log('🔄 Usando dados incorporados como fallback...');
    
    // Usar dados incorporados como fallback
    console.log('✅ Dados incorporados carregados:', dadosOrcamento.length, 'itens');
    console.log('📊 Total geral:', dadosOrcamento
      .filter(item => item.isEtapaTotal)
      .reduce((sum, item) => sum + item.total, 0)
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    
    return dadosOrcamento;
  }
};

// Função para processar dados do Excel 5DEST.xlsx
export const processarDadosExcel5DEST = (excelData: ArrayBuffer): OrcamentoItem[] => {
  console.log('Processando Excel 5DEST...');
  try {
    const workbook = XLSX.read(excelData, { type: 'array' });
    console.log('Planilhas disponíveis:', workbook.SheetNames);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converter para JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Total de linhas no Excel:', jsonData.length);
    console.log('Primeiras 5 linhas:', jsonData.slice(0, 5));
    
    const dados: OrcamentoItem[] = [];
  
  // Pular as primeiras 3 linhas (cabeçalho)
  for (let i = 3; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    // Log para debug das primeiras linhas
    if (i < 10) {
      console.log(`Linha ${i}:`, row);
    }
    
    if (!row || row.length < 8) continue;
    
    const item = row[0]?.toString().trim();
    const descricao = row[1]?.toString().trim();
    const unidade = row[2]?.toString().trim();
    const quantidade = parseFloat(row[3]?.toString().replace(',', '.') || '0');
    const maoDeObraTotal = parseFloat(row[4]?.toString().replace(',', '.') || '0');
    const materiaisTotal = parseFloat(row[5]?.toString().replace(',', '.') || '0');
    const totalFinal = parseFloat(row[6]?.toString().replace(',', '.') || '0');
    const pesoPercentual = parseFloat(row[7]?.toString().replace('%', '').replace(',', '.') || '0');
    
    // Determinar categoria e subcategoria baseado no item
    let categoria = 'Fundação';
    let subcategoria = 'Outros';
    let isEtapaTotal = false;
    
    // Verificar se é um total de etapa (sem subitem)
    if (item === '1' || item === '2' || item === '3') {
      isEtapaTotal = true;
      if (item === '1') {
        categoria = 'Fundação';
        subcategoria = 'Total';
      } else if (item === '2') {
        categoria = 'Térreo';
        subcategoria = 'Total';
      } else if (item === '3') {
        categoria = 'Pavimento Superior';
        subcategoria = 'Total';
      }
    } else if (item.startsWith('1.')) {
      categoria = 'Fundação';
      if (item === '1.1') subcategoria = 'Vigas';
      else if (item === '1.2') subcategoria = 'Pilares';
      else if (item === '1.3') subcategoria = 'Fundações';
    } else if (item.startsWith('2.')) {
      categoria = 'Térreo';
      if (item === '2.1') subcategoria = 'Vigas';
      else if (item === '2.2') subcategoria = 'Pilares';
      else if (item === '2.3') subcategoria = 'Lajes';
    } else if (item.startsWith('3.')) {
      categoria = 'Pavimento Superior';
      if (item === '3.1') subcategoria = 'Vigas';
      else if (item === '3.2') subcategoria = 'Pilares';
      else if (item === '3.3') subcategoria = 'Lajes';
    }
    
    // Log para debug
    if (i < 10) {
      console.log(`Processando linha ${i}:`, { item, descricao, quantidade, totalFinal, isEtapaTotal });
    }
    
    if (item && descricao && (quantidade > 0 || totalFinal > 0 || isEtapaTotal)) {
      // Para totais das etapas principais, calcular M.O. e MAT. baseado nos subitens
      let maoDeObraFinal = maoDeObraTotal;
      let materiaisFinal = materiaisTotal;
      
      if (isEtapaTotal) {
        // Para totais das etapas, usar valores proporcionais baseados no total
        // Assumir 30% M.O. e 70% MAT. como proporção típica
        maoDeObraFinal = totalFinal * 0.30;
        materiaisFinal = totalFinal * 0.70;
      } else {
        // Para subitens, usar valores diretos da planilha
        maoDeObraFinal = maoDeObraTotal;
        materiaisFinal = materiaisTotal;
      }
      
      dados.push({
        id: item,
        codigo: item, // Usar o item como código
        nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
        descricao: descricao,
        categoria: categoria,
        subcategoria: subcategoria,
        unidade: unidade,
        quantidade: quantidade,
        valorUnitario: quantidade > 0 ? totalFinal / quantidade : 0,
        maoDeObra: maoDeObraFinal,
        materiais: materiaisFinal,
        total: totalFinal,
        area: 149, // Área padrão por pavimento
        peso: pesoPercentual,
        isEtapaTotal: isEtapaTotal,
        elementos3D: '' // Elementos 3D não disponíveis na planilha 5DEST
      });
    }
  }
  
  console.log('Dados processados da planilha 5DEST Excel:', dados.length, 'itens');
  console.log('Primeiros itens:', dados.slice(0, 3));
  return dados;
  } catch (error) {
    console.error('Erro ao processar Excel 5DEST:', error);
    return [];
  }
};

// CORREÇÃO COMPLETA DO PARSING CSV - 5DARQ.csv
export const processarDadosCSV5DARQ = (csvContent: string): OrcamentoItem[] => {
  console.log('📊 ===== PROCESSANDO CSV 5DARQ (VERSÃO CORRIGIDA) =====');
  console.log('📄 Processando CSV 5DARQ...');
  
  const lines = csvContent.split('\n');
  console.log('📏 Total de linhas:', lines.length);
  console.log('📋 Primeiras 5 linhas:', lines.slice(0, 5));
  
  const dados: OrcamentoItem[] = [];

  // Analisar o cabeçalho para identificar as colunas corretas
  if (lines.length > 0) {
    const header = lines[0];
    console.log('📋 CABEÇALHO DETECTADO:', header);
    
    // Dividir cabeçalho para identificar posições das colunas
    const headerColumns = header.split(';').map(col => col.trim());
    console.log('📊 COLUNAS DO CABEÇALHO:', headerColumns.map((col, index) => `${index}: ${col}`));
    
    // Encontrar a posição da coluna Elementos3D
    const elementos3DIndex = headerColumns.findIndex(col => 
      col.toLowerCase().includes('elementos') || 
      col.toLowerCase().includes('3d') ||
      col === 'Elementos3D'
    );
    console.log(`🎯 Coluna Elementos3D encontrada na posição: ${elementos3DIndex}`);
  }

  // Processar dados a partir da linha 1 (após cabeçalho)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Log para debug das primeiras linhas
    if (i <= 5) {
      console.log(`Linha ${i}:`, line);
    }

    // Pular linhas vazias ou de totais gerais
    if (!line || line.startsWith(';') || line.includes('Total sem BDI') || line.includes('Total Geral')) {
      continue;
    }

    const columns = line.split(';');
    console.log(`📊 Linha ${i} - Colunas (${columns.length}):`, columns.map((col, index) => `${index}: "${col.trim()}"`));

    if (columns.length >= 8) { // Ajustar conforme necessário
      const item = columns[0]?.trim();
      const descricao = columns[1]?.trim();
      const unidade = columns[2]?.trim();
      const quantidade = parseFloat(columns[3]?.replace(',', '.') || '0');
      
      // CORREÇÃO: Ajustar posições baseado na estrutura real
      // Baseado na sua planilha: Item|Descrição|Und|Quant|M.O.|MAT.|Total|Peso(%)|Elementos3D
      const maoDeObraStr = columns[4]?.trim() || '0';
      const materiaisStr = columns[5]?.trim() || '0';
      const totalStr = columns[6]?.trim() || '0';
      const pesoStr = columns[7]?.trim() || '0';
      const elementos3D = columns[8]?.trim() || ''; // POSIÇÃO CORRIGIDA
      
      // Converter valores corretamente (formato brasileiro: 39.241,02)
      const maoDeObraTotal = parseFloat(maoDeObraStr.replace(/\./g, '').replace(',', '.') || '0');
      const materiaisTotal = parseFloat(materiaisStr.replace(/\./g, '').replace(',', '.') || '0');
      const totalFinal = parseFloat(totalStr.replace(/\./g, '').replace(',', '.') || '0');
      const pesoPercentual = parseFloat(pesoStr.replace('%', '').replace(',', '.') || '0');
      
      // Debug detalhado para item 1.1
      if (item === '1.1') {
        console.log('🏗️ ===== ITEM 1.1 (VIGAS) DETECTADO =====');
        console.log('🏗️ Item:', item);
        console.log('🏗️ Descrição:', descricao);
        console.log('🏗️ Elementos3D RAW:', `"${elementos3D}"`);
        console.log('🏗️ Elementos3D LENGTH:', elementos3D.length);
        console.log('🏗️ Possui vírgulas?', elementos3D.includes(','));
        
        if (elementos3D && elementos3D.includes(',')) {
          const elementosArray = elementos3D.split(',').map(el => el.trim()).filter(el => el !== '');
          console.log('🏗️ Elementos3D ARRAY:', elementosArray);
          console.log('🏗️ Quantidade de elementos:', elementosArray.length);
          console.log('🏗️ Primeiro elemento:', `"${elementosArray[0]}"`);
          console.log('🏗️ Último elemento:', `"${elementosArray[elementosArray.length - 1]}"`);
        } else {
          console.log('🏗️ ⚠️ Elementos3D não contém vírgulas ou está vazio!');
        }
      }

      // Debug para todos os itens com elementos3D
      if (elementos3D && elementos3D.trim() !== '') {
        console.log(`📋 Item ${item} possui elementos3D:`, `"${elementos3D}"`);
      }

      // Pular linha de totais gerais (sem item)
      if (!item || item === '') {
        continue;
      }

      // Determinar categoria e subcategoria baseado no item
      let categoria = 'Fundação';
      let subcategoria = 'Outros';
      let isEtapaTotal = false;

      // Verificar se é um total de etapa (sem subitem)
      if (item === '1' || item === '2' || item === '3') {
        isEtapaTotal = true;
        if (item === '1') {
          categoria = 'Fundação';
          subcategoria = 'Total';
        } else if (item === '2') {
          categoria = 'Térreo';
          subcategoria = 'Total';
        } else if (item === '3') {
          categoria = 'Pavimento Superior';
          subcategoria = 'Total';
        }
      } else if (item.startsWith('1.')) {
        categoria = 'Fundação';
        if (item === '1.1') subcategoria = 'Vigas';
        else if (item === '1.2') subcategoria = 'Pilares';
        else if (item === '1.3') subcategoria = 'Fundações';
      } else if (item.startsWith('2.')) {
        categoria = 'Térreo';
        if (item === '2.1') subcategoria = 'Vigas';
        else if (item === '2.2') subcategoria = 'Pilares';
        else if (item === '2.3') subcategoria = 'Lajes';
      } else if (item.startsWith('3.')) {
        categoria = 'Pavimento Superior';
        if (item === '3.1') subcategoria = 'Vigas';
        else if (item === '3.2') subcategoria = 'Pilares';
        else if (item === '3.3') subcategoria = 'Lajes';
      }

      // Debug para entender por que alguns itens não são processados
      if (i < 10) {
        console.log(`Validação linha ${i}:`, {
          item,
          descricao,
          quantidade,
          totalFinal,
          isEtapaTotal,
          condicao: item && descricao && (quantidade > 0 || totalFinal > 0 || isEtapaTotal)
        });
      }

      if (item && descricao && (quantidade > 0 || totalFinal > 0 || isEtapaTotal)) {
        // Para totais das etapas principais, calcular M.O. e MAT. baseado nos subitens
        let maoDeObraFinal = maoDeObraTotal;
        let materiaisFinal = materiaisTotal;

        if (isEtapaTotal) {
          // Para totais das etapas, calcular baseado nos subitens da mesma categoria
          // Isso será feito após processar todos os itens
          maoDeObraFinal = 0; // Será calculado depois
          materiaisFinal = 0; // Será calculado depois
        } else {
          // Para subitens, usar valores diretos da planilha
          maoDeObraFinal = maoDeObraTotal;
          materiaisFinal = materiaisTotal;
        }

        dados.push({
          id: item,
          codigo: item, // Usar o item como código
          nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
          descricao: descricao,
          categoria: categoria,
          subcategoria: subcategoria,
          unidade: unidade,
          quantidade: quantidade,
          valorUnitario: quantidade > 0 ? totalFinal / quantidade : 0,
          maoDeObra: maoDeObraFinal,
          materiais: materiaisFinal,
          total: totalFinal,
          area: 149, // Área padrão por pavimento
          peso: pesoPercentual,
          isEtapaTotal: isEtapaTotal,
          elementos3D: elementos3D // Elementos 3D da coluna Elementos3D
        });
      }
    }
  }

  // Calcular valores de M.O. e materiais para os totais das etapas baseados nos subitens
  const etapas = ['1', '2', '3'];
  etapas.forEach(etapa => {
    const totalEtapa = dados.find(item => item.id === etapa);
    if (totalEtapa) {
      // Encontrar todos os subitens desta etapa
      const subitens = dados.filter(item => item.id.startsWith(etapa + '.'));
      
      // Somar M.O. e materiais dos subitens
      const totalMO = subitens.reduce((sum, item) => sum + item.maoDeObra, 0);
      const totalMAT = subitens.reduce((sum, item) => sum + item.materiais, 0);
      
      // Atualizar os valores do total da etapa
      totalEtapa.maoDeObra = totalMO;
      totalEtapa.materiais = totalMAT;
      
      console.log(`📊 Etapa ${etapa} (${totalEtapa.descricao}): M.O. = ${totalMO.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, MAT. = ${totalMAT.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    }
  });

  // Resumo final
  const itensComElementos3D = dados.filter(item => item.elementos3D && item.elementos3D.trim() !== '');
  console.log('📊 ===== RESUMO FINAL =====');
  console.log('📋 Total de itens processados:', dados.length);
  console.log('🔗 Itens com elementos3D:', itensComElementos3D.length);
  console.log('📋 Lista de itens com elementos3D:');
  
  itensComElementos3D.forEach(item => {
    console.log(`   ${item.id}: ${item.elementos3D}`);
  });

  console.log('✅ Dados processados da planilha 5DEST:', dados.length, 'itens');
  return dados;
};

// FUNÇÃO DE TESTE ESPECÍFICA PARA VALIDAR A CORREÇÃO
export const testarCorrecaoCSV = (csvContent: string) => {
  console.log('🧪 ===== TESTE DE VALIDAÇÃO DA CORREÇÃO =====');
  
  const lines = csvContent.split('\n');
  
  // Testar o parsing das primeiras linhas
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(';');
    console.log(`Linha ${i}:`, {
      totalColunas: columns.length,
      item: columns[0]?.trim(),
      descricao: columns[1]?.trim(),
      elementos3D_pos8: columns[8]?.trim(),
      elementos3D_pos9: columns[9]?.trim(),
      todasColunas: columns.map((col, idx) => `${idx}:"${col.trim()}"`)
    });
  }
  
  // Procurar especificamente pela linha do item 1.1
  const linha1_1 = lines.find(line => line.trim().startsWith('1.1;'));
  if (linha1_1) {
    console.log('🏗️ LINHA 1.1 ENCONTRADA:', linha1_1);
    const cols = linha1_1.split(';');
    console.log('🏗️ COLUNAS DA LINHA 1.1:', cols.map((col, idx) => `${idx}:"${col.trim()}"`));
  } else {
    console.log('❌ Linha 1.1 NÃO encontrada');
  }
};

// Função para processar dados do CSV EST10AP.csv (mantida para compatibilidade)
export const processarDadosCSV = (csvContent: string): OrcamentoItem[] => {
  const lines = csvContent.split('\n');
  const dados: OrcamentoItem[] = [];
  
  // Pular as primeiras 3 linhas (cabeçalho)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith(';') || line.includes('Total sem BDI') || line.includes('Total Geral')) {
      continue;
    }
    
    const columns = line.split(';');
    if (columns.length >= 12) {
      const item = columns[0]?.trim();
      const descricao = columns[1]?.trim();
      const unidade = columns[2]?.trim();
      const quantidade = parseFloat(columns[3]?.replace(',', '.') || '0');
      const valorUnitario = parseFloat(columns[4]?.replace(',', '.') || '0');
      // const maoDeObra = parseFloat(columns[5]?.replace(',', '.') || '0');
      // const materiais = parseFloat(columns[6]?.replace(',', '.') || '0');
      // const total = parseFloat(columns[7]?.replace(',', '.') || '0');
      const maoDeObraTotal = parseFloat(columns[8]?.replace(',', '.') || '0');
      const materiaisTotal = parseFloat(columns[9]?.replace(',', '.') || '0');
      const totalFinal = parseFloat(columns[10]?.replace(',', '.') || '0');
      const pesoPercentual = parseFloat(columns[11]?.replace('%', '').replace(',', '.') || '0');
      const elementos3D = columns[12]?.trim() || ''; // Nova coluna Elementos 3D
      
      // Determinar categoria e subcategoria baseado no item e descrição
      let categoria = 'Fundação';
      let subcategoria = 'Outros';
      let isEtapaTotal = false;
      
      // Verificar se é um total de etapa (sem subitem)
      if (item.trim() === '1' || item.trim() === '2' || item.trim() === '3') {
        isEtapaTotal = true;
        if (item.trim() === '1') {
          categoria = 'Fundação';
          subcategoria = 'Total';
        } else if (item.trim() === '2') {
          categoria = 'Térreo';
          subcategoria = 'Total';
        } else if (item.trim() === '3') {
          categoria = 'Pavimento Superior';
          subcategoria = 'Total';
        }
      }
      
      if (item && descricao && (quantidade > 0 || totalFinal > 0 || isEtapaTotal)) {
        // Continuar com a lógica de categorização se não for etapa total
        if (!isEtapaTotal) {
          if (item.startsWith('1.')) {
            categoria = 'Fundação';
            if (item === '1.1') subcategoria = 'Vigas';
            else if (item === '1.2') subcategoria = 'Pilares';
            else if (item === '1.3') subcategoria = 'Fundações';
          } else if (item.startsWith('2.')) {
            categoria = 'Térreo';
            if (item === '2.1') subcategoria = 'Vigas';
            else if (item === '2.2') subcategoria = 'Pilares';
            else if (item === '2.3') subcategoria = 'Lajes';
          } else if (item.startsWith('3.')) {
            categoria = 'Pavimento Superior';
            if (item === '3.1') subcategoria = 'Vigas';
            else if (item === '3.2') subcategoria = 'Pilares';
            else if (item === '3.3') subcategoria = 'Lajes';
          }
        }
        
        // Para totais das etapas principais, calcular M.O. e MAT. baseado nos subitens
        let maoDeObraFinal = maoDeObraTotal;
        let materiaisFinal = materiaisTotal;
        
        if (isEtapaTotal) {
          // Para totais das etapas, usar valores proporcionais baseados no total
          // Assumir 30% M.O. e 70% MAT. como proporção típica
          maoDeObraFinal = totalFinal * 0.30;
          materiaisFinal = totalFinal * 0.70;
        }
        
        dados.push({
          id: item,
          codigo: '', // Não disponível no CSV
          nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
          descricao: descricao,
          categoria: categoria,
          subcategoria: subcategoria,
          unidade: unidade,
          quantidade: quantidade,
          valorUnitario: valorUnitario,
          maoDeObra: maoDeObraFinal,
          materiais: materiaisFinal,
          total: totalFinal,
          area: 149, // Área padrão por pavimento
          peso: pesoPercentual,
          isEtapaTotal: isEtapaTotal,
          elementos3D: elementos3D // Nova propriedade para linking 3D
        });
      }
    }
  }
  
  return dados;
};

export const processarDadosExcel = (excelData: ArrayBuffer): OrcamentoItem[] => {
  const workbook = XLSX.read(excelData, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converter para JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  const dados: OrcamentoItem[] = [];
  
  // Pular as primeiras linhas (cabeçalho)
  for (let i = 3; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    
    if (!row || row.length < 12) continue;
    
    const item = row[0]?.toString().trim();
    const descricao = row[1]?.toString().trim();
    const unidade = row[2]?.toString().trim();
    const quantidade = parseFloat(row[3]?.toString().replace(',', '.') || '0');
    // const maoDeObraUnit = parseFloat(row[5]?.toString().replace(',', '.') || '0');
    // const materiaisUnit = parseFloat(row[6]?.toString().replace(',', '.') || '0');
    const totalUnit = parseFloat(row[7]?.toString().replace(',', '.') || '0');
    const maoDeObraTotal = parseFloat(row[8]?.toString().replace(',', '.') || '0');
    const materiaisTotal = parseFloat(row[9]?.toString().replace(',', '.') || '0');
    const totalFinal = parseFloat(row[10]?.toString().replace(',', '.') || '0');
    const pesoPercentual = parseFloat(row[11]?.toString().replace('%', '').replace(',', '.') || '0');
    
    // Pular linhas de cabeçalho ou totais
    if (!item || !descricao || quantidade <= 0 || 
        descricao.includes('Fundação') || descricao.includes('Térreo') || 
        descricao.includes('Pavimento Superior') || descricao.includes('Totais')) {
      continue;
    }
    
    // Determinar categoria e subcategoria baseado no item
    let categoria = 'Fundação';
    let subcategoria = 'Outros';
    
    if (item.startsWith('1.')) {
      categoria = 'Fundação';
      if (item.includes('1.1')) subcategoria = 'Vigas';
      else if (item.includes('1.2')) subcategoria = 'Pilares';
      else if (item.includes('1.3')) subcategoria = 'Fundações';
    } else if (item.startsWith('2.')) {
      categoria = 'Térreo';
      if (item.includes('2.1')) subcategoria = 'Vigas';
      else if (item.includes('2.2')) subcategoria = 'Pilares';
      else if (item.includes('2.3')) subcategoria = 'Lajes';
    } else if (item.startsWith('3.')) {
      categoria = 'Pavimento Superior';
      if (item.includes('3.1')) subcategoria = 'Vigas';
      else if (item.includes('3.2')) subcategoria = 'Pilares';
      else if (item.includes('3.3')) subcategoria = 'Lajes';
    }
    
    dados.push({
      id: item,
      codigo: '', // Não disponível no Excel
      nome: descricao.length > 50 ? descricao.substring(0, 50) + '...' : descricao,
      descricao: descricao,
      categoria: categoria,
      subcategoria: subcategoria,
      unidade: unidade,
      quantidade: quantidade,
      valorUnitario: totalUnit,
      maoDeObra: maoDeObraTotal,
      materiais: materiaisTotal,
      total: totalFinal,
      area: 149, // Área padrão por pavimento
      peso: pesoPercentual,
      elementos3D: '' // Elementos 3D não disponíveis no Excel por enquanto
    });
  }
  
  return dados;
};
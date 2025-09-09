import { OrcamentoItem } from '../types/orcamento';

// Função para processar dados do CSV 5DARQ.csv
const processarDadosCSV5DARQ = (csvContent: string): OrcamentoItem[] => {
  const lines = csvContent.split('\n');
  const dados: OrcamentoItem[] = [];
  
  console.log('Total de linhas no CSV:', lines.length);
  console.log('Primeiras 5 linhas:', lines.slice(0, 5));
  console.log('Todas as linhas do CSV:', lines);
  
  // Processar todas as linhas que contêm dados (a partir da linha 4)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pular linhas vazias ou que são apenas separadores
    if (!line || line.startsWith(';') || line === '') {
      console.log(`Linha ${i} vazia ou separador, pulando...`);
      continue;
    }
    
    const columns = line.split(';');
    console.log(`Linha ${i}:`, columns.length, 'colunas - Conteudo:', line);
    
    // Verificar se tem pelo menos 8 colunas
    if (columns.length >= 8) {
      const item = columns[0]?.trim();
      const descricao = columns[1]?.trim();
      const unidade = columns[2]?.trim();
      // Converter números brasileiros (vírgula como decimal) para formato JavaScript
      const parseNumberBR = (str: string) => {
        if (!str) return 0;
        // Remover pontos (separadores de milhares) e substituir vírgula por ponto
        return parseFloat(str.replace(/\./g, '').replace(',', '.'));
      };
      
      const quantidade = parseNumberBR(columns[3] || '0');
      const maoDeObra = parseNumberBR(columns[4] || '0');
      const materiais = parseNumberBR(columns[5] || '0');
      const total = parseNumberBR(columns[6] || '0');
      const pesoPercentual = parseNumberBR(columns[7]?.replace('%', '') || '0');
      
      console.log(`Linha ${i}: Item: "${item}", Descricao: "${descricao}"`);
      console.log(`  Valores originais: M.O.="${columns[4]}", MAT.="${columns[5]}", Total="${columns[6]}"`);
      console.log(`  Valores parseados: M.O.=${maoDeObra}, MAT.=${materiais}, Total=${total}`);
      
      // Aceitar apenas sub-itens (1.1, 1.2, 2.1, 2.2, etc.) para evitar duplicação de valores
      // Excluir linhas de resumo e totais gerais
      const isSubItem = item && descricao && (total > 0 || maoDeObra > 0 || materiais > 0) && 
          !descricao.includes('PAVIMENTO TÉRREO') && !descricao.includes('PAVIMENTO SUPERIOR') &&
          !item.includes('Totais') && item.includes('.') && item.trim() !== '';
      
      console.log(`Linha ${i}: É sub-item? ${isSubItem}`);
      
      if (isSubItem) {
        // Determinar pavimento baseado no item e descrição
        let pavimento: 'Térreo' | 'Superior' = 'Térreo';
        if (item.startsWith('2') || descricao.includes('SUPERIOR')) {
          pavimento = 'Superior';
        }
        
        // Extrair categoria baseada no item e descrição
        const categoria = extrairCategoriaPorItem(item, descricao);
        
        // Calcular valor unitário
        const valorUnitario = quantidade > 0 ? total / quantidade : total;
        
        const itemProcessado = {
          id: item,
          item: item,
          codigo: '', // Não disponível no CSV
          descricao: descricao,
          unidade: unidade || 'm²',
          quantidade: quantidade || 1,
          valorUnitario: valorUnitario,
          maoDeObra: maoDeObra,
          materiais: materiais,
          total: total,
          pesoPercentual: pesoPercentual,
          pavimento: pavimento,
          categoria: categoria,
          maoDeObraM2: maoDeObra / 289,
          materiaisM2: materiais / 289,
          totalM2: total / 289
        };
        
        dados.push(itemProcessado);
        console.log('✅ Item adicionado:', itemProcessado.item, itemProcessado.descricao, 'Total:', itemProcessado.total);
      } else {
        console.log('❌ Item rejeitado - critérios não atendidos');
      }
    } else {
      console.log(`❌ Linha ${i} rejeitada - menos de 8 colunas (${columns.length})`);
    }
  }
  
  console.log('📊 Total de itens processados:', dados.length);
  console.log('📋 Itens processados:', dados.map(d => `${d.item} - ${d.descricao} - R$ ${d.total}`));
  return dados;
};

// Dados da planilha 5DARQ.csv como fallback (apenas sub-itens, sem linhas de resumo)
const dadosFallback5DARQ: OrcamentoItem[] = [
  {
    id: '1.1',
    item: '1.1',
    codigo: '',
    descricao: 'PAREDES',
    unidade: 'm²',
    quantidade: 384.06,
    valorUnitario: 185.00,
    maoDeObra: 33689.73,
    materiais: 37357.52,
    total: 71047.25,
    pesoPercentual: 16.74,
    pavimento: 'Térreo',
    categoria: 'Paredes',
    maoDeObraM2: 33689.73 / 289,
    materiaisM2: 37357.52 / 289,
    totalM2: 71047.25 / 289
  },
  {
    id: '1.2',
    item: '1.2',
    codigo: '',
    descricao: 'PISO',
    unidade: 'm²',
    quantidade: 134.52,
    valorUnitario: 299.40,
    maoDeObra: 4241.41,
    materiais: 36036.56,
    total: 40277.97,
    pesoPercentual: 9.49,
    pavimento: 'Térreo',
    categoria: 'Piso',
    maoDeObraM2: 4241.41 / 289,
    materiaisM2: 36036.56 / 289,
    totalM2: 40277.97 / 289
  },
  {
    id: '1.3',
    item: '1.3',
    codigo: '',
    descricao: 'REVESTIMENTO PAREDES',
    unidade: 'm²',
    quantidade: 768.12,
    valorUnitario: 73.98,
    maoDeObra: 21441.68,
    materiais: 35382.07,
    total: 56823.75,
    pesoPercentual: 13.39,
    pavimento: 'Térreo',
    categoria: 'Revestimento',
    maoDeObraM2: 21441.68 / 289,
    materiaisM2: 35382.07 / 289,
    totalM2: 56823.75 / 289
  },
  {
    id: '1.4',
    item: '1.4',
    codigo: '',
    descricao: 'FORRO',
    unidade: 'm²',
    quantidade: 134.52,
    valorUnitario: 82.58,
    maoDeObra: 5474.95,
    materiais: 5633.70,
    total: 11108.65,
    pesoPercentual: 2.62,
    pavimento: 'Térreo',
    categoria: 'Forro',
    maoDeObraM2: 5474.95 / 289,
    materiaisM2: 5633.70 / 289,
    totalM2: 11108.65 / 289
  },
  {
    id: '1.5',
    item: '1.5',
    codigo: '',
    descricao: 'ESQUADRIAS',
    unidade: 'unid',
    quantidade: 30,
    valorUnitario: 695.56,
    maoDeObra: 2545.15,
    materiais: 18321.50,
    total: 20866.65,
    pesoPercentual: 4.92,
    pavimento: 'Térreo',
    categoria: 'Esquadrias',
    maoDeObraM2: 2545.15 / 289,
    materiaisM2: 18321.50 / 289,
    totalM2: 20866.65 / 289
  },
  {
    id: '2.1',
    item: '2.1',
    codigo: '',
    descricao: 'PAREDES',
    unidade: 'm²',
    quantidade: 423.58,
    valorUnitario: 185.00,
    maoDeObra: 37156.42,
    materiais: 41201.63,
    total: 78358.05,
    pesoPercentual: 18.46,
    pavimento: 'Superior',
    categoria: 'Paredes',
    maoDeObraM2: 37156.42 / 289,
    materiaisM2: 41201.63 / 289,
    totalM2: 78358.05 / 289
  },
  {
    id: '2.2',
    item: '2.2',
    codigo: '',
    descricao: 'PISO',
    unidade: 'm²',
    quantidade: 134.52,
    valorUnitario: 299.40,
    maoDeObra: 4241.41,
    materiais: 36036.56,
    total: 40277.97,
    pesoPercentual: 9.49,
    pavimento: 'Superior',
    categoria: 'Piso',
    maoDeObraM2: 4241.41 / 289,
    materiaisM2: 36036.56 / 289,
    totalM2: 40277.97 / 289
  },
  {
    id: '2.3',
    item: '2.3',
    codigo: '',
    descricao: 'REVESTIMENTO PAREDES',
    unidade: 'm²',
    quantidade: 847.16,
    valorUnitario: 72.66,
    maoDeObra: 23265.93,
    materiais: 38283.62,
    total: 61549.55,
    pesoPercentual: 14.50,
    pavimento: 'Superior',
    categoria: 'Revestimento',
    maoDeObraM2: 23265.93 / 289,
    materiaisM2: 38283.62 / 289,
    totalM2: 61549.55 / 289
  },
  {
    id: '2.4',
    item: '2.4',
    codigo: '',
    descricao: 'FORRO',
    unidade: 'm²',
    quantidade: 134.52,
    valorUnitario: 82.58,
    maoDeObra: 5474.95,
    materiais: 5633.70,
    total: 11108.65,
    pesoPercentual: 2.62,
    pavimento: 'Superior',
    categoria: 'Forro',
    maoDeObraM2: 5474.95 / 289,
    materiaisM2: 5633.70 / 289,
    totalM2: 11108.65 / 289
  },
  {
    id: '2.5',
    item: '2.5',
    codigo: '',
    descricao: 'ESQUADRIAS',
    unidade: 'unid',
    quantidade: 30,
    valorUnitario: 695.56,
    maoDeObra: 2545.15,
    materiais: 18321.50,
    total: 20866.65,
    pesoPercentual: 4.92,
    pavimento: 'Superior',
    categoria: 'Esquadrias',
    maoDeObraM2: 2545.15 / 289,
    materiaisM2: 18321.50 / 289,
    totalM2: 20866.65 / 289
  },
  {
    id: '2.6',
    item: '2.6',
    codigo: '',
    descricao: 'TELHADO',
    unidade: 'm²',
    quantidade: 171.21,
    valorUnitario: 70.62,
    maoDeObra: 2352.41,
    materiais: 9740.15,
    total: 12092.56,
    pesoPercentual: 2.85,
    pavimento: 'Superior',
    categoria: 'Telhado',
    maoDeObraM2: 2352.41 / 289,
    materiaisM2: 9740.15 / 289,
    totalM2: 12092.56 / 289
  }
];

export const carregarDados = async (): Promise<OrcamentoItem[]> => {
  try {
    console.log('Tentando carregar 5DARQ.csv...');
    
    // Carregar o arquivo 5DARQ.csv
    const response = await fetch('/5DARQ.csv');
    console.log('Resposta do fetch:', response.status, response.statusText);
    
    if (response.ok) {
      const csvContent = await response.text();
      console.log('Conteudo CSV carregado, tamanho:', csvContent.length, 'caracteres');
      
      const dadosProcessados = processarDadosCSV5DARQ(csvContent);
      console.log('Dados processados:', dadosProcessados.length, 'itens');
      
      // Debug: Calcular totais dos dados processados
      const totalMO = dadosProcessados.reduce((sum, item) => sum + item.maoDeObra, 0);
      const totalMat = dadosProcessados.reduce((sum, item) => sum + item.materiais, 0);
      const totalGeral = dadosProcessados.reduce((sum, item) => sum + item.total, 0);
      console.log('=== TOTAIS CALCULADOS ===');
      console.log('Total M.O.:', totalMO);
      console.log('Total Materiais:', totalMat);
      console.log('Total Geral:', totalGeral);
      console.log('========================');
      
      if (dadosProcessados.length > 0) {
        console.log('Dados carregados da planilha 5DARQ.csv:', dadosProcessados.length, 'itens');
        return dadosProcessados;
      } else {
        console.warn('Nenhum dado valido encontrado no CSV, usando dados fallback');
        return dadosFallback5DARQ;
      }
    } else {
      console.error('Erro HTTP:', response.status, response.statusText);
      console.log('Usando dados fallback devido ao erro HTTP');
      return dadosFallback5DARQ;
    }
  } catch (error) {
    console.error('Erro ao carregar 5DARQ.csv:', error);
    console.log('Usando dados fallback devido ao erro');
    return dadosFallback5DARQ;
  }
};

// Função para processar dados reais do Excel (placeholder)
export const processarDadosExcel = (_excelData: ArrayBuffer): OrcamentoItem[] => {
  // Implementar parsing do Excel baseado na lógica do dashboard.py
  // Por enquanto retorna array vazio
  return [];
};

// Função para extrair categoria baseada no item e descrição
export const extrairCategoriaPorItem = (item: string, descricao: string = ''): string => {
  if (!item || item === 'nan') return 'Outros';
  
  // Categorias baseadas nos itens e descrições da planilha 5DARQ.csv
  if (item.includes('1.1') || item.includes('2.1') || descricao.includes('PAREDES')) return 'Paredes';
  if (item.includes('1.2') || item.includes('2.2') || descricao.includes('PISO')) return 'Piso';
  if (item.includes('1.3') || item.includes('2.3') || descricao.includes('REVESTIMENTO')) return 'Revestimento';
  if (item.includes('1.4') || item.includes('2.4') || descricao.includes('FORRO')) return 'Forro';
  if (item.includes('1.5') || item.includes('2.5') || descricao.includes('ESQUADRIAS')) return 'Esquadrias';
  if (item.includes('2.6') || descricao.includes('TELHADO')) return 'Telhado';
  if (descricao.includes('PAVIMENTO TÉRREO')) return 'Pavimento Térreo';
  if (descricao.includes('PAVIMENTO SUPERIOR')) return 'Pavimento Superior';
  
  return 'Outros';
};
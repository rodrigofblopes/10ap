import { OrcamentoItem } from '../types/orcamento';

export interface ItemCotacao {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  quantidade: number;
  unidade: string;
  sinapiMO: number;
  sinapiMat: number;
  sinapiTotal: number;
  realMO: number;
  realMat: number;
  realTotal: number;
  economia: number;
  percentualEconomia: number;
  custoPorM2: number;
  peso: number;
}

// Função para processar dados do ARQ10AP.csv para cotação
export const processarDadosCotacao = (orcamentoItens: OrcamentoItem[]): ItemCotacao[] => {
  return orcamentoItens.map(item => {
    // Calcular economia (assumindo que os valores reais são iguais aos SINAPI por enquanto)
    const realMO = item.maoDeObraM2;
    const realMat = item.materiaisM2;
    const realTotal = item.total;
    const economia = 0; // Pode ser calculada quando houver valores reais diferentes
    const percentualEconomia = 0;
    
    // Determinar categoria e subcategoria
    let categoria = 'Pavimento Térreo';
    let subcategoria = item.categoria;
    
    if (item.pavimento === 'Superior') {
      categoria = 'Pavimento Superior';
    }
    
    return {
      id: item.id,
      codigo: item.codigo || '',
      descricao: item.descricao,
      categoria: categoria,
      subcategoria: subcategoria,
      quantidade: item.quantidade,
      unidade: item.unidade,
      sinapiMO: item.maoDeObraM2,
      sinapiMat: item.materiaisM2,
      sinapiTotal: item.total,
      realMO: realMO,
      realMat: realMat,
      realTotal: realTotal,
      economia: economia,
      percentualEconomia: percentualEconomia,
      custoPorM2: item.totalM2,
      peso: item.pesoPercentual
    };
  });
};

// Função para carregar dados de cotação baseados no orçamento
export const carregarDadosCotacao = async (): Promise<ItemCotacao[]> => {
  try {
    // Importar dinamicamente o serviço de orçamento
    const { carregarDados } = await import('./orcamentoService');
    const orcamentoItens = await carregarDados();
    return processarDadosCotacao(orcamentoItens);
  } catch (error) {
    console.error('Erro ao carregar dados de cotação:', error);
    return [];
  }
};

export interface OrcamentoItem {
  id: string;
  item: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  maoDeObra: number;
  materiais: number;
  total: number;
  pesoPercentual: number;
  pavimento: 'Térreo' | 'Superior';
  categoria: string;
  maoDeObraM2: number;
  materiaisM2: number;
  totalM2: number;
}

export interface ResumoExecutivo {
  totalGeral: number;
  totalMaoObra: number;
  totalMateriais: number;
  totalTerreo: number;
  totalSuperior: number;
  numItens: number;
  percentualMaoObra: number;
  percentualMateriais: number;
}

export interface Filtros {
  pavimento: string[];
  categoria: string[];
  valorMin: number;
  valorMax: number;
}

export interface Ordenacao {
  campo: keyof OrcamentoItem;
  direcao: 'asc' | 'desc';
}

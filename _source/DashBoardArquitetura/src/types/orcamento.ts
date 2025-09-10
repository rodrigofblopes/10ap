export interface OrcamentoItem {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  maoDeObra: number;
  materiais: number;
  total: number;
  area?: number;
  peso: number;
  isEtapaTotal?: boolean; // Flag para identificar totais por etapa
  elementos3D?: string; // IDs dos elementos 3D para linking
}

export interface ResumoExecutivo {
  valorTotal: number;
  maoDeObraTotal: number;
  materiaisTotal: number;
  areaTotal: number;
  custoPorM2: number;
}

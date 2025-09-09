import { create } from 'zustand';
import { OrcamentoItem, ResumoExecutivo, Filtros, Ordenacao } from '../types/orcamento';

interface OrcamentoState {
  itens: OrcamentoItem[];
  itensFiltrados: OrcamentoItem[];
  filtros: Filtros;
  ordenacao: Ordenacao;
  resumo: ResumoExecutivo | null;
  carregando: boolean;
  setItens: (itens: OrcamentoItem[]) => void;
  setFiltros: (filtros: Filtros) => void;
  setOrdenacao: (ordenacao: Ordenacao) => void;
  aplicarFiltros: () => void;
  calcularResumo: () => void;
  resetarFiltros: () => void;
}

export const useOrcamentoStore = create<OrcamentoState>((set, get) => ({
  itens: [],
  itensFiltrados: [],
  filtros: {
    pavimento: [],
    categoria: [],
    valorMin: 0,
    valorMax: 1000000
  },
  ordenacao: {
    campo: 'item',
    direcao: 'asc'
  },
  resumo: null,
  carregando: false,

  setItens: (itens) => {
    console.log('🏪 Store - setItens chamado com:', itens.length, 'itens');
    console.log('🏪 Store - Primeiros 3 itens:', itens.slice(0, 3));
    set({ itens, itensFiltrados: itens });
    get().calcularResumo();
    console.log('🏪 Store - setItens concluído');
  },

  setFiltros: (filtros) => {
    set({ filtros });
    get().aplicarFiltros();
  },

  setOrdenacao: (ordenacao) => {
    set({ ordenacao });
    get().aplicarFiltros();
  },

  aplicarFiltros: () => {
    const { itens, filtros, ordenacao } = get();
    
    let itensFiltrados = [...itens];

    // Aplicar filtros
    if (filtros.pavimento.length > 0) {
      itensFiltrados = itensFiltrados.filter(item => 
        filtros.pavimento.includes(item.pavimento)
      );
    }

    if (filtros.categoria.length > 0) {
      itensFiltrados = itensFiltrados.filter(item => 
        filtros.categoria.includes(item.categoria)
      );
    }

    if (filtros.valorMin > 0) {
      itensFiltrados = itensFiltrados.filter(item => 
        item.total >= filtros.valorMin
      );
    }

    if (filtros.valorMax < 1000000) {
      itensFiltrados = itensFiltrados.filter(item => 
        item.total <= filtros.valorMax
      );
    }

    // Aplicar ordenação
    itensFiltrados.sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];
      
      if (typeof valorA === 'string' && typeof valorB === 'string') {
        return ordenacao.direcao === 'asc' 
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      }
      
      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return ordenacao.direcao === 'asc' ? valorA - valorB : valorB - valorA;
      }
      
      return 0;
    });

    set({ itensFiltrados });
    get().calcularResumo();
  },

  calcularResumo: () => {
    const { itensFiltrados } = get();
    
    if (itensFiltrados.length === 0) {
      set({ resumo: null });
      return;
    }

    const totalGeral = itensFiltrados.reduce((sum, item) => sum + item.total, 0);
    const totalMaoObra = itensFiltrados.reduce((sum, item) => sum + item.maoDeObra, 0);
    const totalMateriais = itensFiltrados.reduce((sum, item) => sum + item.materiais, 0);
    const totalTerreo = itensFiltrados
      .filter(item => item.pavimento === 'Térreo')
      .reduce((sum, item) => sum + item.total, 0);
    const totalSuperior = itensFiltrados
      .filter(item => item.pavimento === 'Superior')
      .reduce((sum, item) => sum + item.total, 0);

    const resumo: ResumoExecutivo = {
      totalGeral,
      totalMaoObra,
      totalMateriais,
      totalTerreo,
      totalSuperior,
      numItens: itensFiltrados.length,
      percentualMaoObra: totalGeral > 0 ? (totalMaoObra / totalGeral) * 100 : 0,
      percentualMateriais: totalGeral > 0 ? (totalMateriais / totalGeral) * 100 : 0
    };

    set({ resumo });
  },

  resetarFiltros: () => {
    set({
      filtros: {
        pavimento: [],
        categoria: [],
        valorMin: 0,
        valorMax: 1000000
      },
      ordenacao: {
        campo: 'item',
        direcao: 'asc'
      }
    });
    get().aplicarFiltros();
  }
}));

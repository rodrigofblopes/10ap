import { create } from 'zustand';
import { OrcamentoItem, ResumoExecutivo } from '../types/orcamento';

interface OrcamentoStore {
  itens: OrcamentoItem[];
  resumo: ResumoExecutivo;
  setItens: (itens: OrcamentoItem[]) => void;
  calcularResumo: () => void;
}

export const useOrcamentoStore = create<OrcamentoStore>((set, get) => ({
  itens: [],
  resumo: {
    valorTotal: 0,
    maoDeObraTotal: 0,
    materiaisTotal: 0,
    areaTotal: 0,
    custoPorM2: 0
  },

  setItens: (itens: OrcamentoItem[]) => {
    set({ itens });
    get().calcularResumo();
  },

  calcularResumo: () => {
    const { itens } = get();
    
    if (itens.length === 0) {
      set({ resumo: {
        valorTotal: 0,
        maoDeObraTotal: 0,
        materiaisTotal: 0,
        areaTotal: 0,
        custoPorM2: 0
      }});
      return;
    }

    // Calcular totais apenas dos itens principais (sem duplicar subitens)
    const itensPrincipais = itens.filter(item => item.isEtapaTotal);
    const valorTotal = itensPrincipais.reduce((sum, item) => sum + item.total, 0);
    const maoDeObraTotal = itensPrincipais.reduce((sum, item) => sum + item.maoDeObra, 0);
    const materiaisTotal = itensPrincipais.reduce((sum, item) => sum + item.materiais, 0);
    
    // Debug para verificar valores
    console.log('🔍 Debug do Store - Itens principais:', itensPrincipais.map(item => ({
      id: item.id,
      descricao: item.descricao,
      total: item.total,
      maoDeObra: item.maoDeObra,
      materiais: item.materiais
    })));
    console.log('🔍 Debug do Store - Totais calculados:', {
      valorTotal,
      maoDeObraTotal,
      materiaisTotal
    });
    const areaTotal = itens.reduce((sum, item) => sum + (item.area || 0), 0);
    const custoPorM2 = areaTotal > 0 ? valorTotal / areaTotal : 0;

    set({ resumo: {
      valorTotal,
      maoDeObraTotal,
      materiaisTotal,
      areaTotal,
      custoPorM2
    }});
  }
}));

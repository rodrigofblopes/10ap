import React, { useState } from 'react';
import { OrcamentoItem } from '../types/orcamento';
import { Table } from 'lucide-react';

interface PlanilhaSinteticaProps {
  itens: OrcamentoItem[];
  selectedItems: string[];
  onItemSelect: (item: OrcamentoItem) => void;
  onCategorySelect?: (categoryCode: string) => void;
}

const PlanilhaSintetica: React.FC<PlanilhaSinteticaProps> = ({ 
  itens, 
  selectedItems, 
  onItemSelect,
  onCategorySelect
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para formatar percentual
  const formatarPercentual = (valor: number) => {
    return `${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })}%`;
  };

  // Função para formatar quantidade
  const formatarQuantidade = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Separar itens em categorias principais e subcategorias
  const categoriasPrincipais = itens.filter(item => item.isEtapaTotal);
  const subcategorias = itens.filter(item => !item.isEtapaTotal);

  const handleItemClick = (item: OrcamentoItem) => {
    console.log('🖱️ ===== ITEM CLICADO NA PLANILHA =====');
    console.log('📋 Item clicado:', { id: item.id, descricao: item.descricao, isEtapaTotal: item.isEtapaTotal });
    
    // Toggle expansão do item
    setExpandedItems(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
    
    // SEMPRE selecionar item para highlight no 3D (tanto categorias quanto subcategorias)
    console.log('🎯 Selecionando item para highlight no 3D:', item.id);
    onItemSelect(item);
    
    // Se é uma categoria principal (1.1, 1.2, etc.) e temos onCategorySelect, também chamar
    if (item.isEtapaTotal && onCategorySelect) {
      console.log('🏗️ Categoria principal clicada - chamando onCategorySelect:', item.id);
      onCategorySelect(item.id);
    }
  };

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  if (itens.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Table className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Carregando dados da planilha...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-2">
        {/* Categorias Principais */}
        {categoriasPrincipais.map((categoria) => {
          const subcategoriasDaCategoria = subcategorias.filter(
            sub => sub.codigo?.startsWith(categoria.codigo || '')
          );

          return (
            <div key={categoria.id} className="space-y-1">
              {/* Card da Categoria Principal */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 text-sm">
                      {categoria.codigo} - {categoria.descricao}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      Categoria Principal
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-blue-800">
                      R$ {formatarMoeda(categoria.total)}
                    </div>
                    <div className="text-xs text-blue-600">
                      {formatarPercentual(categoria.peso)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards das Subcategorias */}
              {subcategoriasDaCategoria.map((subcategoria) => {
                const isSelected = selectedItems.includes(subcategoria.id);
                const isExpandedItem = isExpanded(subcategoria.id);
                
                return (
                  <div
                    key={subcategoria.id}
                    onClick={() => handleItemClick(subcategoria)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-orange-100 border-orange-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-800">
                          {subcategoria.codigo} - {subcategoria.descricao}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {subcategoria.unidade || 'm³'} • Quantidade: {subcategoria.quantidade ? formatarQuantidade(subcategoria.quantidade) : 'N/A'}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-semibold text-blue-600">
                          R$ {formatarMoeda(subcategoria.total)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatarPercentual(subcategoria.peso)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Detalhes Expandidos */}
                    {isExpandedItem && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Quantidade:</span>
                            <span className="ml-2 font-medium">
                              {subcategoria.quantidade ? formatarQuantidade(subcategoria.quantidade) : 'N/A'} {subcategoria.unidade || 'm³'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Valor Unit.:</span>
                            <span className="ml-2 font-medium">
                              R$ {subcategoria.valorUnitario ? formatarMoeda(subcategoria.valorUnitario) : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">M.O.:</span>
                            <span className="ml-2 font-medium">
                              R$ {subcategoria.maoDeObra ? formatarMoeda(subcategoria.maoDeObra) : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Materiais:</span>
                            <span className="ml-2 font-medium">
                              R$ {subcategoria.materiais ? formatarMoeda(subcategoria.materiais) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Totais Gerais */}
      <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-3">Totais Gerais</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">M.O. Total:</span>
              <div className="font-bold text-gray-800">
                R$ {formatarMoeda(categoriasPrincipais.reduce((sum, item) => sum + (item.maoDeObra || 0), 0))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Materiais Total:</span>
              <div className="font-bold text-gray-800">
                R$ {formatarMoeda(categoriasPrincipais.reduce((sum, item) => sum + (item.materiais || 0), 0))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Total Geral:</span>
              <div className="font-bold text-gray-800">
                R$ {formatarMoeda(categoriasPrincipais.reduce((sum, item) => sum + item.total, 0))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 bg-gray-50 p-3 rounded-lg border">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Categoria Principal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-50 border border-orange-300 rounded"></div>
            <span>Item Selecionado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Clique para expandir</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanilhaSintetica;
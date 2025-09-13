import React, { useState, useEffect } from 'react';
import { OrcamentoItem } from '../types/orcamento';
import { Table, Eye, EyeOff, ChevronDown, ChevronRight, EyeIcon, EyeSlashIcon } from 'lucide-react';

interface PlanilhaSinteticaProps {
  itens: OrcamentoItem[];
  selectedItems: string[];
  onItemSelect: (item: OrcamentoItem) => void;
  onCategorySelect?: (categoryCode: string) => void;
  onToggleVisibility?: (item: OrcamentoItem) => void;
  hiddenElements?: Set<string>;
}

const PlanilhaSintetica: React.FC<PlanilhaSinteticaProps> = ({ 
  itens, 
  selectedItems, 
  onItemSelect,
  onCategorySelect,
  onToggleVisibility,
  hiddenElements = new Set()
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [categoriesWithHiddenElements, setCategoriesWithHiddenElements] = useState<Set<string>>(new Set());

  // Debug: verificar se as props estão sendo recebidas
  console.log('🔧 PlanilhaSintetica - Props recebidas:', {
    itens: itens.length,
    onToggleVisibility: !!onToggleVisibility,
    hiddenElements: hiddenElements.size
  });

  // Sincronizar estado local com mudanças nos hiddenElements
  useEffect(() => {
    // Limpar estado local quando hiddenElements é limpo
    if (hiddenElements.size === 0) {
      setCategoriesWithHiddenElements(new Set());
    }
  }, [hiddenElements]);

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
    console.log('📋 Item completo:', item);
    
    // Se é uma categoria principal, toggle colapso/expansão
    if (item.isEtapaTotal) {
      console.log('🏗️ Categoria principal clicada - toggle colapso/expansão');
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
      
      // Chamar onCategorySelect para highlight no 3D
      if (onCategorySelect) {
        console.log('🏗️ Chamando onCategorySelect:', item.id);
        onCategorySelect(item.id);
      }
    } else {
      // Para subcategorias, toggle expansão individual
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
      
      // Selecionar item para highlight no 3D
      console.log('🎯 Selecionando subcategoria para highlight no 3D:', item.id);
      console.log('🎯 Item completo sendo passado:', item);
      console.log('🎯 onItemSelect disponível?', !!onItemSelect);
      if (onItemSelect) {
        onItemSelect(item);
        console.log('✅ onItemSelect chamado com sucesso');
      } else {
        console.log('❌ onItemSelect não está disponível!');
      }
    }
  };

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  // Função simplificada para verificar se um item tem elementos ocultos
  const hasHiddenElements = (item: OrcamentoItem) => {
    if (!item.elementos3D || !onToggleVisibility) return false;
    
    // Lógica simplificada: verificar se algum elemento do item está na lista de elementos ocultos
    const elementosArray = item.elementos3D.split(',').map((el: string) => el.trim());
    
    return elementosArray.some(elemento => {
      // Verificação direta primeiro
      if (hiddenElements.has(elemento)) return true;
      
      // Verificação por padrão de código (ex: "1.1_001")
      if (elemento.includes('.')) {
        const partes = elemento.split('.');
        if (partes.length >= 2) {
          const codigo = partes[0].replace(/\s.*/, '').replace('.', '');
          const numero = partes[partes.length - 1];
          const padrao = `${codigo}_${numero}`;
          
          return Array.from(hiddenElements).some(hiddenEl => 
            hiddenEl.includes(padrao) || hiddenEl.includes(codigo + '_')
          );
        }
      }
      
      return false;
    });
  };

  // Função para verificar se uma categoria principal tem elementos ocultos
  const categoryHasHiddenElements = (categoria: OrcamentoItem) => {
    // Verificar se esta categoria específica foi marcada como tendo elementos ocultos
    return categoriesWithHiddenElements.has(categoria.id);
  };

  // Função para obter subcoleções individuais de um item
  const getIndividualSubcollections = (item: OrcamentoItem): string[] => {
    if (!item.elementos3D) return [];
    
    return item.elementos3D
      .split(',')
      .map(el => el.trim())
      .filter(el => el !== '');
  };

  // Função para verificar se uma subcoleção individual está oculta
  const isSubcollectionHidden = (subcollectionName: string): boolean => {
    console.log('🔸 Verificando se subcoleção está oculta:', subcollectionName);
    
    // Mapear nome da subcoleção para elementos 3D
    if (subcollectionName.includes('.')) {
      const partes = subcollectionName.split('.');
      if (partes.length >= 2) {
        const prefixo = partes[0]; // "1.1 Paredes Térreo"
        const numeroFinal = partes[partes.length - 1]; // "001"
        
        // Criar padrões de busca
        const codigo = prefixo.replace(/\s.*/, '').replace('.', ''); // "11"
        const padroesBusca = [
          `${codigo}_${numeroFinal}`,
          `${codigo}_${numeroFinal.padStart(3, '0')}`,
          `${codigo}_${numeroFinal.padStart(2, '0')}`,
        ];
        
        console.log('🔸 Padrões de busca para subcoleção:', padroesBusca);
        
        // Verificar se algum elemento 3D correspondente está oculto
        const isHidden = Array.from(hiddenElements).some(hiddenEl => {
          const matches = padroesBusca.some(padrao => hiddenEl.includes(padrao));
          if (matches) {
            console.log(`🔸 Elemento 3D "${hiddenEl}" corresponde à subcoleção "${subcollectionName}"`);
          }
          return matches;
        });
        
        console.log('🔸 Subcoleção está oculta?', isHidden);
        return isHidden;
      }
    }
    
    // Fallback: verificação direta
    const directMatch = hiddenElements.has(subcollectionName);
    console.log('🔸 Verificação direta:', directMatch);
    return directMatch;
  };

  // Componente de ícone de visibilidade melhorado
  const VisibilityIcon = ({ 
    item, 
    isHidden, 
    isDisabled = false, 
    size = "sm" 
  }: { 
    item: OrcamentoItem; 
    isHidden: boolean; 
    isDisabled?: boolean; 
    size?: "sm" | "md" | "lg" 
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5", 
      lg: "h-6 w-6"
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (isDisabled || !onToggleVisibility) return;
      
      console.log('👁️ Toggle visibilidade para:', item.id);
      
      // Se é uma categoria principal, atualizar o estado local
      if (item.isEtapaTotal) {
        setCategoriesWithHiddenElements(prev => {
          const newSet = new Set(prev);
          if (isHidden) {
            newSet.delete(item.id); // Remover da lista de ocultos
          } else {
            newSet.add(item.id); // Adicionar à lista de ocultos
          }
          console.log('🏗️ Categorias com elementos ocultos:', Array.from(newSet));
          return newSet;
        });
      }
      
      onToggleVisibility(item);
    };

    const getButtonClasses = () => {
      const baseClasses = "relative p-1.5 rounded-md transition-all duration-300 border-2 group";
      
      if (isDisabled) {
        return `${baseClasses} text-gray-400 cursor-not-allowed opacity-50 border-gray-200 bg-gray-50`;
      }
      
      if (isHidden) {
        return `${baseClasses} text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 bg-red-50 hover:shadow-md hover:scale-105`;
      }
      
      return `${baseClasses} text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300 bg-green-50 hover:shadow-md hover:scale-105`;
    };

    const getIconClasses = () => {
      const baseClasses = `${sizeClasses[size]} transition-all duration-300`;
      
      if (isHidden) {
        return `${baseClasses} group-hover:animate-pulse`;
      }
      
      return `${baseClasses} group-hover:animate-bounce`;
    };

    return (
      <button
        onClick={handleClick}
        className={getButtonClasses()}
        title={
          isDisabled 
            ? 'Sem elementos 3D associados'
            : isHidden 
              ? 'Mostrar elementos 3D' 
              : 'Ocultar elementos 3D'
        }
        disabled={isDisabled}
      >
        {isHidden ? (
          <div className="relative">
            <EyeOff className={getIconClasses()} />
            {/* Indicador de elementos ocultos */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <Eye className={getIconClasses()} />
        )}
      </button>
    );
  };

  // Função para lidar com o clique no ícone de visibilidade (mantida para compatibilidade)
  const handleVisibilityToggle = (e: React.MouseEvent, item: OrcamentoItem) => {
    e.stopPropagation();
    
    if (onToggleVisibility) {
      onToggleVisibility(item);
    }
  };

  // Função para lidar com o toggle de subcoleção individual (não utilizada atualmente)
  // const handleSubcollectionToggle = (e: React.MouseEvent, subcollectionName: string, parentItem: OrcamentoItem) => {
  //   e.stopPropagation();
  //   
  //   console.log('🔸 Toggle de subcoleção individual:', subcollectionName);
  //   console.log('🔸 Item pai:', parentItem);
  //   
  //   // Criar um item fictício apenas para esta subcoleção
  //   const fakeItem = {
  //     ...parentItem,
  //     id: `${parentItem.id}_sub_${subcollectionName}`, // ID único para debug
  //     elementos3D: subcollectionName, // Apenas esta subcoleção
  //     isSubcollection: true // Marcar como subcoleção para debug
  //   };
  //   
  //   console.log('🔸 Item fictício criado:', fakeItem);
  //   
  //   if (onToggleVisibility) {
  //     onToggleVisibility(fakeItem);
  //   }
  // };

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
              <div 
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                onClick={() => handleItemClick(categoria)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {/* Ícone de expansão/colapso */}
                      <div className="flex items-center gap-1">
                        {isExpanded(categoria.id) ? (
                          <ChevronDown className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-blue-600" />
                        )}
                        <div className="font-bold text-blue-900 text-sm">
                          {categoria.codigo} - {categoria.descricao}
                        </div>
                      </div>
                      {/* Ícone de visibilidade para categoria principal */}
                      {onToggleVisibility && (
                        <VisibilityIcon 
                          item={categoria}
                          isHidden={categoryHasHiddenElements(categoria)}
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      Categoria Principal
                      {!isExpanded(categoria.id) && subcategoriasDaCategoria.length > 0 && (
                        <span className="ml-2 bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {subcategoriasDaCategoria.length} subcategorias
                        </span>
                      )}
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

              {/* Cards das Subcategorias - só mostrar se categoria estiver expandida */}
              {isExpanded(categoria.id) && subcategoriasDaCategoria.map((subcategoria) => {
                const isSelected = selectedItems.includes(subcategoria.id);
                const isExpandedItem = isExpanded(subcategoria.id);
                const hasHidden = hasHiddenElements(subcategoria);
                
                return (
                  <div
                    key={subcategoria.id}
                    onClick={(e) => {
                      console.log('🖱️ CLIQUE DETECTADO na subcategoria:', subcategoria.id);
                      e.stopPropagation();
                      handleItemClick(subcategoria);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-orange-100 border-orange-400 shadow-lg ring-2 ring-orange-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`font-medium text-sm ${
                            isSelected ? 'text-orange-800' : 'text-gray-800'
                          }`}>
                            {subcategoria.codigo} - {subcategoria.descricao}
                          </div>
                          {/* Ícone de visibilidade - sempre mostrar */}
                          {onToggleVisibility && (
                            <VisibilityIcon 
                              item={subcategoria}
                              isHidden={hasHidden}
                              isDisabled={!subcategoria.elementos3D}
                              size="sm"
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {subcategoria.unidade || 'm³'} • Quantidade: {subcategoria.quantidade ? formatarQuantidade(subcategoria.quantidade) : 'N/A'}
                          {/* Indicador de subcoleções ocultas */}
                          {subcategoria.elementos3D && (() => {
                            const subcollections = getIndividualSubcollections(subcategoria);
                            const hiddenCount = subcollections.filter(sub => isSubcollectionHidden(sub)).length;
                            const totalCount = subcollections.length;
                            
                            if (hiddenCount > 0) {
                              return (
                                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                  {hiddenCount}/{totalCount} ocultos
                                </span>
                              );
                            } else if (totalCount > 0) {
                              return (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {totalCount} visíveis
                                </span>
                              );
                            }
                            return null;
                          })()}
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
                        
                        {/* Botão de toggle de visibilidade */}
                        {onToggleVisibility && subcategoria.elementos3D && (
                          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Controle de visibilidade:</span>
                            <VisibilityIcon 
                              item={subcategoria}
                              isHidden={hasHiddenElements(subcategoria)}
                              size="md"
                            />
                          </div>
                        )}
                        
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
            <ChevronRight className="h-3 w-3 text-blue-600" />
            <span>Clique para expandir/colapsar</span>
          </div>
          {onToggleVisibility && (
            <>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 text-green-500" />
                <span>Elementos visíveis</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeOff className="h-3 w-3 text-red-500" />
                <span>Elementos ocultos</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanilhaSintetica;
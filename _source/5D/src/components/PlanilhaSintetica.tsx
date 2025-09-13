import React, { useState } from 'react';
import { OrcamentoItem } from '../types/orcamento';
import { Table, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';

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

  // Debug: verificar se as props estão sendo recebidas
  console.log('🔧 PlanilhaSintetica - Props recebidas:', {
    itens: itens.length,
    onToggleVisibility: !!onToggleVisibility,
    hiddenElements: hiddenElements.size
  });

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
      onItemSelect(item);
    }
  };

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  // Função para verificar se um item tem elementos ocultos
  const hasHiddenElements = (item: OrcamentoItem) => {
    if (!item.elementos3D || !onToggleVisibility) return false;
    
    console.log('🔍 Verificando elementos ocultos para item:', item.id);
    console.log('🔍 Elementos3D:', item.elementos3D);
    console.log('🔍 Hidden elements atual:', Array.from(hiddenElements));
    
    // Usar a mesma lógica que funciona no highlight
    // Se o highlight está funcionando, vamos usar uma abordagem mais simples
    const elementosArray = item.elementos3D.split(',').map((el: string) => el.trim());
    console.log('🔍 Elementos array da planilha:', elementosArray);
    
    // Verificar se algum elemento da planilha tem correspondência no hiddenElements
    const hasHidden = elementosArray.some(elemento => {
      // Para elementos como "1.1 Paredes Térreo.001", verificar se existe correspondência
      if (elemento.includes('.')) {
        const partes = elemento.split('.');
        if (partes.length >= 2) {
          const prefixo = partes[0]; // "1.1 Paredes Térreo"
          const numeroFinal = partes[partes.length - 1]; // "001"
          const codigo = prefixo.replace(/\s.*/, '').replace('.', ''); // "11"
          
          // Verificar se algum elemento oculto corresponde a este padrão
          return Array.from(hiddenElements).some(hiddenEl => {
            // Verificar se o elemento oculto corresponde ao código e número
            const matches = hiddenEl.includes(codigo + '_') && 
                           (hiddenEl.includes(numeroFinal) || hiddenEl.includes(numeroFinal.padStart(3, '0')));
            if (matches) {
              console.log(`🔍 Elemento "${elemento}" corresponde ao elemento oculto "${hiddenEl}"`);
            }
            return matches;
          });
        }
      } else {
        // Para elementos sem ponto, verificar por código
        const codigoItem = item.id || item.codigo;
        if (codigoItem) {
          const codigo = codigoItem.replace('.', '');
          return Array.from(hiddenElements).some(hiddenEl => {
            const matches = hiddenEl.startsWith(codigo + '_');
            if (matches) {
              console.log(`🔍 Elemento "${elemento}" corresponde ao elemento oculto "${hiddenEl}"`);
            }
            return matches;
          });
        }
      }
      return false;
    });
    
    console.log('🔍 Item tem elementos ocultos?', hasHidden);
    return hasHidden;
  };

  // Função para verificar se uma categoria principal tem subcategorias com elementos ocultos
  const categoryHasHiddenElements = (categoria: OrcamentoItem) => {
    const subcategoriasDaCategoria = subcategorias.filter(
      sub => sub.codigo?.startsWith(categoria.codigo || '')
    );
    
    console.log('🏗️ Verificando categoria principal:', categoria.id);
    console.log('🏗️ Subcategorias encontradas:', subcategoriasDaCategoria.length);
    
    const hasHidden = subcategoriasDaCategoria.some(sub => {
      const subHasHidden = hasHiddenElements(sub);
      console.log(`🏗️ Subcategoria ${sub.id} tem elementos ocultos?`, subHasHidden);
      return subHasHidden;
    });
    
    console.log('🏗️ Categoria principal tem elementos ocultos?', hasHidden);
    return hasHidden;
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

  // Função para lidar com o clique no ícone de visibilidade
  const handleVisibilityToggle = (e: React.MouseEvent, item: OrcamentoItem) => {
    e.stopPropagation(); // Prevenir que o clique no ícone acione o clique no item
    
    console.log('👁️ ===== CLIQUE NO ÍCONE DE VISIBILIDADE =====');
    console.log('👁️ Item clicado:', item);
    console.log('👁️ Item é categoria principal?', item.isEtapaTotal);
    console.log('👁️ Item é subcategoria?', !item.isEtapaTotal);
    console.log('👁️ onToggleVisibility disponível?', !!onToggleVisibility);
    console.log('👁️ Elementos3D do item:', item.elementos3D);
    
    if (onToggleVisibility) {
      console.log('👁️ Chamando onToggleVisibility...');
      onToggleVisibility(item);
    } else {
      console.log('❌ onToggleVisibility não está disponível!');
    }
  };

  // Função para lidar com o toggle de subcoleção individual
  const handleSubcollectionToggle = (e: React.MouseEvent, subcollectionName: string, parentItem: OrcamentoItem) => {
    e.stopPropagation();
    
    console.log('🔸 Toggle de subcoleção individual:', subcollectionName);
    console.log('🔸 Item pai:', parentItem);
    
    // Criar um item fictício apenas para esta subcoleção
    const fakeItem = {
      ...parentItem,
      id: `${parentItem.id}_sub_${subcollectionName}`, // ID único para debug
      elementos3D: subcollectionName, // Apenas esta subcoleção
      isSubcollection: true // Marcar como subcoleção para debug
    };
    
    console.log('🔸 Item fictício criado:', fakeItem);
    
    if (onToggleVisibility) {
      onToggleVisibility(fakeItem);
    }
  };

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
                        <button
                          onClick={(e) => handleVisibilityToggle(e, categoria)}
                          className={`p-1.5 rounded-md transition-all duration-200 border ${
                            categoryHasHiddenElements(categoria)
                              ? 'text-red-500 hover:text-red-700 hover:bg-red-50 hover:shadow-sm border-red-300 bg-red-50'
                              : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100 hover:shadow-sm border-blue-300 bg-blue-50'
                          }`}
                          title={
                            categoryHasHiddenElements(categoria)
                              ? 'Categoria tem elementos ocultos - clique para mostrar todos'
                              : 'Controlar visibilidade de toda a categoria'
                          }
                        >
                          {categoryHasHiddenElements(categoria) ? (
                            <div 
                              className="relative inline-block"
                              style={{
                                textDecoration: 'line-through',
                                textDecorationColor: '#ef4444',
                                textDecorationThickness: '2px'
                              }}
                            >
                              <EyeOff className="h-4 w-4" />
                            </div>
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
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
                    onClick={() => handleItemClick(subcategoria)}
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
                            <button
                              onClick={(e) => handleVisibilityToggle(e, subcategoria)}
                              className={`p-1.5 rounded-md transition-all duration-200 border ${
                                !subcategoria.elementos3D 
                                  ? 'text-gray-400 cursor-not-allowed opacity-50 border-gray-300'
                                  : hasHidden 
                                    ? 'text-red-500 hover:text-red-700 hover:bg-red-50 hover:shadow-sm border-red-300 bg-red-50' 
                                    : 'text-green-500 hover:text-green-700 hover:bg-green-50 hover:shadow-sm border-green-300 bg-green-50'
                              }`}
                              title={
                                !subcategoria.elementos3D 
                                  ? 'Sem elementos 3D associados'
                                  : hasHidden 
                                    ? 'Mostrar elementos 3D' 
                                    : 'Ocultar elementos 3D'
                              }
                              disabled={!subcategoria.elementos3D}
                            >
                              {!subcategoria.elementos3D ? (
                                <Eye className="h-4 w-4 opacity-50" />
                              ) : hasHidden ? (
                                <div 
                                  className="relative inline-block"
                                  style={{
                                    textDecoration: 'line-through',
                                    textDecorationColor: '#ef4444',
                                    textDecorationThickness: '2px'
                                  }}
                                >
                                  <EyeOff className="h-4 w-4" />
                                </div>
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
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
                        
                        {/* Subcoleções Individuais 3D */}
                        {subcategoria.elementos3D && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="mb-2">
                              <span className="text-xs font-medium text-gray-700">Elementos 3D ({getIndividualSubcollections(subcategoria).length}):</span>
                            </div>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {getIndividualSubcollections(subcategoria).map((subcollection, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                  <span className="text-gray-700 font-mono text-xs">
                                    {subcollection}
                                  </span>
                                  <button
                                    onClick={(e) => handleSubcollectionToggle(e, subcollection, subcategoria)}
                                    className={`p-1 rounded transition-all duration-200 border ${
                                      isSubcollectionHidden(subcollection)
                                        ? 'text-red-500 hover:text-red-700 hover:bg-red-50 border-red-300 bg-red-50'
                                        : 'text-green-500 hover:text-green-700 hover:bg-green-50 border-green-300 bg-green-50'
                                    }`}
                                    title={isSubcollectionHidden(subcollection) ? 'Mostrar elemento' : 'Ocultar elemento'}
                                  >
                                    {isSubcollectionHidden(subcollection) ? (
                                      <div 
                                        className="relative inline-block"
                                        style={{
                                          textDecoration: 'line-through',
                                          textDecorationColor: '#ef4444',
                                          textDecorationThickness: '1px'
                                        }}
                                      >
                                        <EyeOff className="h-3 w-3" />
                                      </div>
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            {/* Botões de controle em lote para subcoleções */}
                            {getIndividualSubcollections(subcategoria).length > 1 && (
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Ocultar todas as subcoleções
                                    const fakeItem = { ...subcategoria, elementos3D: subcategoria.elementos3D };
                                    if (onToggleVisibility) onToggleVisibility(fakeItem);
                                  }}
                                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                  title="Ocultar todos os elementos"
                                >
                                  Ocultar Todos
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Mostrar todas as subcoleções (removendo todas do hiddenElements)
                                    getIndividualSubcollections(subcategoria).forEach(sub => {
                                      const fakeItem = { ...subcategoria, elementos3D: sub };
                                      if (onToggleVisibility && isSubcollectionHidden(sub)) {
                                        onToggleVisibility(fakeItem);
                                      }
                                    });
                                  }}
                                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                  title="Mostrar todos os elementos"
                                >
                                  Mostrar Todos
                                </button>
                              </div>
                            )}
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

      {/* Botão de teste para debug */}
      {onToggleVisibility && (
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="text-center space-y-2">
            <div className="text-sm text-yellow-800 font-medium">🧪 Testes de Visibilidade</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  console.log('🧪 TESTE 1: Subcoleção individual');
                  const testItem = {
                    id: 'test_sub',
                    elementos3D: '1.1 Paredes Térreo.001',
                    isSubcollection: true
                  };
                  console.log('🧪 Item de teste:', testItem);
                  onToggleVisibility(testItem);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Teste Subcoleção
              </button>
              <button
                onClick={() => {
                  console.log('🧪 TESTE 2: Item completo');
                  const testItem = {
                    id: '1.1',
                    codigo: '1.1',
                    descricao: 'Paredes Térreo',
                    elementos3D: '1.1 Paredes Térreo.001, 1.1 Paredes Térreo.002, 1.1 Paredes Térreo.003',
                    isEtapaTotal: false
                  };
                  console.log('🧪 Item de teste:', testItem);
                  onToggleVisibility(testItem);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Teste Item Completo
              </button>
              <button
                onClick={() => {
                  console.log('🧪 TESTE 3: Estado atual');
                  console.log('🧪 Hidden elements:', Array.from(hiddenElements));
                  console.log('🧪 Total de itens:', itens.length);
                  console.log('🧪 onToggleVisibility disponível:', !!onToggleVisibility);
                  
                  // Testar verificação de elementos ocultos
                  const testItem = itens.find(item => item.id === '1.1');
                  if (testItem) {
                    console.log('🧪 Testando item 1.1:', testItem);
                    const hasHidden = hasHiddenElements(testItem);
                    console.log('🧪 Item 1.1 tem elementos ocultos?', hasHidden);
                  }
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Estado Atual
              </button>
              <button
                onClick={() => {
                  console.log('🧪 TESTE 4: Forçar toggle de visibilidade');
                  const testItem = itens.find(item => item.id === '1.1');
                  if (testItem && onToggleVisibility) {
                    console.log('🧪 Forçando toggle para item 1.1:', testItem);
                    onToggleVisibility(testItem);
                  }
                }}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
              >
                Forçar Toggle
              </button>
              <button
                onClick={() => {
                  console.log('🧪 TESTE 5: Verificar se traço está visível');
                  // Forçar um elemento a ficar oculto para testar o traço
                  const testItem = itens.find(item => item.id === '1.1');
                  if (testItem && onToggleVisibility) {
                    console.log('🧪 Ocultando item 1.1 para testar traço visual');
                    onToggleVisibility(testItem);
                    setTimeout(() => {
                      console.log('🧪 Mostrando item 1.1 novamente');
                      onToggleVisibility(testItem);
                    }, 2000);
                  }
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Testar Traço
              </button>
              <button
                onClick={() => {
                  console.log('🧪 TESTE 6: Testar subcategoria específica');
                  // Testar uma subcategoria específica
                  const subcategoria = itens.find(item => item.id === '1.1' && !item.isEtapaTotal);
                  if (subcategoria && onToggleVisibility) {
                    console.log('🧪 Testando subcategoria 1.1:', subcategoria);
                    console.log('🧪 Elementos3D da subcategoria:', subcategoria.elementos3D);
                    onToggleVisibility(subcategoria);
                  } else {
                    console.log('❌ Subcategoria 1.1 não encontrada ou onToggleVisibility não disponível');
                    console.log('🧪 Itens disponíveis:', itens.map(item => ({ id: item.id, isEtapaTotal: item.isEtapaTotal })));
                  }
                }}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
              >
                Testar Subcategoria
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3 text-green-500" />
              <span>Ocultar/Mostrar 3D</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanilhaSintetica;
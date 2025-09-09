import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { DollarSign, Users, Package, Ruler, Calculator, BarChart3 } from 'lucide-react';

const ResumoExecutivo: React.FC = () => {
  const { itensFiltrados } = useOrcamentoStore();
  
  // Debug: Log dos dados recebidos
  console.log('🔍 ResumoExecutivo - itensFiltrados:', itensFiltrados);
  console.log('🔍 ResumoExecutivo - quantidade de itens:', itensFiltrados?.length || 0);
  
  // Calcular resumo baseado nos dados da planilha 5DARQ.csv
  const resumo = React.useMemo(() => {
    console.log('🔍 ResumoExecutivo - useMemo executado');
    console.log('🔍 ResumoExecutivo - itensFiltrados no useMemo:', itensFiltrados);
    
    if (!itensFiltrados || itensFiltrados.length === 0) {
      console.log('🔍 ResumoExecutivo - Retornando null (sem dados)');
      return null;
    }

    const totalGeral = itensFiltrados.reduce((sum, item) => sum + item.total, 0);
    const totalMaoObra = itensFiltrados.reduce((sum, item) => sum + item.maoDeObra, 0);
    const totalMateriais = itensFiltrados.reduce((sum, item) => sum + item.materiais, 0);
    

    return {
      numItens: itensFiltrados.length,
      totalGeral,
      totalMaoObra,
      totalMateriais,
      percentualMaoObra: totalGeral > 0 ? (totalMaoObra / totalGeral) * 100 : 0,
      percentualMateriais: totalGeral > 0 ? (totalMateriais / totalGeral) * 100 : 0,
      areaTotal: 289, // Área total do projeto
      custoPorM2: totalGeral / 289,
      maoObraPorM2: totalMaoObra / 289,
      materiaisPorM2: totalMateriais / 289
    };
  }, [itensFiltrados]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  if (!resumo || resumo.numItens === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando dados da planilha 5DARQ.csv...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
      {/* Título Principal */}
      <div className="flex items-center mb-8">
        <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Resumo Executivo - Arquitetura
        </h2>
      </div>

      {/* Primeira linha de cards - Valores principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Valor Total */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Custo total do projeto</p>
              <p className="text-xs opacity-75">Projeto completo</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {formatarMoeda(resumo.totalGeral)}
          </div>
        </div>

        {/* Mão de Obra */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Custos de mão de obra</p>
              <p className="text-xs opacity-75">{formatarPercentual(resumo.percentualMaoObra)} do total</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {formatarMoeda(resumo.totalMaoObra)}
          </div>
        </div>

        {/* Materiais */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Package className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Custos de materiais</p>
              <p className="text-xs opacity-75">{formatarPercentual(resumo.percentualMateriais)} do total</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {formatarMoeda(resumo.totalMateriais)}
          </div>
        </div>

        {/* Área Total */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Ruler className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Área construída total</p>
              <p className="text-xs opacity-75">10 apartamentos</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {resumo.areaTotal.toFixed(2)} m²
          </div>
        </div>
      </div>

      {/* Segunda linha de cards - Custos por m² e item mais caro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total por m² */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Custo total por metro quadrado</p>
              <p className="text-xs opacity-75">por metro quadrado</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {formatarMoeda(resumo.custoPorM2)}
          </div>
        </div>

        {/* M.O. por m² */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Mão de obra por metro quadrado</p>
              <p className="text-xs opacity-75">por metro quadrado</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {formatarMoeda(resumo.maoObraPorM2)}
          </div>
        </div>

        {/* Materiais por m² */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Package className="h-6 w-6 sm:h-8 sm:w-8" />
            <div className="text-right">
              <p className="text-xs sm:text-sm opacity-90">Materiais por metro quadrado</p>
              <p className="text-xs opacity-75">por metro quadrado</p>
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
            {formatarMoeda(resumo.materiaisPorM2)}
          </div>
        </div>

      </div>

      {/* Seção de distribuição percentual */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <div className="flex items-center mb-3 sm:mb-4">
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-2" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Distribuição Percentual dos Custos
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Mão de Obra</span>
              <span className="text-base sm:text-lg font-bold text-blue-600">
                {formatarPercentual(resumo.percentualMaoObra)}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Materiais</span>
              <span className="text-base sm:text-lg font-bold text-orange-600">
                {formatarPercentual(resumo.percentualMateriais)}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Total por m²</span>
              <span className="text-base sm:text-lg font-bold text-purple-600">
                {formatarMoeda(resumo.custoPorM2)}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Área total</span>
              <span className="text-base sm:text-lg font-bold text-gray-600">
                {resumo.areaTotal.toFixed(2)} m²
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">M.O. por m²</span>
              <span className="text-base sm:text-lg font-bold text-blue-600">
                {formatarMoeda(resumo.maoObraPorM2)}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Mat. por m²</span>
              <span className="text-base sm:text-lg font-bold text-orange-600">
                {formatarMoeda(resumo.materiaisPorM2)}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResumoExecutivo;
import React from 'react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import { Search, Filter, SortAsc, SortDesc, RotateCcw } from 'lucide-react';

const Filtros: React.FC = () => {
  const { filtros, ordenacao, setFiltros, setOrdenacao, resetarFiltros } = useOrcamentoStore();

  const handleFiltroChange = (campo: keyof typeof filtros, valor: any) => {
    setFiltros({
      ...filtros,
      [campo]: valor
    });
  };

  const handleOrdenacaoChange = (campo: keyof typeof ordenacao, valor: any) => {
    setOrdenacao({
      ...ordenacao,
      [campo]: valor
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros e Ordenação</h3>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🔍 Buscar por descrição
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Digite para buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtro por Pavimento */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🏠 Pavimento
        </label>
        <div className="space-y-2">
          {['Térreo', 'Superior'].map((pavimento) => (
            <label key={pavimento} className="flex items-center">
              <input
                type="checkbox"
                checked={filtros.pavimento.includes(pavimento)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleFiltroChange('pavimento', [...filtros.pavimento, pavimento]);
                  } else {
                    handleFiltroChange('pavimento', filtros.pavimento.filter(p => p !== pavimento));
                  }
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{pavimento}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro por Categoria */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📂 Categoria
        </label>
        <div className="space-y-2">
          {['Paredes', 'Piso', 'Revestimento Paredes', 'Forro', 'Esquadrias', 'Telhado'].map((categoria) => (
            <label key={categoria} className="flex items-center">
              <input
                type="checkbox"
                checked={filtros.categoria.includes(categoria)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleFiltroChange('categoria', [...filtros.categoria, categoria]);
                  } else {
                    handleFiltroChange('categoria', filtros.categoria.filter(c => c !== categoria));
                  }
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{categoria}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro por Valor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💰 Faixa de Valor
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Valor Mínimo</label>
            <input
              type="number"
              value={filtros.valorMin}
              onChange={(e) => handleFiltroChange('valorMin', Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Valor Máximo</label>
            <input
              type="number"
              value={filtros.valorMax}
              onChange={(e) => handleFiltroChange('valorMax', Number(e.target.value))}
              placeholder="1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Ordenação */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📊 Ordenar por
        </label>
        <select
          value={ordenacao.campo}
          onChange={(e) => handleOrdenacaoChange('campo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="item">Item</option>
          <option value="categoria">Categoria</option>
          <option value="pavimento">Pavimento</option>
          <option value="total">Valor Total</option>
          <option value="maoDeObra">Mão de Obra</option>
          <option value="materiais">Materiais</option>
          <option value="pesoPercentual">Peso Percentual</option>
        </select>
        
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => handleOrdenacaoChange('direcao', 'asc')}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              ordenacao.direcao === 'asc'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SortAsc className="h-4 w-4 inline mr-1" />
            Crescente
          </button>
          <button
            onClick={() => handleOrdenacaoChange('direcao', 'desc')}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              ordenacao.direcao === 'desc'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SortDesc className="h-4 w-4 inline mr-1" />
            Decrescente
          </button>
        </div>
      </div>

      {/* Botão Resetar */}
      <button
        onClick={resetarFiltros}
        className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Resetar Filtros</span>
      </button>
    </div>
  );
};

export default Filtros;

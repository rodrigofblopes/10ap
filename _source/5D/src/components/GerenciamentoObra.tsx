import React, { useState } from 'react';
import { Calendar, FileText, Truck, Package } from 'lucide-react';

const GerenciamentoObra: React.FC = () => {
  const [activeTab, setActiveTab] = useState('diario');

  const tabs = [
    {
      id: 'diario',
      label: 'Diário de Obra',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Diário de Obra</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Nova Entrada
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Todos</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          {/* Lista vazia */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhuma entrada encontrada</p>
          </div>
        </div>
      )
    },
    {
      id: 'notas',
      label: 'Controle de Notas',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Controle de Notas</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Nova Nota
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Último mês</option>
                  <option>Últimos 3 meses</option>
                  <option>Últimos 6 meses</option>
                  <option>Último ano</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Todos</option>
                  <option>Pendente</option>
                  <option>Aprovado</option>
                  <option>Rejeitado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Todos</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Lista vazia */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhuma nota encontrada</p>
          </div>
        </div>
      )
    },
    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: Truck,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Fornecedores</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Novo Fornecedor
            </button>
          </div>

          {/* Lista vazia */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhum fornecedor cadastrado</p>
          </div>
        </div>
      )
    },
    {
      id: 'insumos',
      label: 'Controle de Insumos',
      icon: Package,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Controle de Insumos</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Novo Insumo
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Todas</option>
                  <option>Concreto</option>
                  <option>Ferro e Aço</option>
                  <option>Materiais de Construção</option>
                  <option>Ferramentas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Todos</option>
                  <option>Em estoque</option>
                  <option>Baixo estoque</option>
                  <option>Sem estoque</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Lista vazia */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Nenhum insumo cadastrado</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Gerenciamento de Obra</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default GerenciamentoObra;
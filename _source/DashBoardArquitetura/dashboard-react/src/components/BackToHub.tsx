import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToHubProps {
  dashboardName: string;
}

const BackToHub: React.FC<BackToHubProps> = ({ dashboardName }) => {
  const handleBackToHub = () => {
    // Navegar para o hub central de projetos
    window.location.href = 'https://lote10x30-10apartamentos.vercel.app/';
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-3">
        <button
          onClick={handleBackToHub}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          title="Voltar ao Hub de Projetos"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">Voltar ao Hub</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <div className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            {dashboardName}
          </h1>
        </div>
      </div>
      
      {/* Botão mobile para voltar */}
      <button
        onClick={handleBackToHub}
        className="sm:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        title="Voltar ao Hub"
      >
        <Home className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BackToHub;

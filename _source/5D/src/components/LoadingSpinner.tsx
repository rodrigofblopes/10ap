import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Carregando Dashboard
        </h2>
        <p className="text-gray-600">
          Analisando dados do Lote 10x30 - 10 Apartamentos...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

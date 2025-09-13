import React from 'react';

const GerenciamentoProjetos: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Iframe Container */}
      <div className="h-[calc(100vh-60px)] w-full overflow-hidden relative">
        {/* Overlay para ocultar apenas o fundo dourado superior */}
        <div 
          className="absolute top-0 left-0 w-full bg-gray-50 z-10 pointer-events-none"
          style={{ height: '80px' }}
        ></div>
        <iframe
          src="https://gerenciamentoprojetos-ashen.vercel.app/"
          className="w-full h-full border-0"
          title="Gerenciamento de Projetos"
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{ 
            minHeight: '600px',
            border: 'none',
            borderRadius: '0 0 8px 8px',
            transform: 'translateY(-80px)', // Reduzido para mostrar as abas
            height: 'calc(100% + 80px)' // Compensa o movimento
          }}
        />
      </div>
    </div>
  );
};

export default GerenciamentoProjetos;

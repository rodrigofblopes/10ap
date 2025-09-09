import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-black via-yellow-600 to-black text-white shadow-lg border-b-2 border-yellow-400">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Nome da Empresa - Lado Esquerdo */}
          <div className="flex items-center flex-1 min-w-0">
            <img 
              src="/BIMTECH.jpg" 
              alt="BIMTECH Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg shadow-md mr-2 sm:mr-3 md:mr-4 bg-white p-1 flex-shrink-0"
            />
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg shadow-lg min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-black truncate">
                Bonfim Imobiliária e Engenharia
              </h1>
            </div>
          </div>
          
          {/* Espaço vazio para centralizar os ícones */}
          <div className="flex-1"></div>
          
          {/* WhatsApp Button - Lado Direito */}
          <div className="flex items-center flex-shrink-0 ml-2">
            <a 
              href="https://wa.me/5569992561830?text=Olá! Gostaria de saber mais sobre o projeto Lote 10x30 - 10 Apartamentos" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 group"
              title="Fale conosco no WhatsApp"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 sm:px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block">
                Fale conosco
              </div>
            </a>
          </div>
        </div>
        
        {/* Título do Projeto Centralizado */}
        <div className="mt-3 sm:mt-4 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg inline-block max-w-full">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
              Lote 10x30 - 10 Apartamentos
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Layers, Menu, X, FolderKanban, HardHat, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileNavMode, setMobileNavMode] = useState<'dropdown' | 'bottom' | 'swipe'>('bottom');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const tabs = [
    {
      id: 'resumo',
      label: 'Resumo',
      fullLabel: 'Resumo Executivo',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Visão geral dos custos e indicadores'
    },
    {
      id: '5d',
      label: '5D',
      fullLabel: 'Visualizador 5D',
      icon: <Layers className="h-4 w-4" />,
      description: '3D + Orçamento integrados'
    },
    {
      id: 'gerenciamento-projetos',
      label: 'Ger. Projetos',
      fullLabel: 'Gerenciamento Projetos',
      icon: <FolderKanban className="h-4 w-4" />,
      description: 'Gestão e controle de projetos'
    },
    {
      id: 'gerenciamento-obra',
      label: 'Ger. Obra',
      fullLabel: 'Gerenciamento Obra',
      icon: <HardHat className="h-4 w-4" />,
      description: 'Gestão e controle de obra'
    },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  // Função para navegação por swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let nextIndex;

      if (isLeftSwipe) {
        // Swipe para esquerda = próxima aba
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      } else {
        // Swipe para direita = aba anterior
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      }

      onTabChange(tabs[nextIndex].id);
    }
  };

  // Função para navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let nextIndex;

      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      }

      onTabChange(tabs[nextIndex].id);
    }
  };

  // Detectar preferência do usuário para modo de navegação
  useEffect(() => {
    const savedMode = localStorage.getItem('mobileNavMode');
    if (savedMode && ['dropdown', 'bottom', 'swipe'].includes(savedMode)) {
      setMobileNavMode(savedMode as 'dropdown' | 'bottom' | 'swipe');
    }
  }, []);

  const saveNavMode = (mode: 'dropdown' | 'bottom' | 'swipe') => {
    setMobileNavMode(mode);
    localStorage.setItem('mobileNavMode', mode);
  };

  return (
    <>
      {/* Mobile Navigation Container */}
      <div 
        ref={containerRef}
        className="lg:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header com navegação atual e controles */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-2">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3">
            {/* Navegação atual */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
              <div className={`p-1 rounded-lg ${
                activeTab === 'resumo' ? 'bg-green-100 text-green-600' : 'text-gray-400'
              }`}>
                {tabs.find(tab => tab.id === activeTab)?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {tabs.find(tab => tab.id === activeTab)?.fullLabel}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </div>
              </div>
            </div>

            {/* Controles de navegação */}
            <div className="flex items-center space-x-1">
              {/* Botão anterior */}
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                  onTabChange(tabs[prevIndex].id);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Aba anterior"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </button>

              {/* Indicador de posição */}
              <div className="flex space-x-1">
                {tabs.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      tabs.findIndex(tab => tab.id === activeTab) === index
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Botão próximo */}
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                  onTabChange(tabs[nextIndex].id);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Próxima aba"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>

              {/* Botão de menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Menu de navegação"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 text-gray-500" />
                ) : (
                  <Menu className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Menu dropdown melhorado */}
          {isMobileMenuOpen && (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Seletor de modo de navegação */}
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-2">Modo de navegação:</div>
                <div className="flex space-x-1">
                  {[
                    { id: 'bottom', label: 'Inferior', icon: '📱' },
                    { id: 'dropdown', label: 'Menu', icon: '📋' },
                    { id: 'swipe', label: 'Swipe', icon: '👆' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => saveNavMode(mode.id as any)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        mobileNavMode === mode.id
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-1">{mode.icon}</span>
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de abas */}
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                      isActive ? 'bg-green-50 text-green-700' : 'text-gray-700'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${
                      isActive ? 'bg-green-100 text-green-600' : 'text-gray-400'
                    }`}>
                      {tab.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{tab.fullLabel}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navegação inferior (quando selecionada) */}
        {mobileNavMode === 'bottom' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around py-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors ${
                      isActive ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${
                      isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {tab.icon}
                    </div>
                    <span className="text-xs font-medium truncate max-w-16">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    group relative py-4 text-center text-sm font-medium hover:text-green-600 focus:z-10
                    ${isActive 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}>
                      {tab.icon}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                    <span className={`
                      text-xs max-w-full truncate
                      ${isActive ? 'text-green-600' : 'text-gray-400'}
                    `}>
                      {tab.description}
                    </span>
                  </div>
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navigation;

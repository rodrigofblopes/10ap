import React, { useState } from 'react';
import { BarChart3, Menu, X, Box } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const tabs = [
    {
      id: 'resumo',
      label: 'Resumo Executivo',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Visão geral dos custos e indicadores'
    },
    {
      id: '5d',
      label: '5D',
      icon: <Box className="h-4 w-4" />,
      description: 'Modelo 3D e planilha orçamentária'
    }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Desktop Navigation */}
      <div className="hidden lg:block border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium hover:text-blue-600 focus:z-10
                  ${isActive 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  <span className={`
                    text-xs max-w-full truncate
                    ${isActive ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                    {tab.description}
                  </span>
                </div>
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Navegação</h2>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto px-4 py-2 space-x-4" aria-label="Mobile Tabs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`
                      flex-shrink-0 flex flex-col items-center space-y-2 py-3 px-4 rounded-lg transition-colors min-w-[120px]
                      ${isActive 
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400'
                      }
                    `}>
                      {tab.icon}
                    </div>
                    <span className="font-medium text-sm text-center">{tab.label}</span>
                    <span className={`
                      text-xs text-center max-w-full
                      ${isActive ? 'text-blue-600' : 'text-gray-400'}
                    `}>
                      {tab.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Mobile Current Tab Display */}
        {!showMobileMenu && (
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {tabs.find(tab => tab.id === activeTab)?.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;

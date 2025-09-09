import { useEffect, useState } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { carregarDados } from './services/orcamentoService';
import BackToHub from './components/BackToHub';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResumoExecutivo from './components/ResumoExecutivo';
import Arquitetura3D from './components/Arquitetura3D';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { setItens, carregando } = useOrcamentoStore();
  const [activeTab, setActiveTab] = useState('resumo');

  useEffect(() => {
    const carregarDadosInicial = async () => {
      try {
        console.log('🚀 App - Iniciando carregamento de dados...');
        // Carregar dados do orçamento
        const dados = await carregarDados();
        console.log('🚀 App - Dados carregados:', dados.length, 'itens');
        console.log('🚀 App - Primeiros 3 itens:', dados.slice(0, 3));
        setItens(dados);
        console.log('🚀 App - Dados definidos no store');
      } catch (error) {
        console.error('❌ App - Erro ao carregar dados:', error);
      }
    };

    carregarDadosInicial();
  }, [setItens]);

  const renderContent = () => {
    switch (activeTab) {
      case 'resumo':
        return <ResumoExecutivo />;
      case '5d':
        return <Arquitetura3D />;
      default:
        return <ResumoExecutivo />;
    }
  };

  if (carregando) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackToHub dashboardName="Dashboard Arquitetura" />
      <Header />
      
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-4 lg:mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;

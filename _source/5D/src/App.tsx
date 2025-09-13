import { useState, useEffect } from 'react';
import { useOrcamentoStore } from './store/orcamentoStore';
import { carregarDados } from './services/orcamentoService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResumoExecutivo from './components/ResumoExecutivo';
import Viewer5D from './components/Viewer5D';
import GerenciamentoProjetos from './components/GerenciamentoProjetos';
import GerenciamentoObra from './components/GerenciamentoObra';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [activeTab, setActiveTab] = useState('resumo');
  const { setItens } = useOrcamentoStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inicializar = async () => {
      try {
        setLoading(true);
        const dados = await carregarDados();
        setItens(dados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    inicializar();
  }, [setItens]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'resumo':
        return <ResumoExecutivo />;
      case '5d':
        return <Viewer5D />;
      case 'gerenciamento-projetos':
        return <GerenciamentoProjetos />;
      case 'gerenciamento-obra':
        return <GerenciamentoObra />;
      default:
        return <ResumoExecutivo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-2 sm:mt-4 lg:mt-6 pb-20 lg:pb-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;

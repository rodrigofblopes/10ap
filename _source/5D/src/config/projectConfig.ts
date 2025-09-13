// 🎯 CONFIGURAÇÃO DO PROJETO - FÁCIL DE ADAPTAR PARA OUTROS PROJETOS

export const PROJECT_CONFIG = {
  // 📋 INFORMAÇÕES BÁSICAS DO PROJETO
  projectInfo: {
    name: "Lote 10x30 - 10 Apartamentos",
    type: "Residencial",
    location: "Rondônia",
    area: 298, // m²
    floors: 2,
    description: "Projeto estrutural para 10 apartamentos em lote 10x30"
  },

  // 🏗️ ESTRUTURA DE CATEGORIAS (PADRÃO PARA PROJETOS ESTRUTURAIS)
  categories: {
    fundacao: {
      name: "Fundação",
      weight: 30.81, // % do total
      subcategories: ["Vigas", "Pilares", "Fundações"]
    },
    terreo: {
      name: "Térreo", 
      weight: 37.20,
      subcategories: ["Vigas", "Pilares", "Lajes"]
    },
    superior: {
      name: "Pavimento Superior",
      weight: 31.99,
      subcategories: ["Vigas", "Pilares"]
    }
  },

  // 📊 CONFIGURAÇÕES SINAPI
  sinapi: {
    version: "07/2025",
    state: "Rondônia",
    bdi: 0.0, // %
    encargosSociais: "Não Desonerado"
  },

  // 🎨 CONFIGURAÇÕES DE INTERFACE
  ui: {
    colors: {
      primary: "#059669", // Verde
      secondary: "#2563eb", // Azul
      accent: "#ea580c", // Laranja
      success: "#16a34a", // Verde sucesso
      warning: "#dc2626", // Vermelho
      neutral: "#6b7280" // Cinza
    },
    theme: "light",
    language: "pt-BR"
  },

  // 💰 CONFIGURAÇÕES DE COTAÇÃO
  quotation: {
    defaultArea: 298,
    currency: "BRL",
    decimalPlaces: 2,
    showPercentages: true,
    showEconomy: true,
    showCostPerM2: true
  },

  // 📁 ESTRUTURA DE ARQUIVOS
  fileStructure: {
    dwgFiles: [
      "Forma Fundação.dwg",
      "Locação.dwg", 
      "Prancha Fundação.dwg"
    ],
    supportedFormats: [".dwg", ".pdf", ".jpg", ".png"],
    maxFileSize: "10MB"
  }
};

// 🔧 FUNÇÕES UTILITÁRIAS REUTILIZÁVEIS
export const PROJECT_UTILS = {
  // Calcular peso percentual de uma categoria
  calculateCategoryWeight: (categoryTotal: number, projectTotal: number): number => {
    return (categoryTotal / projectTotal) * 100;
  },

  // Formatar moeda brasileira
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  // Calcular custo por m²
  calculateCostPerM2: (totalCost: number, area: number): number => {
    return area > 0 ? totalCost / area : 0;
  },

  // Calcular economia
  calculateEconomy: (sinapiValue: number, realValue: number): number => {
    return sinapiValue - realValue;
  },

  // Calcular percentual de economia
  calculateEconomyPercentage: (economy: number, sinapiValue: number): number => {
    return sinapiValue > 0 ? (economy / sinapiValue) * 100 : 0;
  },

  // Validar dados do projeto
  validateProjectData: (data: any): boolean => {
    return data && 
           data.projectInfo && 
           data.projectInfo.area > 0 &&
           data.categories &&
           Object.keys(data.categories).length > 0;
  }
};

// 📊 TIPOS DE DADOS REUTILIZÁVEIS
export interface ProjectConfig {
  projectInfo: {
    name: string;
    type: string;
    location: string;
    area: number;
    floors: number;
    description: string;
  };
  categories: Record<string, {
    name: string;
    weight: number;
    subcategories: string[];
  }>;
  sinapi: {
    version: string;
    state: string;
    bdi: number;
    encargosSociais: string;
  };
  ui: {
    colors: Record<string, string>;
    theme: string;
    language: string;
  };
  quotation: {
    defaultArea: number;
    currency: string;
    decimalPlaces: number;
    showPercentages: boolean;
    showEconomy: boolean;
    showCostPerM2: boolean;
  };
  fileStructure: {
    dwgFiles: string[];
    supportedFormats: string[];
    maxFileSize: string;
  };
}

// 🚀 EXPORTAR CONFIGURAÇÃO PADRÃO
export default PROJECT_CONFIG;

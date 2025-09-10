// Configuração OFFLINE de links entre elementos 3D e itens da planilha
// Este arquivo é editado localmente antes do deploy

export interface OfflineLink {
  id: string;
  element3D: {
    id: string;
    name: string;
    category: string;
    keywords: string[];
  };
  budgetItem: {
    id: string;
    code: string;
    description: string;
    category: string;
  };
  linkType: 'exact' | 'category' | 'manual';
  confidence: number; // 0-100
  notes?: string;
  createdAt: string;
  validated: boolean;
}

export interface LinkingConfig {
  version: string;
  lastUpdated: string;
  project: string;
  links: OfflineLink[];
  settings: {
    autoValidate: boolean;
    requireConfidence: number;
    enablePreview: boolean;
  };
}

// CONFIGURAÇÃO PRINCIPAL - EDITE AQUI ANTES DO DEPLOY
export const LINKING_CONFIG: LinkingConfig = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  project: "Vila Andriw - Lote 10x30",
  settings: {
    autoValidate: true,
    requireConfidence: 80,
    enablePreview: true
  },
  links: [
    // ESTRUTURA - PILARES
    {
      id: "link_001",
      element3D: {
        id: "pilar_001",
        name: "Pilar Central",
        category: "Estrutura",
        keywords: ["pilar", "coluna", "estrutura", "concreto"]
      },
      budgetItem: {
        id: "1.1.1",
        code: "103355",
        description: "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS NA HORIZONTAL DE 11,5X14X24 CM",
        category: "Pavimento Térreo"
      },
      linkType: "category",
      confidence: 95,
      notes: "Pilar principal da estrutura",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // ESTRUTURA - VIGAS
    {
      id: "link_002",
      element3D: {
        id: "viga_001",
        name: "Viga Principal",
        category: "Estrutura",
        keywords: ["viga", "estrutura", "concreto"]
      },
      budgetItem: {
        id: "1.1.2",
        code: "87905",
        description: "CHAPISCO APLICADO EM ALVENARIA (COM PRESENÇA DE VÃOS) E ESTRUTURAS DE CONCRETO",
        category: "Pavimento Térreo"
      },
      linkType: "category",
      confidence: 90,
      notes: "Viga principal de sustentação",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // ESTRUTURA - LAJES
    {
      id: "link_003",
      element3D: {
        id: "laje_001",
        name: "Laje Térreo",
        category: "Estrutura",
        keywords: ["laje", "piso", "estrutura", "concreto"]
      },
      budgetItem: {
        id: "1.2.1",
        code: "87703",
        description: "CONTRAPISO EM ARGAMASSA PRONTA, PREPARO MECÂNICO COM MISTURADOR 300 KG",
        category: "Pavimento Térreo"
      },
      linkType: "exact",
      confidence: 98,
      notes: "Laje de concreto do pavimento térreo",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // ALVENARIA - PAREDES
    {
      id: "link_004",
      element3D: {
        id: "parede_001",
        name: "Parede Externa",
        category: "Alvenaria",
        keywords: ["parede", "alvenaria", "bloco", "vedação"]
      },
      budgetItem: {
        id: "1.1.1",
        code: "103355",
        description: "ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS NA HORIZONTAL DE 11,5X14X24 CM",
        category: "Pavimento Térreo"
      },
      linkType: "exact",
      confidence: 100,
      notes: "Paredes externas de alvenaria",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // REVESTIMENTOS - PISOS
    {
      id: "link_005",
      element3D: {
        id: "piso_001",
        name: "Piso Porcelanato",
        category: "Revestimento",
        keywords: ["piso", "porcelanato", "revestimento", "cerâmica"]
      },
      budgetItem: {
        id: "1.2.2",
        code: "87263",
        description: "REVESTIMENTO CERÂMICO PARA PISO COM PLACAS TIPO PORCELANATO DE DIMENSÕES 60X60 CM",
        category: "Pavimento Térreo"
      },
      linkType: "exact",
      confidence: 100,
      notes: "Piso de porcelanato 60x60",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // ESQUADRIAS - JANELAS
    {
      id: "link_006",
      element3D: {
        id: "janela_001",
        name: "Janela Alumínio",
        category: "Esquadrias",
        keywords: ["janela", "alumínio", "vidro", "esquadria"]
      },
      budgetItem: {
        id: "1.5.5",
        code: "94573",
        description: "JANELA DE ALUMÍNIO DE CORRER COM 4 FOLHAS PARA VIDROS (VIDROS INCLUSOS)",
        category: "Pavimento Térreo"
      },
      linkType: "exact",
      confidence: 100,
      notes: "Janelas de alumínio com vidro",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // ESQUADRIAS - PORTAS
    {
      id: "link_007",
      element3D: {
        id: "porta_001",
        name: "Porta Madeira",
        category: "Esquadrias",
        keywords: ["porta", "madeira", "esquadria"]
      },
      budgetItem: {
        id: "1.5.1",
        code: "91329",
        description: "KIT DE PORTA DE MADEIRA FRISADA, SEMI-OCA (LEVE OU MÉDIA), PADRÃO POPULAR",
        category: "Pavimento Térreo"
      },
      linkType: "exact",
      confidence: 100,
      notes: "Portas de madeira padrão popular",
      createdAt: new Date().toISOString(),
      validated: true
    },
    
    // COBERTURA - TELHADO
    {
      id: "link_008",
      element3D: {
        id: "telhado_001",
        name: "Telhado Fibrocimento",
        category: "Cobertura",
        keywords: ["telhado", "fibrocimento", "cobertura", "telha"]
      },
      budgetItem: {
        id: "2.6.2",
        code: "74088/001",
        description: "TELHAMENTO COM TELHA DE FIBROCIMENTO ONDULADA, ESPESSURA 6MM",
        category: "Pavimento Superior"
      },
      linkType: "exact",
      confidence: 100,
      notes: "Telhado de fibrocimento ondulado",
      createdAt: new Date().toISOString(),
      validated: true
    }
  ]
};

// Funções utilitárias para validação
export function validateLinkingConfig(config: LinkingConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar estrutura básica
  if (!config.version) errors.push("Versão não definida");
  if (!config.project) errors.push("Nome do projeto não definido");
  if (!config.links || config.links.length === 0) warnings.push("Nenhum link definido");

  // Validar links
  config.links.forEach((link, index) => {
    if (!link.id) errors.push(`Link ${index + 1}: ID não definido`);
    if (!link.element3D.id) errors.push(`Link ${index + 1}: ID do elemento 3D não definido`);
    if (!link.budgetItem.id) errors.push(`Link ${index + 1}: ID do item do orçamento não definido`);
    if (link.confidence < 0 || link.confidence > 100) errors.push(`Link ${index + 1}: Confiança inválida (${link.confidence})`);
    if (link.confidence < config.settings.requireConfidence) warnings.push(`Link ${index + 1}: Confiança baixa (${link.confidence}%)`);
  });

  // Verificar duplicatas
  const ids = config.links.map(link => link.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) errors.push(`IDs duplicados: ${duplicates.join(', ')}`);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Função para exportar configuração
export function exportLinkingConfig(config: LinkingConfig, format: 'json' | 'csv'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(config, null, 2);
    
    case 'csv':
      const headers = ['ID', 'Elemento 3D', 'Categoria 3D', 'Item Código', 'Item Descrição', 'Tipo Link', 'Confiança', 'Validado'];
      const rows = config.links.map(link => [
        link.id,
        link.element3D.name,
        link.element3D.category,
        link.budgetItem.code,
        link.budgetItem.description,
        link.linkType,
        link.confidence.toString(),
        link.validated ? 'Sim' : 'Não'
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    
    default:
      return JSON.stringify(config, null, 2);
  }
}

// Função para importar configuração
export function importLinkingConfig(jsonString: string): LinkingConfig | null {
  try {
    const config = JSON.parse(jsonString);
    const validation = validateLinkingConfig(config);
    
    if (!validation.isValid) {
      console.error('Configuração inválida:', validation.errors);
      return null;
    }
    
    if (validation.warnings.length > 0) {
      console.warn('Avisos na configuração:', validation.warnings);
    }
    
    return config;
  } catch (error) {
    console.error('Erro ao importar configuração:', error);
    return null;
  }
}

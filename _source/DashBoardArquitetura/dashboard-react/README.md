# 🏗️ Dashboard de Orçamento - Lote 10x30 - 10 Apartamentos (React)

## 📋 Descrição

Dashboard interativo e moderno para visualização dos custos de construção do Lote 10x30 - 10 Apartamentos, **migrado do Python/Streamlit original** para React + TypeScript + Tailwind CSS.

## ✨ Funcionalidades

### 🎯 **Recursos Principais:**
- **Visualização por Pavimento:** Térreo e Pavimento Superior
- **Análise por Categoria:** Paredes, Piso, Revestimento, Forro, Esquadrias, Telhado
- **Métricas Detalhadas:** Mão de obra, materiais, total, preços por m²
- **Filtros Avançados:** Por pavimento, categoria, faixa de valor
- **Ordenação Flexível:** Por qualquer campo (crescente/decrescente)
- **Gráficos Interativos:** Distribuição de custos e estatísticas
- **Interface Responsiva:** Funciona em qualquer dispositivo

### 🔄 **Migração do Dashboard.py Original:**
- ✅ **Dados preservados:** Mesma estrutura de dados do Excel
- ✅ **Lógica mantida:** Cálculos e categorização idênticos
- ✅ **Funcionalidades:** Todas as features do dashboard Python
- ✅ **Interface moderna:** Cards, gráficos e filtros avançados

## 🚀 Tecnologias

- **Frontend:** React 18 + TypeScript
- **Estilização:** Tailwind CSS
- **Estado:** Zustand
- **Build:** Vite
- **Gráficos:** Chart.js + React-Chartjs-2
- **Ícones:** Lucide React

## 📁 Estrutura do Projeto

```
dashboard-react/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.tsx      # Cabeçalho principal
│   │   ├── ResumoExecutivo.tsx  # Métricas principais
│   │   ├── Filtros.tsx     # Filtros e ordenação
│   │   ├── GridOrcamento.tsx    # Grid de itens
│   │   ├── Graficos.tsx    # Gráficos e estatísticas
│   │   └── LoadingSpinner.tsx   # Spinner de carregamento
│   ├── store/              # Gerenciamento de estado (Zustand)
│   │   └── orcamentoStore.ts
│   ├── services/           # Serviços de dados
│   │   └── orcamentoService.ts
│   ├── types/              # Tipos TypeScript
│   │   └── orcamento.ts
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Ponto de entrada
├── public/                 # Arquivos estáticos
├── tailwind.config.js      # Configuração Tailwind
├── vite.config.ts          # Configuração Vite
└── package.json            # Dependências
```

## 🛠️ Instalação e Execução

### **Pré-requisitos:**
- Node.js 16+ 
- npm ou yarn

### **Passos:**
1. **Navegar para a pasta:**
   ```bash
   cd DashBoardArquitetura/dashboard-react
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar no navegador:**
   ```
   http://localhost:3000
   ```

## 📊 Estrutura de Dados

### **OrcamentoItem:**
```typescript
interface OrcamentoItem {
  id: string;
  item: string;           // Código do item (1.1.1, 2.1.1, etc.)
  codigo: string;         // Código de referência
  descricao: string;      // Descrição detalhada
  unidade: string;        // Unidade de medida
  quantidade: number;     // Quantidade
  valorUnitario: number;  // Valor unitário
  maoDeObra: number;      // Custo mão de obra
  materiais: number;      // Custo materiais
  total: number;          // Valor total
  pesoPercentual: number; // Peso no orçamento
  pavimento: 'Térreo' | 'Superior';
  categoria: string;      // Paredes, Piso, Revestimento, etc.
  maoDeObraM2: number;    // Preço m² mão de obra
  materiaisM2: number;    // Preço m² materiais
  totalM2: number;        // Preço m² total
}
```

## 🎨 Interface

### **Cores e Temas:**
- **Verde:** Valores totais e principais
- **Azul:** Mão de obra
- **Laranja:** Materiais
- **Roxo:** Pavimento Térreo
- **Índigo:** Pavimento Superior

### **Layout:**
- **Header:** Título e descrição do projeto
- **Resumo Executivo:** 6 cards com métricas principais
- **Sidebar:** Filtros e ordenação
- **Conteúdo Principal:** Grid de itens organizados por pavimento
- **Gráficos:** Análise visual dos dados

## 🔧 Desenvolvimento

### **Comandos úteis:**
```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

### **Arquivos de dados:**
- **Desenvolvimento:** Dados mockados em `orcamentoService.ts`
- **Produção:** Integração com arquivo Excel real

## 📈 Melhorias da Migração

### **Antes (Python/Streamlit):**
- ❌ Interface básica
- ❌ CSS inline limitado
- ❌ Gráficos simples
- ❌ Layout menos responsivo
- ❌ Porta 8501

### **Depois (React/TypeScript):**
- ✅ Interface moderna e interativa
- ✅ Tailwind CSS avançado
- ✅ Gráficos interativos com Chart.js
- ✅ Totalmente responsivo
- ✅ Porta 3000
- ✅ Performance superior
- ✅ Atualizações em tempo real

## 🤝 Contribuição

Este projeto foi migrado do dashboard Python original mantendo:
- **Fidelidade aos dados** e lógica de negócio
- **Compatibilidade** com arquivos Excel existentes
- **Experiência do usuário** aprimorada
- **Funcionalidades** expandidas

## 📝 Licença

MIT License - Engenharia Vila Andriw

---

**🎉 Dashboard migrado com sucesso do Python para React!**

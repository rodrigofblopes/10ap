# 🚀 Instruções para Acessar os Dashboards - Vila Andriw

## 📋 Visão Geral

Este documento explica como acessar o **Hub Central Integrado** do projeto Vila Andriw. **Todas as disciplinas estão agora integradas em uma única aplicação Streamlit**, proporcionando navegação fluida e acesso centralizado.

## 🏠 Dashboard de Arquitetura

### 📁 **INTEGRADO NO HUB CENTRAL**
- **Localização**: Integrado em `app.py` (Hub Central)
- **Acesso**: Através do Hub Central na mesma aplicação

### 🚀 **Como Acessar**
1. Execute o Hub Central: `python -m streamlit run app.py --server.port 8501`
2. Clique no botão "🏠 Acessar Dashboard Arquitetura"
3. Ou use a sidebar: "🏠 Ir para Arquitetura"

### 🌐 **Funcionalidades Integradas**
- Dashboard de orçamento interativo
- Análise de custos por pavimento
- Distribuição de custos por categoria
- Detalhamento por apartamento
- Métricas de eficiência do projeto

## 🏗️ Dashboard Estrutural

### 📁 **INTEGRADO NO HUB CENTRAL**
- **Localização**: Integrado em `app.py` (Hub Central)
- **Acesso**: Através do Hub Central na mesma aplicação

### 🚀 **Como Acessar**
1. Execute o Hub Central: `python -m streamlit run app.py --server.port 8501`
2. Clique no botão "🏗️ Acessar Dashboard Estrutural"
3. Ou use a sidebar: "🏗️ Ir para Estrutural"

### 🌐 **Funcionalidades Integradas**
- Análise de volumes (concreto, aço, formas)
- Análise de custos estruturais por elemento
- Indicadores de sustentabilidade
- Comparativo de eficiência vs. padrão mercado
- Gráficos interativos e relatórios detalhados

## 🔄 **SISTEMA INTEGRADO - UMA SÓ APLICAÇÃO**

### ✅ **VANTAGEM**: Tudo em Um Local

**Não é mais necessário executar múltiplos dashboards!** Agora tudo está integrado:

```bash
# APENAS UM COMANDO
python -m streamlit run app.py --server.port 8501
```

### 📱 **URL Única de Acesso**
- **Tudo em**: http://localhost:8501
- **Hub Central**: Visão geral do projeto
- **Arquitetura**: Dashboard completo integrado
- **Estrutural**: Análise estrutural integrada

### 🎯 **Benefícios da Integração**
- ✅ **Uma só aplicação**: Não precisa de múltiplos terminais
- ✅ **Navegação fluida**: Alterna entre disciplinas instantaneamente
- ✅ **Contexto preservado**: Mantém estado entre navegações
- ✅ **Sidebar sempre visível**: Acesso rápido a todas as funcionalidades
- ✅ **Performance otimizada**: Carregamento mais rápido

## 🎯 **Fluxo de Trabalho Simplificado**

### 1. **Iniciar o Sistema Integrado**
```bash
python -m streamlit run app.py --server.port 8501
```

### 2. **Abrir no Navegador**
- Acesse: http://localhost:8501
- Visualize o Hub Central com todas as disciplinas

### 3. **Navegar Entre Disciplinas**
- Clique nos botões "Acessar Dashboard" nos cards
- Use a sidebar para navegação rápida
- **Tudo na mesma aplicação** - sem abrir novas abas

### 4. **Trabalhar com Dados**
- Compare dados entre disciplinas instantaneamente
- Mantenha o contexto entre navegações
- Use a sidebar para ações rápidas

## 🔧 **Solução de Problemas - Sistema Integrado**

### ❌ **Erro: Porta já em uso**
```bash
# Solução: Use uma porta diferente
python -m streamlit run app.py --server.port 8502
```

### ❌ **Erro: Módulo não encontrado**
```bash
# Verifique se está na pasta correta
cd C:\Users\USUARIO\Desktop\lote10x30-10apartamentos
```

### ❌ **Erro: Dependências não instaladas**
```bash
# Instale as dependências
pip install -r requirements.txt
```

### ❌ **Problema de Navegação**
- **Sintoma**: Botões não funcionam
- **Solução**: Verifique se o Streamlit está rodando na versão 1.28+
- **Alternativa**: Use a sidebar para navegação

### ❌ **Erro de Estado da Sessão**
- **Sintoma**: Página não carrega corretamente
- **Solução**: Recarregue a página (F5) ou reinicie a aplicação

## 📊 **Estrutura de Arquivos - Sistema Integrado**

```
Lote10x30-10apartamentos/
├── app.py                          # 🎯 HUB CENTRAL INTEGRADO
│   ├── Dashboard Arquitetura      # 🏠 Integrado
│   ├── Dashboard Estrutural       # 🏗️ Integrado
│   └── Navegação por Abas         # 🔄 Sistema de Estado
├── DashBoardArquitetura/          # 📁 Dados e Recursos
│   ├── VilaAndriw.ifc            # 🎯 Modelo 3D
│   ├── Orçamento Material e MO.xlsx
│   └── app.py                    # 📊 Dashboard Original (referência)
├── DashboardEstrutural/           # 📁 Dados e Recursos
│   ├── VilaAndriw.ifc           # 🎯 Modelo 3D
│   ├── relatorioestrutural.html  # 🌐 Visualizador 3D
│   └── dashboard.py              # 📊 Dashboard Original (referência)
└── INSTRUCOES-ACESSO-DASHBOARDS.md
```

### 🔄 **Como Funciona a Integração**
- **`app.py`**: Contém todos os dashboards integrados
- **Pastas originais**: Mantidas para dados e recursos
- **Navegação**: Sistema de estado com `st.session_state`
- **Funcionalidades**: Todas integradas em uma aplicação

## 💡 Dicas de Uso

1. **Mantenha o Hub Central Aberto**: Use como ponto de referência
2. **Use Portas Diferentes**: Evite conflitos entre aplicações
3. **Abas Separadas**: Abra cada dashboard em abas diferentes
4. **Compare Dados**: Use múltiplos dashboards para análise cruzada
5. **Salve Configurações**: Cada dashboard mantém suas configurações

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se está na pasta correta
2. Confirme se as dependências estão instaladas
3. Use portas diferentes para múltiplos dashboards
4. Consulte os logs de erro no terminal

---

**🏗️ Vila Andriw - Sistema de Dashboards Integrados**  
*Desenvolvido para gestão multidisciplinar de projetos*

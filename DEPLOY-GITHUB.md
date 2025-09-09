# 🚀 Deploy no GitHub Pages - Lote 10x30 - 10 Apartamentos

## 📋 Configuração para GitHub Pages

### ✅ **Arquivos Criados:**
- ✅ `.github/workflows/deploy.yml` - GitHub Actions para deploy automático
- ✅ `.nojekyll` - Arquivo necessário para GitHub Pages
- ✅ `github-pages.json` - Configuração específica para GitHub Pages
- ✅ URLs atualizadas no `index.html`

### 🔧 **Passos para Deploy:**

#### 1. **Criar Repositório no GitHub:**
```bash
# No GitHub, criar um novo repositório público
# Nome sugerido: lote10x30-10apartamentos
```

#### 2. **Subir o Código:**
```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Deploy inicial para GitHub Pages"

# Adicionar remote do GitHub
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# Subir para o GitHub
git push -u origin main
```

#### 3. **Configurar GitHub Pages:**
1. Ir para **Settings** do repositório
2. Scroll até **Pages**
3. Em **Source**, selecionar **GitHub Actions**
4. O deploy será automático!

#### 4. **Atualizar URLs no index.html:**
```javascript
// Substituir estas linhas no index.html:
const githubUser = 'SEU-USUARIO'; // Seu usuário do GitHub
const githubRepo = 'SEU-REPOSITORIO'; // Nome do repositório
```

### 🌐 **URLs Finais:**
Após o deploy, as URLs serão:
- **Hub Central**: `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`
- **Arquitetura**: `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/DashBoardArquitetura/dashboard-react/dist/`
- **Estrutural**: `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/DashboardEstrutural/dist/`
- **Gerenciamento**: `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/gerenciamentoprojetos/dist/`

### 🔄 **Deploy Automático:**
- ✅ A cada push na branch `main`, o deploy será automático
- ✅ GitHub Actions fará o build e deploy
- ✅ Site ficará disponível em alguns minutos

### 🎯 **Estrutura de Arquivos:**
```
lote10x30-10apartamentos/
├── .github/workflows/deploy.yml    # ✅ Deploy automático
├── .nojekyll                       # ✅ Configuração GitHub Pages
├── index.html                      # ✅ Hub Central (URLs atualizadas)
├── DashBoardArquitetura/dashboard-react/dist/  # ✅ Build React
├── DashboardEstrutural/dist/       # ✅ Build React
├── gerenciamentoprojetos/dist/     # ✅ Build React
└── DEPLOY-GITHUB.md               # ✅ Este arquivo
```

### 🚨 **Importante:**
1. **Substituir URLs**: Atualizar `SEU-USUARIO` e `SEU-REPOSITORIO` no `index.html`
2. **Repositório Público**: GitHub Pages gratuito só funciona com repositórios públicos
3. **Branch Main**: Deploy automático só funciona na branch `main` ou `master`

### 🆘 **Solução de Problemas:**

#### ❌ **Erro: 404 Not Found**
- Verificar se as URLs estão corretas no `index.html`
- Confirmar se os builds estão na pasta `dist/`

#### ❌ **Erro: Deploy não funciona**
- Verificar se o repositório é público
- Confirmar se GitHub Actions está habilitado
- Verificar se a branch é `main` ou `master`

#### ❌ **Erro: Assets não carregam**
- Verificar se o arquivo `.nojekyll` está na raiz
- Confirmar se os caminhos dos assets estão corretos

### 🎉 **Pronto!**
Após seguir estes passos, seu projeto estará disponível no GitHub Pages com todas as funcionalidades funcionando perfeitamente!

---
**🏗️ Lote 10x30 - 10 Apartamentos**  
*Deploy automatizado no GitHub Pages*

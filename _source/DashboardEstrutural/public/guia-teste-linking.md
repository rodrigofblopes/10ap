# 🧪 Guia de Teste - Linking GLB-CSV

## 📋 **Passo a Passo para Testar:**

### **1. 🚀 Iniciar o Servidor**
```bash
cd DashboardEstrutural
npm run dev
```

### **2. 🌐 Acessar a Aplicação**
- **Abra**: `http://localhost:3000`
- **Vá para aba "5D"**
- **Aguarde** o modelo 3D carregar completamente

### **3. 🔍 Verificar Logs no Console**
1. **Abra o console** (`F12`)
2. **Procure por estas mensagens:**
   ```
   📦 ===== ELEMENTOS 3D EXTRAÍDOS =====
   🏗️ ===== TODAS AS SUBCOLEÇÕES =====
   🗺️ Mapeamento de elementos carregado
   ```

### **4. 🧪 Executar Diagnóstico**
1. **Cole este código no console:**
   ```javascript
   // Cole o conteúdo do arquivo diagnostico-completo-linking.js
   ```
2. **Execute** e analise os resultados

### **5. 🎯 Testar o Linking**
1. **Clique na linha 1.1** da planilha (Vigas)
2. **Observe** o modelo 3D
3. **Verifique** se as subcoleções ficam laranja

## 🔍 **O que Procurar nos Logs:**

### **✅ Logs de Sucesso:**
```
🏗️ SUBCOLEÇÃO ENCONTRADA: "1.1_.031"
🏗️ SUBCOLEÇÃO ENCONTRADA: "1.1_.032"
...
🏗️ Total de subcoleções: 15
✅ MAPEAMENTO: Subcoleção "1.1_.031" encontrada no GLB
🎯 MAPEAMENTO: 15 subcoleções encontradas via mapeamento
```

### **❌ Logs de Problema:**
```
🏗️ Total de subcoleções: 0
❌ MAPEAMENTO: Subcoleção "1.1_.031" NÃO encontrada no GLB
❌ PROBLEMA: Nenhuma correspondência encontrada!
```

## 🛠️ **Possíveis Problemas e Soluções:**

### **Problema 1: Nenhuma subcoleção encontrada**
**Causa**: Subcoleções não foram renomeadas no Blender
**Solução**: Renomear as subcoleções conforme o mapeamento

### **Problema 2: Subcoleções encontradas mas não destacadas**
**Causa**: Problema na lógica de highlighting
**Solução**: Verificar logs de highlighting

### **Problema 3: Mapeamento não carregado**
**Causa**: Arquivo JSON não encontrado
**Solução**: Verificar se `mapeamento-elementos.json` está na pasta `public`

## 📊 **Resultado Esperado:**

- **15 subcoleções** encontradas no GLB
- **15 correspondências** no mapeamento
- **15 elementos** destacados em laranja
- **Lincagem funcionando** perfeitamente

## 🆘 **Se Não Funcionar:**

1. **Execute o diagnóstico completo**
2. **Verifique os logs detalhados**
3. **Confirme se as subcoleções estão renomeadas**
4. **Teste com o script de diagnóstico**

---

**💡 Dica**: Os logs detalhados vão mostrar exatamente onde está o problema!

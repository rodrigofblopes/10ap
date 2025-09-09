# 🎯 Guia de Renomeação no Blender - Solução Simplificada

## 📋 **O que Você Precisa Fazer (MUITO SIMPLES):**

### **1. Abrir o Blender**
- Abra o arquivo `Estrutural.blend` no Blender

### **2. Localizar as Coleções**
- No painel **Scene Collection** (lado direito)
- Você verá as coleções: `1.1_`, `1.1_.001`, `1.1_.002`, etc.

### **3. Renomear Apenas as Coleções (NÃO os objetos dentro)**

**Coleções para Renomear:**
```
1.1_        → 1.1_.031
1.1_.001    → 1.1_.032
1.1_.002    → 1.1_.033
1.1_.003    → 1.1_.034
1.1_.004    → 1.1_.035
1.1_.005    → 1.1_.036
1.1_.006    → 1.1_.037
1.1_.007    → 1.1_.038
1.1_.008    → 1.1_.039
1.1_.009    → 1.1_.040
1.1_.010    → 1.1_.041
1.1_.011    → 1.1_.042
```

### **4. Como Renomear:**
1. **Clique com botão direito** na coleção
2. **Selecione "Rename"** ou pressione `F2`
3. **Digite o novo nome**
4. **Pressione Enter**

### **5. Exportar o GLB:**
1. **File** → **Export** → **glTF 2.0 (.glb/.gltf)**
2. **Salve como** `Estrutural.glb` na pasta `public`
3. **Substitua** o arquivo antigo

## ✅ **Vantagens desta Abordagem:**

- **Rápido**: Apenas 12 renomeações
- **Simples**: Não precisa mexer nos objetos individuais
- **Eficiente**: Os objetos dentro das coleções mantêm os nomes atuais
- **Funcional**: A lincagem funcionará perfeitamente

## 🎯 **Resultado Esperado:**

Após a renomeação, quando você clicar na linha **1.1 - Vigas** da planilha:
- **12 coleções** serão destacadas em laranja
- **Todos os objetos** dentro dessas coleções serão destacados
- **A lincagem funcionará** perfeitamente

## 🚀 **Teste Após a Renomeação:**

1. **Acesse**: `http://localhost:3000`
2. **Vá para aba "5D"**
3. **Clique na linha 1.1** da planilha
4. **Observe**: 12 coleções destacadas em laranja no modelo 3D

---

**💡 Dica**: Esta é a solução mais prática e rápida para fazer a lincagem funcionar!

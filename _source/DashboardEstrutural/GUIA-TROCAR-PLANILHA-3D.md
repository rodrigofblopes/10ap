# 🔄 Como Trocar Planilha e Modelo 3D

## ✅ **Sim, o linkamento funcionará!**

O sistema foi projetado para ser flexível e funcionar com diferentes planilhas e modelos 3D.

## 📋 **Passo 1: Preparar a Nova Planilha**

### **Estrutura Obrigatória da Planilha CSV:**

```csv
Item;Descrição;Und;Quant.;Total;;;Peso (%);Elementos3D
;;;;M. O.;MAT.;Total;;
1;Fundação;;;;;39.241,02;30,81 %;elemento1,elemento2,elemento3
1.1;Vigas;m³;98,6;5.374,03;14.049,96;19.423,99;15,25 %;viga1,viga2,viga3
1.2;Pilares;m³;1,4;2.394,23;6.903,39;9.297,62;7,30 %;pilar1,pilar2,pilar3
```

### **Colunas Obrigatórias:**
- **Item**: Código do item (ex: 1.1, 1.2, 2.1)
- **Descrição**: Nome do item
- **Elementos3D**: **NOMES DOS ELEMENTOS 3D SEPARADOS POR VÍRGULA**

### **Exemplo de Elementos3D:**
```
1.1_.001,1.1_.002,1.1_.003,1.1_.004,1.1_.005
```

## 🏗️ **Passo 2: Preparar o Modelo 3D**

### **Nomenclatura dos Elementos no Blender:**

1. **Abra o modelo no Blender**
2. **Renomeie os objetos** com os mesmos nomes da coluna `Elementos3D`
3. **Organize em coleções** (opcional, mas recomendado)

### **Exemplo de Nomenclatura:**
```
Coleção: 1.1 (Vigas)
├── 1.1_.001
├── 1.1_.002
├── 1.1_.003
└── 1.1_.004

Coleção: 1.2 (Pilares)
├── 1.2_.001
├── 1.2_.002
└── 1.2_.003
```

### **Exportar como GLB:**
1. **File → Export → glTF 2.0 (.glb/.gltf)**
2. **Salvar como**: `Estrutural.glb`
3. **Configurações**:
   - ✅ Include → Selected Objects
   - ✅ Transform → +Y Up
   - ✅ Geometry → Apply Modifiers

## 🔄 **Passo 3: Substituir os Arquivos**

### **Arquivos a Substituir:**
```
public/
├── 5DEST.csv          ← SUA NOVA PLANILHA
├── Estrutural.glb     ← SEU NOVO MODELO 3D
└── mapeamento-elementos.json  ← OPCIONAL (pode manter o atual)
```

### **Verificações Importantes:**

1. **Nomes dos elementos** na planilha = **Nomes dos objetos** no GLB
2. **Formato CSV** com ponto e vírgula (`;`) como separador
3. **Coluna Elementos3D** na posição correta (última coluna)
4. **Encoding UTF-8** para caracteres especiais

## 🧪 **Passo 4: Testar o Linkamento**

### **1. Iniciar o Servidor:**
```bash
python servidor-local.py
# ou
node servidor-local.js
```

### **2. Abrir no Navegador:**
```
http://localhost:3000
```

### **3. Verificar no Console (F12):**
```
🔍 ===== DEBUG DADOS PLANILHA =====
📊 Total de itens 5D: X
🔗 Itens com elementos3D: X

📦 ===== ELEMENTOS 3D EXTRAÍDOS =====
📦 Total de elementos: X
📦 Lista completa ordenada: [elemento1, elemento2, ...]
```

### **4. Testar o Linkamento:**
- **Clique em um item** da planilha
- **Verifique se os elementos 3D** são destacados em laranja
- **Console deve mostrar**:
  ```
  🎯 X elementos serão destacados em LARANJA
  🟠 Elementos: elemento1, elemento2, elemento3
  ```

## 🐛 **Solução de Problemas**

### **❌ "Nenhum elemento encontrado"**
- **Verifique** se os nomes na planilha coincidem com os do GLB
- **Verifique** se a coluna Elementos3D está preenchida
- **Verifique** se o separador é vírgula (`,`)

### **❌ "Elementos 3D não carregados"**
- **Verifique** se o arquivo GLB está em `public/Estrutural.glb`
- **Verifique** se o modelo foi exportado corretamente do Blender
- **Verifique** se os objetos têm nomes (não "Cube.001", "Cube.002")

### **❌ "Planilha não carrega"**
- **Verifique** se o arquivo está em `public/5DEST.csv`
- **Verifique** se o formato CSV está correto
- **Verifique** se o encoding é UTF-8

## 💡 **Dicas Importantes**

### **Nomenclatura Recomendada:**
```
Padrão: [CATEGORIA]_.[NUMERO]
Exemplos:
- 1.1_.001 (Viga 1 da fundação)
- 1.2_.001 (Pilar 1 da fundação)
- 2.1_.001 (Viga 1 do térreo)
- 2.2_.001 (Pilar 1 do térreo)
```

### **Organização no Blender:**
```
Scene
├── 1.1 (Vigas Fundação)
│   ├── 1.1_.001
│   ├── 1.1_.002
│   └── 1.1_.003
├── 1.2 (Pilares Fundação)
│   ├── 1.2_.001
│   └── 1.2_.002
└── 2.1 (Vigas Térreo)
    ├── 2.1_.001
    └── 2.1_.002
```

### **Validação Rápida:**
1. **Abra o GLB** em um visualizador online
2. **Verifique** se os objetos têm os nomes corretos
3. **Compare** com a coluna Elementos3D da planilha

## 🎯 **Resultado Esperado**

Quando funcionar corretamente:
- ✅ **Planilha carrega** com todos os itens
- ✅ **Modelo 3D carrega** com textura de concreto
- ✅ **Clique na planilha** destaca elementos 3D em laranja
- ✅ **Console mostra** correspondências encontradas
- ✅ **Linkamento bidirecional** funciona (clique no 3D → destaca na planilha)

---

**🚀 Lembre-se**: O sistema é flexível, mas a nomenclatura deve ser consistente entre planilha e modelo 3D!

// Script para analisar a estrutura do arquivo GLB e mapear elementos 3D
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

console.log('🔍 ===== ANÁLISE DA ESTRUTURA GLB =====');

// Função para analisar recursivamente a scene
function analisarNode(node, depth = 0, parent = 'root') {
  const indent = '  '.repeat(depth);
  
  console.log(`${indent}📦 Node: "${node.name}" (Type: ${node.type})`);
  console.log(`${indent}   Parent: ${parent}`);
  console.log(`${indent}   Children: ${node.children.length}`);
  
  if (node.children.length > 0) {
    console.log(`${indent}   Children names:`, node.children.map(child => child.name || 'unnamed'));
  }
  
  // Log adicional para meshes
  if (node.type === 'Mesh') {
    console.log(`${indent}   🎲 Mesh geometry: ${node.geometry.type}`);
    console.log(`${indent}   🎨 Material: ${node.material?.name || 'unnamed'}`);
  }
  
  // Log adicional para groups que podem ser collections
  if (node.type === 'Group' && node.name) {
    console.log(`${indent}   🗂️ Group (possible collection): "${node.name}"`);
  }
  
  // Analisar filhos recursivamente
  node.children.forEach(child => {
    analisarNode(child, depth + 1, node.name || 'unnamed');
  });
}

// Função para extrair todos os nomes de elementos
function extrairTodosElementos(node, elementos = new Set()) {
  if (node.name && node.name.trim() !== '') {
    elementos.add(node.name);
  }
  
  node.children.forEach(child => {
    extrairTodosElementos(child, elementos);
  });
  
  return elementos;
}

// Função para agrupar elementos por padrão
function agruparElementosPorPadrao(elementos) {
  const grupos = {};
  
  elementos.forEach(nome => {
    // Procurar padrões como "1.1_", "2.2_", etc.
    const match = nome.match(/^(\d+\.\d+)_/);
    if (match) {
      const grupo = match[1];
      if (!grupos[grupo]) {
        grupos[grupo] = [];
      }
      grupos[grupo].push(nome);
    } else {
      // Elementos que não seguem o padrão
      if (!grupos['outros']) {
        grupos['outros'] = [];
      }
      grupos['outros'].push(nome);
    }
  });
  
  return grupos;
}

// Carregar e analisar o GLB
async function analisarGLB() {
  try {
    console.log('📂 Carregando arquivo 5d.glb...');
    
    const loader = new GLTFLoader();
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/5d.glb', resolve, undefined, reject);
    });
    
    console.log('✅ Arquivo GLB carregado com sucesso!');
    console.log('📊 Informações gerais:');
    console.log('   Scenes:', gltf.scenes.length);
    console.log('   Animations:', gltf.animations.length);
    console.log('   Cameras:', gltf.cameras.length);
    
    if (gltf.scene) {
      console.log('\n🏗️ ===== ESTRUTURA DA SCENE =====');
      analisarNode(gltf.scene);
      
      console.log('\n🔍 ===== EXTRAÇÃO DE ELEMENTOS =====');
      const todosElementos = extrairTodosElementos(gltf.scene);
      console.log(`📋 Total de elementos encontrados: ${todosElementos.size}`);
      
      console.log('\n📝 Lista de todos os elementos:');
      const elementosArray = Array.from(todosElementos).sort();
      elementosArray.forEach((elemento, index) => {
        console.log(`   ${(index + 1).toString().padStart(3, '0')}: "${elemento}"`);
      });
      
      console.log('\n🗂️ ===== AGRUPAMENTO POR PADRÃO =====');
      const grupos = agruparElementosPorPadrao(todosElementos);
      
      Object.keys(grupos).sort().forEach(grupo => {
        console.log(`\n📦 Grupo "${grupo}" (${grupos[grupo].length} elementos):`);
        grupos[grupo].sort().forEach(elemento => {
          console.log(`   - ${elemento}`);
        });
      });
      
      console.log('\n📊 ===== RESUMO DOS GRUPOS =====');
      Object.keys(grupos).sort().forEach(grupo => {
        console.log(`${grupo}: ${grupos[grupo].length} elementos`);
      });
      
      // Gerar mapeamento para planilha
      console.log('\n📋 ===== MAPEAMENTO PARA PLANILHA CSV =====');
      Object.keys(grupos).sort().forEach(grupo => {
        if (grupo !== 'outros') {
          const elementosString = grupos[grupo].sort().join(',');
          console.log(`Item ${grupo}: ${elementosString}`);
        }
      });
      
    } else {
      console.log('❌ Nenhuma scene encontrada no arquivo GLB');
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar/analisar GLB:', error);
  }
}

// Executar análise
analisarGLB();

export { analisarGLB, extrairTodosElementos, agruparElementosPorPadrao };

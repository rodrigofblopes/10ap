import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Search } from 'lucide-react';
import { useOrcamentoStore } from '../store/orcamentoStore';
import PlanilhaSintetica from './PlanilhaSintetica';

// Componente de loading
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando modelo 3D...</p>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// Componente para carregar o modelo GLB com highlighting
interface StructuralModelProps {
  highlightedElements: string[];
  onElementsExtracted?: (elements: string[]) => void;
  onElementClick?: (elementName: string) => void;
}

function StructuralModel({ highlightedElements, onElementsExtracted, onElementClick }: StructuralModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/Estrutural.glb');

  // Criar textura de concreto (otimizada e reutilizável)
  const createConcreteTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; // Reduzido para melhor performance
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Base cinza muito escuro
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, 256, 256);
    
    // Adicionar ruído para textura (otimizado)
    const imageData = ctx.getImageData(0, 0, 256, 256);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20; // Reduzido para melhor performance
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Adicionar algumas manchas mais escuras (reduzido)
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(50, 50, 50, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 15 + 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, []); // useMemo para criar apenas uma vez
  
  // Extrair elementos e aplicar textura de concreto
  useEffect(() => {
    if (scene && onElementsExtracted) {
      const elements: string[] = [];
      const collections: { [key: string]: THREE.Object3D[] } = {};
    
      scene.traverse((child) => {
        if (child.name && child.name.trim() !== '') {
          elements.push(child.name);
          
          // NOVA LÓGICA: Identificar COLEÇÕES PAI (não subcoleções)
          // As coleções pai são as pastas principais: "1.1", "1.2", "2.1", etc.
          const parentCollectionMatch = child.name.match(/^(\d+\.\d+)$/);
          if (parentCollectionMatch) {
            const parentCollectionName = child.name;
            if (!collections[parentCollectionName]) {
              collections[parentCollectionName] = [];
            }
            collections[parentCollectionName].push(child);
            console.log(`📁 COLECÇÃO PAI IDENTIFICADA: "${parentCollectionName}"`);
          }
          
          // Debug: Log específico para coleções pai
          if (child.name === '1.1' || child.name === '1.2' || child.name === '2.1' || 
              child.name === '2.2' || child.name === '2.3' || child.name === '3.1' || 
              child.name === '3.2') {
            console.log(`📁 COLECÇÃO PAI ENCONTRADA: "${child.name}"`);
          }
        }
        
        // Aplicar textura de concreto a todos os meshes
        if (child instanceof THREE.Mesh) {
          const concreteMaterial = new THREE.MeshStandardMaterial({
            map: createConcreteTexture,
            color: '#3a3a3a',
            roughness: 0.8,
            metalness: 0.1,
            normalScale: new THREE.Vector2(0.5, 0.5)
          });
          
          // Salvar material original
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          
          child.material = concreteMaterial;
          console.log(`🏗️ Textura de concreto aplicada em: ${child.name}`);
        }
      });
      
      // Expor coleções globalmente para debug
      (window as any).glbCollections = collections;
      console.log('📁 ===== COLECÇÕES IDENTIFICADAS =====');
      console.log('📁 Total de subcoleções:', Object.keys(collections).length);
      Object.entries(collections).forEach(([name, objects]) => {
        console.log(`📁 Subcoleção "${name}": ${objects.length} objetos`);
      });
      
      console.log('📦 ===== ELEMENTOS 3D EXTRAÍDOS =====');
      console.log('📦 Total de elementos:', elements.length);
      console.log('📦 Primeiros 10 elementos:', elements.slice(0, 10));
      console.log('📦 Elementos com underscore:', elements.filter(el => el.includes('_')).slice(0, 10));
      
      // Análise específica dos elementos 1.1_ (Vigas)
      const elementos1_1 = elements.filter(el => el.startsWith('1.1_'));
      console.log('📦 ===== ELEMENTOS 1.1_ (VIGAS) =====');
      console.log('📦 Quantidade de elementos 1.1_:', elementos1_1.length);
      console.log('📦 Lista completa dos elementos 1.1_:', elementos1_1.sort());
      
      // Debug específico para todas as subcoleções
      const todasSubcolecoes = elements.filter(el => 
        el.includes('1.1_') || el.includes('1.2_') || el.includes('2.1_') || 
        el.includes('2.2_') || el.includes('2.3_') || el.includes('3.1_') || el.includes('3.2_')
      );
      console.log('🏗️ ===== TODAS AS SUBCOLEÇÕES =====');
      console.log('🏗️ Total de subcoleções:', todasSubcolecoes.length);
      console.log('🏗️ Lista todas subcoleções:', todasSubcolecoes.sort());
      
      // Expor subcoleções globalmente para debug
      (window as any).glbSubcolecoes = todasSubcolecoes;
      
      // Análise específica dos elementos 1.2_ (Pilares)
      const elementos1_2 = elements.filter(el => el.startsWith('1.2_'));
      console.log('📦 ===== ELEMENTOS 1.2_ (PILARES) =====');
      console.log('📦 Quantidade de elementos 1.2_:', elementos1_2.length);
      console.log('📦 Lista completa dos elementos 1.2_:', elementos1_2.sort());
      
      // Análise específica dos elementos 2.1_ (Vigas Térreo)
      const elementos2_1 = elements.filter(el => el.startsWith('2.1_'));
      console.log('📦 ===== ELEMENTOS 2.1_ (VIGAS TÉRREO) =====');
      console.log('📦 Quantidade de elementos 2.1_:', elementos2_1.length);
      console.log('📦 Lista completa dos elementos 2.1_:', elementos2_1.sort());
      
      // Análise específica dos elementos 2.2_ (Pilares Térreo)
      const elementos2_2 = elements.filter(el => el.startsWith('2.2_'));
      console.log('📦 ===== ELEMENTOS 2.2_ (PILARES TÉRREO) =====');
      console.log('📦 Quantidade de elementos 2.2_:', elementos2_2.length);
      console.log('📦 Lista completa dos elementos 2.2_:', elementos2_2.sort());
      
      // Análise específica dos elementos 2.3_ (Lajes Térreo)
      const elementos2_3 = elements.filter(el => el.startsWith('2.3_'));
      console.log('📦 ===== ELEMENTOS 2.3_ (LAJES TÉRREO) =====');
      console.log('📦 Quantidade de elementos 2.3_:', elementos2_3.length);
      console.log('📦 Lista completa dos elementos 2.3_:', elementos2_3.sort());
      
      // Análise específica dos elementos 3.1_ (Vigas Superior)
      const elementos3_1 = elements.filter(el => el.startsWith('3.1_'));
      console.log('📦 ===== ELEMENTOS 3.1_ (VIGAS SUPERIOR) =====');
      console.log('📦 Quantidade de elementos 3.1_:', elementos3_1.length);
      console.log('📦 Lista completa dos elementos 3.1_:', elementos3_1.sort());
      
      // Análise específica dos elementos 3.2_ (Pilares Superior)
      const elementos3_2 = elements.filter(el => el.startsWith('3.2_'));
      console.log('📦 ===== ELEMENTOS 3.2_ (PILARES SUPERIOR) =====');
      console.log('📦 Quantidade de elementos 3.2_:', elementos3_2.length);
      console.log('📦 Lista completa dos elementos 3.2_:', elementos3_2.sort());
      
      console.log('📦 ===== TODOS OS ELEMENTOS (ORDENADOS) =====');
      console.log('📦 Lista completa ordenada:', elements.sort());
      onElementsExtracted(elements);
    }
  }, [scene, onElementsExtracted]);

  // Aplicar highlighting aos elementos selecionados
  useEffect(() => {
    console.log('🎨 ===== INICIANDO HIGHLIGHTING =====');
    console.log('🎨 Elementos para destacar:', highlightedElements.length);
    console.log('🎨 Lista completa:', highlightedElements);
    console.log('🎨 Scene disponível:', !!scene);
    console.log('🎨 Scene children count:', scene ? scene.children.length : 0);
    
    // Log específico para elementos 1.1_ (Vigas)
    if (highlightedElements.some(el => el.startsWith('1.1_'))) {
      const elementos1_1 = highlightedElements.filter(el => el.startsWith('1.1_'));
      console.log('🏗️ ===== DESTACANDO ELEMENTOS 1.1_ (VIGAS) =====');
      console.log('🏗️ Quantidade de elementos 1.1_ a destacar:', elementos1_1.length);
      console.log('🏗️ Lista dos elementos 1.1_ a destacar:', elementos1_1.sort());
    }
    
    // Debug: verificar se há elementos no scene
    if (scene) {
      console.log('🔍 ===== DEBUG SCENE =====');
      console.log('🔍 Scene name:', scene.name);
      console.log('🔍 Scene type:', scene.type);
      console.log('🔍 Scene children:', scene.children.map(child => ({ name: child.name, type: child.type })));
    }
    
    if (scene) {
      let highlightedCount = 0;
      let totalMeshes = 0;
      let foundElements: string[] = [];
      
      // NOVA LÓGICA: Trabalhar com coleções pai
      const collections = (window as any).glbCollections || {};
      console.log('📁 ===== USANDO COLECÇÕES PAI PARA HIGHLIGHTING =====');
      console.log('📁 Coleções pai disponíveis:', Object.keys(collections));
      console.log('🎨 ===== DEBUG HIGHLIGHTING =====');
      console.log('🎨 Elementos para destacar:', highlightedElements);
      console.log('🎨 Quantidade de elementos para destacar:', highlightedElements.length);
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          totalMeshes++;
          
          // Verificar se este objeto pertence a uma coleção pai destacada
          let isHighlighted = false;
          let parentCollectionName = '';
          
          // Verificar se este objeto pertence a uma coleção pai destacada
          for (const highlightedParentCollection of highlightedElements) {
            if (collections[highlightedParentCollection]) {
              // Verificar se este objeto está na coleção pai
              const isInParentCollection = collections[highlightedParentCollection].some((obj: any) => obj === child);
              if (isInParentCollection) {
                isHighlighted = true;
                parentCollectionName = highlightedParentCollection;
                break;
              }
            }
          }
          
          // Fallback: verificação direta por nome (para compatibilidade)
          if (!isHighlighted) {
            isHighlighted = highlightedElements.includes(child.name);
          }
          
          // Debug: mostrar todos os meshes encontrados
          if (child.name && (child.name.includes('11_') || child.name.includes('1.1_') || 
              child.name.includes('12_') || child.name.includes('21_') || child.name.includes('22_'))) {
            console.log(`🔍 MESH ESTRUTURAL ENCONTRADO: ${child.name} - Highlighted: ${isHighlighted} - Coleção Pai: ${parentCollectionName}`);
            console.log(`🔍 Elementos destacados incluem ${child.name}?`, highlightedElements.includes(child.name));
          }
          
          if (isHighlighted) {
            highlightedCount++;
            foundElements.push(child.name);
            
            // Log específico para elementos 1.1_ (Vigas)
            if (child.name.startsWith('1.1_') || parentCollectionName.startsWith('1.1')) {
              console.log(`🏗️ VIGA DESTACADA: ${child.name} - Coleção Pai: ${parentCollectionName} - Posição:`, child.position);
            } else {
              console.log(`🟠 DESTACANDO: ${child.name} - Coleção Pai: ${parentCollectionName}`);
            }
            
            // Verificar se o material existe
            if (child.material) {
              // Salvar material original se ainda não foi salvo
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material.clone();
                console.log(`💾 Material original salvo para: ${child.name}`);
              }
              
              // Criar novo material laranja vibrante mantendo a textura de concreto
              const newMaterial = new THREE.MeshStandardMaterial({
                map: createConcreteTexture, // SEMPRE usar a textura de concreto
                color: 0xff6600, // Laranja vibrante
                emissive: 0x331100, // Brilho laranja suave
                metalness: 0.0,
                roughness: 0.2,
                normalScale: new THREE.Vector2(0.5, 0.5)
              });
              
              // Aplicar novo material
              child.material = newMaterial;
              
              // Forçar atualização do material
              if (child.material.map) {
                child.material.map.needsUpdate = true;
              }
              
              if (child.name.startsWith('1.1_') || parentCollectionName.startsWith('1.1')) {
                console.log(`🏗️ VIGA LARANJA APLICADA: ${child.name} - Cor: #ff6600`);
              } else {
                console.log(`🟠 MATERIAL LARANJA APLICADO: ${child.name}`);
                console.log(`🟠 Cor aplicada: #ff6600 (laranja)`);
                console.log(`🟠 Textura mantida: concreto escuro`);
              }
            } else {
              console.log(`⚠️ Material não encontrado para: ${child.name}`);
            }
          } else {
            // SEMPRE voltar ao material de concreto escuro
            const concreteMaterial = new THREE.MeshStandardMaterial({
              map: createConcreteTexture, // SEMPRE usar a textura de concreto
              color: '#3a3a3a',
              roughness: 0.8,
              metalness: 0.1,
              normalScale: new THREE.Vector2(0.5, 0.5)
            });
            
            child.material = concreteMaterial;
            console.log(`🔄 Material de concreto escuro restaurado para: ${child.name}`);
          }
        }
      });
      
      console.log(`🎨 ===== RESULTADO HIGHLIGHTING =====`);
      console.log(`🎨 Total de meshes: ${totalMeshes}`);
      console.log(`🎨 Meshes destacados: ${highlightedCount}`);
      console.log(`🎨 Elementos encontrados:`, foundElements);
      console.log(`🎨 Elementos não encontrados:`, highlightedElements.filter(el => !foundElements.includes(el)));
      
      // Resumo específico para elementos 1.1_ (Vigas)
      const vigasEncontradas = foundElements.filter(el => el.startsWith('1.1_'));
      const vigasNaoEncontradas = highlightedElements.filter(el => el.startsWith('1.1_') && !foundElements.includes(el));
      
      if (vigasEncontradas.length > 0 || vigasNaoEncontradas.length > 0) {
        console.log(`🏗️ ===== RESUMO VIGAS (1.1_) =====`);
        console.log(`🏗️ Vigas encontradas e destacadas: ${vigasEncontradas.length}`);
        console.log(`🏗️ Lista das vigas destacadas:`, vigasEncontradas.sort());
        console.log(`🏗️ Vigas não encontradas: ${vigasNaoEncontradas.length}`);
        if (vigasNaoEncontradas.length > 0) {
          console.log(`🏗️ Lista das vigas não encontradas:`, vigasNaoEncontradas.sort());
        }
      }
    } else {
      console.log('❌ Scene não disponível para highlighting');
    }
  }, [scene, highlightedElements]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // Função para lidar com clique nos elementos
  const handleElementClick = (event: any) => {
    event.stopPropagation();
    const elementName = event.object.name;
    console.log('🖱️ Elemento clicado:', elementName);
    if (onElementClick) {
      onElementClick(elementName);
    }
  };

  return (
    <group ref={meshRef}>
        <primitive 
          object={scene} 
          onClick={handleElementClick}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e: any) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
          }}
        />
    </group>
  );
}

// Hook personalizado para gerenciar o linking - VERSÃO CORRIGIDA
function usePlanilha3DLink(itens5D: any[]) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  const [glbElements, setGlbElements] = useState<string[]>([]);

  // Carregar mapeamento de elementos
  useEffect(() => {
    const carregarMapeamento = async () => {
      try {
        const response = await fetch('/mapeamento-elementos.json');
        const mapeamento = await response.json();
        (window as any).mapeamentoElementos = mapeamento;
        console.log('🗺️ Mapeamento de elementos carregado:', mapeamento);
      } catch (error) {
        console.log('⚠️ Erro ao carregar mapeamento:', error);
      }
    };
    
    carregarMapeamento();
  }, []);

  // Debug: Log dos dados recebidos
  useEffect(() => {
    console.log('🔍 ===== DEBUG DADOS PLANILHA =====');
    console.log('📊 Total de itens 5D:', itens5D.length);
    
    // Expor dados globalmente para debug
    (window as any).itens5D = itens5D;
    (window as any).debugData = {
      itens: itens5D,
      timestamp: new Date().toISOString()
    };
    
    // Mostrar estrutura dos primeiros itens
    itens5D.slice(0, 5).forEach((item, index) => {
      console.log(`📋 Item ${index + 1}:`, {
        id: item.id,
        codigo: item.codigo,
        descricao: item.descricao,
        elementos3D: item.elementos3D,
        allKeys: Object.keys(item)
      });
    });
    
    // Verificar se existe coluna de elementos 3D
    const temElementos3D = itens5D.some(item => item.elementos3D && item.elementos3D.trim() !== '');
    console.log('🔗 Itens com elementos3D:', temElementos3D);
    
    if (!temElementos3D) {
      console.log('⚠️ ATENÇÃO: Nenhum item possui a coluna "elementos3D" preenchida!');
      console.log('💡 Verifique se a coluna existe na planilha CSV e se os dados foram carregados corretamente');
    }
  }, [itens5D]);

  // Debug: Log dos elementos GLB
  useEffect(() => {
    if (glbElements.length > 0) {
      console.log('🎯 ===== DEBUG ELEMENTOS GLB =====');
      console.log('📦 Total de elementos GLB:', glbElements.length);
      console.log('🔤 Primeiros 20 elementos GLB:', glbElements.slice(0, 20));
      
      // Expor elementos GLB globalmente para debug
      (window as any).glbElements = glbElements;
      (window as any).debugData = {
        ...(window as any).debugData,
        glbElements: glbElements,
        glbTimestamp: new Date().toISOString()
      };
      
      // Agrupar elementos por padrões
      const patterns = {
        withNumbers: glbElements.filter(el => /\d/.test(el)),
        withUnderscore: glbElements.filter(el => el.includes('_')),
        withDots: glbElements.filter(el => el.includes('.')),
        collections: glbElements.filter(el => el.toLowerCase().includes('collection') || el.toLowerCase().includes('colecao'))
      };
      
      Object.entries(patterns).forEach(([pattern, elements]) => {
        if (elements.length > 0) {
          console.log(`🔸 Elementos ${pattern}:`, elements.slice(0, 10));
        }
      });
    }
  }, [glbElements]);

  // Função para analisar padrões de nomenclatura dos elementos GLB
  const analyzeGLBPatterns = useCallback((): Record<string, string[]> => {
    console.log('🔍 ===== ANALISANDO PADRÕES DE NOMENCLATURA GLB =====');
    
    const patterns: Record<string, string[]> = {};
    
    // Extrair todos os padrões numéricos dos elementos GLB
    glbElements.forEach(element => {
      // Padrão: XX_ (ex: 11_, 12_, 21_, 22_, etc.)
      const match = element.match(/^(\d+)_/);
      if (match) {
        const pattern = match[1];
        if (!patterns[pattern]) {
          patterns[pattern] = [];
        }
        patterns[pattern].push(element);
      }
    });
    
    console.log('📊 Padrões encontrados:', Object.keys(patterns));
    console.log('📊 Detalhes dos padrões:', patterns);
    
    return patterns;
  }, [glbElements]);

  // Função para mapear item da planilha para padrão GLB
  const mapItemToGLBPattern = useCallback((itemId: string): string => {
    // Converter item da planilha para padrão GLB
    // 1.1 → 11, 1.2 → 12, 2.1 → 21, 2.2 → 22, etc.
    const parts = itemId.split('.');
    if (parts.length === 2) {
      const pattern = parts[0] + parts[1]; // Remove o ponto
      console.log(`🔄 Mapeando item ${itemId} → padrão GLB: ${pattern}`);
      return pattern;
    }
    return itemId;
  }, []);

  // Função simplificada e melhorada para encontrar correspondências
  const findMatchingElements = useCallback((item: any): string[] => {
    const itemId = item.id;
    const itemCodigo = item.codigo;
    const itemDescricao = item.descricao || '';
    const elementos3D = item.elementos3D || '';
    
    console.log('🔍 ===== BUSCANDO CORRESPONDÊNCIAS =====');
    console.log('📋 Item:', { id: itemId, codigo: itemCodigo, descricao: itemDescricao, elementos3D });
    console.log('📦 Total de elementos GLB disponíveis:', glbElements.length);
    console.log('📦 Primeiros 10 elementos GLB:', glbElements.slice(0, 10));
    
    let matchingElements: string[] = [];
    
    // NOVA ESTRATÉGIA: Mapeamento automático baseado em padrões
    const glbPatterns = analyzeGLBPatterns();
    const targetPattern = mapItemToGLBPattern(itemId);
    
    console.log(`🎯 Procurando padrão GLB: ${targetPattern}`);
    console.log(`🎯 Padrões disponíveis:`, Object.keys(glbPatterns));
    
    if (glbPatterns[targetPattern]) {
      matchingElements = glbPatterns[targetPattern];
      console.log(`✅ MAPEAMENTO AUTOMÁTICO: ${matchingElements.length} elementos encontrados para ${itemId} (padrão ${targetPattern})`);
      console.log(`✅ Lista dos elementos:`, matchingElements);
      return matchingElements;
    }
    
    // FALLBACK: Busca por padrões similares
    console.log(`⚠️ Padrão exato ${targetPattern} não encontrado, tentando padrões similares...`);
    
    const similarPatterns = Object.keys(glbPatterns).filter(pattern => 
      pattern.includes(targetPattern) || targetPattern.includes(pattern)
    );
    
    if (similarPatterns.length > 0) {
      console.log(`🔍 Padrões similares encontrados:`, similarPatterns);
      
      similarPatterns.forEach(pattern => {
        matchingElements = [...matchingElements, ...glbPatterns[pattern]];
      });
      
      console.log(`✅ MAPEAMENTO SIMILAR: ${matchingElements.length} elementos encontrados para ${itemId}`);
      console.log(`✅ Lista dos elementos:`, matchingElements);
      return matchingElements;
    }
    
    // FALLBACK FINAL: Busca por texto no nome
    console.log(`⚠️ Nenhum padrão encontrado, tentando busca por texto...`);
    
    const textSearch = glbElements.filter(el => 
      el.toLowerCase().includes(itemId.toLowerCase()) ||
      el.toLowerCase().includes(itemId.replace('.', '').toLowerCase())
    );
    
    if (textSearch.length > 0) {
      matchingElements = textSearch;
      console.log(`✅ BUSCA POR TEXTO: ${matchingElements.length} elementos encontrados para ${itemId}`);
      console.log(`✅ Lista dos elementos:`, matchingElements);
      return matchingElements;
    }
    
    console.log(`❌ Nenhum elemento encontrado para ${itemId}`);
    return [];
  }, [glbElements]);


  return {
    selectedItems,
    highlightedElements,
    setGlbElements,
    setHighlightedElements,
    findMatchingElements,
    handleItemSelect: useCallback((item: any) => {
      const itemId = item.id;
      
      console.log('🖱️ ===== ITEM SELECIONADO =====');
      console.log('📋 Item completo:', item);
      
      setSelectedItems(() => {
        // SEMPRE limpar seleção anterior e selecionar apenas o item atual
        const newSelection = [itemId];
        
        console.log('🔄 Seleção atualizada (apenas item atual):', newSelection);
        
        // Encontrar elementos 3D correspondentes para o item atual
        const matchingElements = findMatchingElements(item);
        
        console.log('🎨 ===== APLICANDO HIGHLIGHTING =====');
        console.log('🎨 Total de elementos para destacar:', matchingElements.length);
        console.log('🎨 Lista de elementos:', matchingElements);
        
        if (matchingElements.length > 0) {
          console.log(`🎯 ${matchingElements.length} elementos serão destacados em LARANJA`);
          console.log('🟠 Elementos:', matchingElements.join(', '));
          console.log('🟠 ===== DESTAQUE LARANJA ATIVADO =====');
        } else {
          console.log('⚠️ NENHUM elemento encontrado para destacar!');
          console.log('💡 Verifique:');
          console.log('   1. Se a coluna "elementos3D" está preenchida na planilha');
          console.log('   2. Se os nomes dos elementos coincidem com os do modelo GLB');
          console.log('   3. Se o modelo GLB foi carregado corretamente');
          console.log('📋 Item atual:', { id: item.id, descricao: item.descricao, elementos3D: item.elementos3D });
        }
        
        setHighlightedElements(matchingElements);
        
        // Expor elementos destacados globalmente para debug
        (window as any).highlightedElements = matchingElements;
        (window as any).debugData = {
          ...(window as any).debugData,
          highlightedElements: matchingElements,
          selectedItem: item,
          highlightTimestamp: new Date().toISOString()
        };
        
        return newSelection;
      });
    }, [findMatchingElements])
  };
}

// Componente principal do Viewer 5D
export default function Viewer5D() {
  const { itens } = useOrcamentoStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    selectedItems,
    highlightedElements,
    setGlbElements,
    setHighlightedElements,
    handleItemSelect
  } = usePlanilha3DLink(itens);

  // Verificar se os dados estão carregados
  useEffect(() => {
    if (itens.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
      setError(null);
      console.log('✅ Dados da planilha 5DEST.csv carregados no Viewer5D:', itens.length, 'itens');
      console.log('📋 Primeiros itens:', itens.slice(0, 5).map(item => ({
        id: item.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        total: item.total,
        elementos3D: item.elementos3D
      })));
    }
  }, [itens]);
  
  // Callback para elementos extraídos do modelo 3D
  const handleElementsExtracted = useCallback((elements: string[]) => {
    setGlbElements(elements);
    console.log('🎯 Elementos 3D carregados:', elements.length);
  }, [setGlbElements]);


  // Função para destacar elementos por categoria da planilha
  const highlightElementsByCategory = (categoryCode: string) => {
    console.log('🏗️ Destacando elementos da categoria:', categoryCode);
    
    // Encontrar todos os elementos 3D que começam com o código da categoria
    const elementsToHighlight: string[] = [];
    
    // Buscar elementos que começam com o código da categoria (ex: "1.1_", "1.2_")
    const categoryPrefix = categoryCode + '_';
    
    // Simular busca nos elementos 3D baseado no padrão observado
    // Para 1.1 (Vigas): elementos como 1.1_.031, 1.1_.032, etc.
    // Para 1.2 (Pilares): elementos como 1.2_.003, 1.2_.011, etc.
    for (let i = 1; i <= 50; i++) {
      const elementName = `${categoryPrefix}.${i.toString().padStart(3, '0')}`;
      elementsToHighlight.push(elementName);
    }
    
    console.log('🎯 Elementos encontrados para destacar:', elementsToHighlight);
    setHighlightedElements(elementsToHighlight);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Carregando Dashboard 5D</h2>
          <p className="text-gray-500">Preparando modelo 3D e dados orçamentários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro no Carregamento</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
        {/* Visualizador 3D */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Modelo Estrutural 3D
                {highlightedElements.length > 0 && (
                  <span className="ml-2 bg-orange-400 text-orange-900 px-2 py-1 rounded text-xs font-medium">
                    {highlightedElements.length} em destaque
                  </span>
                )}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Clique nos itens da planilha para destacar no modelo
              </p>
            </div>
            
            <div className="h-96 lg:h-[520px]">
              <Canvas camera={{ position: [20, 20, 20], fov: 60 }}>
                            <Suspense fallback={<Loader />}>
                              <Environment preset="studio" />
                              <ambientLight intensity={0.3} />
                              <directionalLight position={[10, 10, 5]} intensity={0.8} />
                              <directionalLight position={[-10, -10, -5]} intensity={0.4} />
                              <directionalLight position={[0, -10, 0]} intensity={0.2} />
                  <StructuralModel 
                    highlightedElements={highlightedElements}
                    onElementsExtracted={handleElementsExtracted}
                    onElementClick={(elementName) => {
                      console.log('🔗 Elemento 3D clicado:', elementName);
                      // Encontrar item correspondente na planilha
                      const matchingItem = itens.find(item => 
                        item.elementos3D && item.elementos3D.includes(elementName)
                      );
                      if (matchingItem) {
                        console.log('📋 Item encontrado na planilha:', matchingItem);
                        handleItemSelect(matchingItem.id);
                      } else {
                        console.log('❌ Nenhum item encontrado para o elemento:', elementName);
                      }
                    }}
                  />
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={100}
                    target={[0, 0, 0]}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Planilha Orçamentária Sintética */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Planilha Orçamentária Sintética
              </h3>
              <p className="text-green-100 text-sm mt-1">
                {itens.length} itens carregados • Clique para destacar no 3D
              </p>
            </div>
            
            <div className="max-h-[520px] overflow-y-auto">
            <PlanilhaSintetica 
              itens={itens}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onCategorySelect={highlightElementsByCategory}
            />
            </div>
          </div>
          </div>
        </div>
    </div>
  );
}
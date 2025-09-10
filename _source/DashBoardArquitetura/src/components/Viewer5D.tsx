import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
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
  hiddenElements: Set<string>;
  onElementsExtracted?: (elements: string[]) => void;
  onElementClick?: (elementName: string) => void;
}

function StructuralModel({ highlightedElements, hiddenElements, onElementsExtracted, onElementClick }: StructuralModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/10apartamentosarq.glb');
  
  // Debug: Verificar se o modelo está carregado
  console.log('🎯 StructuralModel - Scene carregada:', !!scene);
  if (scene) {
    console.log('🎯 StructuralModel - Scene name:', scene.name);
    console.log('🎯 StructuralModel - Scene children count:', scene.children.length);
    console.log('🎯 StructuralModel - Scene type:', scene.type);
  }

  // Criar textura de vidro realista melhorada para portas e janelas
  const createGlassTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base transparente com gradiente azul mais realista
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(173, 216, 230, 0.6)'); // Azul claro no centro
    gradient.addColorStop(0.3, 'rgba(135, 206, 250, 0.4)'); // Azul céu
    gradient.addColorStop(0.7, 'rgba(100, 149, 237, 0.3)'); // Azul médio
    gradient.addColorStop(1, 'rgba(70, 130, 180, 0.2)'); // Azul escuro nas bordas
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Adicionar reflexos de vidro mais realistas
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const width = Math.random() * 30 + 10;
      const height = Math.random() * 4 + 2;
      const opacity = Math.random() * 0.5 + 0.3;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(x, y, width, height);
    }
    
    // Adicionar reflexos verticais mais finos
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 512;
      const opacity = Math.random() * 0.4 + 0.2;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(x, 0, 1, 512);
    }
    
    // Adicionar reflexos horizontais
    for (let i = 0; i < 3; i++) {
      const y = Math.random() * 512;
      const opacity = Math.random() * 0.3 + 0.1;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(0, y, 512, 1);
    }
    
    // Adicionar distorção sutil
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.1 + 0.05;
      
      ctx.fillStyle = `rgba(200, 200, 255, ${opacity})`;
      ctx.fillRect(x, y, size, size);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Textura única sem repetição
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // Criar materiais mais escuros para melhor visualização
  const createMaterials = useMemo(() => {
    const materials = {
      // Material para paredes (concreto escuro)
      parede: new THREE.MeshStandardMaterial({
        color: '#4A4A4A',
        roughness: 0.8,
        metalness: 0.0,
        envMapIntensity: 0.3
      }),
      
      // Material para pisos (concreto polido escuro)
      piso: new THREE.MeshStandardMaterial({
        color: '#5A5A5A',
        roughness: 0.1,
        metalness: 0.0,
        envMapIntensity: 0.5
      }),
      
      // Material para esquadrias (vidro realista com textura)
      esquadria: new THREE.MeshStandardMaterial({
        map: createGlassTexture,
        color: '#B0E0E6', // Azul claro mais vibrante
        roughness: 0.0,
        metalness: 0.0,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        envMapIntensity: 6.0,
        emissive: '#87CEEB',
        emissiveIntensity: 0.1
      }),
      
      // Material para telhado (telha escura)
      telhado: new THREE.MeshStandardMaterial({
        color: '#8B0000',
        roughness: 0.9,
        metalness: 0.0,
        envMapIntensity: 0.2
      }),
      
      // Material para pilares (concreto estrutural escuro)
      pilar: new THREE.MeshStandardMaterial({
        color: '#3A3A3A',
        roughness: 0.6,
        metalness: 0.0,
        envMapIntensity: 0.4
      }),
      
      // Material para vidros (vidro realista com textura)
      vidro: new THREE.MeshStandardMaterial({
        map: createGlassTexture,
        color: '#B0E0E6', // Azul claro mais vibrante
        roughness: 0.0,
        metalness: 0.0,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        envMapIntensity: 7.0,
        emissive: '#87CEEB',
        emissiveIntensity: 0.15
      }),
      
      // Material padrão (concreto padrão escuro)
      default: new THREE.MeshStandardMaterial({
        color: '#404040',
        roughness: 0.7,
        metalness: 0.0,
        envMapIntensity: 0.4
      })
    };
    
    return materials;
  }, [createGlassTexture]);


  // Função para determinar o material baseado no nome do elemento
  const getMaterialForElement = (elementName: string): THREE.MeshStandardMaterial => {
    const name = elementName.toLowerCase();
    
    if (name.includes('parede') || name.includes('alvenaria')) {
      console.log(`🏗️ PAREDE detectada: ${elementName}`);
      return createMaterials.parede;
    } else if (name.includes('piso') || name.includes('laje')) {
      console.log(`🏠 PISO detectado: ${elementName}`);
      return createMaterials.piso;
    } else if (name.includes('porta') || name.includes('janela') || name.includes('esquadria') || 
               name.includes('folha') || name.includes('basculante') || name.includes('correr') ||
               name.includes('madeira') || name.includes('abrir') || name.includes('extern') ||
               name.includes('fachada') || name.includes('front') || name.includes('entrada') ||
               name.includes('door') || name.includes('window') || name.includes('frame') ||
               name.includes('modelo') || name.includes('080x210') || name.includes('050x05') ||
               name.includes('100_x_120') || name.includes('correr') || name.includes('basculante')) {
      // Aplicar material de vidro realista para portas E janelas externas
      console.log(`🚪🪟 ESQUADRIA EXTERNA (porta/janela) com VIDRO REALISTA detectada: ${elementName}`);
      return createMaterials.esquadria;
    } else if (name.includes('telhado') || name.includes('telha')) {
      console.log(`🏠 TELHADO detectado: ${elementName}`);
      return createMaterials.telhado;
    } else if (name.includes('pilar') || name.includes('viga')) {
      console.log(`🏗️ PILAR/VIGA detectado: ${elementName}`);
      return createMaterials.pilar;
    } else if (name.includes('vidro') || name.includes('glass') || name.includes('transparente') ||
               name.includes('cristal') || name.includes('vitro')) {
      console.log(`🪟 VIDRO REALISTA detectado: ${elementName}`);
      return createMaterials.vidro;
    } else {
      console.log(`⚪ PADRÃO aplicado: ${elementName}`);
      return createMaterials.default;
    }
  };
  
  // Extrair elementos e aplicar textura de concreto
  useEffect(() => {
    if (scene && onElementsExtracted) {
      const elements: string[] = [];
      const collections: { [key: string]: THREE.Object3D[] } = {};
      const hierarchy: { [key: string]: any } = {};
    
      // Função para analisar a hierarquia completa
      const analyzeHierarchy = (obj: THREE.Object3D, level = 0, parentPath = '') => {
        const indent = '  '.repeat(level);
        const currentPath = parentPath ? `${parentPath}/${obj.name}` : obj.name;
        
        if (obj.name && obj.name.trim() !== '') {
          elements.push(obj.name);
          
          // Armazenar informações da hierarquia
          hierarchy[obj.name] = {
            level,
            parentPath,
            currentPath,
            children: obj.children.map(child => child.name).filter(name => name),
            type: obj.type,
            isMesh: obj instanceof THREE.Mesh,
            isGroup: obj instanceof THREE.Group
          };
          
          console.log(`${indent}📁 ${obj.name} (${obj.type}) - Level: ${level} - Path: ${currentPath}`);
          
          // Verificar se é uma coleção pai (baseado nos padrões da planilha)
          const elementMatch = obj.name.match(/^(\d+\.\d+)_\.(\d+)$/);
          if (elementMatch) {
            const parentCollectionName = elementMatch[1]; // Ex: "1.1"
            if (!collections[parentCollectionName]) {
              collections[parentCollectionName] = [];
            }
            collections[parentCollectionName].push(obj);
            console.log(`📁 ELEMENTO DA COLECÇÃO PAI: "${obj.name}" -> Coleção: "${parentCollectionName}"`);
          }
          
          // Debug: Log específico para coleções pai
          if (obj.name === '1.1' || obj.name === '1.2' || obj.name === '2.1' || 
              obj.name === '2.2' || obj.name === '2.3' || obj.name === '3.1' || 
              obj.name === '3.2') {
            console.log(`📁 COLECÇÃO PAI ENCONTRADA: "${obj.name}"`);
          }
        }
        
        // Recursivamente analisar filhos
        obj.children.forEach(child => {
          analyzeHierarchy(child, level + 1, currentPath);
        });
      };
      
      console.log('🏗️ ===== ANÁLISE COMPLETA DA HIERARQUIA GLB =====');
      analyzeHierarchy(scene);
      
      // Expor hierarquia globalmente para debug
      (window as any).glbHierarchy = hierarchy;
      console.log('📊 Hierarquia completa:', hierarchy);
      
      scene.traverse((child) => {
        // Aplicar materiais realistas baseados no tipo de elemento
        if (child instanceof THREE.Mesh) {
          // Verificar se o material já foi aplicado para evitar reaplicação
          if (!child.userData.materialApplied) {
            const material = getMaterialForElement(child.name);
            
            // Salvar material original
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material;
            }
            
            child.material = material;
            child.userData.materialApplied = true;
            
            // Adicionar sombras
            child.castShadow = true;
            child.receiveShadow = true;
            console.log(`🎨 Material aplicado em: ${child.name} - Tipo: ${material.color.getHexString()}`);
          }
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
      
      // NOVA LÓGICA: Trabalhar com elementos individuais da planilha
      console.log('🎨 ===== USANDO ELEMENTOS INDIVIDUAIS PARA HIGHLIGHTING =====');
      console.log('🎨 Elementos para destacar:', highlightedElements);
      console.log('🎨 Quantidade de elementos para destacar:', highlightedElements.length);
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          totalMeshes++;
          
          // Verificar se este objeto está na lista de elementos destacados
          const isHighlighted = highlightedElements.includes(child.name);
          
          // Verificar se o elemento deve estar oculto
          const isHidden = hiddenElements.has(child.name);
          
          // Aplicar visibilidade
          child.visible = !isHidden;
          
          if (isHidden) {
            console.log(`👁️ Elemento ocultado: ${child.name}`);
            return; // Pular o resto da lógica para elementos ocultos
          }
          
          // Debug: mostrar todos os meshes encontrados
          if (child.name && (child.name.includes('11_') || child.name.includes('1.1_') || 
              child.name.includes('12_') || child.name.includes('21_') || child.name.includes('22_'))) {
            console.log(`🔍 MESH ESTRUTURAL ENCONTRADO: ${child.name} - Highlighted: ${isHighlighted}`);
            console.log(`🔍 Elementos destacados incluem ${child.name}?`, highlightedElements.includes(child.name));
          }
          
          if (isHighlighted) {
            highlightedCount++;
            foundElements.push(child.name);
            
            // Log específico para elementos 1.1_ (Vigas)
            if (child.name.startsWith('1.1_')) {
              console.log(`🏗️ VIGA DESTACADA: ${child.name} - Posição:`, child.position);
            } else {
              console.log(`🟠 DESTACANDO: ${child.name}`);
            }
            
            // Verificar se o material existe
            if (child.material) {
              // Salvar material original se ainda não foi salvo
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material.clone();
                console.log(`💾 Material original salvo para: ${child.name}`);
              }
              
              // Criar novo material vibrante com alto contraste
              const newMaterial = new THREE.MeshStandardMaterial({
                color: 0xFF4500, // Laranja vibrante
                emissive: 0xFF6347, // Emissão laranja
                emissiveIntensity: 1.2,
                metalness: 0.0,
                roughness: 0.1,
                envMapIntensity: 4.0,
                transparent: false,
                opacity: 1.0
              });
              
              // Aplicar novo material
              child.material = newMaterial;
              
              // Forçar atualização do material
              if (child.material.map) {
                child.material.map.needsUpdate = true;
              }
              
              if (child.name.startsWith('1.1_')) {
                console.log(`🏗️ VIGA LARANJA APLICADA: ${child.name} - Cor: #ff6600`);
              } else {
                console.log(`🟠 MATERIAL LARANJA APLICADO: ${child.name}`);
                console.log(`🟠 Material vibrante aplicado: #FF4500 (laranja com efeitos)`);
                console.log(`🟠 Material realista aplicado`);
              }
            } else {
              console.log(`⚠️ Material não encontrado para: ${child.name}`);
            }
          } else {
            // Voltar ao material original realista
            const originalMaterial = child.userData.originalMaterial;
            if (originalMaterial) {
              child.material = originalMaterial;
            } else {
              // Material padrão se não houver original
              const defaultMaterial = new THREE.MeshStandardMaterial({
                color: '#6A6A6A',
                roughness: 0.7,
              metalness: 0.1,
              normalScale: new THREE.Vector2(0.5, 0.5)
            });
              child.material = defaultMaterial;
            }
            
            console.log(`🔄 Material original restaurado para: ${child.name}`);
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
  }, [scene, highlightedElements, hiddenElements]);

  // useFrame removido para evitar problemas de renderização

  // Função para lidar com clique nos elementos
  const handleElementClick = (event: any) => {
    event.stopPropagation();
    const elementName = event.object.name;
    console.log('🖱️ Elemento clicado:', elementName);
    if (onElementClick) {
      onElementClick(elementName);
    }
  };

  // Verificar se o modelo está carregado
  if (!scene) {
    console.log('❌ StructuralModel - Scene não carregada, renderizando fallback');
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      </group>
    );
  }

  console.log('✅ StructuralModel - Renderizando modelo GLB');
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
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());

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
    
    // Resumo da lincagem
    const itensComElementos = itens5D.filter(item => item.elementos3D && item.elementos3D.trim() !== '');
    console.log('📊 ===== RESUMO DA LINCAGEM =====');
    console.log(`📊 Total de itens: ${itens5D.length}`);
    console.log(`📊 Itens com elementos3D: ${itensComElementos.length}`);
    
    itensComElementos.forEach(item => {
      const elementosArray = item.elementos3D.split(',').map((el: string) => el.trim()).filter((el: string) => el !== '');
      console.log(`📋 ${item.id} (${item.descricao}): ${elementosArray.length} elementos`);
      console.log(`   Primeiros 5: ${elementosArray.slice(0, 5).join(', ')}`);
    });
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

  // Funções removidas - agora usamos hierarquia do GLB diretamente

  // Função melhorada para encontrar correspondências usando elementos3D da planilha
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
    
    // ESTRATÉGIA PRINCIPAL: Usar elementos3D da planilha CSV (coleções pai)
    if (elementos3D && elementos3D.trim() !== '') {
      console.log('🎯 ===== USANDO ELEMENTOS3D DA PLANILHA (COLECÇÕES PAI) =====');
      console.log('📋 Elementos3D RAW:', `"${elementos3D}"`);
      
      // Dividir elementos por vírgula e limpar espaços
      const colecoesPai = elementos3D.split(',').map((el: string) => el.trim()).filter((el: string) => el !== '');
      console.log('📋 Coleções Pai da planilha:', colecoesPai);
      console.log('📋 Quantidade de coleções pai na planilha:', colecoesPai.length);
      
      // Buscar todos os elementos que estão dentro das coleções pai usando hierarquia
      const elementosEncontrados: string[] = [];
      const hierarchy = (window as any).glbHierarchy || {};
      
      for (const colecaoPai of colecoesPai) {
        console.log(`🔍 Buscando elementos dentro da coleção pai: "${colecaoPai}"`);
        
        // ESTRATÉGIA 1: Buscar elementos que começam com o padrão da coleção pai
        const elementosDiretos = glbElements.filter(elemento => 
          elemento.startsWith(colecaoPai) || elemento.includes(colecaoPai)
        );
        
        // ESTRATÉGIA 2: Buscar na hierarquia - encontrar a coleção pai e seus filhos (RESTRITIVO)
        const elementosHierarquicos: string[] = [];
        
        // Procurar a coleção pai na hierarquia
        const colecaoPaiInfo = hierarchy[colecaoPai];
        if (colecaoPaiInfo) {
          console.log(`📁 Coleção pai "${colecaoPai}" encontrada na hierarquia:`, colecaoPaiInfo);
          
          // Extrair padrão numérico para validação
          const matchPai = colecaoPai.match(/^(\d+\.\d+)/);
          const padraoNumerico = matchPai ? matchPai[1].replace('.', '') : '';
          
          // Buscar todos os filhos recursivamente, mas apenas os que seguem o padrão
          const buscarFilhosRecursivamente = (nomeElemento: string, nivel = 0): string[] => {
            const info = hierarchy[nomeElemento];
            if (!info) return [];
            
            let filhos: string[] = [];
            
            // Adicionar o próprio elemento se for um mesh E seguir o padrão correto
            if (info.isMesh) {
              // Verificar se o elemento segue o padrão do item (ex: para 1.1, apenas elementos que começam com "11_")
              if (padraoNumerico && nomeElemento.startsWith(padraoNumerico + '_')) {
                filhos.push(nomeElemento);
              }
            }
            
            // Buscar filhos
            info.children.forEach((filhoNome: string) => {
              filhos.push(...buscarFilhosRecursivamente(filhoNome, nivel + 1));
            });
            
            return filhos;
          };
          
          elementosHierarquicos.push(...buscarFilhosRecursivamente(colecaoPai));
        }
        
        // ESTRATÉGIA 3: Buscar por padrões similares (fallback RESTRITIVO)
        const elementosSimilares = glbElements.filter(elemento => {
          // Extrair o padrão numérico da coleção pai (ex: "1.1_.001" -> "1.1")
          const matchPai = colecaoPai.match(/^(\d+\.\d+)/);
          if (matchPai) {
            const padraoPai = matchPai[1];
            const padraoNumerico = padraoPai.replace('.', ''); // "1.1" -> "11"
            
            // APENAS elementos que começam exatamente com o padrão numérico + underscore
            // Ex: para "1.1" -> apenas "11_" e "11_XXX"
            const regex = new RegExp(`^${padraoNumerico}_(\\d+)?$`);
            return regex.test(elemento);
          }
          return false;
        });
        
        console.log(`📦 Elementos diretos encontrados na coleção "${colecaoPai}":`, elementosDiretos.length);
        console.log(`📦 Elementos hierárquicos encontrados:`, elementosHierarquicos.length);
        console.log(`📦 Elementos similares encontrados:`, elementosSimilares.length);
        
        // Combinar todas as estratégias
        elementosEncontrados.push(...elementosDiretos, ...elementosHierarquicos, ...elementosSimilares);
      }
      
      // Remover duplicatas
      const elementosUnicos = [...new Set(elementosEncontrados)];
      
      console.log('✅ Total de elementos encontrados em todas as coleções pai:', elementosUnicos.length);
      console.log('✅ Lista completa dos elementos encontrados:', elementosUnicos);
      
      if (elementosUnicos.length > 0) {
        matchingElements = elementosUnicos;
        console.log(`🎯 MAPEAMENTO POR COLECÇÕES PAI: ${matchingElements.length} elementos encontrados para ${itemId}`);
      return matchingElements;
      } else {
        console.log('⚠️ Nenhum elemento foi encontrado nas coleções pai especificadas');
        console.log('🔍 Coleções pai da planilha:', colecoesPai);
        console.log('🔍 Elementos disponíveis no GLB:', glbElements.slice(0, 20));
        console.log('❌ Item não possui coleções pai válidas - NENHUM elemento será destacado');
        console.log('💡 Verifique se os nomes das coleções pai na planilha coincidem com os do GLB');
        return [];
      }
    } else {
      console.log('❌ Item não possui coluna Elementos3D preenchida - NENHUM elemento será destacado');
      return [];
    }
    
    // FALLBACK REMOVIDO: Agora só destacamos elementos que estão explicitamente na planilha
    console.log(`❌ Nenhum elemento encontrado para ${itemId} - Item não possui elementos3D válidos`);
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
    }, [findMatchingElements]),

    // Função para alternar visibilidade dos elementos de um item
    toggleElementVisibility: useCallback((item: any) => {
      const itemId = item.id;
      console.log('👁️ Alternando visibilidade para item:', itemId);
      
      // Encontrar elementos 3D correspondentes
      const elementos = findMatchingElements(item);
      console.log(`🔗 Elementos para ocultar/mostrar:`, elementos);
      
      // Verificar se algum elemento já está oculto
      const hasHiddenElements = elementos.some(el => hiddenElements.has(el));
      
      if (hasHiddenElements) {
        // Mostrar elementos (remover do Set de ocultos)
        setHiddenElements(prev => {
          const newSet = new Set(prev);
          elementos.forEach(el => newSet.delete(el));
          return newSet;
        });
        console.log('👁️ Elementos mostrados:', elementos);
      } else {
        // Ocultar elementos (adicionar ao Set de ocultos)
        setHiddenElements(prev => {
          const newSet = new Set(prev);
          elementos.forEach(el => newSet.add(el));
          return newSet;
        });
        console.log('👁️ Elementos ocultados:', elementos);
      }
    }, [findMatchingElements, hiddenElements]),

    // Retornar hiddenElements para uso no componente
    hiddenElements
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
    hiddenElements,
    setGlbElements,
    setHighlightedElements,
    handleItemSelect,
    toggleElementVisibility
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Efeito de fundo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-purple-400/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)]"></div>
      
      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
        {/* Visualizador 3D */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
            {/* Efeito de brilho no topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 relative">
              {/* Efeito de partículas decorativas */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-100"></div>
              <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-200"></div>
              
              <h3 className="text-xl font-bold text-white flex items-center">
                <Box className="h-6 w-6 mr-3 text-blue-200" />
                Projeto Arquitetônico - 3D
                {highlightedElements.length > 0 && (
                  <span className="ml-3 bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    {highlightedElements.length} em destaque
                  </span>
                )}
              </h3>
              <p className="text-blue-100 text-sm mt-2 font-medium">
                ✨ Clique nos itens da planilha para destacar no modelo
              </p>
            </div>
            
            <div className="h-96 lg:h-[520px] relative">
              <Canvas 
                camera={{ position: [20, 20, 20], fov: 60 }}
                gl={{ 
                  antialias: true, 
                  alpha: true, 
                  powerPreference: "high-performance",
                  stencil: false,
                  depth: true
                }}
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
                shadows
              >
                <Suspense fallback={<Loader />}>
                  <Environment preset="night" />
                  
                  {/* Iluminação ambiente reduzida para mais contraste */}
                  <ambientLight intensity={0.2} color="#FFFFFF" />
                  
                  {/* Luz principal mais intensa para destacar elementos */}
                  <directionalLight 
                    position={[40, 40, 20]} 
                    intensity={2.5}
                    color="#FFF8DC"
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.1}
                    shadow-camera-far={500}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                    shadow-bias={-0.0001}
                    shadow-normalBias={0.02}
                  />
                  
                  {/* Luz de preenchimento mais sutil */}
                  <directionalLight 
                    position={[-25, 15, -25]} 
                    intensity={0.3} 
                    color="#E6F3FF"
                  />
                  
                  {/* Luz pontual principal mais intensa */}
                  <pointLight 
                    position={[8, 8, 8]} 
                    intensity={1.2} 
                    color="#FFFFFF"
                    distance={35}
                    decay={2}
                    castShadow
                    shadow-mapSize-width={512}
                    shadow-mapSize-height={512}
                  />
                  
                  {/* Luz pontual de apoio reduzida */}
                  <pointLight 
                    position={[-8, 6, -8]} 
                    intensity={0.2} 
                    color="#FFE4B5"
                    distance={25}
                    decay={2}
                  />
                  <StructuralModel 
                    highlightedElements={highlightedElements}
                    hiddenElements={hiddenElements}
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
                    minDistance={8}
                    maxDistance={80}
                    target={[0, 0, 0]}
                    autoRotate={false}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.8}
                    zoomSpeed={1.0}
                    panSpeed={0.8}
                  />
                  
                </Suspense>
              </Canvas>
            </div>
          </div>

          {/* Planilha Orçamentária Sintética */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
            {/* Efeito de brilho no topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            <div className="bg-gradient-to-r from-green-600 via-emerald-700 to-teal-700 p-6 relative">
              {/* Efeito de partículas decorativas */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-150"></div>
              <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-300"></div>
              
              <h3 className="text-xl font-bold text-white flex items-center">
                <Search className="h-6 w-6 mr-3 text-green-200" />
                Planilha Orçamentária Sintética
              </h3>
              <p className="text-green-100 text-sm mt-2 font-medium">
                📊 {itens.length} itens carregados • Clique para destacar no 3D
              </p>
            </div>
            
            <div className="max-h-[520px] overflow-y-auto">
            <PlanilhaSintetica 
              itens={itens}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onCategorySelect={highlightElementsByCategory}
              onToggleVisibility={toggleElementVisibility}
              hiddenElements={hiddenElements}
            />
            </div>
          </div>
          </div>
        </div>
    </div>
  );
}
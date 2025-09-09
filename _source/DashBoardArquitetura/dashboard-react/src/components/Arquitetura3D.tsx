import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Table } from 'lucide-react';
import { useOrcamentoStore } from '../store/orcamentoStore';

// Componente de loading
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando modelo arquitetônico...</p>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// Componente para carregar o modelo GLB arquitetônico
interface ArquiteturaModelProps {
  onElementSelect: (elementId: string, elementData: any) => void;
  selectedElementId: string | null;
}

function ArquiteturaModel({ onElementSelect, selectedElementId: _selectedElementId }: ArquiteturaModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Carregar o modelo GLB
  const { scene } = useGLTF('/10apartamentosarq.glb');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Função para aplicar materiais arquitetônicos baseados no nome do elemento
  const applyArchitecturalMaterial = (mesh: THREE.Mesh, elementName: string) => {
    const name = elementName.toLowerCase();
    
    // Materiais específicos para arquitetura
    if (name.includes('parede') || name.includes('wall') || name.includes('alvenaria')) {
      // Paredes - cor de tijolo/argamassa
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#F5DEB3',
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('piso') || name.includes('floor') || name.includes('laje')) {
      // Pisos - concreto/cimento
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#D3D3D3',
        roughness: 0.8,
        metalness: 0.1,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('janela') || name.includes('window') || name.includes('vidro')) {
      // Janelas - vidro transparente
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#87CEEB',
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('porta') || name.includes('door')) {
      // Portas - madeira
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#8B4513',
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('telhado') || name.includes('roof') || name.includes('cobertura')) {
      // Telhado - telha/cobertura
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#A0522D',
        roughness: 0.8,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('forro') || name.includes('teto') || name.includes('ceiling')) {
      // Forro - gesso/pintura
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.7,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else if (name.includes('revestimento') || name.includes('ceramica') || name.includes('azulejo')) {
      // Revestimentos - cerâmica
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#F0F8FF',
        roughness: 0.3,
        metalness: 0.0,
        emissive: new THREE.Color(0x000000)
      });
    } else {
      // Material padrão - concreto
      mesh.material = new THREE.MeshStandardMaterial({
        color: '#C0C0C0',
        roughness: 0.8,
        metalness: 0.1,
        emissive: new THREE.Color(0x000000)
      });
    }
  };

  // Adicionar interatividade aos elementos
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const elementName = child.name || `Elemento_${child.id}`;
          
          // Aplicar material arquitetônico baseado no nome
          applyArchitecturalMaterial(child, elementName);
          
          // Adicionar evento de clique
          (child as any).onClick = (event: any) => {
            event.stopPropagation();
            const elementData = {
              name: elementName,
              id: child.id,
              position: child.position,
              userData: child.userData
            };
            onElementSelect(elementName, elementData);
            console.log('Elemento arquitetônico clicado:', elementName, elementData);
          };
          
          // Adicionar hover effects
          (child as any).onPointerOver = () => {
            document.body.style.cursor = 'pointer';
            if (child.material) {
              child.material.emissive = new THREE.Color(0x444444);
            }
          };
          
          (child as any).onPointerOut = () => {
            document.body.style.cursor = 'auto';
            if (child.material) {
              child.material.emissive = new THREE.Color(0x000000);
            }
          };
        }
      });
      
      console.log('Modelo arquitetônico GLB carregado com sucesso!');
      console.log('Elementos encontrados:', scene.children.length);
    }
  }, [scene, onElementSelect]);

  return (
    <group ref={meshRef}>
      {scene && <primitive object={scene} />}
      
      {/* Iluminação Arquitetônica Profissional */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Luz principal (sol) */}
      <directionalLight 
        position={[15, 15, 10]} 
        intensity={1.5} 
        color="#ffebcd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Luz de preenchimento */}
      <directionalLight 
        position={[-10, 10, -10]} 
        intensity={0.6} 
        color="#87ceeb"
      />
      
      {/* Luz ambiente superior */}
      <hemisphereLight 
        args={["#87ceeb", "#f5deb3", 0.8]}
      />
      
      {/* Luz pontual para detalhes internos */}
      <pointLight 
        position={[0, 5, 0]} 
        intensity={0.8} 
        color="#ffffff"
        distance={30}
      />
      
      {/* Luz adicional para fachada */}
      <spotLight
        position={[20, 10, 0]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
    </group>
  );
}

// Componente principal do visualizador 5D arquitetônico
const Arquitetura3D: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<{id: string, data: any} | null>(null);
  const [showShadows] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const { itens } = useOrcamentoStore();

  const handleElementSelect = (elementId: string, elementData: any) => {
    setSelectedElement({ id: elementId, data: elementData });
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Status do Elemento Selecionado */}
        {selectedElement && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Elemento Selecionado:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {selectedElement.id}
              </div>
              <div>
                <span className="font-medium">ID:</span> {selectedElement.data.id}
              </div>
              <div>
                <span className="font-medium">Posição:</span> 
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  X: {selectedElement.data.position.x.toFixed(2)}, 
                  Y: {selectedElement.data.position.y.toFixed(2)}, 
                  Z: {selectedElement.data.position.z.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Layout 5D: 3D + Planilha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualizador 3D */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2">
            <h3 className="font-semibold flex items-center">
              <Box className="h-5 w-5 mr-2" />
              Modelo 3D - 10 Apartamentos
            </h3>
          </div>
          <div className="h-96 lg:h-[600px] relative">
            <Canvas 
              camera={{ position: [20, 15, 20], fov: 50 }}
              shadows={showShadows}
            >
              <Suspense fallback={<Loader />}>
                <ArquiteturaModel 
                  onElementSelect={handleElementSelect}
                  selectedElementId={selectedElement?.id || null}
                />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={10}
                  maxDistance={100}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI - Math.PI / 6}
                />
                <Environment preset="city" />
                
                {/* Efeitos de pós-processamento */}
                <fog attach="fog" args={['#87ceeb', 30, 150]} />
              </Suspense>
            </Canvas>
            
          </div>
        </div>

        {/* Planilha Orçamentária */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-800 text-white px-4 py-2">
            <h3 className="font-semibold flex items-center">
              <Table className="h-5 w-5 mr-2" />
              Planilha Orçamentária
            </h3>
          </div>
          <div className="h-96 lg:h-[600px] overflow-y-auto">
            <div className="p-4">
              {itens.length > 0 ? (
                <div className="space-y-2">
                  {itens.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItem === item.id
                          ? 'bg-orange-100 border-orange-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-800">
                            {item.item} - {item.descricao}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {item.categoria} • {item.pavimento}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-semibold text-blue-600">
                            R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.pesoPercentual.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      {selectedItem === item.id && (
                        <div className="mt-3 pt-3 border-t border-orange-200">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-gray-600">Quantidade:</span>
                              <span className="ml-2 font-medium">{item.quantidade} {item.unidade}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Valor Unit.:</span>
                              <span className="ml-2 font-medium">R$ {item.valorUnitario.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">M.O.:</span>
                              <span className="ml-2 font-medium">R$ {item.maoDeObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Materiais:</span>
                              <span className="ml-2 font-medium">R$ {item.materiais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Table className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Carregando dados da planilha...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Arquitetura3D;

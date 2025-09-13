import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// import { Box, Search } from 'lucide-react';
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

  // Debug: Verificar props recebidas
  console.log('🎯 StructuralModel - Props recebidas:', {
    highlightedElements: highlightedElements.length,
    hiddenElements: hiddenElements.size,
    onElementsExtracted: !!onElementsExtracted,
    onElementClick: !!onElementClick
  });

  // Carregar o modelo GLB
  const { scene } = useGLTF('/5d.glb');
  
  // Debug: Verificar se o modelo está carregado
  console.log('🎯 StructuralModel - Scene carregada:', !!scene);
  console.log('🎯 StructuralModel - onElementsExtracted disponível:', !!onElementsExtracted);
  if (scene) {
    console.log('🎯 StructuralModel - Scene name:', scene.name);
    console.log('🎯 StructuralModel - Scene children count:', scene.children.length);
    console.log('🎯 StructuralModel - Scene type:', scene.type);
    
    // Debug adicional: verificar elementos por categoria
    let contadores = { fundacao: 0, terreo: 0, superior: 0, outros: 0, visiveis: 0, ocultos: 0 };
    const elementosDetalhados: any[] = [];
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const nome = child.name.toLowerCase();
        
        // Forçar TODOS os elementos visíveis para debug
        child.visible = true;
        
        elementosDetalhados.push({
          nome: child.name,
          visivel: child.visible,
          posicao: `(${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)})`
        });
        
        if (child.visible) contadores.visiveis++;
        else contadores.ocultos++;
        
        if (nome.includes('3.') || nome.includes('fundacao')) contadores.fundacao++;
        else if (nome.includes('1.') || nome.includes('4.')) contadores.terreo++;
        else if (nome.includes('2.') || nome.includes('5.')) contadores.superior++;
        else contadores.outros++;
      }
    });
    
    console.log('🏗️ Elementos por categoria:', contadores);
    console.log('📋 Primeiros 10 elementos encontrados:', elementosDetalhados.slice(0, 10));
    console.log('🎯 FORÇANDO TODOS VISÍVEIS - Total de elementos:', elementosDetalhados.length);
  }

  // Criar textura de vidro ultra-realista com alta reflexão e refração
  const createAdvancedGlassTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Base com tonalidade azul sutil e alta transparência
    const baseGradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    baseGradient.addColorStop(0, 'rgba(230, 240, 255, 0.15)'); // Centro muito claro
    baseGradient.addColorStop(0.4, 'rgba(200, 220, 255, 0.12)'); // Azul muito sutil
    baseGradient.addColorStop(0.8, 'rgba(180, 210, 250, 0.08)'); // Azul mais perceptível
    baseGradient.addColorStop(1, 'rgba(160, 200, 240, 0.05)'); // Bordas com azul sutil
    
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Adicionar imperfeições sutis do vidro (bolhas microscópicas)
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 2 + 0.5;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar riscos microscópicos
    ctx.globalAlpha = 0.02;
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const length = Math.random() * 20 + 5;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }
    
    // Adicionar reflexos de alta qualidade (caustics)
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 60 + 20;
      const height = Math.random() * 8 + 2;
      const angle = Math.random() * Math.PI;
      
      // Gradiente para simular reflexos causticos
      const reflectionGradient = ctx.createLinearGradient(
        x - width/2, y - height/2, 
        x + width/2, y + height/2
      );
      reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      reflectionGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
    
    // Adicionar reflexos verticais sutis (luz através do vidro)
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 8; i++) {
      const x = (i + Math.random() * 0.5) * (1024 / 8);
      const gradient = ctx.createLinearGradient(x, 0, x + 2, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 2, 1024);
    }
    
    // Adicionar reflexos horizontais sutis
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 5; i++) {
      const y = (i + Math.random() * 0.5) * (1024 / 5);
      const gradient = ctx.createLinearGradient(0, y, 0, y + 1);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, 1024, 1);
    }
    
    // Adicionar padrão sutil de interferência (efeito de vidro polido)
    ctx.globalAlpha = 0.015;
    for (let x = 0; x < 1024; x += 4) {
      for (let y = 0; y < 1024; y += 4) {
        const noise = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(200, 220, 255, ${noise * 0.3})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    
    ctx.globalAlpha = 1.0;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // Criar normal map para vidro (para efeitos de refração)
  const createGlassNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base normal (azul neutro para superfície lisa)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, 512, 512);
    
    // Adicionar variações muito sutis para simular imperfeições do vidro
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 1.5 + 0.5;
      
      // Variações muito sutis no normal map (superfície quase perfeitamente lisa)
      const r = 128 + (Math.random() - 0.5) * 8;
      const g = 128 + (Math.random() - 0.5) * 8;
      const b = 255 - (Math.random() * 10);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(x, y, size, size);
    }
    
    ctx.globalAlpha = 1.0;
    
    const normalTexture = new THREE.CanvasTexture(canvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(1, 1);
    
    return normalTexture;
  }, []);

  // Criar textura de fibrocimento corrugado
  const createFibrocimentoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Cores do fibrocimento: cinza claro com variações
    const baseGray = '#C0C0C0';      // Cinza claro base
    const lightGray = '#D3D3D3';     // Cinza muito claro
    const darkGray = '#A8A8A8';      // Cinza escuro
    const weatheredGray = '#B5B5B5'; // Cinza desgastado
    const dustyGray = '#CDCDCD';     // Cinza empoeirado
    
    // Base cinza claro uniforme
    ctx.fillStyle = baseGray;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Criar ondulações corrugadas (padrão horizontal)
    const waveHeight = 32;
    const waveCount = 16;
    
    for (let i = 0; i < waveCount; i++) {
      const y = (i * 1024) / waveCount;
      
      // Gradiente para simular ondulação
      const gradient = ctx.createLinearGradient(0, y, 0, y + waveHeight);
      gradient.addColorStop(0, lightGray);
      gradient.addColorStop(0.3, baseGray);
      gradient.addColorStop(0.7, darkGray);
      gradient.addColorStop(1, baseGray);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, 1024, waveHeight);
      
      // Adicionar linha de sombra na crista
      ctx.fillStyle = darkGray;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, y + waveHeight - 2, 1024, 1);
      
      // Adicionar linha de luz no vale
      ctx.fillStyle = lightGray;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(0, y + waveHeight/2, 1024, 1);
      
      ctx.globalAlpha = 1.0;
    }
    
    // Adicionar textura de poros sutis
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 1.5 + 0.5;
      
      ctx.fillStyle = Math.random() > 0.5 ? darkGray : weatheredGray;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar aspecto desgastado (manchas sutis)
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 20 + 5;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, weatheredGray);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar riscos e marcas de desgaste
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const length = Math.random() * 15 + 5;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.strokeStyle = darkGray;
      ctx.lineWidth = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }
    
    // Adicionar textura granulada (aspecto fosco)
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const cores = [lightGray, darkGray, weatheredGray, dustyGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      ctx.fillStyle = cor;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Adicionar variações de fibra (simulando fibras do cimento)
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 8 + 2;
      const height = Math.random() * 1 + 0.5;
      const angle = Math.random() * Math.PI;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = Math.random() > 0.5 ? lightGray : darkGray;
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
    
    ctx.globalAlpha = 1.0;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1); // Repetir horizontalmente para seguir o corrugado
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
  }, []);

  // Criar normal map para fibrocimento corrugado
  const createFibrocimentoNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base normal (azul neutro)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, 512, 512);
    
    // Criar ondulações no normal map (para efeito 3D do corrugado)
    const waveHeight = 16;
    const waveCount = 16;
    
    for (let i = 0; i < waveCount; i++) {
      const y = (i * 512) / waveCount;
      
      // Gradiente para normal map das ondulações
      const gradient = ctx.createLinearGradient(0, y, 0, y + waveHeight);
      gradient.addColorStop(0, '#8080C0'); // Sombra (depressão)
      gradient.addColorStop(0.5, '#8080FF'); // Normal
      gradient.addColorStop(1, '#8080E0'); // Destaque (elevação)
      
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(0, y, 512, waveHeight);
    }
    
    // Adicionar variações sutis para rugosidade
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2 + 0.5;
      
      // Variações no normal map para rugosidade
      const r = 128 + (Math.random() - 0.5) * 30;
      const g = 128 + (Math.random() - 0.5) * 30;
      const b = 255 - (Math.random() * 40);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, size, size);
    }
    
    ctx.globalAlpha = 1.0;
    
    const normalTexture = new THREE.CanvasTexture(canvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(2, 1);
    
    return normalTexture;
  }, []);

  // Criar textura de concreto seamless
  const createConcretoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Cores do concreto: cinza médio com variações naturais
    const baseGray = '#808080';      // Cinza médio base
    const lightGray = '#999999';     // Cinza claro
    const darkGray = '#666666';      // Cinza escuro
    const warmGray = '#8A8A8A';      // Cinza quente
    const coolGray = '#777777';      // Cinza frio
    const dustyGray = '#858585';     // Cinza empoeirado
    
    // Base cinza médio uniforme
    ctx.fillStyle = baseGray;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Adicionar variações tonais naturais (grandes áreas sutis)
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 120 + 60;
      
      const cores = [lightGray, darkGray, warmGray, coolGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, cor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar poros sutis do concreto
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 2.5 + 0.5;
      
      ctx.fillStyle = Math.random() > 0.6 ? darkGray : coolGray;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar imperfeições e marcas de moldagem
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 25 + 8;
      const height = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = Math.random() > 0.5 ? lightGray : darkGray;
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
    
    // Adicionar linhas sutis de moldagem (horizontais principalmente)
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 12; i++) {
      const y = Math.random() * 1024;
      const offset = Math.random() * 20 - 10;
      
      const gradient = ctx.createLinearGradient(0, y + offset, 0, y + offset + 2);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, darkGray);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y + offset, 1024, 2);
    }
    
    // Adicionar algumas linhas verticais sutis
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 1024;
      const offset = Math.random() * 20 - 10;
      
      const gradient = ctx.createLinearGradient(x + offset, 0, x + offset + 1, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, darkGray);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x + offset, 0, 1, 1024);
    }
    
    // Adicionar agregados pequenos (simulando pedriscos no concreto)
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 1.5 + 0.3;
      
      const cores = [lightGray, warmGray, dustyGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      ctx.fillStyle = cor;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar manchas de umidade/desgaste muito sutis
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 40 + 15;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, darkGray);
      gradient.addColorStop(0.7, coolGray);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar textura granulada fina (aspecto fosco)
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 12000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const cores = [lightGray, darkGray, warmGray, coolGray, dustyGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      ctx.fillStyle = cor;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Adicionar padrão de cristalização sutil
    ctx.globalAlpha = 0.02;
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = lightGray;
      ctx.fillRect(-size/2, -size/4, size, size/2);
      ctx.restore();
    }
    
    ctx.globalAlpha = 1.0;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Padrão seamless
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
  }, []);

  // Criar normal map para concreto (rugosidade sutil)
  const createConcretoNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base normal (azul neutro)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, 512, 512);
    
    // Adicionar variações sutis para rugosidade da superfície
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2.5 + 0.5;
      
      // Variações sutis no normal map
      const r = 128 + (Math.random() - 0.5) * 25;
      const g = 128 + (Math.random() - 0.5) * 25;
      const b = 255 - (Math.random() * 35);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, size, size);
    }
    
    // Adicionar linhas sutis de moldagem no normal map
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 8; i++) {
      const y = Math.random() * 512;
      const gradient = ctx.createLinearGradient(0, y, 0, y + 3);
      gradient.addColorStop(0, '#8080E0');
      gradient.addColorStop(0.5, '#8080C0');
      gradient.addColorStop(1, '#8080E0');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, 512, 3);
    }
    
    // Adicionar poros no normal map (depressões sutis)
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 1.5 + 0.5;
      
      ctx.fillStyle = '#7070D0'; // Ligeiramente mais escuro (depressão)
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
    
    const normalTexture = new THREE.CanvasTexture(canvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(1, 1);
    
    return normalTexture;
  }, []);

  // Criar textura de tinta cinza
  const createTintaCinzaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Cores da tinta cinza: diferentes tons de cinza
    const baseGray = '#888888';      // Cinza médio base
    const lightGray = '#9A9A9A';     // Cinza claro
    const darkGray = '#777777';      // Cinza escuro
    const warmGray = '#8C8C8C';      // Cinza quente
    const coolGray = '#848484';      // Cinza frio
    const neutralGray = '#868686';   // Cinza neutro
    
    // Base cinza uniforme
    ctx.fillStyle = baseGray;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Adicionar variações sutis de tinta (pinceladas muito sutis)
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 80 + 40;
      const height = Math.random() * 80 + 40;
      
      const cores = [lightGray, darkGray, warmGray, coolGray, neutralGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height) / 2);
      gradient.addColorStop(0, cor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(width, height) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar textura de pincel muito sutil
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 30 + 10;
      const height = Math.random() * 4 + 1;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = Math.random() > 0.5 ? lightGray : darkGray;
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
    
    // Adicionar pequenas imperfeições da tinta
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 1.5 + 0.3;
      
      ctx.fillStyle = Math.random() > 0.5 ? lightGray : darkGray;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar variações de cobertura da tinta (áreas ligeiramente diferentes)
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 25 + 10;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, Math.random() > 0.5 ? coolGray : warmGray);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar textura muito fina para aspecto de tinta seca
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const cores = [lightGray, darkGray, warmGray, coolGray, neutralGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      ctx.fillStyle = cor;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Adicionar algumas marcas de rolo ou pincel muito sutis
    ctx.globalAlpha = 0.02;
    for (let i = 0; i < 15; i++) {
      const startX = Math.random() * 1024;
      const startY = Math.random() * 1024;
      const endX = startX + (Math.random() * 200 - 100);
      const endY = startY + (Math.random() * 40 - 20);
      
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, Math.random() > 0.5 ? lightGray : darkGray);
      gradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Padrão seamless
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
  }, []);

  // Criar normal map para tinta cinza (superfície lisa)
  const createTintaCinzaNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base normal (azul neutro para superfície lisa)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, 512, 512);
    
    // Adicionar variações muito sutis para textura de tinta
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 1.5 + 0.3;
      
      // Variações muito sutis no normal map (tinta é bem lisa)
      const r = 128 + (Math.random() - 0.5) * 10;
      const g = 128 + (Math.random() - 0.5) * 10;
      const b = 255 - (Math.random() * 15);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, size, size);
    }
    
    // Adicionar algumas marcas de pincel no normal map
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const width = Math.random() * 15 + 5;
      const height = Math.random() * 2 + 0.5;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = '#7878E8'; // Ligeiramente mais escuro
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
    
    ctx.globalAlpha = 1.0;
    
    const normalTexture = new THREE.CanvasTexture(canvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(1, 1);
    
    return normalTexture;
  }, []);

  // Criar textura de papel picado cinza com toques de bege
  const createPapelPicadoTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Cores base: cinza com toques de bege
    const baseGray = '#808080';     // Cinza médio
    const lightGray = '#A0A0A0';    // Cinza claro
    const darkGray = '#606060';     // Cinza escuro
    const beige1 = '#B8A082';       // Bege claro
    const beige2 = '#D4C4A8';       // Bege muito claro
    const warmGray = '#8B8680';     // Cinza quente
    
    // Base cinza uniforme
    ctx.fillStyle = baseGray;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Criar textura de papel com variações sutis
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 3 + 1;
      
      // Alternar entre cinza claro e bege aleatoriamente
      const cores = [lightGray, beige1, beige2, warmGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      ctx.fillStyle = cor;
      ctx.globalAlpha = Math.random() * 0.3 + 0.1;
      ctx.fillRect(x, y, size, size);
    }
    
    // Adicionar textura de fibras de papel
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 15 + 5;
      const height = Math.random() * 2 + 1;
      
      ctx.fillStyle = Math.random() > 0.7 ? beige1 : lightGray;
      ctx.fillRect(x, y, width, height);
    }
    
    // Adicionar fibras verticais
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = Math.random() * 2 + 1;
      const height = Math.random() * 12 + 4;
      
      ctx.fillStyle = Math.random() > 0.6 ? beige2 : darkGray;
      ctx.fillRect(x, y, width, height);
    }
    
    // Adicionar manchas sutis de bege
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 25 + 10;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, beige1);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Adicionar textura granulada
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const cores = [lightGray, darkGray, beige1, warmGray];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      
      ctx.fillStyle = cor;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Restaurar alpha
    ctx.globalAlpha = 1.0;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); // Repetir para criar padrão contínuo
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
  }, []);

  // Criar textura normal map para papel picado (para adicionar relevo sutil)
  const createPapelPicadoNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base normal (azul neutro)
    ctx.fillStyle = '#8080FF';
    ctx.fillRect(0, 0, 512, 512);
    
    // Adicionar variações sutis para simular relevo de papel
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2 + 1;
      
      // Variações sutis no normal map
      const r = 128 + (Math.random() - 0.5) * 20;
      const g = 128 + (Math.random() - 0.5) * 20;
      const b = 255 - (Math.random() * 30);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x, y, size, size);
    }
    
    ctx.globalAlpha = 1.0;
    
    const normalTexture = new THREE.CanvasTexture(canvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(2, 2);
    
    return normalTexture;
  }, []);

  // Criar materiais mais escuros para melhor visualização
  const createMaterials = useMemo(() => {
    const materials = {
      // Material para paredes de concreto seamless
      parede: new THREE.MeshStandardMaterial({
        // Textura de concreto seamless
        map: createConcretoTexture,
        normalMap: createConcretoNormalMap,
        normalScale: new THREE.Vector2(0.4, 0.4), // Normal map sutil para rugosidade
        
        // Cor cinza médio do concreto
        color: '#7A7A7A', // Cinza médio
        
        // Propriedades de superfície rugosa fosca
        roughness: 0.85, // Rugoso e fosco
        metalness: 0.0, // Sem metalicidade
        
        // Reflexão baixa (material fosco)
        envMapIntensity: 0.25,
        
        // Propriedades para realismo
        transparent: false,
        opacity: 1.0,
        
        // Emissão muito sutil para sombreamento natural
        emissive: '#1A1A1A', // Cinza muito escuro
        emissiveIntensity: 0.01 // Quase imperceptível
      }),
      
      // Material para piso de concreto (mais polido)
      piso: new THREE.MeshStandardMaterial({
        // Mesma textura de concreto mas com propriedades diferentes
        map: createConcretoTexture,
        normalMap: createConcretoNormalMap,
        normalScale: new THREE.Vector2(0.2, 0.2), // Normal map mais sutil (polido)
        
        // Cor ligeiramente mais clara (concreto polido)
        color: '#808080', // Cinza médio mais claro
        
        // Superfície mais lisa (polida)
        roughness: 0.3, // Menos rugoso que as paredes
        metalness: 0.0,
        
        // Reflexão um pouco maior (polimento)
        envMapIntensity: 0.4,
        
        transparent: false,
        opacity: 1.0,
        
        emissive: '#1C1C1C',
        emissiveIntensity: 0.01
      }),
      
      // Material avançado para esquadrias (vidro ultra-realista)
      esquadria: new THREE.MeshPhysicalMaterial({
        // Cor base com tonalidade azul sutil
        color: '#F0F8FF',
        
        // Propriedades de transparência e refração
        transparent: true,
        opacity: 0.15, // Alta transparência
        transmission: 0.95, // Alta transmissão de luz
        thickness: 0.5, // Espessura do vidro
        ior: 1.52, // Índice de refração do vidro
        
        // Propriedades de superfície (acabamento polido)
        roughness: 0.0, // Superfície perfeitamente lisa
        metalness: 0.0, // Sem metalicidade
        
        // Texturas
        map: createAdvancedGlassTexture,
        normalMap: createGlassNormalMap,
        normalScale: new THREE.Vector2(0.1, 0.1), // Normal map muito sutil
        
        // Reflexão alta
        envMapIntensity: 8.5, // Alta reflexão do ambiente
        reflectivity: 0.9, // Reflexão elevada
        
        // Efeito de refração e caustics
        clearcoat: 1.0, // Camada de verniz para reflexão adicional
        clearcoatRoughness: 0.0, // Clearcoat perfeitamente liso
        
        // Emissão sutil para simular luz através do vidro
        emissive: '#E6F0FF', // Azul muito claro
        emissiveIntensity: 0.08,
        
        // Propriedades físicas adicionais
        sheen: 0.2, // Brilho sutil
        sheenColor: '#E0F0FF', // Cor do brilho azul claro
        specularIntensity: 1.0, // Intensidade especular máxima
        specularColor: '#FFFFFF', // Reflexos especulares brancos
        
        side: THREE.DoubleSide
      }),
      
      // Material para telhado de fibrocimento corrugado
      telhado: new THREE.MeshStandardMaterial({
        // Textura de fibrocimento corrugado
        map: createFibrocimentoTexture,
        normalMap: createFibrocimentoNormalMap,
        normalScale: new THREE.Vector2(0.8, 0.8), // Normal map pronunciado para ondulações
        
        // Cor cinza claro característica do fibrocimento
        color: '#C5C5C5', // Cinza claro
        
        // Propriedades de superfície rugosa e fosca
        roughness: 0.95, // Muito rugoso (fosco)
        metalness: 0.0, // Sem metalicidade
        
        // Reflexão baixa (material fosco)
        envMapIntensity: 0.1,
        
        // Propriedades para aparência desgastada
        transparent: false,
        opacity: 1.0,
        
        // Sombreamento realista
        flatShading: false, // Sombreamento suave para mostrar ondulações
        
        // Emissão muito sutil para realismo
        emissive: '#2A2A2A', // Cinza muito escuro
        emissiveIntensity: 0.01 // Quase imperceptível
      }),
      
      // Material para pilares/vigas (concreto estrutural)
      pilar: new THREE.MeshStandardMaterial({
        // Textura de concreto estrutural
        map: createConcretoTexture,
        normalMap: createConcretoNormalMap,
        normalScale: new THREE.Vector2(0.5, 0.5), // Normal map mais pronunciado (estrutural)
        
        // Cor cinza um pouco mais escura (concreto estrutural)
        color: '#707070', // Cinza médio escuro
        
        // Propriedades de concreto estrutural (rugoso)
        roughness: 0.8, // Rugoso
        metalness: 0.0, // Sem metalicidade
        
        // Reflexão baixa
        envMapIntensity: 0.3,
        
        transparent: false,
        opacity: 1.0,
        
        // Emissão para realismo estrutural
        emissive: '#181818',
        emissiveIntensity: 0.01
      }),
      
      // Material para vidro puro (extremamente realista)
      vidro: new THREE.MeshPhysicalMaterial({
        // Cor base com tonalidade azul ainda mais sutil
        color: '#F8FBFF',
        
        // Propriedades de transparência e refração maximizadas
        transparent: true,
        opacity: 0.08, // Extremamente transparente
        transmission: 0.98, // Transmissão quase total
        thickness: 0.3, // Vidro mais fino
        ior: 1.52, // Índice de refração do vidro
        
        // Superfície perfeitamente polida
        roughness: 0.0,
        metalness: 0.0,
        
        // Texturas
        map: createAdvancedGlassTexture,
        normalMap: createGlassNormalMap,
        normalScale: new THREE.Vector2(0.05, 0.05), // Normal map ainda mais sutil
        
        // Reflexão máxima
        envMapIntensity: 9.0, // Reflexão máxima do ambiente
        reflectivity: 0.95, // Reflexão quase total
        
        // Efeitos avançados
        clearcoat: 1.0, // Camada de verniz máxima
        clearcoatRoughness: 0.0, // Clearcoat perfeitamente liso
        
        // Emissão mínima para manter realismo
        emissive: '#EEF5FF', // Azul quase imperceptível
        emissiveIntensity: 0.05,
        
        // Propriedades de brilho
        sheen: 0.1, // Brilho muito sutil
        sheenColor: '#E8F2FF', // Cor do brilho azul muito claro
        specularIntensity: 1.0, // Intensidade especular máxima
        specularColor: '#FFFFFF', // Reflexos especulares puros
        
        side: THREE.DoubleSide
      }),
      
      // Material para papel picado (revestimento de paredes)
      papelPicado: new THREE.MeshStandardMaterial({
        map: createPapelPicadoTexture,
        normalMap: createPapelPicadoNormalMap,
        normalScale: new THREE.Vector2(0.3, 0.3), // Relevo sutil
        color: '#898989', // Cinza base
        roughness: 0.85, // Superficie rugosa como papel
        metalness: 0.0, // Sem metalicidade
        envMapIntensity: 0.2, // Pouco reflexo
        transparent: false,
        opacity: 1.0,
        // Adicionar propriedades para iluminação suave
        emissive: '#1A1A1A', // Emissão muito sutil para suavizar
        emissiveIntensity: 0.02
      }),
      
      // Material para tinta cinza
      tintaCinza: new THREE.MeshStandardMaterial({
        // Textura de tinta cinza
        map: createTintaCinzaTexture,
        normalMap: createTintaCinzaNormalMap,
        normalScale: new THREE.Vector2(0.1, 0.1), // Normal map muito sutil (tinta lisa)
        
        // Cor cinza médio da tinta
        color: '#888888', // Cinza médio
        
        // Propriedades de tinta (superfície lisa)
        roughness: 0.25, // Relativamente lisa (tinta seca)
        metalness: 0.0, // Sem metalicidade
        
        // Reflexão moderada (tinta tem pouco brilho)
        envMapIntensity: 0.35,
        
        // Propriedades para realismo
        transparent: false,
        opacity: 1.0,
        
        // Emissão muito sutil para tinta
        emissive: '#1E1E1E', // Cinza muito escuro
        emissiveIntensity: 0.005 // Quase imperceptível
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
  }, [createAdvancedGlassTexture, createGlassNormalMap, createFibrocimentoTexture, createFibrocimentoNormalMap, createConcretoTexture, createConcretoNormalMap, createTintaCinzaTexture, createTintaCinzaNormalMap, createPapelPicadoTexture, createPapelPicadoNormalMap]);


  // Função para determinar o material baseado no nome do elemento
  const getMaterialForElement = (elementName: string): THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial => {
    const name = elementName.toLowerCase();
    
    // PRIORIDADE 1: Elementos de revestimento (papel picado)
    if (name.includes('1.3_') || name.includes('2.3_') || 
        (name.includes('revestimento') && name.includes('parede'))) {
      console.log(`🎨 PAPEL PICADO detectado: ${elementName}`);
      return createMaterials.papelPicado;
    } else if (name.includes('parede') || name.includes('alvenaria')) {
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
    } else if (name.includes('telhado') || name.includes('telha') || name.includes('2.6_') ||
               name.includes('fibrocimento') || name.includes('fiber') || name.includes('cement') ||
               name.includes('roof') || name.includes('tile')) {
      console.log(`🏠 TELHADO/FIBROCIMENTO detectado: ${elementName}`);
      return createMaterials.telhado;
    } else if (name.includes('pilar') || name.includes('viga')) {
      console.log(`🏗️ PILAR/VIGA detectado: ${elementName}`);
      return createMaterials.pilar;
    } else if (name.includes('vidro') || name.includes('glass') || name.includes('transparente') ||
               name.includes('cristal') || name.includes('vitro')) {
      console.log(`🪟 VIDRO REALISTA detectado: ${elementName}`);
      return createMaterials.vidro;
    } else if (name.includes('cinza') || name.includes('gray') || name.includes('grey') ||
               name.includes('tinta') || name.includes('paint') || name.includes('pintura')) {
      console.log(`🎨 TINTA CINZA detectada: ${elementName}`);
      return createMaterials.tintaCinza;
    } else {
      console.log(`⚪ PADRÃO aplicado: ${elementName}`);
      return createMaterials.default;
    }
  };
  
  // Extrair elementos e aplicar textura de concreto
  useEffect(() => {
    console.log('🔍 ===== INICIANDO EXTRAÇÃO DE ELEMENTOS =====');
    console.log('🔍 Scene disponível?', !!scene);
    console.log('🔍 onElementsExtracted disponível?', !!onElementsExtracted);
    
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
      
      // Expor hierarquia e scene globalmente para debug
      (window as any).glbHierarchy = hierarchy;
      (window as any).glbScene = scene;
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
      
      // Análise específica das coleções do Blender
      console.log('📦 ===== ANÁLISE DAS COLECÇÕES DO BLENDER =====');
      const colecoesBlender = elements.filter(el => 
        el.includes('Paredes') || el.includes('Piso') || el.includes('Esquadrias') || el.includes('Telhado')
      );
      console.log('📦 Coleções do Blender encontradas:', colecoesBlender);
      
      // Análise específica das esquadrias
      console.log('📦 ===== ANÁLISE DAS ESQUADRIAS =====');
      const esquadrias = elements.filter(el => 
        el.includes('Esquadrias') || el.includes('Porta') || el.includes('Janela') || el.includes('esquadria')
      );
      console.log('📦 Esquadrias encontradas:', esquadrias);
      console.log('📦 Total de esquadrias:', esquadrias.length);
      
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
      console.log('📦 Total de elementos extraídos:', elements.length);
      console.log('📦 Chamando onElementsExtracted com', elements.length, 'elementos');
      onElementsExtracted(elements);
      console.log('✅ onElementsExtracted chamado com sucesso!');
    } else {
      console.log('❌ Não foi possível extrair elementos - Scene ou onElementsExtracted não disponível');
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

  // Função para lincar Elementos3D da planilha com coleções do Blender - VERSÃO INTELIGENTE
  const findMatchingElements = useCallback((item: any): string[] => {
    const itemId = item.id;
    const itemCodigo = item.codigo;
    const itemDescricao = item.descricao || '';
    const elementos3D = item.elementos3D || '';
    
    console.log('🔍 ===== LÓGICA DE LINCAGEM INTELIGENTE =====');
    console.log('📋 Item:', { id: itemId, codigo: itemCodigo, descricao: itemDescricao, elementos3D });
    console.log('📦 Total de elementos GLB disponíveis:', glbElements.length);
    
    let matchingElements: string[] = [];
    
    // Mapeamento inteligente baseado no código do item
    const codigoItem = itemId || itemCodigo;
    console.log('🎯 Código do item:', codigoItem);

    // Estratégia 1: Mapeamento direto por código
    if (codigoItem) {
      // Converter código para formato GLB (ex: "1.1" -> "11")
      const codigoNumerico = codigoItem.replace('.', '');
      console.log('🔢 Código numérico:', codigoNumerico);

      // Buscar elementos que começam com o código numérico
      const elementosPorCodigo = glbElements.filter(el => {
        return el.startsWith(codigoNumerico + '_');
      });

      if (elementosPorCodigo.length > 0) {
        console.log(`✅ Encontrados ${elementosPorCodigo.length} elementos para código ${codigoItem}:`, elementosPorCodigo);
        matchingElements = elementosPorCodigo;
        return matchingElements;
      }

      // Estratégia 2: Busca por padrões específicos baseados na descrição
      const descricaoLower = itemDescricao.toLowerCase();
      console.log('📝 Descrição:', descricaoLower);

      if (descricaoLower.includes('paredes')) {
        // Para paredes, buscar elementos que contenham "paredes" ou "wall" E que correspondam ao código
        const elementosParedes = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          const hasParedesKeyword = elLower.includes('paredes') || elLower.includes('wall') || elLower.includes('parede');
          
          // Filtrar por código específico se disponível
          if (codigoItem) {
            const codigoNumerico = codigoItem.replace('.', '');
            return hasParedesKeyword && el.startsWith(codigoNumerico + '_');
          }
          
          return hasParedesKeyword;
        });
        
        if (elementosParedes.length > 0) {
          console.log('✅ Elementos de paredes encontrados:', elementosParedes);
          matchingElements = elementosParedes;
          return matchingElements;
        }
      }

      if (descricaoLower.includes('piso')) {
        // Para piso, buscar elementos que contenham "piso" ou "floor" E que correspondam ao código
        const elementosPiso = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          const hasPisoKeyword = elLower.includes('piso') || elLower.includes('floor') || elLower.includes('laje');
          
          // Filtrar por código específico se disponível
          if (codigoItem) {
            const codigoNumerico = codigoItem.replace('.', '');
            return hasPisoKeyword && el.startsWith(codigoNumerico + '_');
          }
          
          return hasPisoKeyword;
        });
        
        if (elementosPiso.length > 0) {
          console.log('✅ Elementos de piso encontrados:', elementosPiso);
          matchingElements = elementosPiso;
          return matchingElements;
        }
      }

      if (descricaoLower.includes('esquadrias')) {
        // Para esquadrias, buscar elementos que contenham "esquadrias" ou "door" ou "window" E que correspondam ao código
        const elementosEsquadrias = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          const hasEsquadriasKeyword = elLower.includes('esquadrias') || elLower.includes('door') || elLower.includes('window') || elLower.includes('porta') || elLower.includes('janela');
          
          // Filtrar por código específico se disponível
          if (codigoItem) {
            const codigoNumerico = codigoItem.replace('.', '');
            return hasEsquadriasKeyword && el.startsWith(codigoNumerico + '_');
          }
          
          return hasEsquadriasKeyword;
        });
        
        if (elementosEsquadrias.length > 0) {
          console.log('✅ Elementos de esquadrias encontrados:', elementosEsquadrias);
          matchingElements = elementosEsquadrias;
          return matchingElements;
        }
      }

      if (descricaoLower.includes('telhado')) {
        // Para telhado, buscar elementos que contenham "telhado" ou "roof" E que correspondam ao código
        const elementosTelhado = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          const hasTelhadoKeyword = elLower.includes('telhado') || elLower.includes('roof') || elLower.includes('telha');
          
          // Filtrar por código específico se disponível
          if (codigoItem) {
            const codigoNumerico = codigoItem.replace('.', '');
            return hasTelhadoKeyword && el.startsWith(codigoNumerico + '_');
          }
          
          return hasTelhadoKeyword;
        });
        
        if (elementosTelhado.length > 0) {
          console.log('✅ Elementos de telhado encontrados:', elementosTelhado);
          matchingElements = elementosTelhado;
          return matchingElements;
        }
      }

      if (descricaoLower.includes('vigas')) {
        // Para vigas, buscar elementos que contenham "vigas" ou "beam"
        const elementosVigas = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          return elLower.includes('vigas') || elLower.includes('beam') || elLower.includes('viga');
        });
        
        if (elementosVigas.length > 0) {
          console.log('✅ Elementos de vigas encontrados:', elementosVigas);
          matchingElements = elementosVigas;
          return matchingElements;
        }
      }

      if (descricaoLower.includes('pilares')) {
        // Para pilares, buscar elementos que contenham "pilares" ou "column"
        const elementosPilares = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          return elLower.includes('pilares') || elLower.includes('column') || elLower.includes('pilar');
        });
        
        if (elementosPilares.length > 0) {
          console.log('✅ Elementos de pilares encontrados:', elementosPilares);
          matchingElements = elementosPilares;
          return matchingElements;
        }
      }

      if (descricaoLower.includes('fundações')) {
        // Para fundações, buscar elementos que contenham "fundações" ou "foundation"
        const elementosFundacoes = glbElements.filter(el => {
          const elLower = el.toLowerCase();
          return elLower.includes('fundações') || elLower.includes('foundation') || elLower.includes('fundacao');
        });
        
        if (elementosFundacoes.length > 0) {
          console.log('✅ Elementos de fundações encontrados:', elementosFundacoes);
          matchingElements = elementosFundacoes;
          return matchingElements;
        }
      }
    }

    // Estratégia 3: Se ainda não encontrou, tentar mapear pelos elementos3D da planilha
    if (elementos3D && elementos3D.trim() !== '') {
      console.log('🎯 Tentando mapear pelos elementos3D da planilha:', elementos3D);
      
      // Dividir elementos3D por vírgula
      const elementosLista = elementos3D.split(',').map((el: string) => el.trim()).filter((el: string) => el !== '');
      console.log('📋 Lista de elementos da planilha:', elementosLista);

      for (const elemento of elementosLista) {
        // Tentar encontrar elemento exato
        const elementoExato = glbElements.find(el => el === elemento);
        if (elementoExato) {
          console.log('✅ Elemento exato encontrado:', elementoExato);
          matchingElements.push(elementoExato);
          continue;
        }

        // Tentar encontrar por partes do nome
        const partes = elemento.split('.');
        if (partes.length >= 2) {
          const prefixo = partes[0];
          const sufixo = partes[partes.length - 1];
          
          // Converter para formato GLB
          const codigoNumerico = prefixo.replace(/\s.*/, '').replace('.', '');
          const descricao = prefixo.replace(/^\d+\.\d+\s*/, '').replace(/\s+/g, '_');
          const nomeEsperado = `${codigoNumerico}_${descricao}${sufixo}`;
          
          const elementoEncontrado = glbElements.find(el => el === nomeEsperado);
          if (elementoEncontrado) {
            console.log('✅ Elemento encontrado por conversão:', elementoEncontrado);
            matchingElements.push(elementoEncontrado);
          }
        }
      }
    }

    if (matchingElements.length > 0) {
      console.log(`✅ Total de elementos encontrados: ${matchingElements.length}`);
    return matchingElements;
    }

    console.log('❌ Nenhum elemento encontrado para este item');
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
      
      console.log('🖱️ ===== ITEM CLICADO =====');
      console.log('📋 Item completo:', item);
      
      setSelectedItems((prevSelected) => {
        const isCurrentlySelected = prevSelected.includes(itemId);
        
        if (isCurrentlySelected) {
          // Item já está selecionado - desselecionar
          console.log('🔄 DESSELECIONANDO item:', itemId);
          setHighlightedElements([]); // Limpar destacamentos
          return []; // Limpar seleção
        } else {
          // Item não está selecionado - selecionar
          console.log('🔄 SELECIONANDO item:', itemId);
          const matchingElements = findMatchingElements(item);
          console.log('🎯 Elementos encontrados:', matchingElements.length);
          
          setHighlightedElements(matchingElements);
          return [itemId]; // Selecionar apenas este item
        }
      });
    }, [findMatchingElements]),

    // Função para alternar visibilidade dos elementos de um item
    toggleElementVisibility: useCallback((item: any) => {
      const itemId = item.id;
      console.log('👁️ ===== TOGGLE VISIBILIDADE =====');
      console.log('👁️ Item recebido:', item);
      console.log('👁️ ID do item:', itemId);
      console.log('👁️ É subcoleção?', item.isSubcollection);
      console.log('👁️ Elementos3D:', item.elementos3D);
      
      // Se é uma categoria principal (isEtapaTotal), controlar todas as subcategorias
      if (item.isEtapaTotal) {
        console.log('👁️ Categoria principal - controlando todas as subcategorias da categoria:', itemId);
        
        // Encontrar todas as subcategorias desta categoria
        const subcategorias = itens5D.filter(subItem => 
          !subItem.isEtapaTotal && 
          subItem.codigo?.startsWith(item.codigo || '')
        );
        
        console.log(`👁️ Encontradas ${subcategorias.length} subcategorias para controlar`);
        
        // Verificar se alguma subcategoria tem elementos ocultos
        let hasAnyHidden = false;
        const todosElementosDaCategoria: string[] = [];
        
        subcategorias.forEach(sub => {
          const elementos = findMatchingElements(sub);
          todosElementosDaCategoria.push(...elementos);
          if (elementos.some(el => hiddenElements.has(el))) {
            hasAnyHidden = true;
          }
        });
        
        if (hasAnyHidden) {
          // Se algum está oculto, mostrar todos
          console.log('👁️ Mostrando todos os elementos da categoria');
          setHiddenElements(prev => {
            const newSet = new Set(prev);
            todosElementosDaCategoria.forEach(el => newSet.delete(el));
            return newSet;
          });
        } else {
          // Se todos estão visíveis, ocultar todos
          console.log('👁️ Ocultando todos os elementos da categoria');
          setHiddenElements(prev => {
            const newSet = new Set(prev);
            todosElementosDaCategoria.forEach(el => newSet.add(el));
            return newSet;
          });
        }
      } else {
        // Subcategoria individual
        console.log('👁️ Processando subcategoria individual ou subcoleção');
        const elementos = findMatchingElements(item);
        console.log('👁️ Elementos encontrados pelo findMatchingElements:', elementos);
        console.log('👁️ Total de elementos encontrados:', elementos.length);
        
        const hasHiddenElements = elementos.some(el => hiddenElements.has(el));
        console.log('👁️ Tem elementos ocultos?', hasHiddenElements);
        console.log('👁️ Hidden elements atual:', Array.from(hiddenElements));
        
        if (hasHiddenElements) {
          console.log('👁️ MOSTRANDO elementos da subcategoria/subcoleção:', itemId);
          console.log('👁️ Elementos que serão mostrados:', elementos);
          setHiddenElements(prev => {
            const newSet = new Set(prev);
            elementos.forEach(el => {
              console.log(`👁️ Removendo "${el}" de hiddenElements`);
              newSet.delete(el);
            });
            console.log('👁️ Novo hiddenElements após mostrar:', Array.from(newSet));
            return newSet;
          });
        } else {
          console.log('👁️ OCULTANDO elementos da subcategoria/subcoleção:', itemId);
          console.log('👁️ Elementos que serão ocultados:', elementos);
          setHiddenElements(prev => {
            const newSet = new Set(prev);
            elementos.forEach(el => {
              console.log(`👁️ Adicionando "${el}" a hiddenElements`);
              newSet.add(el);
            });
            console.log('👁️ Novo hiddenElements após ocultar:', Array.from(newSet));
            return newSet;
          });
        }
      }
    }, [findMatchingElements, hiddenElements, itens5D]),

    // Retornar hiddenElements para uso no componente
    hiddenElements
  };
}

// Componente principal do Viewer 5D
export default function Viewer5D() {
  const { itens } = useOrcamentoStore();
  
  const {
    selectedItems,
    highlightedElements,
    hiddenElements,
    setGlbElements,
    handleItemSelect,
    toggleElementVisibility
  } = usePlanilha3DLink(itens);

  // Debug: Verificar itens carregados
  useEffect(() => {
    if (itens && itens.length > 0) {
      console.log('✅ Dados carregados:', itens.length, 'itens');
    }
  }, [itens]);
  
  const handleElementsExtracted = useCallback((elements: string[]) => {
    console.log('🎯 ===== ELEMENTOS RECEBIDOS DO MODELO 3D =====');
    console.log('🎯 Total de elementos recebidos:', elements.length);
    console.log('🎯 Primeiros 10 elementos:', elements.slice(0, 10));
    console.log('🎯 Chamando setGlbElements...');
    setGlbElements(elements);
    console.log('✅ setGlbElements chamado com sucesso!');
  }, [setGlbElements]);

  const highlightElementsByCategory = (categoryCode: string) => {
    console.log('🏗️ Destacando categoria:', categoryCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96 lg:h-[520px]">
              <Canvas camera={{ position: [20, 20, 20], fov: 60 }}>
                <Suspense fallback={<Loader />}>
                  {/* Iluminação ambiente suave para papel picado */}
                  <ambientLight intensity={0.4} color="#F5F5F0" />
                  
                  {/* Luz principal suave e quente */}
                  <directionalLight 
                    position={[30, 40, 25]} 
                    intensity={1.8}
                    color="#FFFAF0"
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.1}
                    shadow-camera-far={300}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                    shadow-bias={-0.0002}
                  />
                  
                  {/* Luz de preenchimento suave */}
                  <directionalLight 
                    position={[-20, 25, -15]} 
                    intensity={0.6} 
                    color="#F0F8FF"
                  />
                  
                  {/* Luz pontual quente para realçar texturas */}
                  <pointLight 
                    position={[15, 12, 15]} 
                    intensity={0.8} 
                    color="#FFF8DC"
                    distance={40}
                    decay={1.5}
                  />
                  
                  {/* Luz de apoio para suavizar sombras */}
                  <pointLight 
                    position={[-10, 8, -10]} 
                    intensity={0.4} 
                    color="#F5F5DC"
                    distance={30}
                    decay={2}
                  />
                  
                  <OrbitControls />
                  <StructuralModel 
                    highlightedElements={highlightedElements}
                    hiddenElements={hiddenElements}
                    onElementsExtracted={handleElementsExtracted}
                    onElementClick={(elementName) => console.log('Elemento clicado:', elementName)}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-xl overflow-hidden">
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
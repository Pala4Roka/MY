import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ isTalking }) {
  const group = useRef();
  const [mixer, setMixer] = useState(null);
  const [error, setError] = useState(false);
  
  // Try to load the model with error handling
  let gltfResult = null;
  try {
    gltfResult = useGLTF('/Mal0_Base_20.glb', true);
  } catch (err) {
    console.error('Error loading MAL0 model:', err);
    if (!error) setError(true);
  }

  useEffect(() => {
    if (gltfResult?.scene && gltfResult?.animations && gltfResult.animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(gltfResult.scene);
      const action = newMixer.clipAction(gltfResult.animations[0]);
      action.play();
      setMixer(newMixer);
    }
  }, [gltfResult]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
    
    // Gentle idle animation
    if (group.current && !isTalking) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
    
    // Talking animation - more movement
    if (group.current && isTalking) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  // If model failed to load, show a fallback
  if (error || !gltfResult?.scene) {
    return (
      <group ref={group}>
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group}>
      <primitive object={gltfResult.scene} scale={1.5} position={[0, -1, 0]} />
    </group>
  );
}

export default function MAL0Model({ isTalking = false }) {
  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      background: '#0a0a0a',
      border: '2px solid #dc2626',
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: '#dc2626',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>👁</div>
      <h3 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>MAL0 - Объятия тени</h3>
      <p style={{ margin: '0', opacity: 0.7, fontSize: '14px' }}>
        {isTalking ? 'Говорит...' : '3D модель временно недоступна'}
      </p>
      <p style={{ margin: '10px 0 0 0', opacity: 0.5, fontSize: '12px' }}>
        (121MB модель загружается...)
      </p>
    </div>
  );
}

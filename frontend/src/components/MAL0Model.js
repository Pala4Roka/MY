import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ isTalking }) {
  const group = useRef();
  const [mixer, setMixer] = useState(null);
  
  // Load the model
  const gltf = useGLTF('/Mal0_Base_20.glb');

  useEffect(() => {
    if (gltf?.scene && gltf?.animations && gltf.animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(gltf.scene);
      const action = newMixer.clipAction(gltf.animations[0]);
      action.play();
      setMixer(newMixer);
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
    
    // Gentle idle animation
    if (group.current && !isTalking) {
      group.current.rotation.y += delta * 0.1;
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
    
    // Talking animation - more movement
    if (group.current && isTalking) {
      group.current.rotation.y += delta * 0.2;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  if (!gltf?.scene) {
    return null;
  }

  return (
    <group ref={group}>
      <primitive object={gltf.scene.clone()} scale={1.5} position={[0, -1, 0]} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function MAL0Model({ isTalking = false }) {
  const [error, setError] = useState(false);
  
  if (error) {
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
          Ошибка загрузки 3D модели
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      background: '#0a0a0a',
      border: '2px solid #dc2626',
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        onError={() => setError(true)}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#dc2626" />
          <Model isTalking={isTalking} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

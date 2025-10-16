import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ isTalking }) {
  const group = useRef();
  const [modelError, setModelError] = useState(false);
  const [mixer, setMixer] = useState(null);
  
  // Try to load the model with error handling
  let scene, animations;
  try {
    const gltf = useGLTF('/Mal0_Base_20.glb');
    scene = gltf.scene;
    animations = gltf.animations;
  } catch (error) {
    console.error('Error loading MAL0 model:', error);
    setModelError(true);
  }

  useEffect(() => {
    if (scene && animations && animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(scene);
      const action = newMixer.clipAction(animations[0]);
      action.play();
      setMixer(newMixer);
    }
  }, [scene, animations]);

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

  // If model failed to load or scene is null, show a fallback
  if (modelError || !scene) {
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
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/Mal0_Base_20.glb');

export default function MAL0Model({ isTalking = false }) {
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
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="sunset" />
        <Suspense fallback={null}>
          <Model isTalking={isTalking} />
        </Suspense>
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          maxDistance={10}
          minDistance={3}
        />
      </Canvas>
    </div>
  );
}

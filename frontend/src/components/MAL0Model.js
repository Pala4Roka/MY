import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Model({ isTalking }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/mal0_model.glb');
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  useEffect(() => {
    if (animations && animations.length > 0) {
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
  }, [animations, mixer]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
    
    // Gentle idle animation
    if (group.current && !isTalking) {
      group.current.rotation.y += 0.002;
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
    
    // Talking animation - more movement
    if (group.current && isTalking) {
      group.current.rotation.y += 0.005;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
    </group>
  );
}

export default function MAL0Model({ isTalking = false }) {
  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model isTalking={isTalking} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

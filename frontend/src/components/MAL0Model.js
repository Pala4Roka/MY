import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function MAL0Character() {
  const modelRef = useRef();
  const { scene } = useGLTF('https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/vso3zssj_Mal0_Base_20.glb');
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (modelRef.current) {
      // Follow mouse cursor
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      
      modelRef.current.position.x = THREE.MathUtils.lerp(
        modelRef.current.position.x,
        x,
        0.05
      );
      modelRef.current.position.y = THREE.MathUtils.lerp(
        modelRef.current.position.y,
        y,
        0.05
      );
      
      // Rotate slightly based on cursor position
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        state.pointer.x * 0.3,
        0.05
      );
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.5}
      position={[0, 0, 0]}
    />
  );
}

export default function MAL0Model() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1,
      pointerEvents: 'none'
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#dc2626" />
        <React.Suspense fallback={null}>
          <MAL0Character />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

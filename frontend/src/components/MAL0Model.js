import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function MAL0Model({ isTalking = false }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(10, 10, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0xdc2626, 0.8);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.6);
    pointLight2.position.set(10, -10, 10);
    scene.add(pointLight2);

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      '/Mal0_Base_20.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Adjust model scale and position
        model.scale.set(1.2, 1.2, 1.2);
        model.position.y = -1.5;
        
        // Add model to scene
        scene.add(model);
        modelRef.current = model;
        
        setLoading(false);
        setError(false);
        console.log('MAL0 model loaded successfully');
      },
      (progress) => {
        // Loading progress
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading MAL0 model: ${percent.toFixed(1)}%`);
      },
      (err) => {
        console.error('Error loading MAL0 model:', err);
        setError(true);
        setLoading(false);
      }
    )

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate and animate model
      if (modelRef.current) {
        if (isTalking) {
          modelRef.current.rotation.y += delta * 0.5;
          modelRef.current.position.y = -1.5 + Math.sin(elapsed * 3) * 0.15;
        } else {
          modelRef.current.rotation.y += delta * 0.2;
          modelRef.current.position.y = -1.5 + Math.sin(elapsed * 0.8) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isTalking]);

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
          Ошибка инициализации модели
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
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
      position: 'relative'
    }}>
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%' 
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#dc2626',
          fontSize: '18px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          zIndex: 10
        }}>
          <div style={{ fontSize: '48px' }}>👁</div>
          <div>Загрузка 3D модели MAL0...</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
            Это может занять несколько секунд (121MB)
          </div>
          <div style={{ 
            width: '200px', 
            height: '4px', 
            background: 'rgba(220, 38, 38, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              background: '#dc2626',
              animation: 'loadingBar 1.5s ease-in-out infinite'
            }} />
          </div>
          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `}</style>
        </div>
      )}
      {!loading && !error && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#dc2626',
          fontSize: '12px',
          textAlign: 'center',
          opacity: 0.7,
          background: 'rgba(10, 10, 10, 0.8)',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #dc2626'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>MAL0 - Объятия тени</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>3D модель загружена (121MB)</div>
        </div>
      )}
    </div>
  );
}

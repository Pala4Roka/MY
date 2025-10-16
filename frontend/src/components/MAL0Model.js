import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Animation states for MAL0
const ANIMATION_STATES = {
  IDLE: 'idle',
  NERVOUS: 'nervous',
  SLEEPY: 'sleepy',
  SLEEPING: 'sleeping',
  PLAYFUL: 'playful',
  HAPPY: 'happy'
};

export default function MAL0Model({ isTalking = false, emotion = 'idle' }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(false);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);
  const emotionStateRef = useRef({ current: 'idle', time: 0 });

  // Procedural animation function based on emotion
  const applyEmotionAnimation = (model, emotion, elapsed, delta) => {
    const state = emotionStateRef.current;
    state.time += delta;

    switch(emotion) {
      case ANIMATION_STATES.IDLE:
        // Subtle breathing and looking around
        model.rotation.y = Math.sin(elapsed * 0.3) * 0.15;
        model.position.y = -1.2 + Math.sin(elapsed * 0.8) * 0.05;
        break;

      case ANIMATION_STATES.NERVOUS:
        // Quick, jittery movements
        model.rotation.y = Math.sin(elapsed * 2) * 0.3 + Math.random() * 0.05;
        model.position.y = -1.2 + Math.sin(elapsed * 4) * 0.1;
        model.rotation.z = Math.sin(elapsed * 3) * 0.05;
        break;

      case ANIMATION_STATES.SLEEPY:
        // Slow, drowsy swaying
        model.rotation.y = Math.sin(elapsed * 0.15) * 0.1;
        model.position.y = -1.2 + Math.sin(elapsed * 0.5) * 0.03;
        model.rotation.z = Math.sin(elapsed * 0.2) * 0.08;
        break;

      case ANIMATION_STATES.SLEEPING:
        // Minimal movement, gentle breathing
        model.rotation.y = 0;
        model.position.y = -1.3 + Math.sin(elapsed * 0.3) * 0.02;
        model.rotation.z = 0;
        break;

      case ANIMATION_STATES.PLAYFUL:
        // Energetic, bouncy movements
        model.rotation.y = Math.sin(elapsed * 1.5) * 0.4;
        model.position.y = -1.2 + Math.abs(Math.sin(elapsed * 2)) * 0.15;
        model.rotation.x = Math.sin(elapsed * 1.2) * 0.05;
        break;

      case ANIMATION_STATES.HAPPY:
        // Cheerful, slight head bobbing
        model.rotation.y = Math.sin(elapsed * 1) * 0.25;
        model.position.y = -1.2 + Math.sin(elapsed * 1.5) * 0.08;
        model.rotation.z = Math.sin(elapsed * 1) * 0.03;
        break;

      default:
        // Default idle
        model.rotation.y = Math.sin(elapsed * 0.3) * 0.15;
        model.position.y = -1.2 + Math.sin(elapsed * 0.8) * 0.05;
    }

    // Add talking animation overlay
    if (isTalking) {
      model.position.y += Math.sin(elapsed * 8) * 0.03;
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup - positioned to show upper 50% of body, close-up like looking through window
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 2.5); // Closer, focused on upper body
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting for dramatic effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main light (from front, slightly above)
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
    scene.add(spotLight);

    // Red accent light (signature MAL0 color)
    const redLight = new THREE.PointLight(0xdc2626, 1.2);
    redLight.position.set(-3, 0, 2);
    scene.add(redLight);

    // Blue accent light
    const blueLight = new THREE.PointLight(0x3b82f6, 0.8);
    blueLight.position.set(3, 0, 2);
    scene.add(blueLight);

    // Rim light for silhouette
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, 2, -3);
    scene.add(rimLight);

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      '/Mal0_Base_20.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Adjust model scale and position to show upper 50% close to "window"
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(0, -1.2, 0); // Position so upper body is centered
        
        // Apply shadows
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Add model to scene
        scene.add(model);
        modelRef.current = model;
        
        setLoading(false);
        setError(false);
        console.log('MAL0 model loaded successfully');
      },
      (progress) => {
        // Loading progress
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          setLoadProgress(percent);
          console.log(`Loading MAL0 model: ${percent.toFixed(1)}%`);
        }
      },
      (err) => {
        console.error('Error loading MAL0 model:', err);
        setError(true);
        setLoading(false);
      }
    );

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Apply emotion-based animation
      if (modelRef.current) {
        applyEmotionAnimation(modelRef.current, emotion, elapsed, delta);
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
  }, [isTalking, emotion]);

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

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Animation states for MAL0
const ANIMATION_STATES = {
  CALM: 'calm',        // Спокойствие - дышит, следит за курсором
  JOY: 'joy',          // Радость - закрывает глаза, машет хвостом  
  PLAYFUL: 'playful',  // Игривость - прячет руки за спину, трясет грудью
  SAD: 'sad',          // Печаль - опускает уши, обнимает себя
  TIRED: 'tired'       // Усталость - опирается, спит
};

export default function MAL0ModelNew({ isTalking = false, emotion = 'calm', mousePosition = { x: 0, y: 0 } }) {
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
  const emotionStateRef = useRef({ current: 'calm', time: 0, transitionTime: 0 });
  const bonesRef = useRef({});
  const eyeTargetRef = useRef(new THREE.Vector3());
  
  // Mouse tracking for eye following
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      eyeTargetRef.current.set(x * 0.3, y * 0.3, 0);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Find bones by name pattern
  const findBones = (scene) => {
    const bones = {};
    scene.traverse((child) => {
      if (child.isBone || child.type === 'Bone') {
        const name = child.name;
        
        // Tail bones
        if (name.startsWith('Tail')) {
          if (!bones.tail) bones.tail = [];
          bones.tail.push(child);
        }
        
        // Ear bones
        if (name.includes('Ear.L') && !name.includes('Master') && !name.includes('Comb')) {
          if (!bones.earL) bones.earL = [];
          bones.earL.push(child);
        }
        if (name.includes('Ear.R') && !name.includes('Master') && !name.includes('Comb')) {
          if (!bones.earR) bones.earR = [];
          bones.earR.push(child);
        }
        
        // Eyelid bones
        if (name.includes('Lid.T.L')) {
          if (!bones.lidTL) bones.lidTL = [];
          bones.lidTL.push(child);
        }
        if (name.includes('Lid.T.R')) {
          if (!bones.lidTR) bones.lidTR = [];
          bones.lidTR.push(child);
        }
        if (name.includes('Lid.B.L')) {
          if (!bones.lidBL) bones.lidBL = [];
          bones.lidBL.push(child);
        }
        if (name.includes('Lid.B.R')) {
          if (!bones.lidBR) bones.lidBR = [];
          bones.lidBR.push(child);
        }
        
        // Breast bones
        if (name.includes('breast.') && (name.includes('.L') || name.includes('.R'))) {
          if (!bones.breast) bones.breast = [];
          bones.breast.push(child);
        }
        
        // Arm bones
        if (name.includes('upper_arm.L') || name.includes('forearm.L') || name.includes('hand.L')) {
          if (!bones.armL) bones.armL = [];
          bones.armL.push(child);
        }
        if (name.includes('upper_arm.R') || name.includes('forearm.R') || name.includes('hand.R')) {
          if (!bones.armR) bones.armR = [];
          bones.armR.push(child);
        }
        
        // Spine bones for breathing
        if (name.startsWith('DEF-spine')) {
          if (!bones.spine) bones.spine = [];
          bones.spine.push(child);
        }
        
        // Head bone for looking
        if (name === 'head') {
          bones.head = child;
        }
        
        // Eye master bones
        if (name === 'EyeMaster.L' || name.includes('EyeMaster.L')) {
          bones.eyeL = child;
        }
        if (name === 'EyeMaster.R' || name.includes('EyeMaster.R')) {
          bones.eyeR = child;
        }
      }
    });
    
    console.log('Found bones:', Object.keys(bones));
    return bones;
  };

  // Emotion-based bone animations
  const applyBoneAnimations = (bones, emotion, elapsed, delta) => {
    const state = emotionStateRef.current;
    state.time += delta;
    
    // Save initial bone rotations if not saved
    if (!state.initialRotations) {
      state.initialRotations = {};
      Object.entries(bones).forEach(([key, boneOrArray]) => {
        if (Array.isArray(boneOrArray)) {
          state.initialRotations[key] = boneOrArray.map(bone => bone.rotation.clone());
        } else if (boneOrArray) {
          state.initialRotations[key] = boneOrArray.rotation.clone();
        }
      });
    }

    switch(emotion) {
      case ANIMATION_STATES.CALM:
        // Subtle breathing
        if (bones.spine && bones.spine.length > 0) {
          bones.spine.forEach((bone, i) => {
            const breathe = Math.sin(elapsed * 0.8 + i * 0.1) * 0.01;
            bone.rotation.x += breathe;
          });
        }
        
        // Eyes follow mouse cursor
        if (bones.eyeL) {
          bones.eyeL.rotation.y = THREE.MathUtils.lerp(bones.eyeL.rotation.y, eyeTargetRef.current.x, 0.1);
          bones.eyeL.rotation.x = THREE.MathUtils.lerp(bones.eyeL.rotation.x, eyeTargetRef.current.y, 0.1);
        }
        if (bones.eyeR) {
          bones.eyeR.rotation.y = THREE.MathUtils.lerp(bones.eyeR.rotation.y, eyeTargetRef.current.x, 0.1);
          bones.eyeR.rotation.x = THREE.MathUtils.lerp(bones.eyeR.rotation.x, eyeTargetRef.current.y, 0.1);
        }
        
        // Head slightly follows mouse
        if (bones.head) {
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, eyeTargetRef.current.x * 0.2, 0.05);
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, -eyeTargetRef.current.y * 0.15, 0.05);
        }
        
        // Gentle tail sway
        if (bones.tail && bones.tail.length > 0) {
          bones.tail.forEach((bone, i) => {
            const sway = Math.sin(elapsed * 0.5 + i * 0.3) * 0.05;
            bone.rotation.z = sway;
            bone.rotation.x = sway * 0.5;
          });
        }
        break;

      case ANIMATION_STATES.JOY:
        // Close eyes
        if (bones.lidTL && bones.lidTL.length > 0) {
          bones.lidTL.forEach(bone => {
            bone.rotation.x = Math.min(bone.rotation.x + 0.02, 0.8);
          });
        }
        if (bones.lidTR && bones.lidTR.length > 0) {
          bones.lidTR.forEach(bone => {
            bone.rotation.x = Math.min(bone.rotation.x + 0.02, 0.8);
          });
        }
        if (bones.lidBL && bones.lidBL.length > 0) {
          bones.lidBL.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.02, -0.8);
          });
        }
        if (bones.lidBR && bones.lidBR.length > 0) {
          bones.lidBR.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.02, -0.8);
          });
        }
        
        // Wag tail energetically
        if (bones.tail && bones.tail.length > 0) {
          bones.tail.forEach((bone, i) => {
            const wag = Math.sin(elapsed * 4 + i * 0.5) * 0.3;
            bone.rotation.z = wag;
            bone.rotation.y = wag * 0.3;
          });
        }
        
        // Happy breathing
        if (bones.spine && bones.spine.length > 0) {
          bones.spine.forEach((bone, i) => {
            const breathe = Math.sin(elapsed * 1.2 + i * 0.1) * 0.02;
            bone.rotation.x += breathe;
          });
        }
        break;

      case ANIMATION_STATES.PLAYFUL:
        // Hide hands behind back
        if (bones.armL && bones.armL.length > 0) {
          bones.armL.forEach((bone, i) => {
            if (bone.name.includes('upper_arm')) {
              bone.rotation.z = Math.min(bone.rotation.z + 0.02, 1.2);
              bone.rotation.x = Math.min(bone.rotation.x + 0.01, 0.5);
            }
          });
        }
        if (bones.armR && bones.armR.length > 0) {
          bones.armR.forEach((bone, i) => {
            if (bone.name.includes('upper_arm')) {
              bone.rotation.z = Math.max(bone.rotation.z - 0.02, -1.2);
              bone.rotation.x = Math.min(bone.rotation.x + 0.01, 0.5);
            }
          });
        }
        
        // Shake chest
        if (bones.breast && bones.breast.length > 0) {
          const shake = Math.sin(elapsed * 8) * 0.05;
          bones.breast.forEach(bone => {
            bone.rotation.x = shake;
          });
        }
        
        // Playful tail movement
        if (bones.tail && bones.tail.length > 0) {
          bones.tail.forEach((bone, i) => {
            const move = Math.sin(elapsed * 3 + i * 0.4) * 0.2;
            bone.rotation.z = move;
          });
        }
        
        // Slightly tilted head
        if (bones.head) {
          bones.head.rotation.z = Math.sin(elapsed * 1.5) * 0.1;
        }
        break;

      case ANIMATION_STATES.SAD:
        // Lower ears
        if (bones.earL && bones.earL.length > 0) {
          bones.earL.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.01, -0.8);
          });
        }
        if (bones.earR && bones.earR.length > 0) {
          bones.earR.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.01, -0.8);
          });
        }
        
        // Hug self with one arm
        if (bones.armL && bones.armL.length > 0) {
          bones.armL.forEach((bone, i) => {
            if (bone.name.includes('upper_arm')) {
              bone.rotation.y = Math.min(bone.rotation.y + 0.02, 0.8);
              bone.rotation.z = Math.min(bone.rotation.z + 0.01, 0.4);
            }
          });
        }
        
        // Slow breathing
        if (bones.spine && bones.spine.length > 0) {
          bones.spine.forEach((bone, i) => {
            const breathe = Math.sin(elapsed * 0.5 + i * 0.1) * 0.015;
            bone.rotation.x += breathe;
          });
        }
        
        // Head slightly down
        if (bones.head) {
          bones.head.rotation.x = Math.max(bones.head.rotation.x - 0.01, -0.3);
        }
        
        // Droopy tail
        if (bones.tail && bones.tail.length > 0) {
          bones.tail.forEach((bone, i) => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.005, -0.2 * (i + 1));
          });
        }
        break;

      case ANIMATION_STATES.TIRED:
        // Lean on window (forward lean)
        if (bones.spine && bones.spine.length > 0) {
          bones.spine.forEach((bone, i) => {
            const lean = 0.1 * (i / bones.spine.length);
            bone.rotation.x = Math.min(bone.rotation.x + 0.005, lean);
          });
        }
        
        // Close eyes for sleeping
        if (bones.lidTL && bones.lidTL.length > 0) {
          bones.lidTL.forEach(bone => {
            bone.rotation.x = Math.min(bone.rotation.x + 0.01, 1.0);
          });
        }
        if (bones.lidTR && bones.lidTR.length > 0) {
          bones.lidTR.forEach(bone => {
            bone.rotation.x = Math.min(bone.rotation.x + 0.01, 1.0);
          });
        }
        if (bones.lidBL && bones.lidBL.length > 0) {
          bones.lidBL.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.01, -1.0);
          });
        }
        if (bones.lidBR && bones.lidBR.length > 0) {
          bones.lidBR.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.01, -1.0);
          });
        }
        
        // Very slow breathing
        if (bones.spine && bones.spine.length > 0) {
          bones.spine.forEach((bone, i) => {
            const breathe = Math.sin(elapsed * 0.3 + i * 0.1) * 0.008;
            bone.rotation.x += breathe;
          });
        }
        
        // Arms relaxed
        if (bones.armL && bones.armL.length > 0) {
          bones.armL.forEach((bone, i) => {
            if (bone.name.includes('upper_arm')) {
              bone.rotation.x = Math.min(bone.rotation.x + 0.01, 0.3);
            }
          });
        }
        if (bones.armR && bones.armR.length > 0) {
          bones.armR.forEach((bone, i) => {
            if (bone.name.includes('upper_arm')) {
              bone.rotation.x = Math.min(bone.rotation.x + 0.01, 0.3);
            }
          });
        }
        
        // Ears relaxed/droopy
        if (bones.earL && bones.earL.length > 0) {
          bones.earL.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.008, -0.4);
          });
        }
        if (bones.earR && bones.earR.length > 0) {
          bones.earR.forEach(bone => {
            bone.rotation.x = Math.max(bone.rotation.x - 0.008, -0.4);
          });
        }
        
        // Tail still
        if (bones.tail && bones.tail.length > 0) {
          bones.tail.forEach((bone, i) => {
            const stillness = Math.sin(elapsed * 0.2) * 0.01;
            bone.rotation.z = stillness;
          });
        }
        break;
    }

    // Add talking animation overlay
    if (isTalking && bones.head) {
      bones.head.position.y += Math.sin(elapsed * 8) * 0.005;
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 2.5);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
    scene.add(spotLight);

    const redLight = new THREE.PointLight(0xdc2626, 1.2);
    redLight.position.set(-3, 0, 2);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 0.8);
    blueLight.position.set(3, 0, 2);
    scene.add(blueLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, 2, -3);
    scene.add(rimLight);

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      '/Mal0_Base_20.glb',
      (gltf) => {
        const model = gltf.scene;
        
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(0, -1.2, 0);
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(model);
        modelRef.current = model;
        
        // Find and store bone references
        bonesRef.current = findBones(model);
        
        setLoading(false);
        setError(false);
        console.log('MAL0 model loaded successfully with bone animations');
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          setLoadProgress(percent);
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

      // Apply bone-based animation
      if (modelRef.current && bonesRef.current) {
        applyBoneAnimations(bonesRef.current, emotion, elapsed, delta);
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
  }, [isTalking, emotion, mousePosition]);

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '300px',
        borderRadius: '12px', 
        overflow: 'hidden', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)',
        border: '2px solid #dc2626',
        boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#dc2626',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', filter: 'drop-shadow(0 0 10px #dc2626)' }}>👁</div>
        <h3 style={{ margin: '0 0 10px 0', color: '#dc2626', fontSize: '24px', fontWeight: 'bold' }}>
          MAL0 - Объятия тени
        </h3>
        <p style={{ margin: '0', opacity: 0.7, fontSize: '14px' }}>
          Ошибка загрузки 3D модели
        </p>
      </div>
    );
  }

  const getEmotionLabel = (emotion) => {
    switch(emotion) {
      case 'calm': return 'Спокойное';
      case 'joy': return 'Радостное';
      case 'playful': return 'Игривое';
      case 'sad': return 'Печальное';
      case 'tired': return 'Усталое';
      default: return 'Активное';
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      minHeight: '300px',
      borderRadius: '12px', 
      overflow: 'hidden', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)',
      border: '2px solid #dc2626',
      boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)',
      position: 'relative'
    }}>
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '300px'
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#dc2626',
          fontSize: '16px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          zIndex: 10,
          background: 'rgba(10, 10, 10, 0.9)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dc2626',
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'
        }}>
          <div style={{ 
            fontSize: '56px',
            animation: 'pulse 2s ease-in-out infinite',
            filter: 'drop-shadow(0 0 10px #dc2626)'
          }}>👁</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Загрузка 3D модели MAL0...
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {loadProgress > 0 ? `${loadProgress.toFixed(1)}%` : 'Инициализация...'}
          </div>
          <div style={{ 
            width: '250px', 
            height: '6px', 
            background: 'rgba(220, 38, 38, 0.2)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid rgba(220, 38, 38, 0.4)'
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px #dc2626'
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { 
                transform: scale(1);
                opacity: 1;
              }
              50% { 
                transform: scale(1.1);
                opacity: 0.8;
              }
            }
          `}</style>
        </div>
      )}
      {!loading && !error && (
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#dc2626',
          fontSize: '11px',
          textAlign: 'center',
          opacity: 0.7,
          background: 'rgba(10, 10, 10, 0.85)',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid rgba(220, 38, 38, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
            MAL0 - Объятия тени
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            Эмоция: {getEmotionLabel(emotion)}
          </div>
        </div>
      )}
    </div>
  );
}

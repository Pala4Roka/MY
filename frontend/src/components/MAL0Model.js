import React, { useEffect, useState } from 'react';

export default function MAL0Model({ isTalking = false }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isTalking) {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isTalking]);

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: '2px solid #dc2626',
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'
    }}>
      <div style={{
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2), transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isTalking ? 'pulse 1s ease-in-out infinite' : 'float 3s ease-in-out infinite',
        transform: `rotate(${rotation}deg)`
      }}>
        <img 
          src="/Mal0_Base_20.glb"
          alt="MAL0"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div style="color: #dc2626; font-size: 24px; text-align: center; font-family: 'Share Tech Mono', monospace;">
                <div style="font-size: 48px; margin-bottom: 20px;">👁️</div>
                <div>MAL0</div>
                <div style="font-size: 16px; margin-top: 10px; opacity: 0.7;">Объятия тени</div>
                ${isTalking ? '<div style="font-size: 14px; margin-top: 20px; color: #22c55e;">◉ Говорит...</div>' : '<div style="font-size: 14px; margin-top: 20px;">◉ Онлайн</div>'}
              </div>
            `;
          }}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))'
          }} 
        />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(${rotation}deg); }
          50% { transform: scale(1.1) rotate(${rotation + 180}deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(${rotation}deg); }
          50% { transform: translateY(-10px) rotate(${rotation}deg); }
        }
      `}</style>
    </div>
  );
}

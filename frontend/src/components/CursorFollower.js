import React, { useEffect, useState } from 'react';
import './CursorFollower.css';

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let timeout;
    
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMoving(false), 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* MAL0 Shadow Image Following Cursor */}
      <div 
        className={`cursor-follower ${isMoving ? 'moving' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <img 
          src="https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/zeveinwp_4309243.picsmall.jpg"
          alt="MAL0"
          className="follower-image"
        />
      </div>
      
      {/* Glow effect */}
      <div 
        className="cursor-glow"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}

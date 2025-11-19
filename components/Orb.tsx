
import React, { useState, useEffect } from 'react';
import { Emotion } from '../types';
import { EMOTION_STYLES } from '../constants';

interface OrbProps {
  emotion: Emotion;
  volume: number;
  isRecording: boolean;
}

const Orb: React.FC<OrbProps> = ({ emotion, volume, isRecording }) => {
  const [activeEmotion, setActiveEmotion] = useState<Emotion>(emotion);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  
  // When prop changes, trigger transition
  useEffect(() => {
    if (emotion !== activeEmotion) {
      setTargetEmotion(emotion);
    }
  }, [emotion, activeEmotion]);

  const handleTransitionEnd = () => {
    if (targetEmotion) {
      setActiveEmotion(targetEmotion);
      setTargetEmotion(null);
    }
  };

  const activeStyle = EMOTION_STYLES[activeEmotion] || EMOTION_STYLES.default;
  const targetStyle = targetEmotion ? (EMOTION_STYLES[targetEmotion] || EMOTION_STYLES.default) : null;
  
  // Increase turbulence with volume
  const turbulenceFrequency = 0.01 + volume * 0.03;
  const displacementScale = 30 + volume * 50;

  const FireEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
      {[...Array(30)].map((_, i) => {
         const randomDelay = Math.random() * 2;
         const randomDuration = Math.random() * 1 + 1;
         const randomLeft = Math.random() * 80 + 10; // Keep away from absolute edges
         const size = Math.random() * 20 + 10;
         const colorClass = Math.random() > 0.5 ? 'bg-red-500' : 'bg-yellow-400';
         
         return (
            <div
            key={i}
            className={`absolute rounded-full ${colorClass} opacity-0 mix-blend-screen`}
            style={{
                bottom: '-20px',
                left: `${randomLeft}%`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `fire-rise ${randomDuration}s infinite ease-out`,
                animationDelay: `-${randomDelay}s`,
                filter: 'blur(4px)'
            }}
            />
         )
      })}
    </div>
  );

  return (
    <div className="relative w-full h-full aspect-square flex items-center justify-center">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${turbulenceFrequency} ${turbulenceFrequency * 0.7}`}
              numOctaves="1"
              result="turbulence"
            />
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale={displacementScale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      {/* Back Glow - represents the active emotion, transitions slowly if no target */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeStyle.gradient} blur-3xl opacity-60 transition-all duration-1000 ${isRecording ? 'animate-pulse-slow' : ''}`}></div>

      {/* Liquid Container */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden isolate bg-gray-900" // Added dark bg to avoid transparency issues
        style={{ filter: 'url(#liquid-filter)' }}
      >
        {/* Base Layer (Current Emotion) */}
        <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${activeStyle.gradient}`}>
           {activeStyle.specialEffect === 'fire' && <FireEffect />}
        </div>

        {/* Overlay Layer (Target Emotion - Paint Drop) */}
        {targetEmotion && targetStyle && (
          <div 
            className="absolute top-1/2 left-1/2 w-full h-full origin-center animate-paint-drop"
            // Render the drop as a centered div that scales up
            onAnimationEnd={handleTransitionEnd}
          >
             {/* Inner content of the drop */}
             <div className={`w-full h-full rounded-full bg-gradient-to-br ${targetStyle.gradient} transform -translate-x-1/2 -translate-y-1/2`}>
                 {targetStyle.specialEffect === 'fire' && <FireEffect />}
             </div>
          </div>
        )}

        {/* Inner sheen for 3D effect */}
        <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-radial from-white/30 via-transparent to-black/20 opacity-90 pointer-events-none mix-blend-overlay" />
        
        {/* Highlight */}
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/10 rounded-full blur-xl mix-blend-screen pointer-events-none"></div>
      </div>

       {/* Recording Indicator */}
       {isRecording && (
        <div className="absolute w-1/3 h-1/3 bg-white/10 rounded-full animate-ping-slow pointer-events-none blur-md"></div>
       )}

      <style>{`
        @keyframes fire-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-150%) scale(0.2);
            opacity: 0;
          }
        }
        
        @keyframes paint-drop {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 1;
          }
        }

        .animate-paint-drop {
          animation: paint-drop 2s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes ping-slow {
            75%, 100% {
                transform: scale(1.4);
                opacity: 0;
            }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Orb;

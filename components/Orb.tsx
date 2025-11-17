import React from 'react';
import { Emotion } from '../types';
import { EMOTION_STYLES } from '../constants';

interface OrbProps {
  emotion: Emotion;
  volume: number;
  isRecording: boolean;
}

const Orb: React.FC<OrbProps> = ({ emotion, volume, isRecording }) => {
  const style = EMOTION_STYLES[emotion] || EMOTION_STYLES.default;
  const turbulenceFrequency = 0.01 + volume * 0.03;
  
  const BubbleEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-orange-300/70"
          style={{
            bottom: '5%',
            left: `${10 + Math.random() * 80}%`,
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            animation: `bubble-rise ${Math.random() * 3 + 2}s infinite ease-in`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0,
          }}
        />
      ))}
       <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-250px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
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
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale={30 + volume * 50} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      {/* Outer Glow */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.gradient} transition-all duration-1000 blur-2xl ${style.shadow} ${isRecording ? 'animate-pulse-slow' : ''}`}></div>

      <div
        className="relative w-full h-full rounded-full"
        style={{ filter: 'url(#liquid-filter)' }}
      >
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${style.gradient} transition-all duration-1000 overflow-hidden`}>
            {style.specialEffect === 'fire' && <BubbleEffect />}
        </div>
        {/* Inner sheen to give a 3D effect */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-radial from-white/20 via-white/5 to-transparent opacity-70 " />
      </div>

       {/* Central pulse when recording */}
       {isRecording && (
        <div className="absolute w-1/3 h-1/3 bg-white/30 rounded-full animate-ping-slow"></div>
       )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes ping-slow {
            75%, 100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Orb;

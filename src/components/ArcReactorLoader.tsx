import React from 'react';

interface ArcReactorLoaderProps {
  /**
   * Optional className to apply to the root element for custom positioning or sizing.
   */
  className?: string;
}

const ArcReactorLoader: React.FC<ArcReactorLoaderProps> = ({ className = '' }) => {
  console.log('ArcReactorLoader loaded');

  return (
    <div className={`relative flex items-center justify-center w-24 h-24 ${className}`}>
      {/* Outermost faint pulse ring - subtle background energy */}
      <div 
        className="absolute w-full h-full rounded-full bg-cyan-500/10 animate-pulse [animation-duration:2.2s] [animation-timing-function:ease-in-out]"
      ></div>

      {/* Outer spinning ring - main structural element */}
      <div 
        className="absolute w-full h-full rounded-full border-2 border-cyan-600/70 animate-spin [animation-duration:3s] [animation-timing-function:linear]"
      ></div>
      
      {/* Middle pulsing glow ring - active energy field */}
      <div 
        className="absolute w-5/6 h-5/6 rounded-full bg-cyan-400/40 animate-pulse [animation-duration:1.5s] [animation-delay:0.2s] [animation-timing-function:ease-in-out]"
      ></div>

      {/* Inner structural rings - creating a sense of depth and complexity */}
      {/* These spin in opposite directions or at different speeds to enhance the dynamic feel */}
      <div 
        className="absolute w-3/5 h-3/5 rounded-full border-t-2 border-r-2 border-sky-400/90 animate-spin [animation-duration:1.7s] [animation-direction:reverse] [animation-timing-function:linear]"
      ></div>
      <div 
        className="absolute w-3/5 h-3/5 rounded-full border-b-2 border-l-2 border-sky-500/60 animate-spin [animation-duration:2s] [animation-timing-function:linear]"
      ></div>

      {/* Inner Core Glow - concentrated energy, stronger pulse */}
      <div 
        className="absolute w-2/5 h-2/5 rounded-full bg-sky-300/80 animate-pulse [animation-duration:0.9s] [animation-timing-function:ease-in-out]"
      ></div>

      {/* Central Bright Ping - visual representation of power surge/activation */}
      <div 
        className="absolute w-1/4 h-1/4 rounded-full bg-white/70 animate-ping [animation-duration:1.3s] [animation-timing-function:ease-in-out]"
      ></div>
      {/* Static Central Core - the heart of the reactor */}
      <div 
        className="absolute w-1/4 h-1/4 rounded-full bg-white opacity-95 shadow-2xl shadow-white/80"
      ></div>
    </div>
  );
};

export default ArcReactorLoader;
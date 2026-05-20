import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const WaterTank = ({ level = 50 }) => {
  const backWaveRef = useRef(null);
  const frontWaveRef = useRef(null);

  // Ensure level is between 0 and 100
  const normalizedLevel = Math.max(0, Math.min(100, level));
  
  // SVG coordinates
  const height = 300;
  const width = 150;
  const fillHeight = (normalizedLevel / 100) * height;
  const yPosition = height - fillHeight;

  useEffect(() => {
    // Endless horizontal scrolling for back wave
    const backAnim = gsap.fromTo(backWaveRef.current, 
      { x: 0 },
      { x: -width, duration: 4, ease: "none", repeat: -1 }
    );

    // Endless horizontal scrolling for front wave
    const frontAnim = gsap.fromTo(frontWaveRef.current, 
      { x: -width },
      { x: 0, duration: 3, ease: "none", repeat: -1 }
    );

    // Subtle vertical bobbing for realism
    const bobAnim1 = gsap.to(backWaveRef.current, {
      y: -3, duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut"
    });

    const bobAnim2 = gsap.to(frontWaveRef.current, {
      y: 3, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut"
    });

    return () => {
      backAnim.kill();
      frontAnim.kill();
      bobAnim1.kill();
      bobAnim2.kill();
    };
  }, [width]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Background container / Tank shell */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 drop-shadow-xl"
        >
          <defs>
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00B0F0" />
              <stop offset="100%" stopColor="#002733" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Tank outline/glass */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="20"
            ry="20"
            fill="url(#tankGradient)"
            stroke="#94a3b8"
            strokeWidth="4"
            opacity="0.6"
          />

          {/* Water Fill with Wave Animation */}
          <g>
            <clipPath id="waterClip">
              <rect x="2" y="2" width={width - 4} height={height - 4} rx="18" ry="18" />
            </clipPath>
            <g clipPath="url(#waterClip)">
              {/* Deep Water Rect (below the waves) */}
              <rect
                x="0"
                y={yPosition + 5}
                width={width}
                height={height}
                fill="url(#waterGradient)"
                className="transition-all duration-1000 ease-in-out"
              />
              
              <g style={{ transform: `translateY(${yPosition}px)`, transition: 'transform 1s ease-in-out' }}>
                {/* Back wave */}
                <path
                  ref={backWaveRef}
                  d={`M 0 0 Q ${width/4} -12 ${width/2} 0 T ${width} 0 T ${width*1.5} 0 T ${width*2} 0 L ${width*2} ${height} L 0 ${height} Z`}
                  fill="#00B0F0"
                  opacity="0.5"
                />

                {/* Front wave */}
                <path
                  ref={frontWaveRef}
                  d={`M 0 0 Q ${width/4} 12 ${width/2} 0 T ${width} 0 T ${width*1.5} 0 T ${width*2} 0 L ${width*2} ${height} L 0 ${height} Z`}
                  fill="url(#waterGradient)"
                />
              </g>
            </g>
          </g>

          {/* Level Markers */}
          <line x1="10" y1={height * 0.25} x2="30" y2={height * 0.25} stroke="#64748b" strokeWidth="2" />
          <line x1="10" y1={height * 0.5} x2="30" y2={height * 0.5} stroke="#64748b" strokeWidth="2" />
          <line x1="10" y1={height * 0.75} x2="30" y2={height * 0.75} stroke="#64748b" strokeWidth="2" />
        </svg>

        {/* Level Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-4xl font-bold ${normalizedLevel > 40 ? 'text-white' : 'text-vw-blue'} drop-shadow-md transition-colors duration-1000`}>
            {normalizedLevel}%
          </span>
          <span className={`text-sm font-semibold tracking-widest ${normalizedLevel > 40 ? 'text-cyan-100' : 'text-gray-500'} mt-1 transition-colors duration-1000`}>
            NIVEL
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaterTank;

interface TradingCardLogoProps {
  size?: number;
  className?: string;
}

export default function TradingCardLogo({ size = 48, className = "" }: TradingCardLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.4 }}>
      <svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 48 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Card Background with Gradient */}
        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="holographicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Card Base */}
        <rect
          x="2"
          y="2"
          width="44"
          height="63"
          rx="4"
          ry="4"
          fill="url(#cardGradient)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Holographic Effect */}
        <rect
          x="2"
          y="2"
          width="44"
          height="63"
          rx="4"
          ry="4"
          fill="url(#holographicGradient)"
        />
        
        {/* Inner Card Border */}
        <rect
          x="5"
          y="5"
          width="38"
          height="57"
          rx="2"
          ry="2"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.5"
        />
        
        {/* Camera Icon Container */}
        <circle
          cx="24"
          cy="20"
          r="12"
          fill="rgba(255,255,255,0.95)"
          filter="url(#glow)"
        />
        
        {/* Camera Body - Much Larger */}
        <rect
          x="16"
          y="13"
          width="16"
          height="14"
          rx="2"
          fill="#1f2937"
        />
        
        {/* Camera Lens - Larger and More Detailed */}
        <circle
          cx="24"
          cy="20"
          r="5"
          fill="#374151"
        />
        <circle
          cx="24"
          cy="20"
          r="4"
          fill="#111827"
        />
        <circle
          cx="24"
          cy="20"
          r="3"
          fill="#374151"
        />
        <circle
          cx="24"
          cy="20"
          r="1.5"
          fill="#6b7280"
        />
        
        {/* Camera Flash - Larger */}
        <rect
          x="18"
          y="15"
          width="2.5"
          height="2"
          rx="0.5"
          fill="#fbbf24"
        />
        
        {/* Viewfinder */}
        <rect
          x="27"
          y="15"
          width="2"
          height="1.5"
          rx="0.5"
          fill="#6b7280"
        />
        
        {/* Camera Grip Details */}
        <rect
          x="17"
          y="24"
          width="14"
          height="1"
          fill="#374151"
        />
        <rect
          x="17"
          y="26"
          width="14"
          height="0.5"
          fill="#4b5563"
        />
        
        {/* Card Title Area */}
        <rect
          x="8"
          y="32"
          width="32"
          height="12"
          rx="1"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
        
        {/* Title Text Lines */}
        <rect x="10" y="35" width="12" height="1.5" rx="0.5" fill="rgba(255,255,255,0.8)" />
        <rect x="10" y="37.5" width="8" height="1" rx="0.5" fill="rgba(255,255,255,0.6)" />
        <rect x="10" y="39.5" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
        
        {/* Card Stats Area */}
        <rect
          x="8"
          y="48"
          width="32"
          height="8"
          rx="1"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
        
        {/* Stats Icons */}
        <circle cx="12" cy="52" r="1.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="20" cy="52" r="1.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="28" cy="52" r="1.5" fill="rgba(255,255,255,0.7)" />
        
        {/* Corner Shine Effect */}
        <path
          d="M 6 6 L 15 6 L 6 15 Z"
          fill="rgba(255,255,255,0.3)"
        />
      </svg>
    </div>
  );
}
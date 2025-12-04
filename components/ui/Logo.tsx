'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Logo Mark - Abstract medical/data symbol */}
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          className="text-mint"
        />
        {/* Inner abstract shape - representing connection/data flow */}
        <path
          d="M12 20C12 15.5817 15.5817 12 20 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-mint"
        />
        <path
          d="M28 20C28 24.4183 24.4183 28 20 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-mint"
        />
        {/* Center dot */}
        <circle cx="20" cy="20" r="3" className="fill-mint" />
        {/* Data points */}
        <circle cx="12" cy="20" r="2" className="fill-mint-light" />
        <circle cx="28" cy="20" r="2" className="fill-mint-light" />
        <circle cx="20" cy="12" r="2" className="fill-vista-blue" />
        <circle cx="20" cy="28" r="2" className="fill-vista-blue" />
      </svg>

      {showText && (
        <span className={`font-semibold text-text-primary ${textSizeClasses[size]}`}>
          <span className="text-mint">1n</span>Health
        </span>
      )}
    </div>
  );
}

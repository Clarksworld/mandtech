import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
  accentColor?: string;
  className?: string;
}

export const MandtechLogo: React.FC<LogoProps> = ({
  size = 40,
  showText = false,
  color = '#212529',
  accentColor = '#F58220',
  className = '',
}) => {
  return (
    <div className={`mandtech-logo-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        <path
          d="M20 80V20L50 50L80 20V80"
          stroke={accentColor}
          strokeWidth={8}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect x={45} y={45} width={10} height={35} fill={color} />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-headers)",
            fontWeight: 800,
            fontSize: `${size * 0.4}px`,
            letterSpacing: '1px',
            color: color,
            textTransform: 'uppercase',
          }}
        >
          MANDTECH
        </span>
      )}
    </div>
  );
};

export default MandtechLogo;

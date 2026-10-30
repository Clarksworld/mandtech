import React from 'react';
import atlasCopcoLogo from '../assets/atlas_copco.svg';
import sullairLogo from '../assets/sullair.svg';
import ingersollRandLogo from '../assets/ingersoll_rand.svg';
import denairLogo from '../assets/denair.png';
import { HelpCircle } from 'lucide-react';
import './BrandLogo.css';

export type BrandId = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';

interface BrandLogoProps {
  brand: BrandId | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFallbackText?: boolean;
}

const SIZES = {
  sm: { height: '20px', maxHeight: '20px', maxWidth: '80px', iconSize: 15 },
  md: { height: '28px', maxHeight: '28px', maxWidth: '110px', iconSize: 18 },
  lg: { height: '38px', maxHeight: '38px', maxWidth: '135px', iconSize: 22 },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  className = '',
  size = 'md',
  showFallbackText = false,
}) => {
  const normBrand = (brand || '').toUpperCase().trim();
  const currentSize = SIZES[size] || SIZES.md;

  const imgStyle: React.CSSProperties = {
    height: currentSize.height,
    maxHeight: currentSize.maxHeight,
    maxWidth: currentSize.maxWidth,
    width: 'auto',
    objectFit: 'contain',
    display: 'block',
  };

  if (normBrand === 'ATLAS COPCO' || normBrand === 'ATLAS-COPCO') {
    return (
      <img
        src={atlasCopcoLogo}
        alt="Atlas Copco"
        className={`brand-logo-img brand-logo-img--${size} ${className}`}
        style={imgStyle}
        loading="lazy"
      />
    );
  }

  if (normBrand === 'SULLAIR') {
    return (
      <img
        src={sullairLogo}
        alt="Sullair"
        className={`brand-logo-img brand-logo-img--${size} ${className}`}
        style={imgStyle}
        loading="lazy"
      />
    );
  }

  if (normBrand === 'INGERSOLL RAND' || normBrand === 'INGERSOLL-RAND') {
    return (
      <img
        src={ingersollRandLogo}
        alt="Ingersoll Rand"
        className={`brand-logo-img brand-logo-img--${size} ${className}`}
        style={imgStyle}
        loading="lazy"
      />
    );
  }

  if (normBrand === 'DENAIR') {
    return (
      <img
        src={denairLogo}
        alt="DENAIR"
        className={`brand-logo-img brand-logo-img--${size} ${className}`}
        style={imgStyle}
        loading="lazy"
      />
    );
  }

  // OTHERS / Custom Brand
  return (
    <div className={`brand-logo-others brand-logo-others--${size} ${className}`}>
      <div className="brand-logo-others-icon">
        <HelpCircle size={currentSize.iconSize} />
      </div>
      {(showFallbackText || normBrand === 'OTHERS') && (
        <span className="brand-logo-others-text">{normBrand === 'OTHERS' ? 'OTHERS' : normBrand}</span>
      )}
    </div>
  );
};

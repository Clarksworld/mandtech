import React from 'react';
import atlasCopcoLogo from '../assets/atlas_copco.svg';
import sullairLogo from '../assets/sullair.svg';
import ingersollRandLogo from '../assets/ingersoll_rand.svg';
import denairLogo from '../assets/denair.png';
import { HelpCircle } from 'lucide-react';

export type BrandId = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';

interface BrandLogoProps {
  brand: BrandId | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFallbackText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  className = '',
  size = 'md',
  showFallbackText = false,
}) => {
  const normBrand = (brand || '').toUpperCase().trim();

  const sizeClasses = {
    sm: 'h-5 max-w-[90px]',
    md: 'h-7 max-w-[120px]',
    lg: 'h-10 max-w-[160px]',
  }[size];

  if (normBrand === 'ATLAS COPCO' || normBrand === 'ATLAS-COPCO') {
    return (
      <img
        src={atlasCopcoLogo}
        alt="Atlas Copco"
        className={`object-contain ${sizeClasses} ${className}`}
        loading="lazy"
      />
    );
  }

  if (normBrand === 'SULLAIR') {
    return (
      <img
        src={sullairLogo}
        alt="Sullair"
        className={`object-contain ${sizeClasses} ${className}`}
        loading="lazy"
      />
    );
  }

  if (normBrand === 'INGERSOLL RAND' || normBrand === 'INGERSOLL-RAND') {
    return (
      <img
        src={ingersollRandLogo}
        alt="Ingersoll Rand"
        className={`object-contain ${sizeClasses} ${className}`}
        loading="lazy"
      />
    );
  }

  if (normBrand === 'DENAIR') {
    return (
      <img
        src={denairLogo}
        alt="DENAIR"
        className={`object-contain ${sizeClasses} ${className}`}
        loading="lazy"
      />
    );
  }

  // OTHERS / Custom Brand
  return (
    <div className={`inline-flex items-center gap-1.5 font-bold tracking-wide text-white/90 ${className}`}>
      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
        <HelpCircle size={16} className="text-orange" />
      </div>
      {(showFallbackText || normBrand === 'OTHERS') && (
        <span className="text-xs font-semibold uppercase">{normBrand === 'OTHERS' ? 'OTHERS' : normBrand}</span>
      )}
    </div>
  );
};


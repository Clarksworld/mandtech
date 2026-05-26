import React from 'react';
import './Card.css';

interface EquipmentCardProps {
  title: string;
  specs: { icon: string; label: string }[];
  badge?: string;
  badgeType?: 'inStock' | 'featured';
  onQuote: () => void;
  accentTop?: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  title,
  specs,
  badge,
  badgeType = 'inStock',
  onQuote,
  accentTop = false,
}) => {
  return (
    <div className={`equipment-card ${accentTop ? 'accent-top' : ''}`}>
      {badge && (
        <div className={`card-badge badge-${badgeType}`}>
          {badgeType === 'inStock' && <span className="stock-dot"></span>}
          {badge}
        </div>
      )}
      <h3 className="card-title">{title}</h3>
      <div className="card-specs">
        {specs.map((spec, i) => (
          <div key={i} className="spec-row">
            <span className="spec-icon">{spec.icon}</span>
            <span className="spec-label">{spec.label}</span>
          </div>
        ))}
      </div>
      <button className="card-quote-btn" onClick={onQuote}>
        Request a Quote
      </button>
    </div>
  );
};

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ children, className = '' }) => {
  return <div className={`info-card ${className}`}>{children}</div>;
};

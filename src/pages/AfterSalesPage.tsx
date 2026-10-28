import React, { useState, useEffect } from 'react';
import { Gauge, Shield, Cpu, Wrench, Droplet } from 'lucide-react';
import LubricantsQuoteModal, { type LubricantBrand } from '../components/LubricantsQuoteModal';
import compressorHero from '../assets/compressor_hero.jpg';
import './AfterSalesPage.css';

interface BrandInfo {
  id: LubricantBrand;
  name: string;
  icon: React.ReactNode;
}

const BRANDS_LIST: BrandInfo[] = [
  { id: 'ATLAS COPCO',    name: 'ATLAS COPCO',    icon: <Gauge size={28} /> },
  { id: 'SULLAIR',        name: 'SULLAIR',         icon: <Shield size={28} /> },
  { id: 'INGERSOLL RAND', name: 'INGERSOLL RAND',  icon: <Cpu size={28} /> },
  { id: 'DENAIR',         name: 'DENAIR',          icon: <Wrench size={28} /> },
  { id: 'OTHERS',         name: 'OTHERS',          icon: <Droplet size={28} /> },
];

interface AfterSalesPageProps {
  initialBrand?: LubricantBrand | null;
}

export const AfterSalesPage: React.FC<AfterSalesPageProps> = ({ initialBrand }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<LubricantBrand | null>(initialBrand || null);

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      setModalOpen(true);
    }
  }, [initialBrand]);

  const handleOpenBrandModal = (brand: LubricantBrand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  return (
    <div className="lub-page">
      {/* Modal */}
      <LubricantsQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBrand={selectedBrand}
      />

      {/* Hero Section – same dimensions as SparePartsPage */}
      <section className="lub-hero-wrap">
        <img
          src={compressorHero}
          alt="Mandtech Lubricants and Special Fluids"
          className="lub-hero-image"
        />
        <div className="lub-hero-shade" />
        <div className="container lub-hero-inner">
          <div className="lub-hero-badge">FACTORY-APPROVED INDUSTRIAL FLUIDS</div>
          <h1 className="lub-hero-heading">
            Lubricants /<br />Special Fluids
          </h1>
          <p className="lub-hero-lead">
            Factory-approved synthetic compressor fluids, cooling lubricants,
            and food-grade oils.
          </p>
        </div>
      </section>

      {/* Brand Selection Section */}
      <section className="container lub-brands-section">
        <div className="lub-section-head">
          <span className="lub-sub-tag">SELECT MANUFACTURER</span>
          <h2 className="lub-main-title">Choose Your Brand</h2>
          <p className="lub-main-desc">
            Select your compressor brand to request an official lubricant quotation.
          </p>
        </div>

        {/* Staggered 3-2 brand grid */}
        <div className="lub-brands-row top-row">
          {BRANDS_LIST.slice(0, 3).map((brand) => (
            <BrandCard key={brand.id} brand={brand} onSelect={handleOpenBrandModal} />
          ))}
        </div>
        <div className="lub-brands-row bottom-row">
          {BRANDS_LIST.slice(3).map((brand) => (
            <BrandCard key={brand.id} brand={brand} onSelect={handleOpenBrandModal} />
          ))}
        </div>
      </section>
    </div>
  );
};

function BrandCard({
  brand,
  onSelect,
}: {
  brand: BrandInfo;
  onSelect: (id: LubricantBrand) => void;
}) {
  return (
    <div
      className="lub-brand-card"
      onClick={() => onSelect(brand.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(brand.id)}
    >
      <div className="lub-brand-icon-wrap">{brand.icon}</div>
      <span className="lub-brand-label">{brand.name}</span>
    </div>
  );
}

export default AfterSalesPage;

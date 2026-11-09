import React, { useState, useEffect } from 'react';
import { HelpCircle, ShoppingCart } from 'lucide-react';
import LubricantsQuoteModal, { type LubricantBrand } from '../components/LubricantsQuoteModal';
import { BrandLogo } from '../components/BrandLogo';
import { useInquiry } from '../context/InquiryContext';
import compressorHero from '../assets/compressor_hero.jpg';
import './AfterSalesPage.css';

interface BrandInfo {
  id: LubricantBrand;
  name: string;
}

const BRANDS_LIST: BrandInfo[] = [
  { id: 'ATLAS COPCO',    name: 'ATLAS COPCO' },
  { id: 'SULLAIR',        name: 'SULLAIR' },
  { id: 'INGERSOLL RAND', name: 'INGERSOLL RAND' },
  { id: 'DENAIR',         name: 'DENAIR' },
  { id: 'OTHERS',         name: 'OTHERS' },
];

interface AfterSalesPageProps {
  initialBrand?: LubricantBrand | null;
}

export const AfterSalesPage: React.FC<AfterSalesPageProps> = ({ initialBrand }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<LubricantBrand | null>(initialBrand || null);
  const { addToInquiry, isInInquiry } = useInquiry();

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
            Lubricants /<br /> Special Fluids
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
            <BrandCard key={brand.id} brand={brand} onSelect={handleOpenBrandModal} onAddCart={(id) => addToInquiry({
              id: `lub-${id}`,
              title: `${id === 'OTHERS' ? 'Other Brand' : id} Lubricant`,
              category: 'Lubricants',
              type: 'part',
              brand: id,
              specSummary: 'Factory-approved synthetic compressor fluid',
            })} inCart={isInInquiry(`lub-${brand.id}`)} />
          ))}
        </div>
        <div className="lub-brands-row bottom-row">
          {BRANDS_LIST.slice(3).map((brand) => (
            <BrandCard key={brand.id} brand={brand} onSelect={handleOpenBrandModal} onAddCart={(id) => addToInquiry({
              id: `lub-${id}`,
              title: `${id === 'OTHERS' ? 'Other Brand' : id} Lubricant`,
              category: 'Lubricants',
              type: 'part',
              brand: id,
              specSummary: 'Factory-approved synthetic compressor fluid',
            })} inCart={isInInquiry(`lub-${brand.id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
};

function BrandCard({
  brand,
  onSelect,
  onAddCart,
  inCart,
}: {
  brand: BrandInfo;
  onSelect: (id: LubricantBrand) => void;
  onAddCart: (id: LubricantBrand) => void;
  inCart: boolean;
}) {
  return (
    <div
      className="lub-brand-card"
      role="button"
      tabIndex={0}
    >
      <div className="lub-brand-icon-wrap" onClick={() => onSelect(brand.id)}>
        {brand.id === 'OTHERS' ? (
          <HelpCircle size={28} color="#64748b" />
        ) : (
          <BrandLogo brand={brand.id} size="md" />
        )}
      </div>
      <span className="lub-brand-label" onClick={() => onSelect(brand.id)}>{brand.name}</span>
      <div className="lub-brand-card-actions">
        <button
          className="lub-brand-quote-btn"
          onClick={() => onSelect(brand.id)}
        >
          Request Quote
        </button>
        <button
          className={`lub-brand-cart-btn${inCart ? ' in-cart' : ''}`}
          onClick={(e) => { e.stopPropagation(); onAddCart(brand.id); }}
          title={inCart ? 'Already in Cart' : 'Add to Cart'}
        >
          <ShoppingCart size={14} />
          <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}

export default AfterSalesPage;

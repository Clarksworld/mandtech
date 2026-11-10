import React, { useState, useEffect } from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import LubricantsQuoteModal, {
  type LubricantBrand,
} from '../components/LubricantsQuoteModal';
import { BrandLogo } from '../components/BrandLogo';
import compressorHero from '../assets/compressor_hero.jpg';
import './AfterSalesPage.css';

interface BrandInfo {
  id: LubricantBrand;
  name: string;
  badge: string;
  desc: string;
}

const BRANDS_LIST: BrandInfo[] = [
  {
    id: 'ATLAS COPCO',
    name: 'ATLAS COPCO',
    badge: '12 FORMULATIONS',
    desc: 'Roto-Inject, Roto-Xtend, ParOil series, and specialized Food-Grade synthetic fluids.',
  },
  {
    id: 'INGERSOLL RAND',
    name: 'INGERSOLL RAND',
    badge: '6 FORMULATIONS',
    desc: 'Ultra Coolant, Ultra Food Grade, Ultra 4k, Ultra Plus, and Techtrol Gold fluids.',
  },
  {
    id: 'SULLAIR',
    name: 'SULLAIR',
    badge: '8 FORMULATIONS',
    desc: 'Genuine Sullube 32/60, SRF I/II, 24KT silicone-based, AWF all-weather, and Pristine FG.',
  },
  {
    id: 'DENAIR',
    name: 'DENAIR',
    badge: 'OEM CERTIFIED',
    desc: 'High-durability rotary screw compressor fluids engineered for dual-stage units.',
  },
  {
    id: 'OTHERS',
    name: 'OTHERS',
    badge: 'CUSTOM / UNIVERSAL',
    desc: 'Custom OEM specifications, high-temp POE, food-grade H1, and system flushing fluids.',
  },
];

interface AfterSalesPageProps {
  initialBrand?: LubricantBrand | null;
}

export const AfterSalesPage: React.FC<AfterSalesPageProps> = ({ initialBrand }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<LubricantBrand | null>(initialBrand || null);
  const [selectedFluid, setSelectedFluid] = useState<string | null>(null);

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      setModalOpen(true);
    }
  }, [initialBrand]);

  const handleOpenBrandModal = (brand: LubricantBrand, fluid?: string) => {
    setSelectedBrand(brand);
    setSelectedFluid(fluid || null);
    setModalOpen(true);
  };

  return (
    <div className="lub-page">
      {/* Modal */}
      <LubricantsQuoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedFluid(null);
        }}
        initialBrand={selectedBrand}
        initialFluid={selectedFluid}
      />

      {/* Hero Section */}
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
            Certified factory-grade synthetic fluids, extended-duty lubricants, high-pressure synthetic coolants, and food-grade certified oils for Nigeria's leading industrial installations.
          </p>
          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="lub-btn-hero-quote"
              onClick={() => handleOpenBrandModal('ATLAS COPCO')}
            >
              <span>REQUEST FLUIDS QUOTATION</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Brand Selection Section — All-white cards with green edges on click/hover */}
      <section className="section-padding lub-capabilities-section">
        <div className="container">
          <div className="capabilities-header">
            <span className="lub-sub-tag">SELECT EQUIPMENT MANUFACTURER</span>
            <h2 className="capabilities-title">Certified OEM Lubricant Brands</h2>
            <div className="capabilities-accent-line"></div>
            <p className="lub-capabilities-intro">
              Select your compressor manufacturer to configure certified synthetic formulations, view available packaging, and request an official corporate quotation.
            </p>
          </div>

          <div className="capabilities-grid lub-brands-capabilities-grid">
            {BRANDS_LIST.map((brand) => (
              <div
                key={brand.id}
                className="capability-card lub-brand-capability-card"
                onClick={() => handleOpenBrandModal(brand.id)}
                role="button"
                tabIndex={0}
              >
                <div className="card-icon-wrapper lub-brand-icon-wrapper">
                  {brand.id === 'OTHERS' ? (
                    <HelpCircle size={28} color="#64748b" />
                  ) : (
                    <BrandLogo brand={brand.id} size="md" />
                  )}
                </div>

                <h3 className="card-title">{brand.name}</h3>
                <p className="card-desc">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AfterSalesPage;

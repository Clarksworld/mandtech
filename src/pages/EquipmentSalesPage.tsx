import { useState, useEffect } from 'react';
import {
  ArrowRight, Sparkles, HelpCircle, ShoppingCart
} from 'lucide-react';
import CompressorQuoteModal, { type CompressorType, type CompressorBrand } from '../components/CompressorQuoteModal';
import { BrandLogo } from '../components/BrandLogo';
import { useInquiry } from '../context/InquiryContext';
import './EquipmentSalesPage.css';

// Assets
import compressorHero from '../assets/compressor_hero.jpg';
import electricImg from '../assets/electric_compressor.jpg';
import dieselImg from '../assets/diesel_compressor.jpg';


interface EquipmentSalesPageProps {
  initialType?: CompressorType | null;
}

export default function EquipmentSalesPage({ initialType }: EquipmentSalesPageProps) {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<CompressorType | null>(initialType || null);
  const [modalBrand, setModalBrand] = useState<CompressorBrand | null>(null);
  const { addToInquiry, isInInquiry } = useInquiry();
  // Sync initialType from props if passed
  useEffect(() => {
    if (initialType) {
      setModalType(initialType);
      setModalBrand(null);
      setModalOpen(true);
    }
  }, [initialType]);

  const handleOpenModal = (type?: CompressorType, brand?: CompressorBrand) => {
    setModalType(type || null);
    setModalBrand(brand || null);
    setModalOpen(true);
  };

  return (
    <div className="equip-sales-page">

      {/* Embedded Compressor Quote Modal */}
      <CompressorQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        initialBrand={modalBrand}
      />


      {/* Hero Header */}
      <section className="clean-hero-section">
        <img src={compressorHero} alt="Industrial Air Compressors" className="clean-hero-bg-img" />
        <div className="clean-hero-overlay" />
        <div className="container clean-hero-content">
          <div className="clean-hero-badge">
            <Sparkles size={13} />
            <span>OEM CERTIFIED INDUSTRIAL FLEET</span>
          </div>
          <h1 className="clean-hero-title">Industrial Air Compressors</h1>
          <p className="clean-hero-subtitle">
            Formal quotations for stationary electric and mobile diesel rotary screw compressors from leading OEM brands.
          </p>
          <div className="clean-hero-action">
            <button
              type="button"
              className="clean-btn-primary"
              onClick={() => handleOpenModal()}
            >
              <span>REQUEST A FORMAL QUOTATION</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Two Clean Compact Configuration Cards */}
      <section className="container compact-section">
        <div className="compact-section-header">
          <h2 className="compact-section-title">Select Compressor Configuration</h2>
          <p className="compact-section-subtitle">Click either configuration to configure and request your formal quotation</p>
        </div>

        <div className="clean-type-grid">
          {/* Electric Card */}
          <div
            className="clean-type-card electric-card"
            role="button"
            tabIndex={0}
          >
            <div className="clean-card-img-box" onClick={() => handleOpenModal('ELECTRIC AIR COMPRESSOR')}>
              <img src={electricImg} alt="Electric Air Compressor" className="clean-card-img" />
            </div>
            <div className="clean-card-body">
              <span className="clean-card-tag electric" onClick={() => handleOpenModal('ELECTRIC AIR COMPRESSOR')}>STATIONARY INDUSTRIAL FLEET</span>
              <h3 className="clean-card-title" onClick={() => handleOpenModal('ELECTRIC AIR COMPRESSOR')}>ELECTRIC AIR COMPRESSOR</h3>
              <p className="clean-card-desc" onClick={() => handleOpenModal('ELECTRIC AIR COMPRESSOR')}>
                High-efficiency 400V 3-Phase rotary screw systems with variable speed drive (VSD).
              </p>
              <div className="clean-card-actions-row">
                <div className="clean-card-action" onClick={() => handleOpenModal('ELECTRIC AIR COMPRESSOR')}>
                  <span>Configure Electric Quote</span>
                  <ArrowRight size={14} />
                </div>
                <button
                  className={`equip-cart-btn${isInInquiry('equip-electric') ? ' in-cart' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToInquiry({
                      id: 'equip-electric',
                      title: 'Electric Air Compressor',
                      category: 'Equipment Sales',
                      type: 'equipment',
                      specSummary: '400V 3-Phase Rotary Screw, VSD',
                    });
                  }}
                >
                  <ShoppingCart size={14} />
                  <span>{isInInquiry('equip-electric') ? 'In Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Diesel Card */}
          <div
            className="clean-type-card diesel-card"
            role="button"
            tabIndex={0}
          >
            <div className="clean-card-img-box" onClick={() => handleOpenModal('DIESEL AIR COMPRESSOR')}>
              <img src={dieselImg} alt="Diesel Air Compressor" className="clean-card-img" />
            </div>
            <div className="clean-card-body">
              <span className="clean-card-tag diesel" onClick={() => handleOpenModal('DIESEL AIR COMPRESSOR')}>PORTABLE FIELD FLEET</span>
              <h3 className="clean-card-title" onClick={() => handleOpenModal('DIESEL AIR COMPRESSOR')}>DIESEL AIR COMPRESSOR</h3>
              <p className="clean-card-desc" onClick={() => handleOpenModal('DIESEL AIR COMPRESSOR')}>
                Heavy-duty portable units with CAT, Cummins, or Deutz diesel engines for remote jobsites.
              </p>
              <div className="clean-card-actions-row">
                <div className="clean-card-action diesel" onClick={() => handleOpenModal('DIESEL AIR COMPRESSOR')}>
                  <span>Configure Diesel Quote</span>
                  <ArrowRight size={14} />
                </div>
                <button
                  className={`equip-cart-btn${isInInquiry('equip-diesel') ? ' in-cart' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToInquiry({
                      id: 'equip-diesel',
                      title: 'Diesel Air Compressor',
                      category: 'Equipment Sales',
                      type: 'equipment',
                      specSummary: 'Portable, CAT/Cummins/Deutz Engine',
                    });
                  }}
                >
                  <ShoppingCart size={14} />
                  <span>{isInInquiry('equip-diesel') ? 'In Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Clean Compact Brand Cards */}
      <section className="container compact-section" style={{ marginTop: '40px' }}>
        <div className="compact-section-header">
          <h2 className="compact-section-title">OEM Manufacturer Partners</h2>
          <p className="compact-section-subtitle">Choose a manufacturer to open the formal quotation modal</p>
        </div>

        <div className="clean-brands-grid">
          {[
            { brand: 'ATLAS COPCO' as CompressorBrand, sub: 'GA / VSD+ Energy Recovery' },
            { brand: 'SULLAIR' as CompressorBrand, sub: 'Bulletproof Rotary Screw' },
            { brand: 'INGERSOLL RAND' as CompressorBrand, sub: 'Nirvana Series High CFM' },
            { brand: 'DENAIR' as CompressorBrand, sub: 'Dual-Stage German Tech' },
          ].map(({ brand, sub }) => (
            <div
              key={brand}
              className="clean-brand-card"
              role="button"
              tabIndex={0}
            >
              <div className="clean-brand-top" onClick={() => handleOpenModal(undefined, brand)}>
                <div className="clean-brand-icon">
                  <BrandLogo brand={brand} size="sm" />
                </div>
              </div>
              <h4 className="clean-brand-name" onClick={() => handleOpenModal(undefined, brand)}>{brand}</h4>
              <span className="clean-brand-sub" onClick={() => handleOpenModal(undefined, brand)}>{sub}</span>
              <div className="clean-brand-actions">
                <div className="clean-brand-cta" onClick={() => handleOpenModal(undefined, brand)}>
                  <span>Get Quote</span>
                  <ArrowRight size={13} />
                </div>
                <button
                  className={`equip-brand-cart-btn${isInInquiry(`equip-brand-${brand}`) ? ' in-cart' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToInquiry({
                      id: `equip-brand-${brand}`,
                      title: `${brand} Air Compressor`,
                      category: 'Equipment Sales',
                      type: 'equipment',
                      brand,
                      specSummary: sub,
                    });
                  }}
                  title="Add to Cart"
                >
                  <ShoppingCart size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Others */}
          <div
            className="clean-brand-card"
            role="button"
            tabIndex={0}
            onClick={() => handleOpenModal(undefined, 'OTHERS')}
          >
            <div className="clean-brand-top">
              <div className="clean-brand-icon">
                <HelpCircle size={22} color="#64748b" />
              </div>
            </div>
            <h4 className="clean-brand-name">OTHERS</h4>
            <span className="clean-brand-sub">Specify OEM Manufacturer</span>
            <div className="clean-brand-cta">
              <span>Specify &amp; Quote</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}

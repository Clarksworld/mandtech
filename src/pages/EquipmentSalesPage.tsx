import { useState, useEffect } from 'react';
import {
  ArrowRight, Sparkles, HelpCircle
} from 'lucide-react';
import CompressorQuoteModal, { type CompressorType, type CompressorBrand } from '../components/CompressorQuoteModal';
import { BrandLogo } from '../components/BrandLogo';
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
            onClick={() => handleOpenModal('ELECTRIC AIR COMPRESSOR')}
            role="button"
            tabIndex={0}
          >
            <div className="clean-card-img-box">
              <img src={electricImg} alt="Electric Air Compressor" className="clean-card-img" />
            </div>
            <div className="clean-card-body">
              <span className="clean-card-tag electric">STATIONARY INDUSTRIAL FLEET</span>
              <h3 className="clean-card-title">ELECTRIC AIR COMPRESSOR</h3>
              <p className="clean-card-desc">
                High-efficiency 400V 3-Phase rotary screw systems with variable speed drive (VSD).
              </p>
              <div className="clean-card-action">
                <span>Configure Electric Quote</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Diesel Card */}
          <div
            className="clean-type-card diesel-card"
            onClick={() => handleOpenModal('DIESEL AIR COMPRESSOR')}
            role="button"
            tabIndex={0}
          >
            <div className="clean-card-img-box">
              <img src={dieselImg} alt="Diesel Air Compressor" className="clean-card-img" />
            </div>
            <div className="clean-card-body">
              <span className="clean-card-tag diesel">PORTABLE FIELD FLEET</span>
              <h3 className="clean-card-title">DIESEL AIR COMPRESSOR</h3>
              <p className="clean-card-desc">
                Heavy-duty portable units with CAT, Cummins, or Deutz diesel engines for remote jobsites.
              </p>
              <div className="clean-card-action diesel">
                <span>Configure Diesel Quote</span>
                <ArrowRight size={14} />
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
          {/* Atlas Copco */}
          <div
            className="clean-brand-card"
            onClick={() => handleOpenModal(undefined, 'ATLAS COPCO')}
            role="button"
            tabIndex={0}
          >
            <div className="clean-brand-top">
              <div className="clean-brand-icon">
                <BrandLogo brand="ATLAS COPCO" size="sm" />
              </div>
            </div>
            <h4 className="clean-brand-name">ATLAS COPCO</h4>
            <span className="clean-brand-sub">GA / VSD+ Energy Recovery</span>
            <div className="clean-brand-cta">
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Sullair */}
          <div
            className="clean-brand-card"
            onClick={() => handleOpenModal(undefined, 'SULLAIR')}
            role="button"
            tabIndex={0}
          >
            <div className="clean-brand-top">
              <div className="clean-brand-icon">
                <BrandLogo brand="SULLAIR" size="sm" />
              </div>
            </div>
            <h4 className="clean-brand-name">SULLAIR</h4>
            <span className="clean-brand-sub">Bulletproof Rotary Screw</span>
            <div className="clean-brand-cta">
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Ingersoll Rand */}
          <div
            className="clean-brand-card"
            onClick={() => handleOpenModal(undefined, 'INGERSOLL RAND')}
            role="button"
            tabIndex={0}
          >
            <div className="clean-brand-top">
              <div className="clean-brand-icon">
                <BrandLogo brand="INGERSOLL RAND" size="sm" />
              </div>
            </div>
            <h4 className="clean-brand-name">INGERSOLL RAND</h4>
            <span className="clean-brand-sub">Nirvana Series High CFM</span>
            <div className="clean-brand-cta">
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Denair */}
          <div
            className="clean-brand-card"
            onClick={() => handleOpenModal(undefined, 'DENAIR')}
            role="button"
            tabIndex={0}
          >
            <div className="clean-brand-top">
              <div className="clean-brand-icon">
                <BrandLogo brand="DENAIR" size="sm" />
              </div>
            </div>
            <h4 className="clean-brand-name">DENAIR</h4>
            <span className="clean-brand-sub">Dual-Stage German Tech</span>
            <div className="clean-brand-cta">
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Others */}
          <div
            className="clean-brand-card"
            onClick={() => handleOpenModal(undefined, 'OTHERS')}
            role="button"
            tabIndex={0}
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

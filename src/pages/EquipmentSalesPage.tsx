import { useState, useEffect } from 'react';
import {
  Zap, Flame, ArrowRight, Sparkles, Shield,
  Cpu, Gauge, Phone, ChevronRight
} from 'lucide-react';
import CompressorQuoteModal, { type CompressorType, type CompressorBrand } from '../components/CompressorQuoteModal';
import './EquipmentSalesPage.css';

// Assets
import catalogBg from '../assets/catalog_bg.png';
import catalogBg1 from '../assets/catalog_bg1.png';
import catalogBg2 from '../assets/catalog_bg2.png';
import highCapacity from '../assets/high_capacity.png';
import industrialGenerator from '../assets/industrial_generator.png';
import portableUnit from '../assets/portable_unit.png';

interface ProductItem {
  id: number;
  title: string;
  category: string;
  brand: string;
  image: string;
  badge?: string;
  badgeType: 'in-stock' | 'featured';
  specs: { label: string }[];
  capacity: number;
  driven: 'Electric' | 'Diesel Driven';
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: 'Atlas Copco GA 160+ VSD',
    category: 'Air Compressors',
    brand: 'Atlas Copco',
    image: catalogBg,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { label: '920 CFM Flow Rate' },
      { label: '160 kW Variable Speed' },
      { label: 'Elektronikon Touch' },
    ],
    capacity: 920,
    driven: 'Electric',
  },
  {
    id: 2,
    title: 'Sullair 185 Portable Tier 4',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg2,
    badge: 'FEATURED',
    badgeType: 'featured',
    specs: [
      { label: '185 CFM Capacity' },
      { label: 'Caterpillar Diesel' },
      { label: 'Road-Ready Trailer' },
    ],
    capacity: 185,
    driven: 'Diesel Driven',
  },
  {
    id: 3,
    title: 'Ingersoll Rand Nirvana V75',
    category: 'Air Compressors',
    brand: 'Ingersoll Rand',
    image: highCapacity,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { label: '415 CFM Flow' },
      { label: '75 kW Electric Drive' },
      { label: 'Ultra Coolant 8000hr' },
    ],
    capacity: 415,
    driven: 'Electric',
  },
  {
    id: 4,
    title: 'Denair DWD-375 Diesel Mobile',
    category: 'Air Compressors',
    brand: 'Denair',
    image: portableUnit,
    badge: 'FEATURED',
    badgeType: 'featured',
    specs: [
      { label: '375 CFM Heavy Duty' },
      { label: 'Cummins Diesel Engine' },
      { label: 'High Altitude Package' },
    ],
    capacity: 375,
    driven: 'Diesel Driven',
  },
  {
    id: 5,
    title: 'Sullair 375H Heavy Duty',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg1,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { label: '375 CFM @ 150 PSI' },
      { label: 'Diesel Engine Driven' },
      { label: 'Sound Attenuated Canopy' },
    ],
    capacity: 375,
    driven: 'Diesel Driven',
  },
  {
    id: 6,
    title: 'Denair DVA-90 Energy Saver',
    category: 'Air Compressors',
    brand: 'Denair',
    image: industrialGenerator,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { label: '550 CFM Rotary Screw' },
      { label: 'Permanent Magnet Motor' },
      { label: '35% Energy Savings' },
    ],
    capacity: 550,
    driven: 'Electric',
  },
];

interface EquipmentSalesPageProps {
  initialType?: CompressorType | null;
}

export default function EquipmentSalesPage({ initialType }: EquipmentSalesPageProps) {
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<CompressorType | null>(initialType || null);
  const [modalBrand, setModalBrand] = useState<CompressorBrand | null>(null);

  // Accordion for catalog
  const [showCatalog, setShowCatalog] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);

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

      {/* Hotline Modal */}
      {showConsultModal && (
        <div className="status-modal-overlay" onClick={() => setShowConsultModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Phone size={20} className="text-orange" />
                <span>Commercial &amp; Technical Desk</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowConsultModal(false)}>✕</button>
            </div>
            <div className="modal-body-content" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', marginBottom: '16px' }}>
                Speak directly with Mandtech compressed air specialists for sizing, CFM calculations, and delivery schedules across Nigeria.
              </p>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ fontSize: '13px', color: '#1e252b' }}>Direct Engineering Contacts:</strong>
                <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px' }}>
                  Lagos Corporate Office: <strong>+234 (1) 460-7000</strong><br />
                  Port Harcourt Hub: <strong>+234 (84) 303-900</strong><br />
                  Email: <strong>compressors@mandtech.com.ng</strong>
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowConsultModal(false)}
                  style={{
                    background: 'var(--primary-container)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="clean-hero-section">
        <div className="container clean-hero-content">
          <div className="clean-hero-badge">
            <Sparkles size={13} />
            <span>OEM CERTIFIED INDUSTRIAL FLEET</span>
          </div>
          <h1 className="clean-hero-title">Industrial Air Compressors</h1>
          <p className="clean-hero-subtitle">
            Direct sales, warranty support, and formal quotations for stationary electric and mobile diesel rotary screw compressors across Nigeria.
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
            <div className="clean-card-icon-box electric">
              <Zap size={28} />
            </div>
            <div className="clean-card-body">
              <span className="clean-card-tag">PLANT &amp; STATIONARY</span>
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
            <div className="clean-card-icon-box diesel">
              <Flame size={28} />
            </div>
            <div className="clean-card-body">
              <span className="clean-card-tag diesel">MOBILE &amp; FIELD TRAILER</span>
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

      {/* Section 2: Four Clean Compact Brand Cards */}
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
                <Gauge size={22} />
              </div>
              <span className="clean-brand-warranty">5-Yr Warranty</span>
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
                <Shield size={22} />
              </div>
              <span className="clean-brand-warranty">10-Yr Air-End</span>
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
                <Cpu size={22} />
              </div>
              <span className="clean-brand-warranty">5-Yr Package</span>
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
                <Sparkles size={22} />
              </div>
              <span className="clean-brand-warranty">5-Yr Air-End</span>
            </div>
            <h4 className="clean-brand-name">DENAIR</h4>
            <span className="clean-brand-sub">Dual-Stage German Tech</span>
            <div className="clean-brand-cta">
              <span>Get Quote</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Optional Discreet Fleet Accordion */}
      <section className="container" style={{ marginTop: '48px', marginBottom: '60px' }}>
        <div className="clean-fleet-accordion-bar">
          <div className="fleet-bar-left">
            <h4 className="fleet-bar-title">View Certified Fleet Specifications</h4>
            <p className="fleet-bar-desc">Inspect matching units currently stationed in our Lagos and Port Harcourt yards.</p>
          </div>
          <button
            type="button"
            className="clean-fleet-toggle-btn"
            onClick={() => setShowCatalog(!showCatalog)}
          >
            <span>{showCatalog ? 'Hide Fleet' : 'Browse Inventory'}</span>
            <ChevronRight
              size={16}
              style={{
                transform: showCatalog ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        {showCatalog && (
          <div className="clean-fleet-grid-wrap cq-fade-in" style={{ marginTop: '20px' }}>
            <div className="equip-products-grid">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="equip-product-card">
                  <div className="equip-card-image-wrap">
                    <img src={p.image} alt={p.title} className="equip-card-img" />
                    {p.badge && (
                      <span className={`equip-card-badge badge-${p.badgeType}`}>
                        {p.badge}
                      </span>
                    )}
                    <span className="equip-card-driven-tag">
                      {p.driven === 'Electric' ? <Zap size={12} /> : <Flame size={12} />}
                      <span>{p.driven}</span>
                    </span>
                  </div>
                  <div className="equip-card-body">
                    <div className="equip-card-meta">
                      <span className="equip-card-brand">{p.brand}</span>
                      <span className="equip-card-category">{p.category}</span>
                    </div>
                    <h4 className="equip-card-title">{p.title}</h4>
                    <div className="equip-card-specs">
                      {p.specs.map((s, idx) => (
                        <div key={idx} className="equip-card-spec-item">
                          <span>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="equip-card-footer">
                      <button
                        className="equip-btn-quote"
                        onClick={() => {
                          const matchedType = p.driven === 'Electric' ? 'ELECTRIC AIR COMPRESSOR' : 'DIESEL AIR COMPRESSOR';
                          const upperBrand = p.brand.toUpperCase();
                          let brandId: CompressorBrand = 'ATLAS COPCO';
                          if (upperBrand.includes('ATLAS')) brandId = 'ATLAS COPCO';
                          else if (upperBrand.includes('SULLAIR')) brandId = 'SULLAIR';
                          else if (upperBrand.includes('INGERSOLL')) brandId = 'INGERSOLL RAND';
                          else if (upperBrand.includes('DENAIR')) brandId = 'DENAIR';
                          handleOpenModal(matchedType, brandId);
                        }}
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { HelpCircle, ShoppingCart, ArrowRight, Droplets, Sparkles } from 'lucide-react';
import LubricantsQuoteModal, {
  type LubricantBrand,
  BRAND_LUBRICANTS
} from '../components/LubricantsQuoteModal';
import { BrandLogo } from '../components/BrandLogo';
import { useInquiry } from '../context/InquiryContext';
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
  const [activeCatalogBrand, setActiveCatalogBrand] = useState<LubricantBrand>(initialBrand || 'ATLAS COPCO');

  const { addToInquiry, isInInquiry } = useInquiry();

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      setActiveCatalogBrand(initialBrand);
      setModalOpen(true);
    }
  }, [initialBrand]);

  const handleOpenBrandModal = (brand: LubricantBrand, fluid?: string) => {
    setSelectedBrand(brand);
    setSelectedFluid(fluid || null);
    setModalOpen(true);
  };

  const handleAddToCart = (brand: LubricantBrand, fluidName: string) => {
    const itemId = `lub-${brand.toLowerCase().replace(/\s+/g, '-')}-${fluidName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    addToInquiry({
      id: itemId,
      title: `${brand === 'OTHERS' ? '' : brand + ' '}${fluidName}`,
      category: 'Lubricants',
      type: 'part',
      brand: brand,
      specSummary: 'Packaging: 20L Pail / 209L Drum • Factory Certified Lubricant',
    });
  };

  const activeConfig = BRAND_LUBRICANTS[activeCatalogBrand];

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

      {/* Brand Selection Overview */}
      <section className="container lub-brands-section">
        <div className="lub-section-head">
          <span className="lub-sub-tag">OEM MANUFACTURER SELECTION</span>
          <h2 className="lub-main-title">Certified OEM Lubricant Brands</h2>
          <p className="lub-main-desc">
            Select an equipment manufacturer below to explore certified synthetic formulations, view available packaging, or request formal corporate pricing.
          </p>
        </div>

        {/* 5 Brand Cards in clean layout */}
        <div className="lub-brands-grid-5">
          {BRANDS_LIST.map((brand) => {
            const isSelected = activeCatalogBrand === brand.id;
            return (
              <div
                key={brand.id}
                className={`lub-brand-card ${isSelected ? 'active-brand-card' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCatalogBrand(brand.id)}
              >
                <div className="lub-brand-top-row">
                  <span className="lub-brand-badge">{brand.badge}</span>
                </div>
                <div className="lub-brand-icon-wrap" onClick={(e) => { e.stopPropagation(); setActiveCatalogBrand(brand.id); }}>
                  {brand.id === 'OTHERS' ? (
                    <HelpCircle size={28} color="#64748b" />
                  ) : (
                    <BrandLogo brand={brand.id} size="md" />
                  )}
                </div>
                <span className="lub-brand-label">{brand.name}</span>
                <p className="lub-brand-snippet">{brand.desc}</p>

                <div className="lub-brand-card-actions">
                  <button
                    className="lub-brand-quote-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBrandModal(brand.id);
                    }}
                  >
                    <span>Request Quote</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    className="lub-brand-explore-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCatalogBrand(brand.id);
                    }}
                  >
                    <span>View Formulations</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Certified Fluids Catalog */}
      <section className="lub-catalog-section">
        <div className="container">
          <div className="lub-catalog-header">
            <div>
              <span className="lub-sub-tag">CERTIFIED FLUID FORMULATIONS</span>
              <h2 className="lub-catalog-title">
                {activeCatalogBrand === 'OTHERS' ? 'Universal & Custom' : activeCatalogBrand} Fluids Catalog
              </h2>
              <p className="lub-catalog-desc">
                {activeConfig?.tagline || 'Factory-tested synthetic fluids for guaranteed operational life and thermal stability.'}
              </p>
            </div>

            {/* Quick Brand Switcher Tabs */}
            <div className="lub-tabs-bar">
              {BRANDS_LIST.map((b) => (
                <button
                  key={b.id}
                  className={`lub-tab-pill ${activeCatalogBrand === b.id ? 'active' : ''}`}
                  onClick={() => setActiveCatalogBrand(b.id)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grouped Fluids Lists */}
          <div className="lub-groups-container">
            {activeConfig?.groups.map((group, gIdx) => (
              <div key={gIdx} className="lub-fluid-group-card">
                <div className="lub-group-header">
                  <div className="lub-group-title-wrap">
                    <Droplets size={18} className="lub-group-icon" />
                    <h3 className="lub-group-heading">{group.group || 'Available Formulations'}</h3>
                  </div>
                  <span className="lub-group-count">{group.items.length} Options</span>
                </div>

                <div className="lub-fluids-grid">
                  {group.items.map((item, iIdx) => {
                    const isOther = item.includes('Other') || item.includes('Specify');
                    const isFoodGrade = item.includes('Food Grade') || item.includes('FG');
                    const itemId = `lub-${activeCatalogBrand.toLowerCase().replace(/\s+/g, '-')}-${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    const inCart = isInInquiry(itemId);

                    return (
                      <div key={iIdx} className={`lub-item-card ${isFoodGrade ? 'food-grade-card' : ''}`}>
                        <div className="lub-item-header">
                          <div className="lub-item-badge-row">
                            {isFoodGrade ? (
                              <span className="lub-item-badge food-grade">H1 FOOD GRADE CERTIFIED</span>
                            ) : isOther ? (
                              <span className="lub-item-badge custom">CUSTOM FORMULATION</span>
                            ) : (
                              <span className="lub-item-badge factory">OEM FACTORY RATED</span>
                            )}
                          </div>
                          <h4 className="lub-item-name">{item}</h4>
                          <p className="lub-item-sub">
                            {isFoodGrade
                              ? 'NSF H1 registered non-toxic synthetic lubricant for food packaging & pharma processing lines.'
                              : isOther
                              ? 'Specify your OEM part number, viscosity grade (ISO VG 32/46/68), or operating temperature range.'
                              : 'High-thermal stability synthetic rotary compressor fluid. Extended 4,000h – 8,000h operating life.'}
                          </p>
                        </div>

                        <div className="lub-item-specs-bar">
                          <span className="lub-spec-chip">20L Pail</span>
                          <span className="lub-spec-chip">209L Drum</span>
                          <span className="lub-spec-chip">1,000L Tote</span>
                        </div>

                        <div className="lub-item-actions">
                          <button
                            type="button"
                            className="lub-item-quote-btn"
                            onClick={() => handleOpenBrandModal(activeCatalogBrand, item)}
                          >
                            <span>Request Quote</span>
                            <ArrowRight size={14} />
                          </button>
                          {!isOther && (
                            <button
                              type="button"
                              className={`lub-item-cart-btn ${inCart ? 'in-cart' : ''}`}
                              onClick={() => handleAddToCart(activeCatalogBrand, item)}
                              title={inCart ? 'In Yard Cart' : 'Add to Yard Cart'}
                            >
                              <ShoppingCart size={14} />
                              <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sourcing / Assistance Footer */}
          <div className="lub-support-banner">
            <div className="lub-support-text">
              <Sparkles size={22} className="lub-sparkle-icon" />
              <div>
                <h4>Require MSDS, Certificate of Analysis (COA), or Oil Sample Testing?</h4>
                <p>
                  Mandtech engineers provide fluid lab analysis, viscosity verification, and scheduled oil sampling for industrial facilities across Port Harcourt, Lagos, and Abuja.
                </p>
              </div>
            </div>
            <button
              className="lub-btn-support"
              onClick={() => handleOpenBrandModal(activeCatalogBrand, 'Special Lubricant Request')}
            >
              Contact Fluid Specialist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AfterSalesPage;

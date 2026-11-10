import React, { useState, useEffect } from 'react';
import {
  HelpCircle, ShoppingCart, ArrowRight, Droplets, Sparkles,
  CheckSquare, Square, CheckCircle2
} from 'lucide-react';
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
  const [selectedFluidsForQuote, setSelectedFluidsForQuote] = useState<string[]>([]);
  const [activeCatalogBrand, setActiveCatalogBrand] = useState<LubricantBrand>(initialBrand || 'ATLAS COPCO');

  // Multi-selection state for current brand catalog
  const [selectedFluids, setSelectedFluids] = useState<string[]>([]);
  const [bulkCartNotice, setBulkCartNotice] = useState<string | null>(null);

  const { addToInquiry, isInInquiry } = useInquiry();

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      setActiveCatalogBrand(initialBrand);
      setModalOpen(true);
    }
  }, [initialBrand]);

  // Reset selected fluids when switching brand tab
  const handleTabSwitch = (brand: LubricantBrand) => {
    setActiveCatalogBrand(brand);
    setSelectedFluids([]);
    setBulkCartNotice(null);
  };

  const handleOpenBrandModal = (brand: LubricantBrand, fluid?: string) => {
    setSelectedBrand(brand);
    setSelectedFluid(fluid || null);
    setSelectedFluidsForQuote(fluid ? [fluid] : []);
    setModalOpen(true);
  };

  const handleOpenMultiQuoteModal = (brand: LubricantBrand) => {
    if (selectedFluids.length === 0) return;
    setSelectedBrand(brand);
    setSelectedFluid(null);
    setSelectedFluidsForQuote(selectedFluids);
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

  // Toggle single fluid selection
  const handleToggleSelectFluid = (fluidName: string) => {
    setSelectedFluids((prev) =>
      prev.includes(fluidName)
        ? prev.filter((f) => f !== fluidName)
        : [...prev, fluidName]
    );
  };

  // Select all / deselect all for active brand
  const activeConfig = BRAND_LUBRICANTS[activeCatalogBrand];
  const allBrandItems = activeConfig
    ? activeConfig.groups.flatMap((g) => g.items.filter((item) => !item.includes('Other')))
    : [];
  const areAllBrandItemsSelected =
    allBrandItems.length > 0 && allBrandItems.every((item) => selectedFluids.includes(item));

  const handleToggleSelectAll = () => {
    if (areAllBrandItemsSelected) {
      setSelectedFluids([]);
    } else {
      setSelectedFluids(allBrandItems);
    }
  };

  // Bulk Add to Cart
  const handleBulkAddToCart = () => {
    if (selectedFluids.length === 0) return;
    selectedFluids.forEach((fluidName) => {
      handleAddToCart(activeCatalogBrand, fluidName);
    });
    setBulkCartNotice(`Successfully added ${selectedFluids.length} formulation(s) to your Yard Cart!`);
    setTimeout(() => setBulkCartNotice(null), 3500);
  };

  return (
    <div className="lub-page">
      {/* Modal */}
      <LubricantsQuoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedFluid(null);
          setSelectedFluidsForQuote([]);
        }}
        initialBrand={selectedBrand}
        initialFluid={selectedFluid}
        initialFluids={selectedFluidsForQuote}
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
                onClick={() => handleTabSwitch(brand.id)}
              >
                <div className="lub-brand-top-row">
                  <span className="lub-brand-badge">{brand.badge}</span>
                </div>
                <div className="lub-brand-icon-wrap" onClick={(e) => { e.stopPropagation(); handleTabSwitch(brand.id); }}>
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
                      handleTabSwitch(brand.id);
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

      {/* Interactive Certified Fluids List & Multi-Select Catalog */}
      <section className="lub-catalog-section">
        <div className="container">
          <div className="lub-catalog-header">
            <div>
              <span className="lub-sub-tag">CERTIFIED FLUID FORMULATIONS</span>
              <h2 className="lub-catalog-title">
                {activeCatalogBrand === 'OTHERS' ? 'Universal & Custom' : activeCatalogBrand} Fluids List
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
                  onClick={() => handleTabSwitch(b.id)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky / Dedicated Multi-Selection Action Toolbar */}
          <div className="lub-page-list-toolbar">
            <div className="lub-plt-left">
              <button
                type="button"
                className="lub-plt-select-all"
                onClick={handleToggleSelectAll}
              >
                {areAllBrandItemsSelected ? (
                  <CheckSquare size={17} className="text-green-600" />
                ) : (
                  <Square size={17} className="text-gray-400" />
                )}
                <span>
                  {areAllBrandItemsSelected
                    ? 'Deselect All'
                    : `Select All Formulations (${allBrandItems.length})`}
                </span>
              </button>
              {selectedFluids.length > 0 && (
                <span className="lub-plt-counter">
                  <strong>{selectedFluids.length}</strong> formulation{selectedFluids.length === 1 ? '' : 's'} selected
                </span>
              )}
            </div>

            <div className="lub-plt-right">
              <button
                type="button"
                className="lub-plt-cart-btn"
                disabled={selectedFluids.length === 0}
                onClick={handleBulkAddToCart}
                title="Add all checked fluids to your Yard Cart"
              >
                <ShoppingCart size={15} />
                <span>Add Selected to Cart ({selectedFluids.length})</span>
              </button>

              <button
                type="button"
                className="lub-plt-quote-btn"
                disabled={selectedFluids.length === 0}
                onClick={() => handleOpenMultiQuoteModal(activeCatalogBrand)}
                title="Request official corporate quote for all selected formulations"
              >
                <span>Request Quote for Selected ({selectedFluids.length})</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Cart Feedback Toast Banner */}
          {bulkCartNotice && (
            <div className="lub-cart-toast-banner" style={{ marginBottom: '18px' }}>
              <CheckCircle2 size={17} color="#15803d" />
              <span>{bulkCartNotice}</span>
            </div>
          )}

          {/* Smooth Item List by Category */}
          <div className="lub-list-container">
            {activeConfig?.groups.map((group, gIdx) => (
              <div key={gIdx} className="lub-list-group-block">
                <div className="lub-group-title-row">
                  <div className="lub-group-title-left">
                    <Droplets size={17} className="lub-group-droplet" />
                    <h3 className="lub-group-heading-text">{group.group || 'Available Formulations'}</h3>
                  </div>
                  <span className="lub-group-items-badge">{group.items.length} Formulations</span>
                </div>

                <div className="lub-list-table">
                  {group.items.map((item, iIdx) => {
                    const isOther = item.includes('Other') || item.includes('Specify');
                    const isFoodGrade = item.includes('Food Grade') || item.includes('FG');
                    const isChecked = selectedFluids.includes(item);
                    const itemId = `lub-${activeCatalogBrand.toLowerCase().replace(/\s+/g, '-')}-${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    const inCart = isInInquiry(itemId);

                    return (
                      <div
                        key={iIdx}
                        className={`lub-table-row ${isChecked ? 'row-is-selected' : ''} ${isFoodGrade ? 'row-is-food-grade' : ''}`}
                        onClick={() => {
                          if (!isOther) handleToggleSelectFluid(item);
                        }}
                      >
                        {/* Checkbox column */}
                        <div className="lub-col-check" onClick={(e) => e.stopPropagation()}>
                          {!isOther ? (
                            <button
                              type="button"
                              className="lub-row-check-btn"
                              onClick={() => handleToggleSelectFluid(item)}
                              aria-label={`Select ${item}`}
                            >
                              {isChecked ? (
                                <CheckSquare size={19} className="check-box-active" />
                              ) : (
                                <Square size={19} className="check-box-idle" />
                              )}
                            </button>
                          ) : (
                            <span className="lub-custom-bullet">•</span>
                          )}
                        </div>

                        {/* S/N or Index */}
                        <div className="lub-col-num">
                          <span>{String(iIdx + 1).padStart(2, '0')}</span>
                        </div>

                        {/* Fluid Info & Badges */}
                        <div className="lub-col-info">
                          <div className="lub-col-name-row">
                            <span className="lub-fluid-title">{item}</span>
                            {isFoodGrade ? (
                              <span className="lub-badge-tag food-grade">H1 FOOD GRADE</span>
                            ) : isOther ? (
                              <span className="lub-badge-tag custom">CUSTOM SPECIFICATION</span>
                            ) : (
                              <span className="lub-badge-tag factory">FACTORY CERTIFIED</span>
                            )}
                          </div>
                          <p className="lub-fluid-desc">
                            {isFoodGrade
                              ? 'NSF H1 non-toxic synthetic lubricant engineered for food, beverage & pharmaceutical plants.'
                              : isOther
                              ? 'Specify custom viscosity grade, high-pressure rating, or OEM cross-reference part number.'
                              : 'High thermal-stability synthetic rotary screw fluid. Formulated for extended 4,000h – 8,000h drain intervals.'}
                          </p>
                        </div>

                        {/* Packaging options */}
                        <div className="lub-col-packaging">
                          <span className="lub-pack-chip">20L Pail</span>
                          <span className="lub-pack-chip">209L Drum</span>
                          <span className="lub-pack-chip">1,000L Tote</span>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="lub-col-actions" onClick={(e) => e.stopPropagation()}>
                          {!isOther && (
                            <button
                              type="button"
                              className={`lub-row-cart-btn ${inCart ? 'in-cart' : ''}`}
                              onClick={() => handleAddToCart(activeCatalogBrand, item)}
                              title={inCart ? 'Item in Yard Cart' : 'Add formulation to Yard Cart'}
                            >
                              <ShoppingCart size={14} />
                              <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="lub-row-quote-btn"
                            onClick={() => handleOpenBrandModal(activeCatalogBrand, item)}
                            title="Request quotation for this formulation"
                          >
                            <span>Quote</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sourcing / Technical Lab Testing Banner */}
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

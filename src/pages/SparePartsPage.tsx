import { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, ShieldCheck,
  CheckCircle2, Clock, Check
} from 'lucide-react';
import SparePartsQuoteModal, {
  type SparePartsBrand,
  BRANDS_DATA,
  SPARE_PARTS_LIST,
} from '../components/SparePartsQuoteModal';
import './SparePartsPage.css';
import compressorHero from '../assets/compressor_hero.jpg';

interface SparePartsPageProps {
  initialBrand?: SparePartsBrand | null;
}

export default function SparePartsPage({ initialBrand }: SparePartsPageProps) {
  const [selectedBrand, setSelectedBrand] = useState<SparePartsBrand>(initialBrand || 'ATLAS COPCO');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBrand, setModalBrand] = useState<SparePartsBrand | null>(null);
  const [modalPart, setModalPart] = useState<string | null>(null);

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
    }
  }, [initialBrand]);

  const handleOpenModal = (brand?: SparePartsBrand, part?: string) => {
    setModalBrand(brand || selectedBrand);
    setModalPart(part || null);
    setModalOpen(true);
  };

  return (
    <div className="spare-parts-page">
      {/* Embedded Quote Modal */}
      <SparePartsQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBrand={modalBrand}
        initialPart={modalPart}
      />

      {/* Hero Header */}
      <section className="sp-hero-section">
        <img src={compressorHero} alt="Industrial Spare Parts" className="sp-hero-bg-img" />
        <div className="sp-hero-overlay" />
        <div className="container sp-hero-content">
          <div className="sp-hero-badge">
            <Sparkles size={13} />
            <span>OEM CERTIFIED COMPRESSOR COMPONENTS</span>
          </div>
          <h1 className="sp-hero-title">Industrial Spare Parts & Consumables</h1>
          <p className="sp-hero-subtitle">
            Direct OEM replacement parts, filtration elements, precision valves, and scheduled overhaul kits
            for Atlas Copco, Sullair, Ingersoll Rand, and Denair compressors across Nigeria.
          </p>
          <div className="sp-hero-action">
            <button
              type="button"
              className="sp-btn-hero-primary"
              onClick={() => handleOpenModal()}
            >
              <span>REQUEST PARTS QUOTATION</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Brand Selection */}
      <section className="container sp-page-section">
        <div className="sp-section-header">
          <div className="sp-section-tag">STEP 1: SELECT MANUFACTURER</div>
          <h2 className="sp-section-title">Authorized OEM Brands</h2>
          <p className="sp-section-subtitle">
            Choose a manufacturer brand to browse certified replacement parts or request immediate technical sourcing
          </p>
        </div>

        <div className="sp-page-brands-grid">
          {BRANDS_DATA.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <div
                key={brand.id}
                className={`sp-page-brand-card ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedBrand(brand.id)}
                role="button"
                tabIndex={0}
              >
                <div className="sp-pbc-header">
                  <div className="sp-pbc-icon-box">{brand.icon}</div>
                  <span className="sp-pbc-origin">{brand.origin}</span>
                </div>
                <h3 className="sp-pbc-name">{brand.name}</h3>
                <p className="sp-pbc-badge">{brand.badge}</p>
                <div className="sp-pbc-footer">
                  {isSelected ? (
                    <span className="sp-pbc-active-tag">
                      <Check size={14} />
                      Active Brand
                    </span>
                  ) : (
                    <span className="sp-pbc-click-tag">Select Brand</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: 14 Parts Catalog for the selected brand */}
      <section className="container sp-page-section sp-parts-list-section">
        <div className="sp-section-header-split">
          <div>
            <div className="sp-section-tag">STEP 2: CHOOSE SPARE COMPONENT</div>
            <h2 className="sp-section-title">
              {selectedBrand} — Certified Parts Catalog
            </h2>
            <p className="sp-section-subtitle">
              Click any component below to open the quotation request form
            </p>
          </div>
          <button
            type="button"
            className="sp-btn-quick-quote"
            onClick={() => handleOpenModal(selectedBrand)}
          >
            <span>Quote Multiple Parts</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="sp-page-parts-grid">
          {SPARE_PARTS_LIST.map((part) => (
            <div
              key={part.id}
              className="sp-page-part-card"
              onClick={() => handleOpenModal(selectedBrand, part.id)}
              role="button"
              tabIndex={0}
            >
              <div className="sp-ppc-top">
                <span className="sp-ppc-numeral">{part.numeral}</span>
                <span className="sp-ppc-brand-tag">{selectedBrand}</span>
              </div>
              <div className="sp-ppc-icon">{part.icon}</div>
              <h4 className="sp-ppc-name">{part.name}</h4>
              <p className="sp-ppc-desc">{part.desc}</p>
              <div className="sp-ppc-action">
                <span>Request Quote</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="container sp-page-section">
        <div className="sp-guarantee-banner">
          <div className="sp-gb-item">
            <ShieldCheck size={26} className="text-orange" />
            <div>
              <h4 className="sp-gb-title">100% OEM Guaranteed</h4>
              <p className="sp-gb-desc">Genuine manufacturer factory tolerances and warranties.</p>
            </div>
          </div>
          <div className="sp-gb-item">
            <Clock size={26} className="text-orange" />
            <div>
              <h4 className="sp-gb-title">Rapid Nigerian Dispatch</h4>
              <p className="sp-gb-desc">Stocked items dispatched within 24 hours to industrial sites.</p>
            </div>
          </div>
          <div className="sp-gb-item">
            <CheckCircle2 size={26} className="text-orange" />
            <div>
              <h4 className="sp-gb-title">Technical Clearance</h4>
              <p className="sp-gb-desc">Assistance verifying exact part numbers against serial IDs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

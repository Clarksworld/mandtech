import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Wrench, Shield, Cpu, Gauge
} from 'lucide-react';
import SparePartsQuoteModal, {
  type SparePartsBrand,
} from '../components/SparePartsQuoteModal';
import './SparePartsPage.css';
import compressorHero from '../assets/compressor_hero.jpg';

interface SparePartsPageProps {
  initialBrand?: SparePartsBrand | null;
}

interface BrandCardInfo {
  id: SparePartsBrand;
  name: string;
  series: string;
  desc: string;
  icon: React.ReactNode;
}

const BRANDS_LIST: BrandCardInfo[] = [
  {
    id: 'ATLAS COPCO',
    name: 'ATLAS COPCO',
    series: 'GA • GX • VSD+ SERIES',
    desc: 'OEM air & oil filters, separator elements, minimum pressure valves, and Elektronikon controllers.',
    icon: <Gauge size={24} />,
  },
  {
    id: 'SULLAIR',
    name: 'SULLAIR',
    series: 'PORTABLE & STATIONARY SCREW',
    desc: 'Genuine Sullube synthetic fluids, intake unloader assemblies, check valves, and air-end kits.',
    icon: <Shield size={24} />,
  },
  {
    id: 'INGERSOLL RAND',
    name: 'INGERSOLL RAND',
    series: 'SSR • NIRVANA • SIERRA',
    desc: 'Ultra Coolant lubricants, thermo-control bypass valves, sensor transducers, and overhaul kits.',
    icon: <Cpu size={24} />,
  },
  {
    id: 'DENAIR',
    name: 'DENAIR',
    series: 'DUAL-STAGE ROTARY UNITS',
    desc: 'High-pressure filter elements, cooling fans, aluminum radiators, and microprocessor boards.',
    icon: <Wrench size={24} />,
  },
];

export default function SparePartsPage({ initialBrand }: SparePartsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<SparePartsBrand | null>(initialBrand || null);

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
      setModalOpen(true);
    }
  }, [initialBrand]);

  const handleOpenBrandModal = (brand: SparePartsBrand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const handleOpenGenericModal = () => {
    setSelectedBrand(null);
    setModalOpen(true);
  };

  return (
    <div className="sp-clean-page">
      {/* Embedded Quote Modal */}
      <SparePartsQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBrand={selectedBrand}
      />

      {/* Hero Header with Bigger, Authoritative Image */}
      <section className="sp-hero-wrap">
        <img
          src={compressorHero}
          alt="Mandtech Industrial Compressor Spare Parts"
          className="sp-hero-image"
        />
        <div className="sp-hero-shade" />

        <div className="container sp-hero-inner">
          <div className="sp-hero-badge">
            OEM CERTIFIED INDUSTRIAL SPARES
          </div>
          <h1 className="sp-hero-heading">
            Compressor Spare Parts &amp; Consumables
          </h1>
          <p className="sp-hero-lead">
            Certified factory-grade replacement components, filtration elements, precision valve kits,
            and scheduled service consumables for Nigeria’s leading industrial operations.
          </p>
          <div className="sp-hero-cta-row">
            <button
              type="button"
              className="sp-btn-brand-primary"
              onClick={handleOpenGenericModal}
            >
              <span>REQUEST A PARTS QUOTATION</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Section: Only The 4 Brand Options */}
      <section className="container sp-brands-section">
        <div className="sp-section-heading-box">
          <span className="sp-sub-tag">SELECT EQUIPMENT MANUFACTURER</span>
          <h2 className="sp-main-title">Authorized OEM Brands</h2>
          <p className="sp-main-desc">
            Select your compressor manufacturer to view certified components and request an official quotation.
          </p>
        </div>

        {/* Exactly 4 Brand Options */}
        <div className="sp-four-brands-grid">
          {BRANDS_LIST.map((brand) => (
            <div
              key={brand.id}
              className="sp-brand-option-card"
              onClick={() => handleOpenBrandModal(brand.id)}
              role="button"
              tabIndex={0}
            >
              <div className="sp-boc-header">
                <div className="sp-boc-icon">
                  {brand.icon}
                </div>
                <span className="sp-boc-series">{brand.series}</span>
              </div>

              <h3 className="sp-boc-name">{brand.name}</h3>
              <p className="sp-boc-desc">{brand.desc}</p>

              <div className="sp-boc-action">
                <span>Configure &amp; Request Quote</span>
                <ArrowRight size={16} className="sp-boc-arrow" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

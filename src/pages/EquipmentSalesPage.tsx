import React, { useState, useMemo } from 'react';
import {
  Sliders, Zap, Shield, ChevronDown, Check, X,
  Phone, ChevronLeft, ChevronRight, Activity, Settings, Download
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import './EquipmentSalesPage.css';

// Assets
import catalogBg from '../assets/catalog_bg.png';
import catalogBg1 from '../assets/catalog_bg1.png';
import catalogBg2 from '../assets/catalog_bg2.png';
import highCapacity from '../assets/high_capacity.png';
import industrialGenerator from '../assets/industrial_generator.png';
import portableUnit from '../assets/portable_unit.png';

const CATEGORIES = ['Air Compressors', 'Generators', 'Pumps', 'Air Dryers'];
const BRANDS = ['Atlas Copco', 'Ingersoll Rand', 'Sullair', 'Kaeser'];
const DRIVEN_TYPES = ['Electric', 'Diesel Driven'];

interface ProductItem {
  id: number;
  title: string;
  category: string;
  brand: string;
  image: string;
  badge?: string;
  badgeType: 'in-stock' | 'featured';
  specs: { icon: React.ReactNode; label: string }[];
  capacity: number;
  driven: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: 'Sullair 185 Series',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '185 CFM Capacity' },
      { icon: <Zap size={14} />, label: 'Diesel Driven Engine' },
      { icon: <Shield size={14} />, label: 'Heavy-Duty Frame' },
    ],
    capacity: 185,
    driven: 'Diesel Driven',
  },
  {
    id: 2,
    title: 'Electric Power Dry E-40',
    category: 'Air Dryers',
    brand: 'Kaeser',
    image: catalogBg1,
    badge: undefined,
    badgeType: 'in-stock',
    specs: [
      { icon: <Zap size={14} />, label: 'Electric Driven 400V' },
      { icon: <Activity size={14} />, label: '40 CFM Low Noise' },
      { icon: <Shield size={14} />, label: 'Zero Emissions' },
    ],
    capacity: 40,
    driven: 'Electric',
  },
  {
    id: 3,
    title: 'Mandtech Titan X-120',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: portableUnit,
    badge: 'FEATURED',
    badgeType: 'featured',
    specs: [
      { icon: <Activity size={14} />, label: '120 CFM, Diesel Driven' },
      { icon: <Settings size={14} />, label: 'Site-Ready Portable' },
      { icon: <Shield size={14} />, label: 'Extended Runtime' },
    ],
    capacity: 120,
    driven: 'Diesel Driven',
  },
  {
    id: 4,
    title: 'High-Capacity Pump V9',
    category: 'Pumps',
    brand: 'Ingersoll Rand',
    image: highCapacity,
    badge: undefined,
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '900 GPM Flow Rate' },
      { icon: <Settings size={14} />, label: 'Corrosion Resistant' },
      { icon: <Zap size={14} />, label: 'High Torque Diesel' },
    ],
    capacity: 900,
    driven: 'Diesel Driven',
  },
  {
    id: 5,
    title: 'Sullair 375 Tier 4',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg2,
    badge: undefined,
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '375 CFM Capacity' },
      { icon: <Shield size={14} />, label: 'Emission Compliant' },
      { icon: <Settings size={14} />, label: 'Smart Monitoring' },
    ],
    capacity: 375,
    driven: 'Diesel Driven',
  },
  {
    id: 6,
    title: 'DryLine Industrial S',
    category: 'Air Dryers',
    brand: 'Atlas Copco',
    image: industrialGenerator,
    badge: undefined,
    badgeType: 'in-stock',
    specs: [
      { icon: <Shield size={14} />, label: 'Desiccant Drying' },
      { icon: <Zap size={14} />, label: 'Electric 230V/400V' },
      { icon: <Activity size={14} />, label: 'Variable Flow Rate' },
    ],
    capacity: 600,
    driven: 'Electric',
  },
  {
    id: 7,
    title: 'Atlas Copco GA-160',
    category: 'Air Compressors',
    brand: 'Atlas Copco',
    image: catalogBg,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '160 kW Rotary Screw' },
      { icon: <Zap size={14} />, label: 'Variable Speed Electric' },
      { icon: <Shield size={14} />, label: 'Remote Monitoring' },
    ],
    capacity: 800,
    driven: 'Electric',
  },
  {
    id: 8,
    title: 'Prime Power 500 kVA',
    category: 'Generators',
    brand: 'Ingersoll Rand',
    image: highCapacity,
    badge: undefined,
    badgeType: 'in-stock',
    specs: [
      { icon: <Zap size={14} />, label: '500 kVA Prime Output' },
      { icon: <Activity size={14} />, label: 'Low-Consumption Diesel' },
      { icon: <Shield size={14} />, label: 'Sound-Attenuated Shell' },
    ],
    capacity: 500,
    driven: 'Diesel Driven',
  },
  {
    id: 9,
    title: 'Atlas Copco QAS 250 Generator',
    category: 'Generators',
    brand: 'Atlas Copco',
    image: industrialGenerator,
    badge: 'FEATURED',
    badgeType: 'featured',
    specs: [
      { icon: <Zap size={14} />, label: '250 kVA Multi-Voltage' },
      { icon: <Activity size={14} />, label: 'Spillage-Free Frame' },
      { icon: <Shield size={14} />, label: 'Dual Frequency 50/60Hz' },
    ],
    capacity: 250,
    driven: 'Diesel Driven',
  },
  {
    id: 10,
    title: 'Kaeser M125 Portable Unit',
    category: 'Air Compressors',
    brand: 'Kaeser',
    image: portableUnit,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '405 CFM Flow' },
      { icon: <Settings size={14} />, label: 'Sigma Profile Rotor' },
      { icon: <Shield size={14} />, label: 'Anti-Frost Control' },
    ],
    capacity: 405,
    driven: 'Diesel Driven',
  },
  {
    id: 11,
    title: 'Ingersoll Rand Submersible 600',
    category: 'Pumps',
    brand: 'Ingersoll Rand',
    image: catalogBg1,
    badge: undefined,
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '600 GPM High Head' },
      { icon: <Zap size={14} />, label: 'Electric Heavy Duty' },
      { icon: <Shield size={14} />, label: 'Dry-Run Protection' },
    ],
    capacity: 600,
    driven: 'Electric',
  },
  {
    id: 12,
    title: 'Sullair Refrigerated Dryer SR-200',
    category: 'Air Dryers',
    brand: 'Sullair',
    image: catalogBg2,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Shield size={14} />, label: 'ISO Class 4 Pressure Dewpoint' },
      { icon: <Zap size={14} />, label: 'Low Pressure Drop' },
      { icon: <Activity size={14} />, label: '200 CFM Rating' },
    ],
    capacity: 200,
    driven: 'Electric',
  },
];

interface EquipCardProps {
  title: string;
  image: string;
  badge?: string;
  badgeType: 'in-stock' | 'featured';
  specs: { icon: React.ReactNode; label: string }[];
  inInquiry: boolean;
  onQuote: () => void;
}

const EquipCard: React.FC<EquipCardProps> = ({ title, image, badge, badgeType, specs, inInquiry, onQuote }) => (
  <div className="equip-card">
    <div className="equip-card-image-wrapper">
      <img src={image} alt={title} className="equip-card-image" />
      {badge && (
        <div className={`equip-badge equip-badge-${badgeType}`}>
          {badgeType === 'in-stock' && <span className="equip-stock-dot" />}
          {badge}
        </div>
      )}
    </div>
    <div className="equip-card-body">
      <h3 className="equip-card-title">{title}</h3>
      <div className="equip-specs">
        {specs.map((s, i) => (
          <div key={i} className="equip-spec-row">
            <span className="equip-spec-icon">{s.icon}</span>
            <span className="equip-spec-label">{s.label}</span>
          </div>
        ))}
      </div>
      <button
        className="equip-quote-btn"
        onClick={onQuote}
        style={{
          background: inInquiry ? 'var(--deep-charcoal)' : 'var(--primary-container)',
          borderColor: inInquiry ? 'var(--deep-charcoal)' : 'var(--primary-container)'
        }}
      >
        {inInquiry ? '✓ In Inquiry Ticket' : 'Request a Quote'}
      </button>
    </div>
  </div>
);

export default function EquipmentSalesPage() {
  const [activeCategory, setActiveCategory] = useState('Air Compressors');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDriven, setSelectedDriven] = useState<string[]>([]);
  const [capacityRange, setCapacityRange] = useState(2000);
  const [sortBy, setSortBy] = useState('capacity-desc');
  const [quoteMsg, setQuoteMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConsultModal, setShowConsultModal] = useState(false);

  const { addToInquiry, isInInquiry } = useInquiry();

  const ITEMS_PER_PAGE = 6;

  const filterKey = `${activeCategory}-${selectedBrands.join(',')}-${selectedDriven.join(',')}-${capacityRange}-${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const toggleBrand = (b: string) =>
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const toggleDriven = (d: string) =>
    setSelectedDriven(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedDriven([]);
    setCapacityRange(2000);
  };

  const filtered = useMemo(() => {
    const result = PRODUCTS.filter(p => {
      const matchCat = p.category === activeCategory;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchDriven = selectedDriven.length === 0 || selectedDriven.includes(p.driven);
      const matchCap = p.capacity <= capacityRange;
      return matchCat && matchBrand && matchDriven && matchCap;
    });
    if (sortBy === 'capacity-desc') result.sort((a, b) => b.capacity - a.capacity);
    else if (sortBy === 'capacity-asc') result.sort((a, b) => a.capacity - b.capacity);
    return result;
  }, [activeCategory, selectedBrands, selectedDriven, capacityRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleQuote = (product: ProductItem) => {
    addToInquiry({
      id: product.id,
      title: product.title,
      category: product.category,
      brand: product.brand,
      type: 'equipment',
      image: product.image,
      specSummary: product.specs.map(s => s.label).join(' • '),
    });

    setQuoteMsg(product.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setQuoteMsg(null), 4500);
  };

  const handleDownloadCatalogPdf = () => {
    const content = `MANDTECH EQUIPMENT SALES CATALOG 2026/2027
------------------------------------------------
Authorized Distributors: Sullair, Atlas Copco, Ingersoll Rand, Kaeser
Contact: sales@mandtech.com.ng | +234 (1) 460-7000

PRODUCT INVENTORY & SPECIFICATIONS:
${PRODUCTS.map(p => `• ${p.title} (${p.category} | ${p.brand}) - Capacity: ${p.capacity} CFM/kVA - ${p.driven}`).join('\n')}

All sales backed by Mandtech Comprehensive OEM Warranty & Pre-Delivery Inspection.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mandtech_Equipment_Catalog_2026.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="equip-sales-page">

      {/* Expert Consultation Modal */}
      {showConsultModal && (
        <div className="status-modal-overlay" onClick={() => setShowConsultModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Phone size={20} className="text-orange" />
                <span>Schedule Engineering Consultation</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowConsultModal(false)}>✕</button>
            </div>
            <div className="modal-body-content" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', marginBottom: '16px' }}>
                Our senior mechanical and electrical application engineers will review your flow demand, pressure profiles, and power load requirements to formulate tailored sizing specifications.
              </p>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ fontSize: '13px', color: '#1e252b' }}>Direct Regional Hotlines:</strong>
                <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px' }}>
                  Lagos VI Engineering Annex: <strong>+234 (1) 460-7000</strong><br />
                  Port Harcourt Yard: <strong>+234 (84) 303-900</strong><br />
                  Email: <strong>proposals@mandtech.com.ng</strong>
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setShowConsultModal(false)}
                  style={{
                    background: 'var(--primary-container)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
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

      {/* Quote success banner */}
      {quoteMsg && (
        <div className="equip-quote-banner container">
          <span className="equip-banner-badge"><Check size={16} /></span>
          <div className="equip-banner-content">
            <h4>Quote Request Logged</h4>
            <p><strong>{quoteMsg}</strong> has been added to your procurement checklist. Click "Get an Inquiry" in the navbar to review.</p>
          </div>
          <button className="equip-banner-close" onClick={() => setQuoteMsg(null)}><X size={18} /></button>
        </div>
      )}

      {/* Page Header */}
      <div className="container equip-page-header">
        <h1 className="equip-page-title">Heavy Equipment Sales Catalog</h1>
      </div>

      {/* Category Tabs */}
      <div className="container equip-category-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`equip-cat-chip ${activeCategory === cat ? 'equip-cat-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main content: sidebar + grid */}
      <div className="container equip-content-layout">

        {/* Sidebar */}
        <aside className="equip-sidebar">
          <div className="equip-sidebar-header">
            <span>Filters</span>
            <Sliders size={16} className="equip-sidebar-icon" />
          </div>

          {/* Driven Type */}
          <div className="equip-filter-block">
            <label className="equip-filter-label">DRIVEN TYPE</label>
            {DRIVEN_TYPES.map(d => {
              const checked = selectedDriven.includes(d);
              return (
                <div key={d} className="equip-check-row" onClick={() => toggleDriven(d)}>
                  <div className={`equip-checkbox ${checked ? 'checked' : ''}`}>
                    {checked && <Check size={11} />}
                  </div>
                  <span className="equip-check-label">{d}</span>
                </div>
              );
            })}
          </div>

          {/* Capacity Slider */}
          <div className="equip-filter-block">
            <label className="equip-filter-label">CAPACITY (CFM/KVA)</label>
            <input
              type="range"
              min={40}
              max={2000}
              step={10}
              value={capacityRange}
              onChange={e => setCapacityRange(Number(e.target.value))}
              className="equip-capacity-slider"
            />
            <div className="equip-slider-labels">
              <span>40 CFM</span>
              <span className="equip-slider-val">
                {capacityRange >= 2000 ? '2000+ CFM' : `${capacityRange} CFM`}
              </span>
            </div>
          </div>

          {/* Brand */}
          <div className="equip-filter-block">
            <label className="equip-filter-label">BRAND</label>
            {BRANDS.map(b => {
              const checked = selectedBrands.includes(b);
              return (
                <div key={b} className="equip-check-row" onClick={() => toggleBrand(b)}>
                  <div className={`equip-checkbox ${checked ? 'checked' : ''}`}>
                    {checked && <Check size={11} />}
                  </div>
                  <span className="equip-check-label">{b}</span>
                </div>
              );
            })}
          </div>

          <button className="equip-clear-btn" onClick={clearFilters}>Clear All Filters</button>
        </aside>

        {/* Product grid */}
        <main className="equip-grid-main">
          {/* Results bar */}
          <div className="equip-results-bar">
            <span className="equip-results-text">
              Showing <strong>{filtered.length === 0 ? 0 : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}`}</strong> of {filtered.length} equipment units
            </span>
            <div className="equip-sort-wrapper">
              <span>Sort by:</span>
              <div className="equip-sort-select-box">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="equip-sort-select"
                >
                  <option value="capacity-desc">Capacity: High to Low</option>
                  <option value="capacity-asc">Capacity: Low to High</option>
                </select>
                <ChevronDown size={14} className="equip-sort-chevron" />
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="equip-empty-state">
              <span className="equip-empty-emoji">🔍</span>
              <h3>No Equipment Found</h3>
              <p>No machines match your criteria. Try adjusting your filters or resetting the capacity range.</p>
              <button className="equip-reset-btn" onClick={clearFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="equip-products-grid">
              {pagedProducts.map(p => (
                <EquipCard
                  key={p.id}
                  title={p.title}
                  image={p.image}
                  badge={p.badge}
                  badgeType={p.badgeType}
                  specs={p.specs}
                  inInquiry={isInInquiry(p.id)}
                  onQuote={() => handleQuote(p)}
                />
              ))}
            </div>
          )}

          {/* True Working Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="equip-pagination">
              <button
                className="equip-pag-nav"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`equip-pag-num ${currentPage === page ? 'equip-pag-active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="equip-pag-nav"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* CTA Dark Banner */}
      <section className="equip-cta-banner">
        <div className="container equip-cta-inner">
          <div className="equip-cta-text">
            <h2 className="equip-cta-title">Need custom technical specifications?</h2>
            <p className="equip-cta-subtitle">
              Our engineers are ready to help you configure the perfect setup for your site requirements.
              We provide full technical audits and ROI projections.
            </p>
            <div className="equip-cta-btns">
              <button className="equip-cta-primary" onClick={() => setShowConsultModal(true)}>
                Talk to an Expert
              </button>
              <button className="equip-cta-secondary" onClick={handleDownloadCatalogPdf}>
                <Download size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Download Catalog (.TXT)
              </button>
            </div>
          </div>

          <div className="equip-cta-support-card">
            <div className="equip-support-icon-wrap">
              <Phone size={18} />
            </div>
            <div className="equip-support-text">
              <span className="equip-support-tag">DIRECT SUPPORT</span>
              <strong className="equip-support-tel">+234 (1) 460-7000</strong>
              <p className="equip-support-desc">
                Available 24/7 for emergency equipment leasing and technical assistance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  Sliders, Zap, Shield, ChevronDown, Check, X,
  Phone, ChevronLeft, ChevronRight, Activity, Settings
} from 'lucide-react';
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

const PRODUCTS = [
  {
    id: 1,
    title: 'Sullair 185 Series',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg,
    badge: 'IN STOCK',
    badgeType: 'in-stock' as const,
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
    badgeType: 'in-stock' as const,
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
    badgeType: 'featured' as const,
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
    badgeType: 'in-stock' as const,
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
    badgeType: 'in-stock' as const,
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
    badgeType: 'in-stock' as const,
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
    badgeType: 'in-stock' as const,
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
    badgeType: 'in-stock' as const,
    specs: [
      { icon: <Zap size={14} />, label: '500 kVA Prime Output' },
      { icon: <Activity size={14} />, label: 'Low-Consumption Diesel' },
      { icon: <Shield size={14} />, label: 'Sound-Attenuated Shell' },
    ],
    capacity: 500,
    driven: 'Diesel Driven',
  },
];

interface EquipCardProps {
  title: string;
  image: string;
  badge?: string;
  badgeType: 'in-stock' | 'featured';
  specs: { icon: React.ReactNode; label: string }[];
  onQuote: () => void;
}

const EquipCard: React.FC<EquipCardProps> = ({ title, image, badge, badgeType, specs, onQuote }) => (
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
      <button className="equip-quote-btn" onClick={onQuote}>
        Request a Quote
      </button>
    </div>
  </div>
);

export default function EquipmentSalesPage() {
  const [activeCategory, setActiveCategory] = useState('Air Compressors');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Sullair']);
  const [selectedDriven, setSelectedDriven] = useState<string[]>(['Diesel Driven']);
  const [capacityRange, setCapacityRange] = useState(2000);
  const [sortBy, setSortBy] = useState('capacity-desc');
  const [quoteMsg, setQuoteMsg] = useState<string | null>(null);

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
    let result = PRODUCTS.filter(p => {
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

  const handleQuote = (title: string) => {
    setQuoteMsg(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setQuoteMsg(null), 4000);
  };

  return (
    <div className="equip-sales-page">

      {/* Quote success banner */}
      {quoteMsg && (
        <div className="equip-quote-banner container">
          <span className="equip-banner-badge"><Check size={16} /></span>
          <div className="equip-banner-content">
            <h4>Quote Request Logged</h4>
            <p>Your RFQ for <strong>{quoteMsg}</strong> has been assigned to a regional sales engineer.</p>
          </div>
          <button className="equip-banner-close" onClick={() => setQuoteMsg(null)}><X size={18} /></button>
        </div>
      )}

      {/* Page Header */}
      <div className="container equip-page-header">
        <h1 className="equip-page-title">Equipment Catalog</h1>
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
              min={50}
              max={2000}
              value={capacityRange}
              onChange={e => setCapacityRange(Number(e.target.value))}
              className="equip-capacity-slider"
            />
            <div className="equip-slider-labels">
              <span>50 CFM</span>
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
              Showing <strong>{filtered.length}</strong> of 48 results
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
              <p>No machines match your criteria. Try adjusting your filters.</p>
              <button className="equip-reset-btn" onClick={clearFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="equip-products-grid">
              {filtered.map(p => (
                <EquipCard
                  key={p.id}
                  title={p.title}
                  image={p.image}
                  badge={p.badge}
                  badgeType={p.badgeType}
                  specs={p.specs}
                  onQuote={() => handleQuote(p.title)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="equip-pagination">
              <button className="equip-pag-nav"><ChevronLeft size={16} /></button>
              <button className="equip-pag-num equip-pag-active">1</button>
              <button className="equip-pag-num">2</button>
              <button className="equip-pag-num">3</button>
              <span className="equip-pag-dots">...</span>
              <button className="equip-pag-num">8</button>
              <button className="equip-pag-nav"><ChevronRight size={16} /></button>
            </div>
          )}
        </main>
      </div>

      {/* CTA Dark Banner */}
      <section className="equip-cta-banner">
        <div className="container equip-cta-inner">
          <div className="equip-cta-text">
            <h2 className="equip-cta-title">Need a custom technical specification?</h2>
            <p className="equip-cta-subtitle">
              Our engineers are ready to help you configure the perfect setup for your site requirements.
              We provide full technical audits and ROI projections.
            </p>
            <div className="equip-cta-btns">
              <button className="equip-cta-primary" onClick={() => alert('Opening consulting intake form...')}>
                Talk to an Expert
              </button>
              <button className="equip-cta-secondary" onClick={() => alert('Downloading full equipment catalog PDF...')}>
                Download Catalog
              </button>
            </div>
          </div>

          <div className="equip-cta-support-card">
            <div className="equip-support-icon-wrap">
              <Phone size={18} />
            </div>
            <div className="equip-support-text">
              <span className="equip-support-tag">DIRECT SUPPORT</span>
              <strong className="equip-support-tel">+1 (800) MAND-TECH</strong>
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

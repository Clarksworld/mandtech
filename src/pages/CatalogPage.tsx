import React, { useState, useMemo } from 'react';
import { Search, Sliders, Zap, Shield, ChevronDown, Check, X, Phone, ArrowLeft, ArrowRight, Activity, Settings } from 'lucide-react';
import { EquipmentCard } from '../components/Card';
import './CatalogPage.css';

// Import Assets
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
    badgeType: 'inStock' as const,
    accentTop: false,
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
    badgeType: 'inStock' as const,
    accentTop: false,
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
    brand: 'Kaeser', // Styled as Kaeser/Sullair in mockup
    image: portableUnit,
    badge: 'FEATURED',
    badgeType: 'featured' as const,
    accentTop: false,
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
    badgeType: 'inStock' as const,
    accentTop: false,
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
    badgeType: 'inStock' as const,
    accentTop: false,
    specs: [
      { icon: <Activity size={14} />, label: '375 CFM capacity' },
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
    badgeType: 'inStock' as const,
    accentTop: false,
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
    badgeType: 'inStock' as const,
    accentTop: false,
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
    badgeType: 'inStock' as const,
    accentTop: false,
    specs: [
      { icon: <Zap size={14} />, label: '500 kVA Prime Output' },
      { icon: <Activity size={14} />, label: 'Low-Consumption Diesel' },
      { icon: <Shield size={14} />, label: 'Sound-Attenuated Shell' },
    ],
    capacity: 500,
    driven: 'Diesel Driven',
  },
];

export const CatalogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Air Compressors');
  
  // Set default filters as per the visual mockup design
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Sullair']);
  const [selectedDrivenTypes, setSelectedDrivenTypes] = useState<string[]>(['Diesel Driven']);
  const [capacityRange, setCapacityRange] = useState<number>(2000);
  const [sortBy, setSortBy] = useState('capacity-desc');

  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleDrivenType = (type: string) => {
    setSelectedDrivenTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedDrivenTypes([]);
    setCapacityRange(2000);
    setSearch('');
  };

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const matchCategory = p.category === activeCategory;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchDriven = selectedDrivenTypes.length === 0 || selectedDrivenTypes.includes(p.driven);
      const matchCapacity = p.capacity <= capacityRange;
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      
      return matchCategory && matchBrand && matchDriven && matchCapacity && matchSearch;
    });

    if (sortBy === 'capacity-desc') {
      result.sort((a, b) => b.capacity - a.capacity);
    } else if (sortBy === 'capacity-asc') {
      result.sort((a, b) => a.capacity - b.capacity);
    }

    return result;
  }, [search, activeCategory, selectedBrands, selectedDrivenTypes, capacityRange, sortBy]);

  const handleQuote = (title: string) => {
    setQuoteSuccessMsg(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setQuoteSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="catalog-page-container">
      <div className="container">
        {/* Quote alert banner */}
        {quoteSuccessMsg && (
          <div className="quote-alert-banner">
            <span className="alert-badge"><Check size={16} /></span>
            <div className="alert-content">
              <h4 className="alert-title">Quote Request Logged</h4>
              <p className="alert-text">
                Your RFQ ticket for <strong>{quoteSuccessMsg}</strong> has been assigned to a regional sales engineer. Check your email for formal specs.
              </p>
            </div>
            <button className="alert-close" onClick={() => setQuoteSuccessMsg(null)}>
              <X size={18} />
            </button>
          </div>
        )}

        <div className="catalog-header-row">
          <div>
            <h1 className="catalog-title">Equipment Catalog</h1>
          </div>
        </div>

        {/* Categories strip */}
        <div className="categories-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'chip-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="catalog-content-layout">
          {/* Sidebar filters (Redesigned matching Mockup) */}
          <aside className="filter-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-header-left">
                <span>Filters</span>
              </span>
              <Sliders size={16} className="sidebar-hamburger-icon" />
            </div>

            {/* Driven Type checkbox list */}
            <div className="filter-block">
              <label className="sidebar-block-title">DRIVEN TYPE</label>
              <div className="brand-checkboxes-list">
                {DRIVEN_TYPES.map((type) => {
                  const isChecked = selectedDrivenTypes.includes(type);
                  return (
                    <div 
                      key={type} 
                      className={`brand-check-row ${isChecked ? 'brand-checked' : ''}`}
                      onClick={() => toggleDrivenType(type)}
                    >
                      <div className={`checkbox-box ${isChecked ? 'box-active' : ''}`}>
                        {isChecked && <Check size={12} />}
                      </div>
                      <span className="brand-check-label">{type}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Capacity Slider control */}
            <div className="filter-block">
              <label className="sidebar-block-title">CAPACITY (CFM/KVA)</label>
              <div className="slider-container">
                <input 
                  type="range" 
                  min="50" 
                  max="2000" 
                  value={capacityRange} 
                  onChange={(e) => setCapacityRange(Number(e.target.value))} 
                  className="capacity-range-slider"
                />
                <div className="slider-labels">
                  <span>50 CFM</span>
                  <span className="active-slider-val">{capacityRange === 2000 ? '2000+ CFM' : `${capacityRange} CFM`}</span>
                </div>
              </div>
            </div>

            {/* Brand checkboxes */}
            <div className="filter-block">
              <label className="sidebar-block-title">BRAND</label>
              <div className="brand-checkboxes-list">
                {BRANDS.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <div 
                      key={brand} 
                      className={`brand-check-row ${isChecked ? 'brand-checked' : ''}`}
                      onClick={() => toggleBrand(brand)}
                    >
                      <div className={`checkbox-box ${isChecked ? 'box-active' : ''}`}>
                        {isChecked && <Check size={12} />}
                      </div>
                      <span className="brand-check-label">{brand}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="clear-filter-btn-bottom" onClick={clearFilters}>
              Clear All Filters
            </button>
          </aside>

          {/* Product Grid area */}
          <main className="catalog-grid-area">
            {/* Grid Stats Strip */}
            <div className="grid-results-bar">
              <div className="results-indicator">
                Showing <strong className="orange-count">{filtered.length}</strong> of 48 results
              </div>
              <div className="sort-by-wrapper">
                <span>Sort by:</span>
                <div className="sort-dropdown-container">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown-select"
                  >
                    <option value="capacity-desc">Capacity: High to Low</option>
                    <option value="capacity-asc">Capacity: Low to High</option>
                  </select>
                  <ChevronDown size={14} className="sort-chevron-icon" />
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-catalog-state">
                <span className="empty-emoji">🔍</span>
                <h3 className="empty-title">No Equipment Found</h3>
                <p className="empty-desc">No machines match your criteria. Try loosening search terms or brands.</p>
                <button className="reset-btn" onClick={clearFilters}>Reset All Filters</button>
              </div>
            ) : (
              <div className="catalog-products-grid">
                {filtered.map((prod) => (
                  <EquipmentCard
                    key={prod.id}
                    title={prod.title}
                    image={prod.image}
                    specs={prod.specs}
                    badge={prod.badge}
                    badgeType={prod.badgeType}
                    accentTop={prod.accentTop}
                    onQuote={() => handleQuote(prod.title)}
                  />
                ))}
              </div>
            )}

            {/* Pagination controls below Grid */}
            <div className="catalog-pagination">
              <button className="pag-btn prev"><ArrowLeft size={16} /></button>
              <button className="pag-number active">1</button>
              <button className="pag-number">2</button>
              <button className="pag-number">3</button>
              <span className="pag-dots">...</span>
              <button className="pag-number">8</button>
              <button className="pag-btn next"><ArrowRight size={16} /></button>
            </div>
          </main>
        </div>
      </div>

      {/* Redesigned Custom Technical Specifications Dark Banner */}
      <section className="custom-spec-banner">
        <div className="container banner-grid-box">
          <div className="banner-text-side">
            <h2 className="banner-title-text">Need a custom technical specification?</h2>
            <p className="banner-subtitle-text">
              Our engineers are ready to help you configure the perfect setup for your site requirements. We provide full technical audits and ROI projections.
            </p>
            <div className="banner-buttons-row">
              <button className="banner-expert-btn" onClick={() => alert('Routing to Consulting intake form...')}>
                Talk to an Expert
              </button>
              <button className="banner-catalog-btn" onClick={() => alert('Download complete catalogs in PDF format.')}>
                Download Catalog
              </button>
            </div>
          </div>

          <div className="banner-support-badge-wrapper">
            <div className="banner-support-badge">
              <div className="support-icon-circle">
                <Phone size={18} />
              </div>
              <div className="support-text-lines">
                <span className="support-badge-label">DIRECT SUPPORT</span>
                <strong className="support-badge-tel">+1 (800) MAND-TECH</strong>
                <p className="support-badge-desc">Available 24/7 for emergency equipment leasing and technical assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;

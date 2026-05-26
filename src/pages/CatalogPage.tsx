import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Check, X, ShoppingCart, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import './CatalogPage.css';

// Import local premium assets representing the parts
import partFilter from '../assets/part_filter.png';
import partGauge from '../assets/part_gauge.png';
import partValve from '../assets/part_valve.png';
import partGasket from '../assets/part_gasket.png';
import partFan from '../assets/part_fan.png';
import partSwitch from '../assets/part_switch.png';

const CATEGORIES = [
  'All Components',
  'Air Filtration',
  'Control Systems',
  'Electrical Spares',
  'Mechanical Gaskets'
];

const MANUFACTURERS = [
  'Sullair',
  'Ingersoll Rand',
  'Atlas Copco',
  'Kaeser'
];

const CONDITIONS = [
  'New OEM',
  'Refurbished'
];

const PRODUCTS = [
  {
    id: 1,
    title: 'High-Pressure Oil Filter',
    category: 'Air Filtration',
    brand: 'Sullair',
    sku: 'SL-98230-XP',
    compatibility: 'LS Series, 16-25 Series Compressors',
    image: partFilter,
    badge: 'IN STOCK',
    badgeType: 'in-stock' as const,
    condition: 'New OEM'
  },
  {
    id: 2,
    title: 'Digital Pressure Sensor',
    category: 'Control Systems',
    brand: 'Ingersoll Rand',
    sku: 'IR-PG-400X',
    compatibility: 'SSR/M Series Rotary Screw',
    image: partGauge,
    badge: 'IN STOCK',
    badgeType: 'in-stock' as const,
    condition: 'New OEM'
  },
  {
    id: 3,
    title: 'Thermal Control Valve',
    category: 'Control Systems',
    brand: 'Atlas Copco',
    sku: 'AC-TCV-772',
    compatibility: 'GA VSD+ Series Compressors',
    image: partValve,
    badge: 'LOW STOCK',
    badgeType: 'low-stock' as const,
    condition: 'New OEM'
  },
  {
    id: 4,
    title: 'Service Overhaul Gasket Kit',
    category: 'Mechanical Gaskets',
    brand: 'Universal',
    sku: 'MK-GSKT-KIT-V2',
    compatibility: 'Universal 2-Stage Air Ends',
    image: partGasket,
    badge: 'IN STOCK',
    badgeType: 'in-stock' as const,
    condition: 'New OEM'
  },
  {
    id: 5,
    title: 'Reinforced Cooling Fan',
    category: 'Mechanical Gaskets',
    brand: 'Sullair',
    sku: 'SL-FAN-0098',
    compatibility: 'TS Series, LS Series Compressors',
    image: partFan,
    badge: 'IN STOCK',
    badgeType: 'in-stock' as const,
    condition: 'New OEM'
  },
  {
    id: 6,
    title: 'Heavy-Duty Pressure Switch',
    category: 'Electrical Spares',
    brand: 'Kaeser',
    sku: 'KS-PSW-300',
    compatibility: 'BSD, CSD, DSD Compressor Units',
    image: partSwitch,
    badge: 'REFURBISHED AVAILABLE',
    badgeType: 'refurbished' as const,
    condition: 'Refurbished'
  }
];

// Helper to deduce mockup display category (e.g. SULLAIR • FILTRATION)
const getDisplayCategory = (brand: string, category: string, title: string) => {
  if (title.toLowerCase().includes('valve')) return 'VALVES';
  if (title.toLowerCase().includes('sensor')) return 'SENSORS';
  if (category === 'Air Filtration') return 'FILTRATION';
  if (category === 'Mechanical Gaskets') return 'GASKETS';
  if (category === 'Electrical Spares') return 'ELECTRICAL';
  if (category === 'Control Systems') return 'CONTROLS';
  return category.toUpperCase();
};

interface PartCardProps {
  title: string;
  category: string;
  brand: string;
  sku: string;
  compatibility: string;
  image: string;
  badge: string;
  badgeType: 'in-stock' | 'low-stock' | 'refurbished';
  onAdd: () => void;
}

const PartCard: React.FC<PartCardProps> = ({
  title,
  category,
  brand,
  sku,
  compatibility,
  image,
  badge,
  badgeType,
  onAdd
}) => {
  const displayBrand = brand === 'Universal' ? 'UNIVERSAL' : brand.toUpperCase();
  const displayCategory = getDisplayCategory(brand, category, title);

  return (
    <div className="part-card">
      <div className="part-card-image-wrapper">
        <img src={image} alt={title} className="part-card-image" />
        <div className={`part-card-badge badge-${badgeType}`}>
          {badgeType === 'in-stock' && <span className="stock-dot"></span>}
          {badge}
        </div>
      </div>
      <div className="part-card-body">
        <span className="part-card-meta-category">
          {displayBrand} • {displayCategory}
        </span>
        <h3 className="part-card-title">{title}</h3>
        <span className="part-card-sku">SKU: {sku}</span>
        
        <div className="part-card-compatibility-box">
          <span className="compat-label">COMPATIBILITY</span>
          <span className="compat-value">{compatibility}</span>
        </div>
        
        <button className="part-card-inquiry-btn" onClick={onAdd}>
          <ShoppingCart size={15} />
          <span>Add to Inquiry</span>
        </button>
      </div>
    </div>
  );
};

export const CatalogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Components');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Sullair']);
  const [selectedCondition, setSelectedCondition] = useState<string>('New OEM');
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState<string | null>(null);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCondition('New OEM');
    setActiveCategory('All Components');
    setSearch('');
  };

  const handleQuickLink = (type: string) => {
    if (type === 'Filters') {
      setActiveCategory('Air Filtration');
      setSearch('');
    } else if (type === 'Valves') {
      setActiveCategory('All Components');
      setSearch('valve');
    } else if (type === 'Gaskets') {
      setActiveCategory('Mechanical Gaskets');
      setSearch('');
    } else if (type === 'Sensors') {
      setActiveCategory('All Components');
      setSearch('sensor');
    }
  };

  const handleAddInquiry = (title: string) => {
    setInquirySuccessMsg(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setInquirySuccessMsg(null);
    }, 4000);
  };

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const matchCategory = activeCategory === 'All Components' || p.category === activeCategory;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchCondition = !selectedCondition || p.condition === selectedCondition;
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      
      return matchCategory && matchBrand && matchCondition && matchSearch;
    });

    if (sortBy === 'SKU: A to Z') {
      result.sort((a, b) => a.sku.localeCompare(b.sku));
    } else if (sortBy === 'Brand: A to Z') {
      result.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    return result;
  }, [search, activeCategory, selectedBrands, selectedCondition, sortBy]);

  return (
    <div className="parts-catalog-container">
      {/* Dynamic Inquiry success notification banner */}
      {inquirySuccessMsg && (
        <div className="inquiry-alert-banner container">
          <span className="alert-badge"><Check size={16} /></span>
          <div className="alert-content">
            <h4 className="alert-title">Added to Inquiry Ticket</h4>
            <p className="alert-text">
              <strong>{inquirySuccessMsg}</strong> has been added to your procurement checklist. Click "Get an Inquiry" above to submit.
            </p>
          </div>
          <button className="alert-close" onClick={() => setInquirySuccessMsg(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Hero Search Block (Dark Theme Mockup styled) */}
      <section className="parts-hero-search-section">
        <div className="container search-hero-inner">
          <h1 className="parts-search-title">Search Parts Catalog</h1>
          
          <div className="parts-search-bar-row">
            <div className="parts-search-input-wrapper">
              <Search size={18} className="parts-search-icon" />
              <input 
                type="text" 
                placeholder="Search by Part Number, Keyword, or OEM..." 
                className="parts-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="parts-search-submit-btn">
              <Sliders size={16} className="btn-search-slider-icon" />
              <span>Search</span>
            </button>
          </div>

          <div className="quick-links-row">
            <span className="quick-links-label">QUICK LINKS:</span>
            <div className="quick-links-chips">
              {['Filters', 'Valves', 'Gaskets', 'Sensors'].map((link) => (
                <button 
                  key={link} 
                  className="quick-link-chip"
                  onClick={() => handleQuickLink(link)}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container parts-content-layout">
        
        {/* Sidebar Filters */}
        <aside className="parts-sidebar">
          
          {/* Category block */}
          <div className="sidebar-filter-block">
            <label className="filter-title-label">CATEGORY</label>
            <ul className="category-vertical-list">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button 
                    className={`category-list-btn ${activeCategory === cat ? 'active-list-btn' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Manufacturer check list */}
          <div className="sidebar-filter-block">
            <label className="filter-title-label">MANUFACTURER</label>
            <div className="sidebar-checklist">
              {MANUFACTURERS.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <div 
                    key={brand} 
                    className="checkbox-filter-row"
                    onClick={() => toggleBrand(brand)}
                  >
                    <div className={`filter-checkbox-box ${isChecked ? 'checked' : ''}`}>
                      {isChecked && <Check size={12} />}
                    </div>
                    <span className="checkbox-filter-label">{brand}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Condition radio/pill select */}
          <div className="sidebar-filter-block">
            <label className="filter-title-label">CONDITION</label>
            <div className="sidebar-condition-group">
              {CONDITIONS.map((cond) => {
                const isSelected = selectedCondition === cond;
                return (
                  <div 
                    key={cond} 
                    className="radio-filter-row"
                    onClick={() => setSelectedCondition(cond)}
                  >
                    <div className={`filter-radio-dot ${isSelected ? 'selected' : ''}`}>
                      {isSelected && <div className="inner-dot" />}
                    </div>
                    <span className="radio-filter-label">{cond}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="parts-clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </aside>

        {/* Parts Grid & Results */}
        <main className="parts-grid-container">
          
          {/* Top Info Bar */}
          <div className="parts-grid-results-bar">
            <div className="parts-indicator-text">
              Showing <strong className="matching-parts-highlight">{filtered.length === 0 ? 0 : 124}</strong> matching parts
            </div>
            
            <div className="parts-sort-group">
              <span>Sort by:</span>
              <div className="parts-sort-select-wrapper">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="parts-sort-select"
                >
                  <option value="Most Relevant">Most Relevant</option>
                  <option value="SKU: A to Z">SKU: A to Z</option>
                  <option value="Brand: A to Z">Brand: A to Z</option>
                </select>
                <ChevronDown size={14} className="sort-select-chevron" />
              </div>
            </div>
          </div>

          {/* Actual Parts Grid */}
          {filtered.length === 0 ? (
            <div className="empty-parts-state">
              <span className="empty-emoji">🔍</span>
              <h3>No Matching Parts Found</h3>
              <p>We couldn't find any replacement parts matching your criteria. Try resetting filters or adjusting search queries.</p>
              <button className="empty-reset-btn" onClick={clearFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="parts-items-grid">
              {filtered.map((prod) => (
                <PartCard 
                  key={prod.id}
                  title={prod.title}
                  category={prod.category}
                  brand={prod.brand}
                  sku={prod.sku}
                  compatibility={prod.compatibility}
                  image={prod.image}
                  badge={prod.badge}
                  badgeType={prod.badgeType}
                  onAdd={() => handleAddInquiry(prod.title)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="parts-pagination-row">
              <button className="pag-nav-btn"><ChevronLeft size={16} /></button>
              <button className="pag-num-btn active-pag">1</button>
              <button className="pag-num-btn">2</button>
              <button className="pag-num-btn">3</button>
              <span className="pag-elipsis">...</span>
              <button className="pag-num-btn">12</button>
              <button className="pag-nav-btn"><ChevronRight size={16} /></button>
            </div>
          )}
        </main>
      </div>

      {/* Obsolete/Hard-To-Find Procure CTA Banner */}
      <section className="parts-procurement-cta-banner">
        <div className="container procure-cta-inner">
          <div className="procure-text-side">
            <h2 className="procure-cta-title">Can't find a specific part?</h2>
            <p className="procure-cta-subtitle">
              Our procurement specialists can source obsolete or hard-to-find components globally.
            </p>
          </div>
          <button 
            className="procure-submit-btn"
            onClick={() => alert('Opening Technical Procurement intake ticket... Our regional sourcing engineers will contact you shortly.')}
          >
            Submit Technical Request
          </button>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;

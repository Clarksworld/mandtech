import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Check, X, ShoppingCart, Sliders, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
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
  'Kaeser',
  'Universal'
];

const CONDITIONS = [
  'New OEM',
  'Refurbished'
];

export interface PartProduct {
  id: number;
  title: string;
  category: string;
  brand: string;
  sku: string;
  compatibility: string;
  image: string;
  badge: string;
  badgeType: 'in-stock' | 'low-stock' | 'refurbished';
  condition: 'New OEM' | 'Refurbished';
}

const PRODUCTS: PartProduct[] = [
  {
    id: 1,
    title: 'High-Pressure Oil Filter Element',
    category: 'Air Filtration',
    brand: 'Sullair',
    sku: 'SL-98230-XP',
    compatibility: 'LS Series, 16-25 Series Compressors',
    image: partFilter,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 2,
    title: 'Digital Pressure Sensor & Transducer',
    category: 'Control Systems',
    brand: 'Ingersoll Rand',
    sku: 'IR-PG-400X',
    compatibility: 'SSR/M Series Rotary Screw',
    image: partGauge,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 3,
    title: 'Thermal Control Bypass Valve',
    category: 'Control Systems',
    brand: 'Atlas Copco',
    sku: 'AC-TCV-772',
    compatibility: 'GA VSD+ Series Compressors',
    image: partValve,
    badge: 'LOW STOCK',
    badgeType: 'low-stock',
    condition: 'New OEM'
  },
  {
    id: 4,
    title: 'Service Overhaul Gasket Kit V2',
    category: 'Mechanical Gaskets',
    brand: 'Universal',
    sku: 'MK-GSKT-KIT-V2',
    compatibility: 'Universal 2-Stage Air Ends',
    image: partGasket,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 5,
    title: 'Reinforced Impeller Cooling Fan',
    category: 'Mechanical Gaskets',
    brand: 'Sullair',
    sku: 'SL-FAN-0098',
    compatibility: 'TS Series, LS Series Compressors',
    image: partFan,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 6,
    title: 'Heavy-Duty Pressure Switch 16 Bar',
    category: 'Electrical Spares',
    brand: 'Kaeser',
    sku: 'KS-PSW-300',
    compatibility: 'BSD, CSD, DSD Compressor Units',
    image: partSwitch,
    badge: 'REFURBISHED AVAILABLE',
    badgeType: 'refurbished',
    condition: 'Refurbished'
  },
  {
    id: 7,
    title: 'Air Intake Heavy Pre-Filter Housing',
    category: 'Air Filtration',
    brand: 'Atlas Copco',
    sku: 'AC-AIF-901',
    compatibility: 'G-Series Industrial Compressors',
    image: partFilter,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 8,
    title: 'Electronic Solenoid Drain Valve',
    category: 'Control Systems',
    brand: 'Ingersoll Rand',
    sku: 'IR-SDV-220',
    compatibility: 'Nirvana Series Variable Speed',
    image: partValve,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 9,
    title: 'Precision Pressure Gauge 0-25 Bar',
    category: 'Control Systems',
    brand: 'Kaeser',
    sku: 'KS-GAUGE-25',
    compatibility: 'Sigma Control 2 Modules',
    image: partGauge,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  },
  {
    id: 10,
    title: 'High-Temperature Viton Seal Ring Set',
    category: 'Mechanical Gaskets',
    brand: 'Sullair',
    sku: 'SL-VIT-880',
    compatibility: 'Sullair S-Flo Series Compressors',
    image: partGasket,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    condition: 'New OEM'
  }
];

const getDisplayCategory = (category: string, title: string) => {
  if (title.toLowerCase().includes('valve')) return 'VALVES';
  if (title.toLowerCase().includes('sensor') || title.toLowerCase().includes('gauge')) return 'SENSORS';
  if (category === 'Air Filtration') return 'FILTRATION';
  if (category === 'Mechanical Gaskets') return 'GASKETS';
  if (category === 'Electrical Spares') return 'ELECTRICAL';
  if (category === 'Control Systems') return 'CONTROLS';
  return category.toUpperCase();
};

interface PartCardProps {
  prod: PartProduct;
  inInquiry: boolean;
  onAdd: () => void;
}

const PartCard: React.FC<PartCardProps> = ({ prod, inInquiry, onAdd }) => {
  const displayBrand = prod.brand === 'Universal' ? 'UNIVERSAL' : prod.brand.toUpperCase();
  const displayCategory = getDisplayCategory(prod.category, prod.title);

  return (
    <div className="part-card">
      <div className="part-card-image-wrapper">
        <img src={prod.image} alt={prod.title} className="part-card-image" />
        <div className={`part-card-badge badge-${prod.badgeType}`}>
          {prod.badgeType === 'in-stock' && <span className="stock-dot"></span>}
          {prod.badge}
        </div>
      </div>
      <div className="part-card-body">
        <span className="part-card-meta-category">
          {displayBrand} • {displayCategory}
        </span>
        <h3 className="part-card-title">{prod.title}</h3>
        <span className="part-card-sku">SKU: {prod.sku}</span>
        
        <div className="part-card-compatibility-box">
          <span className="compat-label">COMPATIBILITY</span>
          <span className="compat-value">{prod.compatibility}</span>
        </div>
        
        <button
          className="part-card-inquiry-btn"
          onClick={onAdd}
          style={{
            background: inInquiry ? 'var(--deep-charcoal)' : 'var(--primary-container)',
            color: '#ffffff'
          }}
        >
          <ShoppingCart size={15} />
          <span>{inInquiry ? '✓ In Inquiry Ticket' : 'Add to Inquiry'}</span>
        </button>
      </div>
    </div>
  );
};

export const CatalogPage: React.FC = () => {
  const { addToInquiry, isInInquiry, globalSearch } = useInquiry();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Components');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProcureModal, setShowProcureModal] = useState(false);
  const [procurePartNo, setProcurePartNo] = useState('');
  const [procureDetails, setProcureDetails] = useState('');
  const [procureSuccess, setProcureSuccess] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const [prevGlobalSearch, setPrevGlobalSearch] = useState(globalSearch);
  if (globalSearch !== prevGlobalSearch) {
    setPrevGlobalSearch(globalSearch);
    setSearch(globalSearch);
  }

  const filterKey = `${search}-${activeCategory}-${selectedBrands.join(',')}-${selectedCondition}-${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCondition('');
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

  const handleAddInquiry = (prod: PartProduct) => {
    addToInquiry({
      id: prod.id,
      title: prod.title,
      category: prod.category,
      brand: prod.brand,
      sku: prod.sku,
      type: 'part',
      image: prod.image,
      specSummary: `Compatibility: ${prod.compatibility}`,
    });

    setInquirySuccessMsg(prod.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setInquirySuccessMsg(null);
    }, 4500);
  };

  const handleProcureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procurePartNo.trim()) return;
    setProcureSuccess(true);
    setTimeout(() => {
      setProcureSuccess(false);
      setShowProcureModal(false);
      setProcurePartNo('');
      setProcureDetails('');
    }, 2500);
  };

  const filtered = useMemo(() => {
    const result = PRODUCTS.filter((p) => {
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className="parts-catalog-container">
      {/* Sourcing Modal for Obsolete / Hard to Find Parts */}
      {showProcureModal && (
        <div className="status-modal-overlay" onClick={() => setShowProcureModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Send size={18} className="text-orange" />
                <span>Technical Parts Procurement Sourcing</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowProcureModal(false)}>✕</button>
            </div>
            <div className="modal-body-content" style={{ padding: '24px' }}>
              {procureSuccess ? (
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #10b981',
                  borderRadius: '6px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#065f46',
                  fontWeight: 600
                }}>
                  <Check size={20} color="#10b981" />
                  <span>Sourcing ticket submitted! Our procurement engineers will check global warehouses.</span>
                </div>
              ) : (
                <form onSubmit={handleProcureSubmit}>
                  <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
                    Provide the OEM part number, stamping code, or machine serial tag. Our sourcing logistics network locates hard-to-find components internationally.
                  </p>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Part Number / Stamping Tag *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 02250112-031 or IR-SSR-904"
                      value={procurePartNo}
                      onChange={(e) => setProcurePartNo(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Machine Model &amp; Urgency Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Specify compressor/generator model and deadline..."
                      value={procureDetails}
                      onChange={(e) => setProcureDetails(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowProcureModal(false)}
                      style={{ background: 'transparent', border: '1px solid #d1d5db', padding: '9px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ background: 'var(--primary-container)', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Dispatch Sourcing Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Inquiry success notification banner */}
      {inquirySuccessMsg && (
        <div className="inquiry-alert-banner container">
          <span className="alert-badge"><Check size={16} /></span>
          <div className="alert-content">
            <h4 className="alert-title">Added to Inquiry Ticket</h4>
            <p className="alert-text">
              <strong>{inquirySuccessMsg}</strong> has been added to your procurement checklist. Click "Get an Inquiry" in the navbar to finalize proposal.
            </p>
          </div>
          <button className="alert-close" onClick={() => setInquirySuccessMsg(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Hero Search Block */}
      <section className="parts-hero-search-section">
        <div className="container search-hero-inner">
          <h1 className="parts-search-title">Search Genuine Parts Catalog</h1>
          
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
            <button className="parts-search-submit-btn" onClick={() => {}}>
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

          {/* Condition radio select */}
          <div className="sidebar-filter-block">
            <label className="filter-title-label">CONDITION</label>
            <div className="sidebar-condition-group">
              {CONDITIONS.map((cond) => {
                const isSelected = selectedCondition === cond;
                return (
                  <div 
                    key={cond} 
                    className="radio-filter-row"
                    onClick={() => setSelectedCondition(isSelected ? '' : cond)}
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
              Showing <strong className="matching-parts-highlight">{filtered.length === 0 ? 0 : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}`}</strong> of {filtered.length} matching parts
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
              {pagedProducts.map((prod) => (
                <PartCard 
                  key={prod.id}
                  prod={prod}
                  inInquiry={isInInquiry(prod.id)}
                  onAdd={() => handleAddInquiry(prod)}
                />
              ))}
            </div>
          )}

          {/* Working Dynamic Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="parts-pagination-row">
              <button
                className="pag-nav-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pag-num-btn ${currentPage === page ? 'active-pag' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pag-nav-btn"
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

      {/* Obsolete/Hard-To-Find Procure CTA Banner */}
      <section className="parts-procurement-cta-banner">
        <div className="container procure-cta-inner">
          <div className="procure-text-side">
            <h2 className="procure-cta-title">Can't find a specific part?</h2>
            <p className="procure-cta-subtitle">
              Our procurement specialists can source obsolete or hard-to-find components globally via direct OEM links.
            </p>
          </div>
          <button 
            className="procure-submit-btn"
            onClick={() => setShowProcureModal(true)}
          >
            Submit Technical Request
          </button>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;

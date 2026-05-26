import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, X, RefreshCw } from 'lucide-react';
import { EquipmentCard } from '../components/Card';
import './CatalogPage.css';

const CATEGORIES = ['All', 'Air Compressors', 'Generators', 'Pumps', 'Air Dryers'];
const BRANDS = ['Atlas Copco', 'Ingersoll Rand', 'Sullair', 'Kaeser', 'Mandtech'];

const PRODUCTS = [
  {
    id: 1,
    title: 'Sullair 185 Series',
    category: 'Air Compressors',
    brand: 'Sullair',
    badge: 'IN STOCK',
    badgeType: 'inStock' as const,
    accentTop: true,
    specs: [
      { icon: '⚙️', label: '185 CFM Capacity' },
      { icon: '⛽', label: 'Diesel Driven Engine' },
      { icon: '✅', label: 'Heavy-Duty Steel Frame' },
    ],
  },
  {
    id: 2,
    title: 'Electric Power Dry E-40',
    category: 'Air Dryers',
    brand: 'Kaeser',
    specs: [
      { icon: '⚡', label: 'Electric Driven 400V' },
      { icon: '🌬️', label: '40 CFM Low Noise' },
      { icon: '🌿', label: 'Zero Site Emissions' },
    ],
  },
  {
    id: 3,
    title: 'Mandtech Titan X-120',
    category: 'Air Compressors',
    brand: 'Mandtech',
    badge: 'FEATURED',
    badgeType: 'featured' as const,
    accentTop: true,
    specs: [
      { icon: '⚙️', label: '120 CFM, Diesel Driven' },
      { icon: '🏗️', label: 'Site-Ready Portable Layout' },
      { icon: '⏱️', label: 'Extended Runtime Fuel Cell' },
    ],
  },
  {
    id: 4,
    title: 'High-Capacity Pump V9',
    category: 'Pumps',
    brand: 'Ingersoll Rand',
    specs: [
      { icon: '💧', label: '900 GPM Flow Rate' },
      { icon: '🔩', label: 'Corrosion Resistant Impeller' },
      { icon: '🚀', label: 'High Torque Diesel Engine' },
    ],
  },
  {
    id: 5,
    title: 'Sullair 375 Tier 4',
    category: 'Air Compressors',
    brand: 'Sullair',
    specs: [
      { icon: '⚙️', label: '375 CFM Capacity' },
      { icon: '🌿', label: 'Emission Compliant Engine' },
      { icon: '📊', label: 'Smart Diagnostic Monitoring' },
    ],
  },
  {
    id: 6,
    title: 'DryLine Industrial S',
    category: 'Air Dryers',
    brand: 'Atlas Copco',
    specs: [
      { icon: '❄️', label: 'Desiccant Drying Method' },
      { icon: '⚡', label: 'Electric 230V/400V Options' },
      { icon: '🎛️', label: 'Variable Flow Rate Valves' },
    ],
  },
  {
    id: 7,
    title: 'Atlas Copco GA-160',
    category: 'Air Compressors',
    brand: 'Atlas Copco',
    badge: 'IN STOCK',
    badgeType: 'inStock' as const,
    accentTop: true,
    specs: [
      { icon: '⚙️', label: '160 kW Rotary Screw' },
      { icon: '⚡', label: 'Variable Speed Drive' },
      { icon: '📡', label: 'Remote Monitoring Interface' },
    ],
  },
  {
    id: 8,
    title: 'Prime Power 500 kVA',
    category: 'Generators',
    brand: 'Ingersoll Rand',
    specs: [
      { icon: '⚡', label: '500 kVA Prime Output' },
      { icon: '⛽', label: 'Low-Consumption Diesel' },
      { icon: '🔇', label: 'Sound-Attenuated Shell' },
    ],
  },
];

export const CatalogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setActiveCategory('All');
    setSearch('');
  };

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchBrand && matchSearch;
    });
  }, [search, activeCategory, selectedBrands]);

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
            <h1 className="catalog-title">Industrial Equipment Catalog</h1>
            <p className="catalog-subtitle">Search and filter active fleet inventories across our regional yards.</p>
          </div>
          <div className="results-indicator">
            Showing <strong className="orange-count">{filtered.length}</strong> of {PRODUCTS.length} listings
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
          {/* Sidebar filters (Desktop only) */}
          <aside className="filter-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-header-left">
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </span>
              {(selectedBrands.length > 0 || activeCategory !== 'All' || search.trim() !== '') && (
                <button className="clear-filter-btn" onClick={clearFilters}>
                  <RefreshCw size={12} /> Clear
                </button>
              )}
            </div>

            {/* Search Input block */}
            <div className="filter-block">
              <label className="sidebar-block-title">Search keyword</label>
              <div className="search-input-wrapper">
                <Search size={16} className="search-field-icon" />
                <input
                  type="text"
                  placeholder="e.g. Sullair 185..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-field-input"
                />
              </div>
            </div>

            {/* Brand checkboxes */}
            <div className="filter-block">
              <label className="sidebar-block-title">Filter by Brand</label>
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
          </aside>

          {/* Product Grid area */}
          <main className="catalog-grid-area">
            {/* Mobile search bar trigger overlay */}
            <div className="mobile-search-bar">
              <Search size={18} className="search-field-icon" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-field-input"
              />
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
                    specs={prod.specs}
                    badge={prod.badge}
                    badgeType={prod.badgeType}
                    accentTop={prod.accentTop}
                    onQuote={() => handleQuote(prod.title)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;

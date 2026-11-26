import React, { useState, useRef, useEffect } from 'react';
import { Wrench, ShieldCheck, Scale, Package, Calendar, Zap, ChevronRight, ChevronDown } from 'lucide-react';
import './HomePage.css';
import heroBg from '../assets/hero_bg.png';
import compressorImg from '../assets/compressor.png';
import atlasCopcoSvg from '../assets/atlas_copco.svg';
import sullairSvg from '../assets/sullair.svg';
import ingersollRandSvg from '../assets/ingersoll_rand.svg';
import denairPng from '../assets/denair.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [equipmentDropdownOpen, setEquipmentDropdownOpen] = useState(false);
  const equipmentDropdownRef = useRef<HTMLDivElement>(null);
  const equipmentDropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnterDropdown = () => {
    if (equipmentDropdownTimeoutRef.current) {
      clearTimeout(equipmentDropdownTimeoutRef.current);
    }
    setEquipmentDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    equipmentDropdownTimeoutRef.current = setTimeout(() => {
      setEquipmentDropdownOpen(false);
    }, 220);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (equipmentDropdownRef.current && !equipmentDropdownRef.current.contains(event.target as Node)) {
        setEquipmentDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (equipmentDropdownTimeoutRef.current) {
        clearTimeout(equipmentDropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="home-page-container">
      {/* Redesigned Hero Block with Industrial Workshop Image */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-dim-overlay"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            ENGINEERING EXCELLENCE
          </div>
          <h1 className="hero-title">
            Mandtech Services:<br />
            <span className="text-orange">Your One-Stop Name</span> in Industrial Equipment.
          </h1>
          <p className="hero-desc">
            Providing High-Precision Robust Air Solutions, Air systems, &amp; comprehensive Maintenance Support to: Manufacturing,  Oil &amp; Gas, Mining, Packaging,  Pharmaceuticals, Power Generation, etc., Industries
          </p>
          <div className="hero-cta-group">
            {/* Explore Equipment Sales with Hover/Click Dropdown */}
            <div 
              className="hero-equipment-dropdown-container"
              ref={equipmentDropdownRef}
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button 
                type="button"
                className={`home-btn-primary hero-dropdown-trigger ${equipmentDropdownOpen ? 'active' : ''}`}
                onClick={() => setEquipmentDropdownOpen(prev => !prev)}
                aria-expanded={equipmentDropdownOpen}
              >
                <span>Explore Equipment Sales</span>
                <ChevronDown size={16} className={`hero-cta-chevron ${equipmentDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {equipmentDropdownOpen && (
                <div className="hero-equipment-dropdown-menu">
                  <div 
                    className="hero-dropdown-item"
                    onClick={() => {
                      setEquipmentDropdownOpen(false);
                      onNavigate('equipmentSales');
                    }}
                  >
                    <div className="hero-dropdown-icon">
                      <Scale size={18} />
                    </div>
                    <div className="hero-dropdown-info">
                      <span className="hero-dropdown-title">Air Compressors</span>
                      <span className="hero-dropdown-sub">Electric &amp; Diesel Rotary Screw Fleet</span>
                    </div>
                    <ChevronRight size={14} className="hero-dropdown-arrow" />
                  </div>

                  <div 
                    className="hero-dropdown-item"
                    onClick={() => {
                      setEquipmentDropdownOpen(false);
                      onNavigate('catalog');
                    }}
                  >
                    <div className="hero-dropdown-icon">
                      <Package size={18} />
                    </div>
                    <div className="hero-dropdown-info">
                      <span className="hero-dropdown-title">Spare parts</span>
                      <span className="hero-dropdown-sub">OEM Filters, Valves, Elements &amp; Kits</span>
                    </div>
                    <ChevronRight size={14} className="hero-dropdown-arrow" />
                  </div>

                  <div 
                    className="hero-dropdown-item"
                    onClick={() => {
                      setEquipmentDropdownOpen(false);
                      onNavigate('aftersales');
                    }}
                  >
                    <div className="hero-dropdown-icon">
                      <Wrench size={18} />
                    </div>
                    <div className="hero-dropdown-info">
                      <span className="hero-dropdown-title">lubricants/ special fluids</span>
                      <span className="hero-dropdown-sub">Synthetic Oils, Coolants &amp; Specialty Fluids</span>
                    </div>
                    <ChevronRight size={14} className="hero-dropdown-arrow" />
                  </div>
                </div>
              )}
            </div>

            <button className="home-btn-ghost" onClick={() => onNavigate('support')}>
              Technical Support
            </button>
          </div>
        </div>

        {/* Hero bottom translucent overlay link bar */}
        <div className="hero-bottom-bar-wrapper">
          <div className="container">
            <div className="hero-bottom-bar">
              <div className="bar-item" onClick={() => onNavigate('equipmentSales')}>Air Compressors</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('catalog')}>Spare Parts</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('leasing')}>Leasing &amp; Rentals</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('aftersales')}>Lubricants/Special Fluids</div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Our Core Capabilities Section */}
      <section className="section-padding capabilities-section">
        <div className="container">
          <div className="capabilities-header">
            <h2 className="capabilities-title">Our Core Capabilities</h2>
            <div className="capabilities-accent-line"></div>
          </div>

          <div className="capabilities-grid">
            {/* Card 1: Equipment Sales (Highlighted) */}
            <div className="capability-card highlighted" onClick={() => onNavigate('equipmentSales')}>
              <div className="card-icon-wrapper">
                <Scale size={24} />
              </div>
              <h3 className="card-title">Equipment Sales</h3>
              <p className="card-desc">
                Authorized dealer of world-class air compressors, diesel generators, and heavy-duty drilling rigs tailored for industrial durability.
              </p>
              <button className="card-link-btn text-orange">
                Explore Sales <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>

            {/* Card 2: Spare Parts Supply */}
            <div className="capability-card" onClick={() => onNavigate('catalog')}>
              <div className="card-icon-wrapper">
                <Package size={24} />
              </div>
              <h3 className="card-title">Spare Parts Supply</h3>
              <p className="card-desc">
                Comprehensive inventory of genuine components, hydraulic pumps, and filtration systems ensuring minimal downtime for your operations.
              </p>
              <button className="card-link-btn">
                Catalog Access <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>

            {/* Card 3: Repairs & Servicing */}
            <div className="capability-card" onClick={() => onNavigate('contact')}>
              <div className="card-icon-wrapper">
                <Wrench size={24} />
              </div>
              <h3 className="card-title">Repairs &amp; Servicing</h3>
              <p className="card-desc">
                On-site and workshop-based maintenance by certified technicians specializing in pneumatic and power generation systems.
              </p>
              <button className="card-link-btn" onClick={(e) => { e.stopPropagation(); onNavigate('contact'); }}>
                Get Enquiries <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>

            {/* Card 4: Short & Long Leasing */}
            <div className="capability-card" onClick={() => onNavigate('leasing')}>
              <div className="card-icon-wrapper">
                <Calendar size={24} />
              </div>
              <h3 className="card-title">Short &amp; Long Leasing</h3>
              <p className="card-desc">
                Flexible equipment rental programs designed to scale with your project demands without heavy capital expenditure.
              </p>
              <button className="card-link-btn">
                Leasing Programs <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned High-Performance Power Solutions Two-Column Section */}
      <section className="section-padding power-solutions-section">
        <div className="container power-solutions-grid">
          {/* Left Column: Product Image frame with floating quote card */}
          <div className="power-left-column">
            <div className="power-image-frame">
              <img src={compressorImg} alt="Air Compressor" className="power-product-img" />
              {/* Floating Quote Badge */}
              <div className="power-quote-card">
                <h4 className="quote-title">Technical Lead</h4>
                <p className="quote-body">
                  "Our systems are built to withstand the harshest industrial conditions across the region."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions and stacked key bullet features */}
          <div className="power-right-column">
            <span className="power-small-title">ENGINEERED FOR PERFORMANCE</span>
            <h2 className="power-heading">High-Performance Power Solutions</h2>
            <p className="power-desc">
              Mandtech Services specializes in the integration of advanced power systems that offer maximum efficiency with minimum environmental impact. Our generators are engineered for 24/7 continuous operation.
            </p>

            <div className="power-features-list">
              <div className="power-feature-row">
                <div className="feature-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="feature-text-block">
                  <strong className="feature-title">OEM Certified</strong>
                  <p className="feature-desc">Fully compliant with international standards.</p>
                </div>
              </div>

              <div className="power-feature-row">
                <div className="feature-icon">
                  <Zap size={20} />
                </div>
                <div className="feature-text-block">
                  <strong className="feature-title">Peak Efficiency</strong>
                  <p className="feature-desc">Up to 30% reduction in fuel consumption.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OEM Partners & Global Brands Showcase (Placed below High-Performance Power Solutions) */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-header">
            <span className="partners-tagline">Authorized Distribution &amp; Technical Fleet Brands</span>
            <h2 className="partners-title">Our OEM Partners &amp; Trusted Brands</h2>
            <p className="partners-subtitle">
              Official Distributors of Denair Air Compressors in Nigeria, with certified factory OEM supply and maintenance support across major world-class machinery brands.
            </p>
          </div>

          <div className="partners-grid">
            <div className="partner-card" onClick={() => onNavigate('equipmentSales')} title="Atlas Copco Air Compressors & Fleet">
              <img src={atlasCopcoSvg} alt="Atlas Copco" />
            </div>
            <div className="partner-card" onClick={() => onNavigate('equipmentSales')} title="Sullair Industrial Air Compressors">
              <img src={sullairSvg} alt="Sullair" />
            </div>
            <div className="partner-card" onClick={() => onNavigate('equipmentSales')} title="Denair Air Compressors (Official Distributor in Nigeria)">
              <img src={denairPng} alt="Denair" />
            </div>
            <div className="partner-card" onClick={() => onNavigate('equipmentSales')} title="Ingersoll Rand Compressors & Heavy Equipment">
              <img src={ingersollRandSvg} alt="Ingersoll Rand" />
            </div>
            <div className="partner-card" onClick={() => onNavigate('catalog')} title="Kaeser Compressors OEM Spares & Systems">
              <div className="partner-kaeser-badge">
                <span className="kaeser-main">KAESER</span>
                <span className="kaeser-sub">COMPRESSORS</span>
              </div>
            </div>
            <div className="partner-card" onClick={() => onNavigate('catalog')} title="CompAir Industrial Systems">
              <span className="partner-compair-text">CompAir</span>
            </div>
            <div className="partner-card" onClick={() => onNavigate('leasing')} title="Doosan Industrial Fleet">
              <span className="partner-doosan-text">DOOSAN</span>
            </div>
            <div className="partner-card" onClick={() => onNavigate('equipmentSales')} title="Sollant Industrial Compressors">
              <span className="partner-sollant-text">SOLLANT</span>
            </div>
            <div className="partner-card" onClick={() => onNavigate('leasing')} title="JMG Power & Air Systems">
              <span className="partner-jmg-text">JMG</span>
            </div>
            <div className="partner-card" onClick={() => onNavigate('leasing')} title="Atlas Copco Mobile & Plant Fleet">
              <span className="partner-atlasred-text">Atlas Copco</span>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Stats Strip Section */}
      <section className="stats-strip-section">
        <div className="container stats-grid">
          <div className="stat-item">
            <span className="stat-value">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">500+</span>
            <span className="stat-label">Major Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Support Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">98%</span>
            <span className="stat-label">Client Retention</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

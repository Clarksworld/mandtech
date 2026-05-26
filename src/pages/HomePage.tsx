import React from 'react';
import { Wrench, ShieldCheck, Scale, Package, Calendar, Zap, ChevronRight } from 'lucide-react';
import './HomePage.css';
import heroBg from '../assets/hero_bg.png';
import compressorImg from '../assets/compressor.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
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
            Providing robust solutions for heavy industry, from high-precision air systems to reliable power generation and comprehensive maintenance support.
          </p>
          <div className="hero-cta-group">
            <button className="home-btn-primary" onClick={() => onNavigate('catalog')}>
              View Parts Catalog <ChevronRight size={16} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />
            </button>
            <button className="home-btn-ghost" onClick={() => onNavigate('aftersales')}>
              Technical Support
            </button>
          </div>
        </div>

        {/* Hero bottom translucent overlay link bar */}
        <div className="hero-bottom-bar-wrapper">
          <div className="container">
            <div className="hero-bottom-bar">
              <div className="bar-item" onClick={() => onNavigate('catalog')}>Sales</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('aftersales')}>After-Sales</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('catalog')}>Parts</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('contact')}>Leasing</div>
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
            <div className="capability-card highlighted" onClick={() => onNavigate('catalog')}>
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
            <div className="capability-card" onClick={() => onNavigate('aftersales')}>
              <div className="card-icon-wrapper">
                <Wrench size={24} />
              </div>
              <h3 className="card-title">Repairs & Servicing</h3>
              <p className="card-desc">
                On-site and workshop-based maintenance by certified technicians specializing in pneumatic and power generation systems.
              </p>
              <button className="card-link-btn">
                Book Service <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>

            {/* Card 4: Short & Long Leasing */}
            <div className="capability-card" onClick={() => onNavigate('contact')}>
              <div className="card-icon-wrapper">
                <Calendar size={24} />
              </div>
              <h3 className="card-title">Short & Long Leasing</h3>
              <p className="card-desc">
                Flexible equipment rental programs designed to scale with your project demands without the heavy capital expenditure.
              </p>
              <button className="card-link-btn">
                Lease Terms <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
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

            <button 
              className="power-download-btn"
              onClick={() => alert('Industrial technical data sheet catalog download log registered.')}
            >
              Download Specs Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Redesigned Stats Strip Section (Dark Charcoal Above Footer) */}
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

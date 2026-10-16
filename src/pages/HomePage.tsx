import React, { useState } from 'react';
import { Wrench, ShieldCheck, Scale, Package, Calendar, Zap, ChevronRight, Download, FileText, Check } from 'lucide-react';
import './HomePage.css';
import heroBg from '../assets/hero_bg.png';
import compressorImg from '../assets/compressor.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    // Create an actual downloadable text/spec file dynamically
    const specContent = `MANDTECH SERVICES INDUSTRIAL SPECIFICATIONS CATALOG
------------------------------------------------------
Revision: 2026.Q4
Engineering Standards: ISO 8573.1 Class 0, CE, ASME, SONCAP

1. ROTARY SCREW AIR COMPRESSORS
   - Sullair 185 - 1600 CFM Series (Diesel Driven & Electric)
   - Atlas Copco GA VSD+ Intelligent Variable Speed
   - Kaeser Sigma Profile High-Efficiency Air Ends

2. INDUSTRIAL DIESEL GENERATORS
   - Prime Ratings: 50 kVA - 2250 kVA
   - Engines: Perkins, Cummins, Caterpillar Heavy-Duty
   - Sound Attenuation: 68 dBA @ 7m

3. FLUID MANAGEMENT & PROCESS PUMPS
   - High-Volume Trash & Slurry Pumps (Up to 1500 GPM)
   - Corrosion-Resistant Stainless Impellers

4. REGIONAL HUBS & DISPATCH
   - Lagos VI Operational Hub: +234 (1) 460-7000
   - Port Harcourt Trans-Amadi Hub: +234 (84) 303-900
   - Technical SLA: 24/7 Mobile Dispatch Unit

Mandtech Services Ltd. | engineering@mandtech.com.ng`;

    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mandtech_Industrial_Specs_Catalog.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
      setShowSpecsModal(false);
    }, 2500);
  };

  return (
    <div className="home-page-container">
      {/* Specs Download Modal */}
      {showSpecsModal && (
        <div className="status-modal-overlay" onClick={() => setShowSpecsModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <FileText size={20} className="text-orange" />
                <span>Mandtech Technical Specifications Catalog</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowSpecsModal(false)}>✕</button>
            </div>
            <div className="modal-body-content" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14.5px', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                Download our comprehensive engineering datasheet catalog detailing CFM curves, power factor ratings, diesel fuel burn rates, and ISO standard compliance certifications.
              </p>

              {downloadSuccess ? (
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
                  <span>Datasheet downloaded successfully!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => setShowSpecsModal(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      padding: '10px 18px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: '#374151'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulateDownload}
                    style={{
                      background: 'var(--primary-container)',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={16} /> Download Datasheet (.TXT)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
            <button className="home-btn-primary" onClick={() => onNavigate('equipmentSales')}>
              Explore Equipment Sales <ChevronRight size={16} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />
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
              <div className="bar-item" onClick={() => onNavigate('equipmentSales')}>Equipment Sales</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('aftersales')}>After-Sales</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('catalog')}>Parts Catalog</div>
              <div className="bar-divider"></div>
              <div className="bar-item" onClick={() => onNavigate('leasing')}>Leasing &amp; Rentals</div>
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
            <div className="capability-card" onClick={() => onNavigate('aftersales')}>
              <div className="card-icon-wrapper">
                <Wrench size={24} />
              </div>
              <h3 className="card-title">Repairs &amp; Servicing</h3>
              <p className="card-desc">
                On-site and workshop-based maintenance by certified technicians specializing in pneumatic and power generation systems.
              </p>
              <button className="card-link-btn">
                Book Service <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
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

            <button 
              className="power-download-btn"
              onClick={() => setShowSpecsModal(true)}
            >
              <Download size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Download Specs Catalog
            </button>
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

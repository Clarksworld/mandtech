import React from 'react';
import { Settings, Wrench, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import './HomePage.css';

const STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '24/7', label: 'Technical Support' },
  { value: '500+', label: 'Assets Leased' },
  { value: '100%', label: 'Genuine Parts' },
];

const SERVICES = [
  { icon: '⚙️', title: 'Air Compressors', sub: 'Diesel & Electric Driven', desc: 'Sullair, Atlas Copco, and Kaeser high-pressure heavy lines.' },
  { icon: '⚡', title: 'Generators', sub: '20kVA – 2000kVA', desc: 'Cummins, Perkins, and Caterpillar diesel power plants.' },
  { icon: '💧', title: 'Pumps', sub: 'Fluid Management Systems', desc: 'High GPM torque diesel and submersible pumps for sites.' },
  { icon: '🌬️', title: 'Air Dryers', sub: 'Refrigerant & Desiccant', desc: 'Zero emissions systems ensuring perfectly moisture-free air.' },
];

const FEATURES = [
  { 
    icon: <Wrench size={24} className="feature-lucide" />, 
    title: 'Repairs & Servicing', 
    desc: 'Full overhaul, precision calibration & preventative maintenance for heavy machinery.' 
  },
  { 
    icon: <Settings size={24} className="feature-lucide" />, 
    title: 'Short & Long Leasing', 
    desc: 'Flexible project-based (1–6 months) or strategic enterprise partnerships (12–60 months).' 
  },
  { 
    icon: <Truck size={24} className="feature-lucide" />, 
    title: 'Rapid Mobilisation', 
    desc: 'Same-day site deployment across Nigeria with our dedicated heavy transport logistics fleet.' 
  },
  { 
    icon: <ShieldCheck size={24} className="feature-lucide" />, 
    title: 'SLA Warranted Quality', 
    desc: 'Guaranteed 98% operational uptime contracts backed by genuine OEM spares.' 
  },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="home-page-container">
      {/* Hero Block */}
      <section className="hero-section">
        <div className="hero-mesh-overlay">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="hero-grid-dot"></div>
          ))}
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>INDUSTRIAL EQUIPMENT SOLUTIONS</span>
          </div>
          <h1 className="hero-title">
            Engineering <span className="text-orange">Excellence</span> <br />
            for Heavy Industry
          </h1>
          <p className="hero-desc">
            Premium diesel/electric air compressors, sound-attenuated generators, fluid management pumps, and desiccant dryers. Built for strategic engineering, oil & gas, and manufacturing yards.
          </p>
          <div className="hero-cta-group">
            <button className="home-btn-primary" onClick={() => onNavigate('catalog')}>
              Browse Equipment Catalog
            </button>
            <button className="home-btn-ghost" onClick={() => onNavigate('contact')}>
              Request Consulting RFQ
            </button>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip-section">
        <div className="container stats-grid">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Lines Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-accent-bar"></span>
            <div>
              <h2 className="section-title">Core Product Lines</h2>
              <p className="section-subtitle">Heavy-duty hardware engineered for the most demanding sites.</p>
            </div>
          </div>

          <div className="product-lines-grid">
            {SERVICES.map((svc, i) => (
              <div 
                key={i} 
                className="product-line-card" 
                onClick={() => onNavigate('catalog')}
              >
                <div className="line-icon-row">
                  <span className="line-emoji">{svc.icon}</span>
                  <ChevronRight size={18} className="line-arrow" />
                </div>
                <h3 className="line-title">{svc.title}</h3>
                <span className="line-sub">{svc.sub}</span>
                <p className="line-desc">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mandtech Features Section */}
      <section className="section-padding dark-features-section">
        <div className="container">
          <div className="section-header text-center-mobile">
            <span className="section-accent-bar accent-orange"></span>
            <div>
              <h2 className="section-title text-white">Why Mandtech?</h2>
              <p className="section-subtitle text-muted">A trusted industrial partner to Nigeria's leading sectors since 2004.</p>
            </div>
          </div>

          <div className="features-grid">
            {FEATURES.map((feat, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrapper">
                  {feat.icon}
                </div>
                <div className="feature-info">
                  <h3 className="feature-card-title">{feat.title}</h3>
                  <p className="feature-card-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Service Intake Banner */}
      <section className="container banner-padding">
        <div className="service-banner-card">
          <div className="banner-left">
            <h2 className="banner-title">Need Urgent Maintenance or Servicing?</h2>
            <p className="banner-desc">
              Log a support ticket instantly. Our industrial service coordinates, calibrations, and emergency dispatch squads are active 24/7.
            </p>
          </div>
          <div className="banner-right">
            <button className="banner-btn" onClick={() => onNavigate('aftersales')}>
              Service Intake Portal →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

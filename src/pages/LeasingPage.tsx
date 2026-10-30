import React from 'react';
import {
  Zap, Shield, Clock, Truck, ArrowRight
} from 'lucide-react';
import type { LeasingCompressorType, LeasingBrand } from '../components/LeasingQuoteModal';
import './LeasingPage.css';

// Assets
import heroBg from '../assets/hero_bg.png';
import electricImg from '../assets/electric_compressor.jpg';
import dieselImg from '../assets/diesel_compressor.jpg';

interface LeasingPageProps {
  onNavigateToContact?: () => void;
  onOpenLeasingModal?: (type?: LeasingCompressorType, brand?: LeasingBrand) => void;
}

export const LeasingPage: React.FC<LeasingPageProps> = ({ onOpenLeasingModal }) => {
  return (
    <div className="leasing-page-container">
      {/* Hero */}
      <section className="leasing-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="leasing-hero-overlay" />
        <div className="container leasing-hero-content">
          <div className="leasing-badge">
            <Clock size={14} /> LEASING &amp; RENTALS DISPATCH
          </div>
          <h1 className="leasing-hero-title">
            Industrial Equipment Leasing and Rentals.<br />
            Zero CapEx. 100% Operational Readiness.
          </h1>
          <p className="leasing-hero-desc">
            Deploy tier-1 electric and diesel rotary screw air compressors on flexible spot or project terms. Backed by guaranteed 4-hour hot-swap SLA, OEM parts, and certified on-site technicians across Nigeria.
          </p>
          <div className="leasing-hero-highlights">
            <div className="hero-highlight-pill">
              <Shield size={16} /> 24/7 Field Techs Included
            </div>
            <div className="hero-highlight-pill">
              <Truck size={16} /> Rapid Mobilization in PHC, Lagos &amp; Abuja
            </div>
            <div className="hero-highlight-pill">
              <Zap size={16} /> Full Load Bank Tested Before Dispatch
            </div>
          </div>
        </div>
      </section>

      {/* Compressor Rental Types Quick Launch Section */}
      <section className="container leasing-power-selector-section" style={{ marginTop: '-40px', position: 'relative', zIndex: 4, marginBottom: '60px' }}>
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px solid #e2e8f0', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-container)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                COMPRESSOR RENTAL &amp; LEASING FLEET
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#121412', margin: '3px 0 0' }}>
                Select Compressor Power Specification
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>OEM Fleets:</span>
              {(['ATLAS COPCO', 'SULLAIR', 'INGERSOLL RAND', 'DENAIR', 'OTHERS'] as LeasingBrand[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onOpenLeasingModal && onOpenLeasingModal(undefined, b)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#121412',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-container)';
                    e.currentTarget.style.color = 'var(--primary-container)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#121412';
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {/* Electric Air Compressor Card */}
            <div 
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fafbfa',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onOpenLeasingModal && onOpenLeasingModal('ELECTRIC AIR COMPRESSOR')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-container)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(84, 180, 53, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
                  <img src={electricImg} alt="Electric Air Compressor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#1d4ed8', background: '#dbeafe', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      STATIONARY PLANT FLEET
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      ELECTRIC AIR COMPRESSOR
                    </h3>
                  </div>
                </div>
                <div style={{ padding: '16px 20px 0' }}>
                  <p style={{ fontSize: '13px', color: '#555d55', lineHeight: '1.5', margin: '0 0 12px' }}>
                    High-efficiency electric rotary screw rental units for manufacturing, food &amp; beverage, and industrial plants (400V 3-Phase).
                  </p>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '16px' }}>
                    Available Brands: ATLAS COPCO • SULLAIR • INGERSOLL RAND • DENAIR • OTHERS
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #edf2f7' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>4-Hour Hot Swap SLA</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-container)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Start Rental Request <ArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Diesel Air Compressor Card */}
            <div 
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fafbfa',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onOpenLeasingModal && onOpenLeasingModal('DIESEL AIR COMPRESSOR')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-container)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(84, 180, 53, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
                  <img src={dieselImg} alt="Diesel Air Compressor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#c2410c', background: '#ffedd5', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      PORTABLE FIELD FLEET
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      DIESEL AIR COMPRESSOR
                    </h3>
                  </div>
                </div>
                <div style={{ padding: '16px 20px 0' }}>
                  <p style={{ fontSize: '13px', color: '#555d55', lineHeight: '1.5', margin: '0 0 12px' }}>
                    Heavy-duty towable diesel compressors (185 – 1600 CFM) engineered for offshore barges, pipelines, mining, and remote sites.
                  </p>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '16px' }}>
                    Available Brands: ATLAS COPCO • SULLAIR • INGERSOLL RAND • DENAIR • OTHERS
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #edf2f7' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Immediate Yard Dispatch</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-container)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Start Rental Request <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeasingPage;

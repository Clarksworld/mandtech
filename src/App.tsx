import React, { useState } from 'react';
import { ShieldCheck, Search, Share2, Mail } from 'lucide-react';
import { MandtechLogo } from './components/Logo';
import { useInquiry } from './context/InquiryContext';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AfterSalesPage from './pages/AfterSalesPage';
import ContactPage from './pages/ContactPage';
import EquipmentSalesPage from './pages/EquipmentSalesPage';
import LeasingPage from './pages/LeasingPage';
import './App.css';

export type ActivePage = 'home' | 'catalog' | 'equipmentSales' | 'leasing' | 'aftersales' | 'contact';

interface InfoModalState {
  title: string;
  content: React.ReactNode;
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalState | null>(null);
  const [navSearch, setNavSearch] = useState('');

  const { inquiryItems, setGlobalSearch } = useInquiry();

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setGlobalSearch(navSearch.trim());
      setActivePage('catalog');
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={(page) => setActivePage(page as ActivePage)} />;
      case 'equipmentSales':
        return <EquipmentSalesPage />;
      case 'catalog':
        return <CatalogPage />;
      case 'leasing':
        return <LeasingPage onNavigateToContact={() => setActivePage('contact')} />;
      case 'aftersales':
        return <AfterSalesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={(page) => setActivePage(page as ActivePage)} />;
    }
  };

  return (
    <div className="app-web-wrapper">
      {/* Dynamic Status Operations Banner Popup */}
      {showStatusModal && (
        <div className="status-modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <ShieldCheck size={20} className="text-orange" />
                <span>System Operations Directory</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowStatusModal(false)}>✕</button>
            </div>
            <div className="modal-body-content">
              <div className="status-indicator-block">
                <div className="pulse-green-dot"></div>
                <div className="status-info-text">
                  <strong>Emergency Logistics: ACTIVE</strong>
                  <p>All emergency yards are staffed. Heavy dispatch vehicles are fully staged within regional sectors.</p>
                </div>
              </div>
              <ul className="status-check-list">
                <li>🟢 Lagos VI Annex: <strong>ONLINE</strong> (12 dispatches active)</li>
                <li>🟢 PH Trans-Amadi Yard: <strong>ONLINE</strong> (8 dispatches active)</li>
                <li>🟢 Escravos Offshore Staging: <strong>STANDBY</strong> (2 barges on call)</li>
                <li>🟢 24/7 Technical Hotline: <strong>OPERATIONAL</strong> (Average answer: 8s)</li>
              </ul>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="info-modal-action-btn"
                  onClick={() => setShowStatusModal(false)}
                >
                  Close Operational View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Info / Terms Modal */}
      {infoModal && (
        <div className="info-modal-backdrop" onClick={() => setInfoModal(null)}>
          <div className="info-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3>{infoModal.title}</h3>
              <button className="info-modal-close-btn" onClick={() => setInfoModal(null)}>✕</button>
            </div>
            <div className="info-modal-body">
              {infoModal.content}
            </div>
            <div className="info-modal-footer">
              <button className="info-modal-action-btn" onClick={() => setInfoModal(null)}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global brand navigation navbar */}
      <header className="global-navbar">
        <div className="container nav-container">
          {/* Logo & Brand Name */}
          <div className="nav-brand-group" onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>
            <MandtechLogo size={32} color="var(--deep-charcoal)" accentColor="var(--primary-container)" />
            <div className="brand-text-block">
              <span className="brand-primary-name">Mandtech</span>
              <span className="brand-secondary-name">Services</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="nav-links-list">
            <button
              className={`nav-item-btn ${activePage === 'home' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('home')}
            >
              Home
            </button>
            <button
              className={`nav-item-btn ${activePage === 'equipmentSales' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('equipmentSales')}
            >
              Equipment Sales
            </button>
            <button
              className={`nav-item-btn ${activePage === 'catalog' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('catalog')}
            >
              Parts Catalog
            </button>
            <button
              className={`nav-item-btn ${activePage === 'leasing' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('leasing')}
            >
              Leasing &amp; Rentals
            </button>
            <button
              className={`nav-item-btn ${activePage === 'aftersales' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('aftersales')}
            >
              After-Sales
            </button>
          </nav>

          {/* Search box, Yard Status chip & Action Button */}
          <div className="nav-actions-group">
            {/* Live Yard Status Trigger Button */}
            <button
              className="nav-yard-status-pill"
              onClick={() => setShowStatusModal(true)}
              title="Click to inspect real-time yard operations and technician readiness"
            >
              <span className="pulse-green-dot" />
              <span>Yards: <strong>ONLINE</strong></span>
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleNavSearch} className="nav-search-box">
              <Search size={16} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search components..."
                className="nav-search-input"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </form>

            {/* Inquiry Basket Button */}
            <button
              className="nav-inquiry-btn"
              onClick={() => setActivePage('contact')}
            >
              Get an Inquiry
              {inquiryItems.length > 0 && (
                <span className="nav-inquiry-badge">{inquiryItems.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Page body render */}
      <main className="primary-content-body">
        {renderActivePage()}
      </main>

      {/* Global responsive Footer */}
      <footer className="global-footer">
        <div className="container footer-grid">
          {/* Column 1: Brand description and social */}
          <div className="footer-brand-column">
            <div className="footer-brand-logo" onClick={() => setActivePage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MandtechLogo size={32} color="#ffffff" accentColor="var(--primary-container)" />
              <div className="brand-text-block" style={{ marginLeft: 0 }}>
                <span className="brand-primary-name text-white">Mandtech</span>
                <span className="brand-secondary-name text-white" style={{ display: 'block', marginTop: '2px' }}>Services</span>
              </div>
            </div>
            <p className="footer-brand-desc" style={{ marginTop: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
              Providing premium industrial equipment solutions, OEM parts distribution, and technical maintenance services across Nigeria and West Africa since 2004.
            </p>
          </div>

          {/* Column 2: Product Lines */}
          <div className="footer-links-column">
            <h4 className="footer-section-title" style={{ fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#ffffff', marginBottom: '18px' }}>Product Lines</h4>
            <ul className="footer-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><button onClick={() => setActivePage('equipmentSales')} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Air Compressors</button></li>
              <li><button onClick={() => setActivePage('equipmentSales')} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Industrial Generators</button></li>
              <li><button onClick={() => setActivePage('equipmentSales')} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Fluid Management Pumps</button></li>
              <li><button onClick={() => setActivePage('equipmentSales')} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Desiccant Air Dryers</button></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-links-column">
            <h4 className="footer-section-title" style={{ fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#ffffff', marginBottom: '18px' }}>Services</h4>
            <ul className="footer-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <button
                  onClick={() => setInfoModal({
                    title: 'On-Site Maintenance & Overhaul Service',
                    content: (
                      <div>
                        <p>Mandtech provides on-site field maintenance by OEM-certified mechanical and electrical specialists across Nigeria:</p>
                        <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <li><strong>Routine Service Contracts:</strong> 250h, 500h, 1000h, and 2000h scheduled preventative maintenance.</li>
                          <li><strong>Diagnostic Testing:</strong> Laser alignment, oil sampling, vibration telemetry, and pressure decay auditing.</li>
                          <li><strong>24/7 Rapid Emergency Response:</strong> Dedicated dispatch vans stationed at Lagos and Port Harcourt yards.</li>
                        </ul>
                      </div>
                    )
                  })}
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}
                >
                  On-Site Maintenance
                </button>
              </li>
              <li><button onClick={() => setActivePage('leasing')} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Equipment Rentals</button></li>
              <li>
                <button
                  onClick={() => setInfoModal({
                    title: 'Industrial Compressed Air & Power Audits',
                    content: (
                      <div>
                        <p>Save up to 30% on industrial plant energy consumption through Mandtech's comprehensive technical audits:</p>
                        <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <li><strong>Flow &amp; Pressure Profiling:</strong> Identify artificial demand and line leaks.</li>
                          <li><strong>Power Quality Logging:</strong> Evaluate generator fuel efficiency and peak power factor.</li>
                          <li><strong>Air Purity Testing:</strong> Verify ISO 8573.1 Class 1/Class 0 air quality compliance.</li>
                        </ul>
                      </div>
                    )
                  })}
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}
                >
                  System Audits
                </button>
              </li>
              <li><button onClick={() => setActivePage('catalog')} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Parts &amp; Spares</button></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="footer-links-column">
            <h4 className="footer-section-title" style={{ fontSize: '11px', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#ffffff', marginBottom: '18px' }}>Connect</h4>
            <div className="footer-social-icons" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <a
                href="mailto:info@mandtech.com.ng"
                style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none' }}
                title="Email Mandtech"
              >
                <Mail size={16} />
              </a>
              <button
                onClick={() => setInfoModal({
                  title: 'Corporate Share & Media Inquiries',
                  content: (
                    <p>For corporate media, public relations, and tender bid distributions, please contact <strong>corporate@mandtech.com.ng</strong> or visit our Lagos Headquarters.</p>
                  )
                })}
                style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', backgroundColor: 'transparent' }}
                title="Share & Media"
              >
                <Share2 size={16} />
              </button>
            </div>
            <p className="footer-contact-text" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
              HQ: Victoria Island Industrial Zone,<br />Lagos, Nigeria<br />
              Yard: Trans-Amadi, Port Harcourt
            </p>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="footer-bottom-bar" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0', marginTop: '48px' }}>
          <div className="container bottom-bar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span className="copyright-text" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
              © {new Date().getFullYear()} Mandtech Services Ltd. All Rights Reserved.
            </span>
            <div className="footer-bottom-links" style={{ display: 'flex', gap: '24px' }}>
              <button
                onClick={() => setInfoModal({
                  title: 'Platform Sitemap',
                  content: (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      <div onClick={() => { setActivePage('home'); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Home Page</div>
                      <div onClick={() => { setActivePage('equipmentSales'); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Equipment Sales</div>
                      <div onClick={() => { setActivePage('catalog'); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Parts Catalog</div>
                      <div onClick={() => { setActivePage('leasing'); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Leasing &amp; Rentals</div>
                      <div onClick={() => { setActivePage('aftersales'); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• After-Sales &amp; Service</div>
                      <div onClick={() => { setActivePage('contact'); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Contact &amp; Inquiry</div>
                    </div>
                  )
                })}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }}
              >
                Sitemap
              </button>
              <button
                onClick={() => setInfoModal({
                  title: 'Privacy Policy',
                  content: (
                    <div>
                      <p>Mandtech Services Ltd values your privacy. We collect client contact and facility information solely to process equipment procurement, service dispatches, and contractual SLAs.</p>
                      <p style={{ marginTop: '10px' }}>No information is sold or transferred to third-party marketing entities. Technical and telemetry logs are encrypted and stored in compliance with applicable Nigerian data protection regulations.</p>
                    </div>
                  )
                })}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setInfoModal({
                  title: 'Terms of Service',
                  content: (
                    <div>
                      <p>All equipment sales, spare parts distribution, and field maintenance contracts executed by Mandtech Services are subject to formal quotation terms, OEM warranty boundaries, and client site safety clearance agreements.</p>
                      <p style={{ marginTop: '10px' }}>Mobilization times are dependent upon signed work authorizations and site readiness certificates.</p>
                    </div>
                  )
                })}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActivePage('contact')}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

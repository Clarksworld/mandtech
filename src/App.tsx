import { useState } from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import { MandtechLogo } from './components/Logo';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AfterSalesPage from './pages/AfterSalesPage';
import ContactPage from './pages/ContactPage';
import EquipmentSalesPage from './pages/EquipmentSalesPage';
import './App.css';

type ActivePage = 'home' | 'catalog' | 'equipmentSales' | 'aftersales' | 'contact';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('catalog'); // Set 'catalog' active to default to the Parts Catalog as per mockup
  const [showStatusModal, setShowStatusModal] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={(page) => setActivePage(page as ActivePage)} />;
      case 'equipmentSales':
        return <EquipmentSalesPage />;
      case 'catalog':
        return <CatalogPage />;
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
      {/* Dynamic Status Banner popup */}
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
                  <p>All emergency yards are staffed. Dispatch vehicles are en route within designated regions.</p>
                </div>
              </div>
              <ul className="status-check-list">
                <li>🟢 Lagos VI Yard: <strong>ONLINE</strong> (12 dispatches today)</li>
                <li>🟢 PH Trans-Amadi: <strong>ONLINE</strong> (6 dispatches today)</li>
                <li>🟢 Technical Hotline: <strong>OPERATIONAL</strong> (Average answer: 8s)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Global brand navigation navbar (Redesigned Light Theme) */}
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
              className={`nav-item-btn ${activePage === 'contact' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('contact')}
            >
              Leasing & Rentals
            </button>
            <button
              className={`nav-item-btn ${activePage === 'aftersales' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('aftersales')}
            >
              After-Sales
            </button>
          </nav>

          {/* Search box and Action Button */}
          <div className="nav-actions-group">
            <div className="nav-search-box">
              <Search size={16} className="nav-search-icon" />
              <input 
                type="text" 
                placeholder="Search components..." 
                className="nav-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert(`Searching catalog for keyword: "${(e.target as HTMLInputElement).value}"`);
                    setActivePage('catalog');
                  }
                }}
              />
            </div>
            <button 
              className="nav-inquiry-btn"
              onClick={() => setActivePage('contact')}
            >
              Get an Inquiry
            </button>
          </div>
        </div>
      </header>

      {/* Primary Page body render */}
      <main className="primary-content-body">
        {renderActivePage()}
      </main>

      {/* Global responsive Footer (Redesigned 4-Column Dark Theme) */}
      <footer className="global-footer">
        <div className="container footer-grid">
          {/* Column 1: Brand description and social */}
          <div className="footer-brand-column">
            <div className="footer-brand-logo" onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>
              <MandtechLogo size={32} color="#FFFFFF" accentColor="var(--primary-container)" />
              <div className="brand-text-block">
                <span className="brand-primary-name text-orange">Mandtech</span>
                <span className="brand-secondary-name text-white">Services</span>
              </div>
            </div>
            <p className="footer-brand-desc" style={{ marginTop: '12px' }}>
              Industrial excellence in equipment lifecycle management and parts distribution.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-column">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-items-list">
              <li><button onClick={() => setActivePage('equipmentSales')}>Equipment Sales</button></li>
              <li><button onClick={() => setActivePage('contact')}>Leasing & Rentals</button></li>
              <li><button onClick={() => setActivePage('catalog')} style={{ textDecoration: 'underline', color: 'var(--primary-container)' }}>Parts Catalog</button></li>
              <li><button onClick={() => setActivePage('aftersales')}>After-Sales</button></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-links-column">
            <h4 className="footer-section-title">Resources</h4>
            <ul className="footer-items-list">
              <li><button onClick={() => alert('Loading Maintenance Manuals...')}>Maintenance Manuals</button></li>
              <li><button onClick={() => setActivePage('aftersales')}>Service Request</button></li>
              <li><button onClick={() => alert('Loading Technical Guides...')}>Technical Guides</button></li>
              <li><button onClick={() => alert('Loading OEM Compliance resources...')}>OEM Compliance</button></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-links-column">
            <h4 className="footer-section-title">Contact Us</h4>
            <p className="footer-contact-text" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '12px' }}>
              Plot 24A, Industrial Area Phase II,<br />Johannesburg, SA
            </p>
            <p className="footer-contact-email" style={{ fontSize: '13.5px' }}>
              <a href="mailto:parts@mandtech.co.za" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffffff'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}>
                parts@mandtech.co.za
              </a>
            </p>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="footer-bottom-bar">
          <div className="container bottom-bar-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span className="copyright-text">
              © 2024 Mandtech Services. All Rights Reserved.
            </span>
            <div className="footer-bottom-links" style={{ display: 'flex', gap: '20px' }}>
              <button onClick={() => alert('Sitemap')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffffff'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>Sitemap</button>
              <button onClick={() => alert('Privacy Policy')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffffff'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>Privacy Policy</button>
              <button onClick={() => alert('Terms of Service')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', transition: 'color 0.2s' }} onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ffffff'} onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

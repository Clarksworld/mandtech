import { useState } from 'react';
import { ShieldCheck, Search, Globe, Share2 } from 'lucide-react';
import { MandtechLogo } from './components/Logo';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AfterSalesPage from './pages/AfterSalesPage';
import ContactPage from './pages/ContactPage';
import './App.css';

type ActivePage = 'home' | 'catalog' | 'aftersales' | 'contact';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={(page) => setActivePage(page as ActivePage)} />;
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      alert(`Newsletter subscription registered for: ${emailInput}`);
      setEmailInput('');
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
              className={`nav-item-btn ${activePage === 'catalog' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('catalog')}
            >
              Equipment Sales
            </button>
            <button
              className={`nav-item-btn`}
              onClick={() => setActivePage('catalog')}
            >
              Parts Catalog
            </button>
            <button
              className={`nav-item-btn`}
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
            <p className="footer-brand-desc">
              Pioneering industrial reliability through superior equipment and unmatched technical expertise since 2008.
            </p>
            <div className="footer-social-row">
              <button className="footer-social-btn" onClick={() => alert('Corporate Website: www.mandtech.com.ng')}>
                <Globe size={16} />
              </button>
              <button className="footer-social-btn" onClick={() => alert('Share Mandtech Services profile link.')}>
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-column">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-items-list">
              <li><button onClick={() => setActivePage('catalog')}>Parts Catalog</button></li>
              <li><button onClick={() => setActivePage('catalog')}>Equipment Sales</button></li>
              <li><button onClick={() => setActivePage('aftersales')}>Service Request</button></li>
              <li><button onClick={() => setActivePage('contact')}>Leasing Terms</button></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-links-column">
            <h4 className="footer-section-title">Resources</h4>
            <ul className="footer-items-list">
              <li><button onClick={() => alert('Sitemap directory load')}>Sitemap</button></li>
              <li><button onClick={() => alert('Privacy Policy document download')}>Privacy Policy</button></li>
              <li><button onClick={() => alert('Terms of Service document download')}>Terms of Service</button></li>
              <li><button onClick={() => alert('Technical data sheets catalog loaded')}>Technical Data</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-newsletter-column">
            <h4 className="footer-section-title">Newsletter</h4>
            <p className="footer-newsletter-desc">
              Stay updated with our latest industrial solutions.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                className="footer-newsletter-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button type="submit" className="footer-newsletter-submit">
                <Share2 size={16} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="footer-bottom-bar">
          <div className="container bottom-bar-inner">
            <span className="copyright-text">
              © 2024 Mandtech Services, All Rights Reserved.
            </span>
            <button className="footer-contact-link" onClick={() => setActivePage('contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

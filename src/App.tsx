import React, { useState } from 'react';
import { Bell, Info, ShieldCheck, Mail, MapPin, PhoneCall, Heart } from 'lucide-react';
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

      {/* Global brand navigation navbar */}
      <header className="global-navbar">
        <div className="container nav-container">
          {/* Logo & Brand Name */}
          <div className="nav-brand-group" onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>
            <MandtechLogo size={36} color="#FFFFFF" accentColor="var(--primary-container)" />
            <div className="brand-text-block">
              <span className="brand-primary-name">MANDTECH</span>
              <span className="brand-secondary-name">DIGITAL IDENTITY SYSTEM</span>
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
              Catalog
            </button>
            <button
              className={`nav-item-btn ${activePage === 'aftersales' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('aftersales')}
            >
              After-Sales
            </button>
            <button
              className={`nav-item-btn ${activePage === 'contact' ? 'nav-active' : ''}`}
              onClick={() => setActivePage('contact')}
            >
              Contact
            </button>
          </nav>

          {/* Quick Info bar */}
          <div className="nav-actions-group">
            <button 
              className="status-trigger-badge"
              onClick={() => setShowStatusModal(true)}
              title="System Operations Status"
            >
              <span className="pulse-green-dot"></span>
              <span className="badge-text-label">System Active</span>
            </button>
            
            <button 
              className="notification-navbar-btn" 
              onClick={() => {
                alert('Notification Center: Dispatch system calibrated. Routine dispatches completed.');
              }}
            >
              <Bell size={18} />
              <span className="notif-counter-bubble">1</span>
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
          {/* Column 1: Brand description */}
          <div className="footer-brand-column">
            <div className="footer-brand-logo">
              <MandtechLogo size={32} color="#FFFFFF" accentColor="var(--primary-container)" />
              <span className="footer-brand-name">MANDTECH</span>
            </div>
            <p className="footer-brand-desc">
              Nigeria's specialized industrial partner since 2004. Engineering high-pressure air and prime standby power dispatches for manufacturing yards and refining depots.
            </p>
          </div>

          {/* Column 2: Navigation map */}
          <div className="footer-links-column">
            <h4 className="footer-section-title">FLEET SERVICES</h4>
            <ul className="footer-items-list">
              <li><button onClick={() => setActivePage('catalog')}>Browse Compressors</button></li>
              <li><button onClick={() => setActivePage('catalog')}>Generator Inventory</button></li>
              <li><button onClick={() => setActivePage('aftersales')}>Servicing SLA</button></li>
              <li><button onClick={() => setActivePage('contact')}>Consulting RFQ</button></li>
            </ul>
          </div>

          {/* Column 3: Contact indices */}
          <div className="footer-contact-column">
            <h4 className="footer-section-title">LAGOS HEADQUARTERS</h4>
            <div className="footer-contact-details">
              <p><MapPin size={14} /> Industrial Park Phase II, Victoria Island, Lagos</p>
              <p><PhoneCall size={14} /> +234 (1) 460-7000</p>
              <p><Mail size={14} /> info@mandtech.com.ng</p>
            </div>
          </div>
        </div>

        {/* Bottom footer credit */}
        <div className="footer-bottom-bar">
          <div className="container bottom-bar-inner">
            <span className="copyright-text">
              © {new Date().getFullYear()} Mandtech Services Limited. All rights reserved.
            </span>
            <span className="credit-text">
              Industrial Kinetic Identity System. Crafted with <Heart size={10} className="text-orange" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

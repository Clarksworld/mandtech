import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Search, Share2, Mail, ChevronDown, ArrowRight, 
  Zap, Activity, Wrench, Truck, 
  FileText, Menu, X, Phone, CheckCircle, Flame,
  Gauge, Shield, Cpu
} from 'lucide-react';
import { MandtechLogo } from './components/Logo';
import { useInquiry } from './context/InquiryContext';
import HomePage from './pages/HomePage';
import SparePartsPage from './pages/SparePartsPage';
import AfterSalesPage from './pages/AfterSalesPage';
import ContactPage from './pages/ContactPage';
import EquipmentSalesPage from './pages/EquipmentSalesPage';
import CompressorQuoteModal from './components/CompressorQuoteModal';
import { type SparePartsBrand } from './components/SparePartsQuoteModal';
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCompressorType, setSelectedCompressorType] = useState<'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR' | null>(null);
  const [compressorModalOpen, setCompressorModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR' | null>(null);
  const [selectedSparePartsBrand, setSelectedSparePartsBrand] = useState<SparePartsBrand | null>(null);

  const openCompressorModal = (type?: 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR') => {
    setModalInitialType(type || null);
    setCompressorModalOpen(true);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const navigateToCompressors = (type?: 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR') => {
    setSelectedCompressorType(type || null);
    navigateTo('equipmentSales');
  };

  const navigateToSpareParts = (brand?: SparePartsBrand) => {
    setSelectedSparePartsBrand(brand || null);
    navigateTo('catalog');
  };

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { inquiryItems, setGlobalSearch } = useInquiry();

  const handleMouseEnter = (key: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setGlobalSearch(navSearch.trim());
      navigateTo('catalog');
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={(page) => navigateTo(page as ActivePage)} />;
      case 'equipmentSales':
        return <EquipmentSalesPage initialType={selectedCompressorType} />;
      case 'catalog':
        return <SparePartsPage initialBrand={selectedSparePartsBrand} />;
      case 'leasing':
        return <LeasingPage onNavigateToContact={() => navigateTo('contact')} />;
      case 'aftersales':
        return <AfterSalesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={(page) => navigateTo(page as ActivePage)} />;
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

      {/* Professional Chainstack-Style Navbar */}
      <header className="global-navbar">
        <div className="container nav-container">
          {/* Brand Logo & Name */}
          <div className="nav-brand-group" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <MandtechLogo size={34} color="var(--black)" accentColor="var(--primary-container)" />
            <div className="brand-text-block">
              <span className="brand-primary-name">MANDTECH</span>
              <span className="brand-secondary-name">SERVICES</span>
            </div>
          </div>

          {/* Desktop Chainstack-Style Mega Navigation */}
          <nav className="desktop-nav-menu">
            {/* Nav Item: Air Compressors */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('equipment')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`desktop-nav-link ${activePage === 'equipmentSales' ? 'nav-active' : ''} ${activeDropdown === 'equipment' ? 'dropdown-active' : ''}`}
                onClick={() => navigateToCompressors()}
              >
                <span>Air Compressors</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>

              {activeDropdown === 'equipment' && (
                <div className="mega-menu-panel compressor-dropdown-panel" onMouseEnter={() => handleMouseEnter('equipment')} onMouseLeave={handleMouseLeave}>
                  <div className="compressor-dropdown-content">
                    <div className="compressor-dropdown-header">
                      <span>SELECT COMPRESSOR CONFIGURATION</span>
                      <span className="compressor-dropdown-badge">2 OPTIONS</span>
                    </div>
                    <div className="compressor-dropdown-grid">
                      {/* Option 1: ELECTRIC AIR COMPRESSOR */}
                      <div 
                        className="compressor-dropdown-item"
                        onClick={() => openCompressorModal('ELECTRIC AIR COMPRESSOR')}
                      >
                        <div className="compressor-item-icon-box electric">
                          <Zap size={22} />
                        </div>
                        <div className="compressor-item-info">
                          <div className="compressor-item-title">ELECTRIC AIR COMPRESSOR</div>
                          <div className="compressor-item-desc">High-efficiency stationary rotary screw units for industrial plants (400V 3-Phase).</div>
                          <span className="compressor-item-tag">ATLAS COPCO • SULLAIR • INGERSOLL RAND • DENAIR</span>
                        </div>
                      </div>

                      {/* Option 2: DIESEL AIR COMPRESSOR */}
                      <div 
                        className="compressor-dropdown-item"
                        onClick={() => openCompressorModal('DIESEL AIR COMPRESSOR')}
                      >
                        <div className="compressor-item-icon-box diesel">
                          <Flame size={22} />
                        </div>
                        <div className="compressor-item-info">
                          <div className="compressor-item-title">DIESEL AIR COMPRESSOR</div>
                          <div className="compressor-item-desc">Heavy-duty mobile trailer-mounted portable units for remote field operations.</div>
                          <span className="compressor-item-tag">ATLAS COPCO • SULLAIR • INGERSOLL RAND • DENAIR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Item: Spare Parts */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('parts')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`desktop-nav-link ${activePage === 'catalog' ? 'nav-active' : ''} ${activeDropdown === 'parts' ? 'dropdown-active' : ''}`}
                onClick={() => navigateToSpareParts()}
              >
                <span>Spare Parts</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>

              {activeDropdown === 'parts' && (
                <div className="mega-menu-panel spareparts-dropdown-panel" onMouseEnter={() => handleMouseEnter('parts')} onMouseLeave={handleMouseLeave}>
                  <div className="spareparts-minimal-grid">
                    {/* Option 1: ATLAS COPCO */}
                    <div 
                      className="spareparts-minimal-item"
                      onClick={() => navigateToSpareParts('ATLAS COPCO')}
                    >
                      <div className="spareparts-minimal-icon">
                        <Gauge size={24} />
                      </div>
                      <span className="spareparts-minimal-name">ATLAS COPCO</span>
                    </div>

                    {/* Option 2: SULLAIR */}
                    <div 
                      className="spareparts-minimal-item"
                      onClick={() => navigateToSpareParts('SULLAIR')}
                    >
                      <div className="spareparts-minimal-icon">
                        <Shield size={24} />
                      </div>
                      <span className="spareparts-minimal-name">SULLAIR</span>
                    </div>

                    {/* Option 3: INGERSOLL RAND */}
                    <div 
                      className="spareparts-minimal-item"
                      onClick={() => navigateToSpareParts('INGERSOLL RAND')}
                    >
                      <div className="spareparts-minimal-icon">
                        <Cpu size={24} />
                      </div>
                      <span className="spareparts-minimal-name">INGERSOLL RAND</span>
                    </div>

                    {/* Option 4: DENAIR */}
                    <div 
                      className="spareparts-minimal-item"
                      onClick={() => navigateToSpareParts('DENAIR')}
                    >
                      <div className="spareparts-minimal-icon">
                        <Wrench size={24} />
                      </div>
                      <span className="spareparts-minimal-name">DENAIR</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Item: Leasing & Rentals */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('leasing')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`desktop-nav-link ${activePage === 'leasing' ? 'nav-active' : ''} ${activeDropdown === 'leasing' ? 'dropdown-active' : ''}`}
                onClick={() => navigateTo('leasing')}
              >
                <span>Leasing &amp; Fleet</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>

              {activeDropdown === 'leasing' && (
                <div className="mega-menu-panel" onMouseEnter={() => handleMouseEnter('leasing')} onMouseLeave={handleMouseLeave}>
                  <div className="mega-menu-content">
                    <div className="mega-menu-main-col">
                      <div className="mega-menu-col-header">EQUIPMENT RENTAL SOLUTIONS</div>
                      <div className="mega-menu-links-grid">
                        <div className="mega-menu-item" onClick={() => navigateTo('leasing')}>
                          <div className="mega-item-icon-box">
                            <Truck size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Flexible Rental Agreements</div>
                            <div className="mega-item-desc">Daily, monthly, and multi-year project lease packages with full support</div>
                          </div>
                        </div>

                        <div className="mega-menu-item" onClick={() => navigateTo('leasing')}>
                          <div className="mega-item-icon-box">
                            <FileText size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Online Lease Rate Estimator</div>
                            <div className="mega-item-desc">Instant pricing calculators based on machine capacity and operating duty</div>
                          </div>
                        </div>

                        <div className="mega-menu-item" onClick={() => navigateTo('leasing')}>
                          <div className="mega-item-icon-box">
                            <ShieldCheck size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">99.8% Uptime SLA Guarantee</div>
                            <div className="mega-item-desc">Standby replacement machinery staged on site for critical operations</div>
                          </div>
                        </div>

                        <div className="mega-menu-item" onClick={() => navigateTo('leasing')}>
                          <div className="mega-item-icon-box">
                            <CheckCircle size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Rapid Site Mobilization</div>
                            <div className="mega-item-desc">24h transport and connection across Lagos, Rivers, and Delta hubs</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mega-menu-side-col">
                      <div className="mega-side-badge">NO CAPEX REQUIRED</div>
                      <h4 className="mega-side-heading">Fleet Rental Services</h4>
                      <p className="mega-side-desc">
                        Deploy heavy compressors and generators without heavy capital outlay. Maintenance included.
                      </p>
                      <button className="mega-side-action-btn" onClick={() => navigateTo('leasing')}>
                        <span>Explore Leasing</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Item: Technical Support / After-Sales */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('support')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`desktop-nav-link ${activePage === 'aftersales' ? 'nav-active' : ''} ${activeDropdown === 'support' ? 'dropdown-active' : ''}`}
                onClick={() => navigateTo('aftersales')}
              >
                <span>After-Sales</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>

              {activeDropdown === 'support' && (
                <div className="mega-menu-panel" onMouseEnter={() => handleMouseEnter('support')} onMouseLeave={handleMouseLeave}>
                  <div className="mega-menu-content">
                    <div className="mega-menu-main-col">
                      <div className="mega-menu-col-header">FIELD ENGINEERING &amp; MAINTENANCE</div>
                      <div className="mega-menu-links-grid">
                        <div className="mega-menu-item" onClick={() => navigateTo('aftersales')}>
                          <div className="mega-item-icon-box">
                            <Wrench size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">24/7 Field Maintenance</div>
                            <div className="mega-item-desc">Emergency mechanical, electrical, and pneumatic diagnostic dispatch</div>
                          </div>
                        </div>

                        <div className="mega-menu-item" onClick={() => navigateTo('aftersales')}>
                          <div className="mega-item-icon-box">
                            <Activity size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Live Dispatch Tracker</div>
                            <div className="mega-item-desc">Real-time status, technician ETA, and log breakdown for your tickets</div>
                          </div>
                        </div>

                        <div className="mega-menu-item" onClick={() => navigateTo('aftersales')}>
                          <div className="mega-item-icon-box">
                            <ShieldCheck size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Preventative Service Contracts</div>
                            <div className="mega-item-desc">Scheduled inspections, vibration analysis, and OEM fluid testing</div>
                          </div>
                        </div>

                        <div className="mega-menu-item" onClick={() => navigateTo('contact')}>
                          <div className="mega-item-icon-box">
                            <Phone size={18} />
                          </div>
                          <div className="mega-item-text">
                            <div className="mega-item-title">Emergency Hotline</div>
                            <div className="mega-item-desc">Direct 24/7 contact: +234 (1) 460-7000 (average pickup: 8 seconds)</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mega-menu-side-col">
                      <div className="mega-side-badge">8S AVERAGE ANSWER</div>
                      <h4 className="mega-side-heading">Technical Support Hotline</h4>
                      <p className="mega-side-desc">
                        Our engineering response units are stationed in major industrial corridors with rapid dispatch readiness.
                      </p>
                      <button className="mega-side-action-btn" onClick={() => navigateTo('aftersales')}>
                        <span>Access Support Hub</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Nav Item: Contact */}
            <button
              className={`desktop-nav-link single-link ${activePage === 'contact' ? 'nav-active' : ''}`}
              onClick={() => navigateTo('contact')}
            >
              <span>Contact &amp; Yards</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="nav-actions-group">
            {/* Live Yard Status Pill */}
            <button
              className="nav-yard-status-pill"
              onClick={() => setShowStatusModal(true)}
              title="Click to inspect real-time yard operations and technician readiness"
            >
              <span className="pulse-green-dot" />
              <span>Yards: <strong>ONLINE</strong></span>
            </button>

            {/* Search Box */}
            <form onSubmit={handleNavSearch} className="nav-search-box">
              <Search size={15} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search equipment, parts..."
                className="nav-search-input"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </form>

            {/* Get Enquiry CTA Button */}
            <button
              className="nav-inquiry-btn"
              onClick={() => navigateTo('contact')}
            >
              <span>Get Enquiry</span>
              {inquiryItems.length > 0 && (
                <span className="nav-inquiry-badge">{inquiryItems.length}</span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer (Clean & organized) */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-search">
                <form onSubmit={handleNavSearch} style={{ display: 'flex', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Search equipment, parts..."
                    className="mobile-search-input"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                  />
                </form>
              </div>

              <div className="mobile-links-list">
                <button
                  className={`mobile-link-item ${activePage === 'home' ? 'mobile-active' : ''}`}
                  onClick={() => navigateTo('home')}
                >
                  <span>Home</span>
                </button>

                <button
                  className={`mobile-link-item ${activePage === 'equipmentSales' ? 'mobile-active' : ''}`}
                  onClick={() => navigateToCompressors()}
                >
                  <span>Air Compressors</span>
                  <span className="mobile-link-tag">Electric &amp; Diesel</span>
                </button>

                <button
                  className={`mobile-link-item ${activePage === 'catalog' ? 'mobile-active' : ''}`}
                  onClick={() => navigateToSpareParts()}
                >
                  <span>Spare Parts</span>
                  <span className="mobile-link-tag">OEM Spares</span>
                </button>

                <button
                  className={`mobile-link-item ${activePage === 'leasing' ? 'mobile-active' : ''}`}
                  onClick={() => navigateTo('leasing')}
                >
                  <span>Leasing &amp; Fleet</span>
                  <span className="mobile-link-tag">Rentals</span>
                </button>

                <button
                  className={`mobile-link-item ${activePage === 'aftersales' ? 'mobile-active' : ''}`}
                  onClick={() => navigateTo('aftersales')}
                >
                  <span>After-Sales Support</span>
                  <span className="mobile-link-tag">24/7 Field</span>
                </button>

                <button
                  className={`mobile-link-item ${activePage === 'contact' ? 'mobile-active' : ''}`}
                  onClick={() => navigateTo('contact')}
                >
                  <span>Contact &amp; Yards</span>
                </button>
              </div>

              <div className="mobile-drawer-footer">
                <button
                  className="mobile-yard-status-btn"
                  onClick={() => { setShowStatusModal(true); setMobileMenuOpen(false); }}
                >
                  <span className="pulse-green-dot" />
                  <span>Yard Operations: <strong>ONLINE</strong></span>
                </button>

                <button
                  className="mobile-inquiry-btn"
                  onClick={() => navigateTo('contact')}
                >
                  <span>Submit Inquiry Request</span>
                  {inquiryItems.length > 0 && (
                    <span className="nav-inquiry-badge">{inquiryItems.length}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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
              <li><button onClick={() => navigateToSpareParts()} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Spare Parts</button></li>
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
                      <div onClick={() => { navigateToCompressors(); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Air Compressors</div>
                      <div onClick={() => { navigateToSpareParts(); setInfoModal(null); }} style={{ cursor: 'pointer', color: 'var(--primary-container)' }}>• Spare Parts</div>
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

      {/* Global Air Compressor Quotation Modal */}
      <CompressorQuoteModal
        isOpen={compressorModalOpen}
        onClose={() => setCompressorModalOpen(false)}
        initialType={modalInitialType}
      />
    </div>
  );
}

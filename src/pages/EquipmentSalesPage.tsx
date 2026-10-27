import React, { useState, useMemo, useEffect } from 'react';
import {
  Zap, Shield, Check, X,
  Phone, Activity,
  Flame, Mail, Building, ArrowRight, CheckCircle2, RotateCcw, AlertCircle, Sparkles
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import { submitCompressorRequest } from '../services/api';
import './EquipmentSalesPage.css';

// Assets
import catalogBg from '../assets/catalog_bg.png';
import catalogBg1 from '../assets/catalog_bg1.png';
import catalogBg2 from '../assets/catalog_bg2.png';
import highCapacity from '../assets/high_capacity.png';
import industrialGenerator from '../assets/industrial_generator.png';
import portableUnit from '../assets/portable_unit.png';

export type CompressorType = 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR';
export type CompressorBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR';

export const COMPRESSOR_BRANDS: {
  id: CompressorBrand;
  name: string;
  tagline: string;
  country: string;
  description: string;
  warranty: string;
}[] = [
  {
    id: 'ATLAS COPCO',
    name: 'Atlas Copco',
    tagline: 'VSD+ Energy Recovery & Oil-Free Excellence',
    country: 'Sweden / Global',
    description: 'World-leading rotary screw compressors engineered for maximum uptime, intelligent Elektronikon controls, and lowest total lifecycle cost.',
    warranty: '5-Year OEM Air-End Protection',
  },
  {
    id: 'SULLAIR',
    name: 'Sullair',
    tagline: 'Legendary Bulletproof Rotary Screw Air-Ends',
    country: 'USA / Global',
    description: 'Engineered for extreme heavy-duty environments, mining, infrastructure, and heavy plant air with zero unscheduled downtime.',
    warranty: '10-Year Diamond Air-End Warranty',
  },
  {
    id: 'INGERSOLL RAND',
    name: 'Ingersoll Rand',
    tagline: 'Industrial Power, Contact-Cooled Reliability',
    country: 'USA / Global',
    description: 'Precision engineered rotary screw compressors delivering high CFM airflow with low noise attenuation and advanced micro-filtration.',
    warranty: '5-Year Package Protection',
  },
  {
    id: 'DENAIR',
    name: 'Denair',
    tagline: 'German Engineering & High Efficiency',
    country: 'Germany / Global',
    description: 'Advanced dual-stage energy-saving rotary screw units designed for severe tropical ambient temperatures and 24/7 continuous duty.',
    warranty: '5-Year Air-End Warranty',
  },
];

interface ProductItem {
  id: number;
  title: string;
  category: string;
  brand: string;
  image: string;
  badge?: string;
  badgeType: 'in-stock' | 'featured';
  specs: { icon: React.ReactNode; label: string }[];
  capacity: number;
  driven: 'Electric' | 'Diesel Driven';
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: 'Atlas Copco GA 160+ VSD',
    category: 'Air Compressors',
    brand: 'Atlas Copco',
    image: catalogBg,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '920 CFM Flow Rate' },
      { icon: <Zap size={14} />, label: '160 kW Variable Speed' },
      { icon: <Shield size={14} />, label: 'Elektronikon Touch' },
    ],
    capacity: 920,
    driven: 'Electric',
  },
  {
    id: 2,
    title: 'Sullair 185 Portable Tier 4',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg2,
    badge: 'FEATURED',
    badgeType: 'featured',
    specs: [
      { icon: <Activity size={14} />, label: '185 CFM Capacity' },
      { icon: <Flame size={14} />, label: 'Caterpillar Diesel' },
      { icon: <Shield size={14} />, label: 'Road-Ready Trailer' },
    ],
    capacity: 185,
    driven: 'Diesel Driven',
  },
  {
    id: 3,
    title: 'Ingersoll Rand Nirvana V75',
    category: 'Air Compressors',
    brand: 'Ingersoll Rand',
    image: highCapacity,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '415 CFM Flow' },
      { icon: <Zap size={14} />, label: '75 kW Electric Drive' },
      { icon: <Shield size={14} />, label: 'Ultra Coolant 8000hr' },
    ],
    capacity: 415,
    driven: 'Electric',
  },
  {
    id: 4,
    title: 'Denair DWD-375 Diesel Mobile',
    category: 'Air Compressors',
    brand: 'Denair',
    image: portableUnit,
    badge: 'FEATURED',
    badgeType: 'featured',
    specs: [
      { icon: <Activity size={14} />, label: '375 CFM Heavy Duty' },
      { icon: <Flame size={14} />, label: 'Cummins Diesel Engine' },
      { icon: <Shield size={14} />, label: 'High Altitude Package' },
    ],
    capacity: 375,
    driven: 'Diesel Driven',
  },
  {
    id: 5,
    title: 'Sullair 375H Heavy Duty',
    category: 'Air Compressors',
    brand: 'Sullair',
    image: catalogBg1,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '375 CFM @ 150 PSI' },
      { icon: <Flame size={14} />, label: 'Diesel Engine Driven' },
      { icon: <Shield size={14} />, label: 'Sound Attenuated Canopy' },
    ],
    capacity: 375,
    driven: 'Diesel Driven',
  },
  {
    id: 6,
    title: 'Denair DVA-90 Energy Saver',
    category: 'Air Compressors',
    brand: 'Denair',
    image: industrialGenerator,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '550 CFM Rotary Screw' },
      { icon: <Zap size={14} />, label: 'Permanent Magnet Motor' },
      { icon: <Shield size={14} />, label: '35% Energy Savings' },
    ],
    capacity: 550,
    driven: 'Electric',
  },
  {
    id: 7,
    title: 'Atlas Copco XATS 400 Diesel',
    category: 'Air Compressors',
    brand: 'Atlas Copco',
    image: catalogBg,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '400 CFM Portable' },
      { icon: <Flame size={14} />, label: 'Deutz Stage V Engine' },
      { icon: <Shield size={14} />, label: 'HardHat Polyethylene' },
    ],
    capacity: 400,
    driven: 'Diesel Driven',
  },
  {
    id: 8,
    title: 'Ingersoll Rand UP6-50',
    category: 'Air Compressors',
    brand: 'Ingersoll Rand',
    image: portableUnit,
    badge: 'IN STOCK',
    badgeType: 'in-stock',
    specs: [
      { icon: <Activity size={14} />, label: '235 CFM Continuous' },
      { icon: <Zap size={14} />, label: '37 kW TEFC Electric' },
      { icon: <Shield size={14} />, label: 'Integrated Air Dryer' },
    ],
    capacity: 235,
    driven: 'Electric',
  },
];

interface EquipmentSalesPageProps {
  initialType?: CompressorType | null;
}

export default function EquipmentSalesPage({ initialType }: EquipmentSalesPageProps) {
  const { addToInquiry } = useInquiry();

  // Quotation Configurator State
  const [selectedType, setSelectedType] = useState<CompressorType | null>(initialType || null);
  const [selectedBrand, setSelectedBrand] = useState<CompressorBrand | null>(null);

  // Form inputs
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    id: string;
    compressor_type: string;
    brand: string;
    company_name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // UI Modals
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [quoteMsg, setQuoteMsg] = useState<string | null>(null);

  // Sync initialType when passed via navigation
  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  const handleTypeSelect = (type: CompressorType) => {
    setSelectedType(type);
    setSubmissionSuccess(null);
    setSubmitError(null);
  };

  const handleBrandSelect = (brand: CompressorBrand) => {
    setSelectedBrand(brand);
    setSubmissionSuccess(null);
    setSubmitError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedType) {
      setSubmitError('Please select whether you need an Electric or Diesel air compressor.');
      return;
    }
    if (!selectedBrand) {
      setSubmitError('Please select a preferred manufacturer (Atlas Copco, Sullair, Ingersoll Rand, or Denair).');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Please provide your company or organization name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please provide a valid corporate or official email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setSubmitError('Please provide a valid telephone/mobile contact number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitCompressorRequest({
        compressor_type: selectedType,
        brand: selectedBrand,
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
      });

      setSubmissionSuccess({
        id: response.data.id,
        compressor_type: response.data.compressor_type,
        brand: response.data.brand,
        company_name: response.data.company_name,
        email: response.data.email,
        phone: response.data.phone,
      });

      // Clear input fields
      setPhone('');
      setEmail('');
      setCompanyName('');
      setNotes('');
    } catch (err: any) {
      console.error('Error submitting compressor quote request:', err);
      setSubmitError(err.message || 'Failed to submit quotation request. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFlow = () => {
    setSelectedType(null);
    setSelectedBrand(null);
    setSubmissionSuccess(null);
    setSubmitError(null);
  };

  // Filter catalog products matching selections
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (selectedType) {
        const requiredDriven = selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel Driven';
        if (p.driven !== requiredDriven) return false;
      }
      if (selectedBrand) {
        const brandMatch = p.brand.toUpperCase() === selectedBrand.toUpperCase();
        if (!brandMatch) return false;
      }
      return true;
    });
  }, [selectedType, selectedBrand]);

  const handleQuickAddBasket = (item: ProductItem) => {
    addToInquiry({
      id: `equip-${item.id}`,
      title: item.title,
      category: item.category,
      type: 'equipment',
      brand: item.brand,
      image: item.image,
      specSummary: item.specs.map(s => s.label).join(' • '),
    });
    setQuoteMsg(item.title);
    setTimeout(() => setQuoteMsg(null), 5000);
  };

  return (
    <div className="equip-sales-page">

      {/* Expert Consultation Modal */}
      {showConsultModal && (
        <div className="status-modal-overlay" onClick={() => setShowConsultModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Phone size={20} className="text-orange" />
                <span>Air Systems Engineering Consultation</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowConsultModal(false)}>✕</button>
            </div>
            <div className="modal-body-content" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', marginBottom: '16px' }}>
                Our application engineers will review your air pressure (PSI/Bar), airflow demand (CFM/m³/min), duty cycle, and site conditions to size the ideal compressor setup.
              </p>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ fontSize: '13px', color: '#1e252b' }}>Direct Engineering Contacts:</strong>
                <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px' }}>
                  Lagos Technical Centre: <strong>+234 (1) 460-7000</strong><br />
                  Port Harcourt Operations: <strong>+234 (84) 303-900</strong><br />
                  Email: <strong>compressors@mandtech.com.ng</strong>
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setShowConsultModal(false)}
                  style={{
                    background: 'var(--primary-container)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote success banner */}
      {quoteMsg && (
        <div className="equip-quote-banner container">
          <span className="equip-banner-badge"><Check size={16} /></span>
          <div className="equip-banner-content">
            <h4>Added to Procurement Checklist</h4>
            <p><strong>{quoteMsg}</strong> has been saved. You can also finalize your quotation request below.</p>
          </div>
          <button className="equip-banner-close" onClick={() => setQuoteMsg(null)}><X size={18} /></button>
        </div>
      )}

      {/* Hero Header */}
      <section className="compressor-hero-banner">
        <div className="container">
          <div className="compressor-hero-badge">
            <Sparkles size={14} />
            <span>OEM CERTIFIED INDUSTRIAL FLEET</span>
          </div>
          <h1 className="compressor-hero-title">Air Compressors & Sizing Quotations</h1>
          <p className="compressor-hero-desc">
            Direct Nigerian sales, turnkey installation, and OEM factory warranty for high-performance electric and diesel rotary screw air compressors.
          </p>
        </div>
      </section>

      {/* MAIN STEP-BY-STEP FLOW */}
      <div className="container compressor-flow-container">

        {/* Step Indicator */}
        <div className="compressor-stepper">
          <div className={`step-node ${selectedType ? 'step-completed' : 'step-current'}`}>
            <div className="step-circle">{selectedType ? <Check size={14} /> : '1'}</div>
            <div className="step-label">Select Compressor Type</div>
          </div>
          <div className="step-line" />
          <div className={`step-node ${selectedBrand ? 'step-completed' : selectedType ? 'step-current' : 'step-upcoming'}`}>
            <div className="step-circle">{selectedBrand ? <Check size={14} /> : '2'}</div>
            <div className="step-label">Choose Brand</div>
          </div>
          <div className="step-line" />
          <div className={`step-node ${submissionSuccess ? 'step-completed' : selectedBrand ? 'step-current' : 'step-upcoming'}`}>
            <div className="step-circle">{submissionSuccess ? <Check size={14} /> : '3'}</div>
            <div className="step-label">Request Formal Quotation</div>
          </div>
        </div>

        {/* STEP 1: COMPRESSOR TYPE SELECTION */}
        <section className="flow-card-section">
          <div className="section-title-wrap">
            <span className="section-step-tag">STEP 1</span>
            <h2 className="section-main-heading">Choose Air Compressor Type</h2>
            <p className="section-subheading">Select power configuration based on plant electrical supply or remote field requirements.</p>
          </div>

          <div className="type-selection-grid">
            {/* ELECTRIC */}
            <div
              className={`type-card ${selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'type-card-selected' : ''}`}
              onClick={() => handleTypeSelect('ELECTRIC AIR COMPRESSOR')}
            >
              <div className="type-icon-circle electric-icon">
                <Zap size={28} />
              </div>
              <div className="type-card-badge">STATIONARY & PLANT</div>
              <h3 className="type-card-title">ELECTRIC AIR COMPRESSOR</h3>
              <p className="type-card-desc">
                High-efficiency rotary screw systems with variable speed drive (VSD), permanent magnet motors, and ultra-quiet stationary acoustic canopies.
              </p>
              <ul className="type-highlights">
                <li><Check size={14} /> Zero emissions & lowest operating cost</li>
                <li><Check size={14} /> 400V 3-Phase industrial plant power</li>
                <li><Check size={14} /> Integrated moisture separators & dryers</li>
              </ul>
              <button
                type="button"
                className={`type-select-btn ${selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'selected-btn' : ''}`}
              >
                {selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Selected Type ✓' : 'Select Electric'}
              </button>
            </div>

            {/* DIESEL */}
            <div
              className={`type-card ${selectedType === 'DIESEL AIR COMPRESSOR' ? 'type-card-selected' : ''}`}
              onClick={() => handleTypeSelect('DIESEL AIR COMPRESSOR')}
            >
              <div className="type-icon-circle diesel-icon">
                <Flame size={28} />
              </div>
              <div className="type-card-badge">MOBILE & RUGGED FIELD</div>
              <h3 className="type-card-title">DIESEL AIR COMPRESSOR</h3>
              <p className="type-card-desc">
                Heavy-duty diesel-driven mobile units built on robust trailer running gear with heavy soundproofing, high CFM capacity, and field autonomy.
              </p>
              <ul className="type-highlights">
                <li><Check size={14} /> CAT / Cummins / Deutz diesel engines</li>
                <li><Check size={14} /> High mobility trailer mount with highway brakes</li>
                <li><Check size={14} /> Severe duty filtration & high-ambient package</li>
              </ul>
              <button
                type="button"
                className={`type-select-btn ${selectedType === 'DIESEL AIR COMPRESSOR' ? 'selected-btn' : ''}`}
              >
                {selectedType === 'DIESEL AIR COMPRESSOR' ? 'Selected Type ✓' : 'Select Diesel'}
              </button>
            </div>
          </div>
        </section>

        {/* STEP 2: BRAND SELECTION (Appears when type is selected) */}
        {selectedType && (
          <section className="flow-card-section animated-fade-in" id="brand-selection-step">
            <div className="section-title-wrap">
              <div className="selected-summary-pill">
                <span>Selected Type:</span> <strong>{selectedType}</strong>
              </div>
              <span className="section-step-tag">STEP 2</span>
              <h2 className="section-main-heading">Select Manufacturer Brand</h2>
              <p className="section-subheading">Choose your preferred OEM brand. Mandtech provides certified direct import, commissioning, and warranty support.</p>
            </div>

            <div className="brands-selection-grid">
              {COMPRESSOR_BRANDS.map(brand => {
                const isSelected = selectedBrand === brand.id;
                return (
                  <div
                    key={brand.id}
                    className={`brand-choice-card ${isSelected ? 'brand-card-selected' : ''}`}
                    onClick={() => handleBrandSelect(brand.id)}
                  >
                    <div className="brand-header-row">
                      <h4 className="brand-title">{brand.name.toUpperCase()}</h4>
                      <span className="brand-warranty-badge">{brand.warranty}</span>
                    </div>
                    <div className="brand-tagline">{brand.tagline}</div>
                    <p className="brand-desc">{brand.description}</p>
                    <div className="brand-footer-row">
                      <span className="brand-origin">{brand.country}</span>
                      <button
                        type="button"
                        className={`brand-select-btn ${isSelected ? 'brand-btn-selected' : ''}`}
                      >
                        {isSelected ? 'Selected ✓' : 'Choose Brand'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3: FORMAL QUOTATION REQUEST FORM */}
        {selectedType && selectedBrand && (
          <section className="flow-card-section quotation-form-section animated-fade-in" id="quotation-form-step">
            <div className="section-title-wrap">
              <span className="section-step-tag">STEP 3</span>
              <h2 className="section-main-heading">Request a Formal Quotation</h2>
              <p className="section-subheading">
                Enter your commercial contact details below. Our technical sales desk will prepare an official commercial invoice and sizing specification.
              </p>
            </div>

            {/* Success Card */}
            {submissionSuccess ? (
              <div className="formal-quote-success-card">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={48} className="text-success" />
                </div>
                <h3 className="success-title">Official Quotation Request Registered</h3>
                <p className="success-reference">
                  Quotation Tracking Reference: <strong>MT-Q-{submissionSuccess.id.slice(0, 8).toUpperCase()}</strong>
                </p>
                <div className="success-summary-box">
                  <div className="success-summary-item">
                    <span>Compressor Type:</span>
                    <strong>{submissionSuccess.compressor_type}</strong>
                  </div>
                  <div className="success-summary-item">
                    <span>Selected Brand:</span>
                    <strong>{submissionSuccess.brand}</strong>
                  </div>
                  <div className="success-summary-item">
                    <span>Company:</span>
                    <strong>{submissionSuccess.company_name}</strong>
                  </div>
                  <div className="success-summary-item">
                    <span>Official Email:</span>
                    <strong>{submissionSuccess.email}</strong>
                  </div>
                  <div className="success-summary-item">
                    <span>Telephone:</span>
                    <strong>{submissionSuccess.phone}</strong>
                  </div>
                </div>
                <p className="success-delivery-notice">
                  A regional technical sales engineer has been assigned. You will receive an official PDF quotation and technical data sheet via email within <strong>2 to 4 business hours</strong>.
                </p>
                <div className="success-actions">
                  <button type="button" className="btn-reset-flow" onClick={handleResetFlow}>
                    <RotateCcw size={16} />
                    <span>Submit Another Request</span>
                  </button>
                  <button type="button" className="btn-consult-hotline" onClick={() => setShowConsultModal(true)}>
                    <Phone size={16} />
                    <span>Call Engineering Hotlines</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="formal-quote-form">
                {/* Configuration summary chip */}
                <div className="form-summary-banner">
                  <div className="summary-left">
                    <span className="summary-label">Quotation Package:</span>
                    <span className="summary-val">{selectedType}</span>
                    <span className="summary-divider">•</span>
                    <span className="summary-val highlight">{selectedBrand}</span>
                  </div>
                  <button
                    type="button"
                    className="summary-change-btn"
                    onClick={() => setSelectedBrand(null)}
                  >
                    Change Brand
                  </button>
                </div>

                {submitError && (
                  <div className="form-error-banner">
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="form-inputs-grid">
                  {/* Company Name */}
                  <div className="form-input-group">
                    <label htmlFor="companyName" className="form-label">
                      Company Name <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Building size={18} className="field-icon" />
                      <input
                        id="companyName"
                        type="text"
                        placeholder="e.g. Dangote Cement, Julius Berger, NLNG"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-input-group">
                    <label htmlFor="email" className="form-label">
                      Corporate / Official Email <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Mail size={18} className="field-icon" />
                      <input
                        id="email"
                        type="email"
                        placeholder="procurement@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="form-input-group">
                    <label htmlFor="phone" className="form-label">
                      Telephone / WhatsApp Number <span className="req">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Phone size={18} className="field-icon" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Notes / Sizing */}
                  <div className="form-input-group full-width">
                    <label htmlFor="notes" className="form-label">
                      Required CFM / Pressure / Project Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Need 300 to 500 CFM at 8 Bar for continuous sandblasting plant in Ogun state..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-action-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-formal-quotation"
                  >
                    {isSubmitting ? (
                      <span>Submitting Formal Quotation Request...</span>
                    ) : (
                      <>
                        <span>REQUEST A FORMAL QUOTATION</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                <div className="form-guarantees">
                  <div className="guarantee-item">
                    <Shield size={14} />
                    <span>Official OEM Quotation</span>
                  </div>
                  <div className="guarantee-item">
                    <Check size={14} />
                    <span>Turnaround: 2-4 Hours</span>
                  </div>
                  <div className="guarantee-item">
                    <Activity size={14} />
                    <span>PDI &amp; Delivery Across Nigeria</span>
                  </div>
                </div>
              </form>
            )}
          </section>
        )}

      </div>

      {/* TECHNICAL FLEET & INVENTORY SECTION */}
      <section className="container fleet-inventory-section">
        <div className="fleet-section-header">
          <div>
            <h3 className="fleet-title">Technical Fleet & Available Models</h3>
            <p className="fleet-sub">
              {selectedType || selectedBrand
                ? `Showing models matching ${selectedType || ''} ${selectedBrand ? `• ${selectedBrand}` : ''}`
                : 'Browse popular certified industrial air compressor units in stock in Nigeria'}
            </p>
          </div>
          {(selectedType || selectedBrand) && (
            <button className="clear-filter-btn" onClick={handleResetFlow}>
              Clear Selections &amp; Show All
            </button>
          )}
        </div>

        <div className="equip-products-grid">
          {filteredProducts.map(p => (
            <div key={p.id} className="equip-product-card">
              <div className="equip-card-image-wrap">
                <img src={p.image} alt={p.title} className="equip-card-img" />
                {p.badge && (
                  <span className={`equip-card-badge badge-${p.badgeType}`}>
                    {p.badge}
                  </span>
                )}
                <span className="equip-card-driven-tag">
                  {p.driven === 'Electric' ? <Zap size={12} /> : <Flame size={12} />}
                  <span>{p.driven}</span>
                </span>
              </div>
              <div className="equip-card-body">
                <div className="equip-card-meta">
                  <span className="equip-card-brand">{p.brand}</span>
                  <span className="equip-card-category">{p.category}</span>
                </div>
                <h4 className="equip-card-title">{p.title}</h4>
                <div className="equip-card-specs">
                  {p.specs.map((s, idx) => (
                    <div key={idx} className="equip-card-spec-item">
                      <span className="equip-card-spec-icon">{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="equip-card-footer">
                  <button
                    className="equip-btn-quote"
                    onClick={() => {
                      const matchedType = p.driven === 'Electric' ? 'ELECTRIC AIR COMPRESSOR' : 'DIESEL AIR COMPRESSOR';
                      setSelectedType(matchedType);
                      const upperBrand = p.brand.toUpperCase();
                      if (upperBrand.includes('ATLAS')) setSelectedBrand('ATLAS COPCO');
                      else if (upperBrand.includes('SULLAIR')) setSelectedBrand('SULLAIR');
                      else if (upperBrand.includes('INGERSOLL')) setSelectedBrand('INGERSOLL RAND');
                      else if (upperBrand.includes('DENAIR')) setSelectedBrand('DENAIR');
                      // Scroll to quotation form
                      document.getElementById('quotation-form-step')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Select for Quotation
                  </button>
                  <button
                    className="equip-btn-checklist"
                    title="Add to procurement checklist"
                    onClick={() => handleQuickAddBasket(p)}
                  >
                    + Checklist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Support CTA Bar */}
      <section className="container equip-cta-section" style={{ marginTop: '48px', marginBottom: '48px' }}>
        <div className="equip-cta-card">
          <div className="equip-cta-text">
            <h3>Need Custom Piping, Air Audits or Dual-Stage Configurations?</h3>
            <p>Our certified rotating machinery engineers conduct on-site pressure drop assessments and air audits across Nigeria.</p>
          </div>
          <button className="equip-cta-btn" onClick={() => setShowConsultModal(true)}>
            <Phone size={16} />
            <span>Speak with Application Engineer</span>
          </button>
        </div>
      </section>

    </div>
  );
}

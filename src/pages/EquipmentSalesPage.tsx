import React, { useState, useEffect } from 'react';
import {
  Zap, Shield, Check,
  Phone,
  Flame, Mail, Building, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, AlertCircle, Sparkles,
  ChevronRight
} from 'lucide-react';
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
  keyFeature: string;
}[] = [
  {
    id: 'ATLAS COPCO',
    name: 'Atlas Copco',
    tagline: 'VSD+ Energy Recovery & Oil-Free Precision',
    country: 'Sweden / Global',
    description: 'Pioneering rotary screw technology with permanent magnet motors and smart Elektronikon control.',
    warranty: '5-Year OEM Protection',
    keyFeature: 'Up to 50% Energy Savings with VSD+',
  },
  {
    id: 'SULLAIR',
    name: 'Sullair',
    tagline: 'Legendary Bulletproof Rotary Screw Air-Ends',
    country: 'USA / Global',
    description: 'Renowned for extreme durability in oil & gas, mining, and heavy industrial plant duty.',
    warranty: '10-Year Diamond Warranty',
    keyFeature: 'Heavy-Duty Sullube Fluid & Zero Breakdown',
  },
  {
    id: 'INGERSOLL RAND',
    name: 'Ingersoll Rand',
    tagline: 'High CFM Power & Ultra-Coolant Reliability',
    country: 'USA / Global',
    description: 'Next-generation industrial rotary compressors delivering constant air pressure with low decibel attenuation.',
    warranty: '5-Year Package Protection',
    keyFeature: '8,000-Hour Factory Coolant Included',
  },
  {
    id: 'DENAIR',
    name: 'Denair',
    tagline: 'German Engineering & High Ambient Resistance',
    country: 'Germany / Global',
    description: 'Precision dual-stage rotary systems optimized for tropical heat, humidity, and continuous 24/7 duty.',
    warranty: '5-Year Air-End Warranty',
    keyFeature: 'Dual-Stage Compression Efficiency',
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
  specs: { label: string }[];
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
      { label: '920 CFM Flow Rate' },
      { label: '160 kW Variable Speed' },
      { label: 'Elektronikon Touch' },
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
      { label: '185 CFM Capacity' },
      { label: 'Caterpillar Diesel' },
      { label: 'Road-Ready Trailer' },
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
      { label: '415 CFM Flow' },
      { label: '75 kW Electric Drive' },
      { label: 'Ultra Coolant 8000hr' },
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
      { label: '375 CFM Heavy Duty' },
      { label: 'Cummins Diesel Engine' },
      { label: 'High Altitude Package' },
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
      { label: '375 CFM @ 150 PSI' },
      { label: 'Diesel Engine Driven' },
      { label: 'Sound Attenuated Canopy' },
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
      { label: '550 CFM Rotary Screw' },
      { label: 'Permanent Magnet Motor' },
      { label: '35% Energy Savings' },
    ],
    capacity: 550,
    driven: 'Electric',
  },
];

interface EquipmentSalesPageProps {
  initialType?: CompressorType | null;
}

export default function EquipmentSalesPage({ initialType }: EquipmentSalesPageProps) {
  // Step State: 1 = Type, 2 = Brand, 3 = Details Form, 4 = Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialType ? 2 : 1);

  // Configuration Choices
  const [selectedType, setSelectedType] = useState<CompressorType | null>(initialType || null);
  const [selectedBrand, setSelectedBrand] = useState<CompressorBrand | null>(null);

  // Contact Details Form inputs
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

  // Optional Catalog Accordion
  const [showCatalog, setShowCatalog] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);

  // Synchronize when initialType changes from Navbar dropdown
  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
      setCurrentStep(2);
    }
  }, [initialType]);

  // Step 1: Select Type -> Advances to Step 2
  const handleSelectType = (type: CompressorType) => {
    setSelectedType(type);
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 2: Select Brand -> Advances to Step 3
  const handleSelectBrand = (brand: CompressorBrand) => {
    setSelectedBrand(brand);
    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 3: Form Submit -> Advances to Step 4
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedType) {
      setSubmitError('Please select a compressor type.');
      setCurrentStep(1);
      return;
    }
    if (!selectedBrand) {
      setSubmitError('Please select an OEM brand.');
      setCurrentStep(2);
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Please enter your company or organization name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid corporate email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setSubmitError('Please enter a valid telephone or WhatsApp number.');
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

      // Clear form inputs
      setPhone('');
      setEmail('');
      setCompanyName('');
      setNotes('');

      // Advance to Success Step
      setCurrentStep(4);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting quotation request:', err);
      setSubmitError(err.message || 'Unable to submit quotation request. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset entire flow back to Step 1
  const handleResetFlow = () => {
    setSelectedType(null);
    setSelectedBrand(null);
    setSubmissionSuccess(null);
    setSubmitError(null);
    setCurrentStep(1);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  return (
    <div className="equip-sales-page">

      {/* Engineering Hotline Modal */}
      {showConsultModal && (
        <div className="status-modal-overlay" onClick={() => setShowConsultModal(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Phone size={20} className="text-orange" />
                <span>Commercial &amp; Technical Desk</span>
              </h3>
              <button className="modal-close-btn" onClick={() => setShowConsultModal(false)}>✕</button>
            </div>
            <div className="modal-body-content" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', marginBottom: '16px' }}>
                Speak directly with Mandtech compressed air specialists for sizing, CFM calculations, and delivery schedules across Nigeria.
              </p>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ fontSize: '13px', color: '#1e252b' }}>Direct Engineering Contacts:</strong>
                <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px' }}>
                  Lagos Corporate Office: <strong>+234 (1) 460-7000</strong><br />
                  Port Harcourt Hub: <strong>+234 (84) 303-900</strong><br />
                  Email: <strong>compressors@mandtech.com.ng</strong>
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowConsultModal(false)}
                  style={{
                    background: 'var(--primary-container)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 22px',
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

      {/* Executive Clean Hero */}
      <section className="wizard-hero-section">
        <div className="container">
          <div className="wizard-hero-badge">
            <Sparkles size={14} />
            <span>OEM CERTIFIED INDUSTRIAL AIR SYSTEMS</span>
          </div>
          <h1 className="wizard-hero-title">Air Compressors & Sizing Quotations</h1>
          <p className="wizard-hero-sub">
            Follow our guided 3-step formal quotation process. Certified factory warranty, delivery, and commissioning across Nigeria.
          </p>
        </div>
      </section>

      {/* Main Single-Step Wizard Container */}
      <div className="container wizard-outer-wrap">
        <div className="wizard-card-box">

          {/* Top Progress & Stepper Bar */}
          <div className="wizard-stepper-header">
            {/* Step 1 Pill */}
            <button
              type="button"
              className={`wizard-step-pill ${currentStep === 1 ? 'pill-active' : currentStep > 1 ? 'pill-completed' : 'pill-disabled'}`}
              onClick={() => {
                if (currentStep > 1 && currentStep < 4) setCurrentStep(1);
              }}
              disabled={currentStep === 4}
            >
              <span className="step-num">{currentStep > 1 ? <Check size={14} /> : '1'}</span>
              <span className="step-text">
                <span className="step-sublabel">Configuration</span>
                <span className="step-mainlabel">{selectedType ? (selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel') : 'Select Type'}</span>
              </span>
            </button>

            <ChevronRight size={18} className="stepper-arrow" />

            {/* Step 2 Pill */}
            <button
              type="button"
              className={`wizard-step-pill ${currentStep === 2 ? 'pill-active' : currentStep > 2 ? 'pill-completed' : 'pill-disabled'}`}
              onClick={() => {
                if (selectedType && currentStep > 2 && currentStep < 4) setCurrentStep(2);
              }}
              disabled={!selectedType || currentStep === 4}
            >
              <span className="step-num">{currentStep > 2 ? <Check size={14} /> : '2'}</span>
              <span className="step-text">
                <span className="step-sublabel">Manufacturer</span>
                <span className="step-mainlabel">{selectedBrand || 'Select Brand'}</span>
              </span>
            </button>

            <ChevronRight size={18} className="stepper-arrow" />

            {/* Step 3 Pill */}
            <button
              type="button"
              className={`wizard-step-pill ${currentStep === 3 ? 'pill-active' : currentStep === 4 ? 'pill-completed' : 'pill-disabled'}`}
              disabled={!selectedBrand || currentStep === 4}
            >
              <span className="step-num">{currentStep === 4 ? <Check size={14} /> : '3'}</span>
              <span className="step-text">
                <span className="step-sublabel">Formal Quote</span>
                <span className="step-mainlabel">Commercial Details</span>
              </span>
            </button>
          </div>

          {/* Progress Bar Line */}
          <div className="wizard-progress-track">
            <div
              className="wizard-progress-fill"
              style={{
                width: currentStep === 1 ? '20%' : currentStep === 2 ? '55%' : currentStep === 3 ? '85%' : '100%'
              }}
            />
          </div>

          {/* STEP 1: ONLY COMPRESSOR TYPE SELECTION */}
          {currentStep === 1 && (
            <div className="wizard-step-body wizard-anim-enter">
              <div className="step-title-zone">
                <span className="step-badge-indicator">STEP 1 OF 3</span>
                <h2 className="step-headline">Select Compressor Configuration</h2>
                <p className="step-explanation">
                  Choose the power source required for your industrial facility or remote field job site.
                </p>
              </div>

              <div className="step-cards-grid-two">
                {/* ELECTRIC AIR COMPRESSOR */}
                <div
                  className="interactive-type-card"
                  onClick={() => handleSelectType('ELECTRIC AIR COMPRESSOR')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="type-card-badge-top">PLANT &amp; STATIONARY</div>
                  <div className="type-icon-wrapper electric-theme">
                    <Zap size={36} />
                  </div>
                  <h3 className="type-card-heading">ELECTRIC AIR COMPRESSOR</h3>
                  <p className="type-card-summary">
                    High-efficiency rotary screw systems with variable speed drives (VSD) designed for permanent indoor factory power.
                  </p>
                  <div className="type-card-spec-list">
                    <div className="spec-bullet"><Check size={14} /> 400V 3-Phase Continuous Plant Duty</div>
                    <div className="spec-bullet"><Check size={14} /> Ultra-low acoustic decibel canopy</div>
                    <div className="spec-bullet"><Check size={14} /> Lowest total cost of electricity &amp; maintenance</div>
                  </div>
                  <div className="type-card-cta-btn">
                    <span>Configure Electric</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* DIESEL AIR COMPRESSOR */}
                <div
                  className="interactive-type-card"
                  onClick={() => handleSelectType('DIESEL AIR COMPRESSOR')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="type-card-badge-top diesel">MOBILE &amp; FIELD AUTONOMY</div>
                  <div className="type-icon-wrapper diesel-theme">
                    <Flame size={36} />
                  </div>
                  <h3 className="type-card-heading">DIESEL AIR COMPRESSOR</h3>
                  <p className="type-card-summary">
                    Rugged trailer-mounted portable units powered by CAT, Cummins, or Deutz diesel engines for remote operations.
                  </p>
                  <div className="type-card-spec-list">
                    <div className="spec-bullet"><Check size={14} /> Heavy-duty highway running gear &amp; tow bar</div>
                    <div className="spec-bullet"><Check size={14} /> High CFM output for sandblasting &amp; drilling</div>
                    <div className="spec-bullet"><Check size={14} /> Tropical high-ambient cooling package</div>
                  </div>
                  <div className="type-card-cta-btn diesel">
                    <span>Configure Diesel</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ONLY BRAND SELECTION */}
          {currentStep === 2 && selectedType && (
            <div className="wizard-step-body wizard-anim-enter">
              {/* Back & Breadcrumb Bar */}
              <div className="wizard-nav-subbar">
                <button
                  type="button"
                  className="wizard-back-btn"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Change Configuration</span>
                </button>

                <div className="wizard-current-selection-badge">
                  <span>Selected:</span>
                  <strong>{selectedType}</strong>
                </div>
              </div>

              <div className="step-title-zone">
                <span className="step-badge-indicator">STEP 2 OF 3</span>
                <h2 className="step-headline">Select Manufacturer Brand</h2>
                <p className="step-explanation">
                  Select your preferred OEM manufacturer. Mandtech is an authorized distributor providing full factory warranty in Nigeria.
                </p>
              </div>

              <div className="step-brands-grid-four">
                {COMPRESSOR_BRANDS.map((brand) => (
                  <div
                    key={brand.id}
                    className="interactive-brand-card"
                    onClick={() => handleSelectBrand(brand.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="brand-card-top-row">
                      <span className="brand-oem-tag">{brand.country}</span>
                      <span className="brand-warranty-pill">{brand.warranty}</span>
                    </div>

                    <h3 className="brand-card-name">{brand.name.toUpperCase()}</h3>
                    <p className="brand-card-tagline">{brand.tagline}</p>
                    <p className="brand-card-desc">{brand.description}</p>

                    <div className="brand-key-feature">
                      <Sparkles size={13} />
                      <span>{brand.keyFeature}</span>
                    </div>

                    <div className="brand-card-select-action">
                      <span>Select {brand.name}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ONLY FORMAL QUOTATION FORM */}
          {currentStep === 3 && selectedType && selectedBrand && (
            <div className="wizard-step-body wizard-anim-enter">
              {/* Back & Breadcrumb Bar */}
              <div className="wizard-nav-subbar">
                <button
                  type="button"
                  className="wizard-back-btn"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft size={16} />
                  <span>Change Brand</span>
                </button>

                <div className="wizard-current-selection-badge">
                  <span>Configuration:</span>
                  <strong>{selectedType}</strong>
                  <span className="sep">•</span>
                  <strong className="text-orange">{selectedBrand}</strong>
                </div>
              </div>

              <div className="step-title-zone">
                <span className="step-badge-indicator">STEP 3 OF 3</span>
                <h2 className="step-headline">Request a Formal Quotation</h2>
                <p className="step-explanation">
                  Enter your company and procurement contact details. Our regional commercial engineering desk will formulate your official proforma quotation.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="wizard-quote-form">
                {submitError && (
                  <div className="wizard-form-error">
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="wizard-form-grid">
                  {/* Company Name */}
                  <div className="wizard-field-group">
                    <label htmlFor="companyName" className="wizard-label">
                      Company Name <span className="req">*</span>
                    </label>
                    <div className="wizard-input-wrap">
                      <Building size={18} className="field-icon" />
                      <input
                        id="companyName"
                        type="text"
                        placeholder="e.g. Dangote Cement, Julius Berger, NLNG"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="wizard-input"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Corporate Email */}
                  <div className="wizard-field-group">
                    <label htmlFor="email" className="wizard-label">
                      Corporate / Official Email <span className="req">*</span>
                    </label>
                    <div className="wizard-input-wrap">
                      <Mail size={18} className="field-icon" />
                      <input
                        id="email"
                        type="email"
                        placeholder="procurement@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="wizard-input"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="wizard-field-group">
                    <label htmlFor="phone" className="wizard-label">
                      Phone Number / WhatsApp <span className="req">*</span>
                    </label>
                    <div className="wizard-input-wrap">
                      <Phone size={18} className="field-icon" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="wizard-input"
                      />
                    </div>
                  </div>

                  {/* Optional Notes / CFM Requirements */}
                  <div className="wizard-field-group full-span">
                    <label htmlFor="notes" className="wizard-label">
                      Target Airflow (CFM) / Operating Pressure / Project Site Details (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Require 300–500 CFM at 8 Bar for continuous plant operation in Ogun State..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="wizard-input textarea"
                    />
                  </div>
                </div>

                {/* Form Action Button */}
                <div className="wizard-action-container">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="wizard-cta-submit-btn"
                  >
                    {isSubmitting ? (
                      <span>Formulating &amp; Sending Quotation Request...</span>
                    ) : (
                      <>
                        <span>REQUEST A FORMAL QUOTATION</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                <div className="wizard-guarantees-bar">
                  <div className="guarantee-chip">
                    <Shield size={14} />
                    <span>Official OEM Quotation</span>
                  </div>
                  <div className="guarantee-chip">
                    <Check size={14} />
                    <span>Turnaround: 2–4 Business Hours</span>
                  </div>
                  <div className="guarantee-chip">
                    <Sparkles size={14} />
                    <span>Commissioning &amp; Warranty Across Nigeria</span>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: ONLY SUCCESS CONFIRMATION */}
          {currentStep === 4 && submissionSuccess && (
            <div className="wizard-step-body wizard-anim-enter">
              <div className="wizard-success-card">
                <div className="success-badge-circle">
                  <CheckCircle2 size={54} className="text-emerald" />
                </div>
                <h2 className="success-headline">Formal Quotation Request Registered</h2>
                <p className="success-subheadline">
                  Your quotation ticket has been assigned to our senior commercial desk.
                </p>

                <div className="success-reference-banner">
                  <span className="ref-label">Official Tracking Reference</span>
                  <span className="ref-id">MT-Q-{submissionSuccess.id.slice(0, 8).toUpperCase()}</span>
                </div>

                <div className="success-recap-box">
                  <div className="recap-item">
                    <span className="recap-label">Compressor Configuration</span>
                    <strong className="recap-value">{submissionSuccess.compressor_type}</strong>
                  </div>
                  <div className="recap-item">
                    <span className="recap-label">Selected OEM Brand</span>
                    <strong className="recap-value text-orange">{submissionSuccess.brand}</strong>
                  </div>
                  <div className="recap-item">
                    <span className="recap-label">Company Name</span>
                    <strong className="recap-value">{submissionSuccess.company_name}</strong>
                  </div>
                  <div className="recap-item">
                    <span className="recap-label">Destination Email</span>
                    <strong className="recap-value">{submissionSuccess.email}</strong>
                  </div>
                </div>

                <p className="success-sla-notice">
                  A regional application engineer will email your formal proforma invoice and technical specification sheet within <strong>2 to 4 business hours</strong>.
                </p>

                <div className="success-buttons-row">
                  <button
                    type="button"
                    className="btn-wizard-restart"
                    onClick={handleResetFlow}
                  >
                    <RotateCcw size={16} />
                    <span>Request Another Quotation</span>
                  </button>
                  <button
                    type="button"
                    className="btn-wizard-call"
                    onClick={() => setShowConsultModal(true)}
                  >
                    <Phone size={16} />
                    <span>Speak with Commercial Desk</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Optional Discreet Catalog View */}
      <section className="container fleet-accordion-section">
        <div className="fleet-toggle-card">
          <div className="fleet-toggle-left">
            <h4 className="fleet-toggle-title">Need to Inspect Technical Models &amp; Specifications?</h4>
            <p className="fleet-toggle-desc">
              Browse available certified units currently stationed in our Lagos and Port Harcourt yards.
            </p>
          </div>
          <button
            type="button"
            className="fleet-toggle-button"
            onClick={() => setShowCatalog(!showCatalog)}
          >
            <span>{showCatalog ? 'Hide Fleet Specifications' : 'View Available Models'}</span>
            <ChevronRight
              size={16}
              style={{
                transform: showCatalog ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        {showCatalog && (
          <div className="fleet-cards-container wizard-anim-enter">
            <div className="equip-products-grid">
              {PRODUCTS.map((p) => (
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
                          setCurrentStep(3);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                      >
                        Select for Quotation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

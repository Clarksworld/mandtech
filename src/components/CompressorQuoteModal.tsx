import React, { useState, useEffect } from 'react';
import {
  Zap, Flame, X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, HelpCircle,
  PackageCheck, Wrench
} from 'lucide-react';
import { submitCompressorRequest } from '../services/api';
import { BrandLogo } from './BrandLogo';
import { MandtechLogo } from './Logo';
import electricImg from '../assets/electric_compressor.jpg';
import dieselImg from '../assets/diesel_compressor.jpg';
import './CompressorQuoteModal.css';

export type CompressorType = 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR';
export type CompressorBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';
export type CompressorCondition = 'NEW' | 'USED';

interface CompressorQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: CompressorType | null;
  initialBrand?: CompressorBrand | null;
}

const BRANDS_DATA: {
  id: CompressorBrand;
  name: string;
  badge: string;
  origin: string;
}[] = [
    { id: 'ATLAS COPCO', name: 'Atlas Copco', badge: 'GA / VSD+ Series', origin: 'Sweden' },
    { id: 'SULLAIR', name: 'Sullair', badge: 'Heavy-Duty Air-End', origin: 'USA' },
    { id: 'INGERSOLL RAND', name: 'Ingersoll Rand', badge: 'Nirvana Series', origin: 'USA' },
    { id: 'DENAIR', name: 'Denair', badge: 'Dual-Stage Efficiency', origin: 'Germany' },
    { id: 'OTHERS', name: 'Others', badge: 'Specify Your Brand', origin: '—' },
  ];

// Steps: 1=Type, 2=Condition (New/Used), 3=Brand, 4=Contact Form, 5=Success
type Step = 1 | 2 | 3 | 4 | 5;
const TOTAL_STEPS = 4;

export default function CompressorQuoteModal({
  isOpen,
  onClose,
  initialType,
  initialBrand,
}: CompressorQuoteModalProps) {
  const [step, setStep] = useState<Step>(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<CompressorType | null>(initialType || null);
  const [selectedCondition, setSelectedCondition] = useState<CompressorCondition | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<CompressorBrand | null>(initialBrand || null);
  const [customBrand, setCustomBrand] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    compressor_type: string;
    brand: string;
    condition: string;
    company_name: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialType && initialBrand) {
        setSelectedType(initialType);
        setSelectedBrand(initialBrand);
        setSelectedCondition(null);
        setStep(2);
      } else if (initialType) {
        setSelectedType(initialType);
        setSelectedBrand(null);
        setSelectedCondition(null);
        setStep(2);
      } else {
        setSelectedType(null);
        setSelectedBrand(null);
        setSelectedCondition(null);
        setStep(1);
      }
      setSubmitError(null);
      setSuccessData(null);
    }
  }, [isOpen, initialType, initialBrand]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectType = (type: CompressorType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleSelectBrand = (brand: CompressorBrand) => {
    setSelectedBrand(brand);
    if (brand === 'OTHERS') {
      // stay on step 2 so user can enter custom brand name
      setCustomBrand('');
      return;
    }
    setStep(3);
  };

  const handleSelectCondition = (condition: CompressorCondition) => {
    setSelectedCondition(condition);
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep((s) => (s - 1) as Step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedType) { setSubmitError('Please select a compressor type.'); setStep(1); return; }
    if (!selectedBrand) { setSubmitError('Please select a brand.'); setStep(2); return; }
    if (selectedBrand === 'OTHERS' && !customBrand.trim()) { setSubmitError('Please specify the brand name.'); setStep(2); return; }
    if (!selectedCondition) { setSubmitError('Please select a compressor condition.'); setStep(3); return; }
    if (!companyName.trim()) { setSubmitError('Please provide your company name.'); return; }
    if (!email.trim() || !email.includes('@')) { setSubmitError('Please provide a valid corporate email.'); return; }
    if (!phone.trim() || phone.trim().length < 6) { setSubmitError('Please provide a valid phone number.'); return; }

    setIsSubmitting(true);
    const brandToSend = selectedBrand === 'OTHERS' ? customBrand.trim() : selectedBrand;
    try {
      const res = await submitCompressorRequest({
        compressor_type: selectedType,
        brand: brandToSend,
        condition: selectedCondition,
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccessData({
        id: res.data.id,
        compressor_type: res.data.compressor_type,
        brand: res.data.brand,
        condition: selectedCondition,
        company_name: res.data.company_name,
      });

      setPhone('');
      setEmail('');
      setCompanyName('');
      setNotes('');
      setStep(5);
    } catch (err: any) {
      console.error('Modal quote submission error:', err);
      setSubmitError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setSelectedCondition(null);
    setSelectedBrand(null);
    setSuccessData(null);
    setSubmitError(null);
    setStep(1);
  };

  const progressPercent = step >= 5 ? 100 : Math.round(((step - 1) / TOTAL_STEPS) * 100);

  return (
    <div className="cq-modal-backdrop" onClick={onClose}>
      <div className="cq-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Modal Top Bar */}
        <div className="cq-modal-topbar">
          <div className="cq-topbar-left">
            {step > 1 && step < 5 && (
              <button type="button" className="cq-back-btn" onClick={handleBack} title="Go back">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            )}
            <span className="cq-step-counter">
              {step < 5 ? `Step ${step} of ${TOTAL_STEPS}` : 'Completed'}
            </span>
          </div>
          <button type="button" className="cq-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Top Progress Bar */}
        <div className="cq-progress-track">
          <div className="cq-progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Modal Content Area */}
        <div className="cq-modal-body">

          {/* ── STEP 1: COMPRESSOR TYPE ── */}
          {step === 1 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <span className="cq-mini-pill">Configuration</span>
                <h3 className="cq-title">Choose Air Compressor Type</h3>
                <p className="cq-subtitle">Select power configuration for your facility or site.</p>
              </div>
              <div className="cq-cards-two-grid">
                <div className="cq-type-card cq-type-card--img electric-hover" onClick={() => handleSelectType('ELECTRIC AIR COMPRESSOR')} role="button" tabIndex={0}>
                  <div className="cq-type-img-wrap">
                    <img src={electricImg} alt="Electric Air Compressor" className="cq-type-img" />
                    <div className="cq-type-img-overlay" />
                    <div className="cq-type-img-badge"><Zap size={14} /> Plant &amp; Stationary</div>
                  </div>
                  <div className="cq-card-info">
                    <h4 className="cq-card-title">ELECTRIC AIR COMPRESSOR</h4>
                    <span className="cq-card-meta">400V 3-Phase • Rotary Screw VSD</span>
                  </div>
                  <div className="cq-card-arrow"><ArrowRight size={16} /></div>
                </div>
                <div className="cq-type-card cq-type-card--img diesel-hover" onClick={() => handleSelectType('DIESEL AIR COMPRESSOR')} role="button" tabIndex={0}>
                  <div className="cq-type-img-wrap">
                    <img src={dieselImg} alt="Diesel Air Compressor" className="cq-type-img" />
                    <div className="cq-type-img-overlay" />
                    <div className="cq-type-img-badge diesel"><Flame size={14} /> Mobile &amp; Field</div>
                  </div>
                  <div className="cq-card-info">
                    <h4 className="cq-card-title">DIESEL AIR COMPRESSOR</h4>
                    <span className="cq-card-meta">Highway Trailer • CAT/Cummins Engine</span>
                  </div>
                  <div className="cq-card-arrow"><ArrowRight size={16} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: OEM BRAND ── */}
          {step === 2 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <div className="cq-context-pill">
                  <span>Type:</span>
                  <strong>{selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'}</strong>
                </div>
                <h3 className="cq-title">Select Manufacturer Brand</h3>
                <p className="cq-subtitle">Choose your preferred industrial OEM manufacturer.</p>
              </div>
              <div className="cq-brands-grid">
                {BRANDS_DATA.map((brand) => (
                  <div
                    key={brand.id}
                    className={`cq-brand-card ${selectedBrand === brand.id ? 'cq-brand-card--selected' : ''}`}
                    onClick={() => handleSelectBrand(brand.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cq-brand-logo-box">
                      {brand.id === 'OTHERS' ? (
                        <div className="cq-brand-others-icon">
                          <HelpCircle size={28} />
                        </div>
                      ) : (
                        <BrandLogo brand={brand.id} size="md" />
                      )}
                    </div>
                    <div className="cq-brand-text">
                      <div className="cq-brand-name">{brand.name.toUpperCase()}</div>
                      <div className="cq-brand-badge">{brand.badge}</div>
                    </div>
                    <div className="cq-brand-origin">{brand.origin}</div>
                  </div>
                ))}
              </div>
              {/* Custom brand input if OTHERS selected */}
              {selectedBrand === 'OTHERS' && (
                <div className="cq-others-input-wrap">
                  <label className="cq-label">Specify Brand Name <span className="req">*</span></label>
                  <input
                    type="text"
                    className="cq-input"
                    placeholder="e.g. Kaeser, CompAir, Gardner Denver, Hitachi..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="cq-submit-btn"
                    style={{ marginTop: '12px' }}
                    disabled={!customBrand.trim()}
                    onClick={() => { if (customBrand.trim()) setStep(3); }}
                  >
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: CONDITION (New / Used) ── */}
          {step === 3 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <div className="cq-context-pill">
                  <span>{selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'}</span>
                  <span className="dot">•</span>
                  <strong className="text-orange">{selectedBrand === 'OTHERS' ? customBrand : selectedBrand}</strong>
                </div>
                <h3 className="cq-title">Select Compressor Condition</h3>
                <p className="cq-subtitle">Are you requesting a quote for a new or used unit?</p>
              </div>
              <div className="cq-cards-two-grid">
                {/* New */}
                <div className="cq-type-card cq-condition-card new-hover" onClick={() => handleSelectCondition('NEW')} role="button" tabIndex={0}>
                  <div className="cq-card-icon-box new-condition"><PackageCheck size={24} /></div>
                  <div className="cq-card-info">
                    <span className="cq-card-badge new-badge">Brand New</span>
                    <h4 className="cq-card-title">NEW UNIT</h4>
                    <span className="cq-card-meta">Factory-fresh • Full OEM Warranty</span>
                  </div>
                  <div className="cq-card-arrow"><ArrowRight size={16} /></div>
                </div>
                {/* Used */}
                <div className="cq-type-card cq-condition-card used-hover" onClick={() => handleSelectCondition('USED')} role="button" tabIndex={0}>
                  <div className="cq-card-icon-box used-condition"><Wrench size={24} /></div>
                  <div className="cq-card-info">
                    <span className="cq-card-badge used-badge">Pre-Owned</span>
                    <h4 className="cq-card-title">USED UNIT</h4>
                    <span className="cq-card-meta">Refurbished • Certified Inspection</span>
                  </div>
                  <div className="cq-card-arrow"><ArrowRight size={16} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: CONTACT FORM ── */}
          {step === 4 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <div className="cq-context-pill">
                  <span>{selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'}</span>
                  <span className="dot">•</span>
                  <strong className="text-orange">{selectedBrand}</strong>
                  <span className="dot">•</span>
                  <span className={selectedCondition === 'NEW' ? 'text-green' : 'text-amber'}>
                    {selectedCondition === 'NEW' ? 'New' : 'Used'}
                  </span>
                </div>
                <h3 className="cq-title">Request a Formal Quotation</h3>
                <p className="cq-subtitle">
                  Enter your details. Our commercial desk will email an official proforma invoice.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="cq-form">
                {submitError && (
                  <div className="cq-error-pill">
                    <AlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}
                <div className="cq-inputs-stack">
                  <div className="cq-field">
                    <label htmlFor="modalCompany" className="cq-label">Company Name <span className="req">*</span></label>
                    <div className="cq-input-wrap">
                      <Building size={16} className="cq-field-icon" />
                      <input id="modalCompany" type="text" placeholder="e.g. Dangote Cement, Julius Berger" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="cq-input" autoFocus />
                    </div>
                  </div>
                  <div className="cq-field">
                    <label htmlFor="modalEmail" className="cq-label">Corporate / Official Email <span className="req">*</span></label>
                    <div className="cq-input-wrap">
                      <Mail size={16} className="cq-field-icon" />
                      <input id="modalEmail" type="email" placeholder="procurement@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="cq-input" />
                    </div>
                  </div>
                  <div className="cq-field">
                    <label htmlFor="modalPhone" className="cq-label">Telephone / WhatsApp Number <span className="req">*</span></label>
                    <div className="cq-input-wrap">
                      <Phone size={16} className="cq-field-icon" />
                      <input id="modalPhone" type="tel" placeholder="+234 803 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} required className="cq-input" />
                    </div>
                  </div>
                  <div className="cq-field">
                    <label htmlFor="modalNotes" className="cq-label">CFM / Pressure / Site Notes (Optional)</label>
                    <input id="modalNotes" type="text" placeholder="e.g. 375 CFM @ 10 Bar for factory in Ikeja" value={notes} onChange={(e) => setNotes(e.target.value)} className="cq-input" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="cq-submit-btn">
                  {isSubmitting ? (
                    <span>Submitting Quotation Request...</span>
                  ) : (
                    <>
                      <span>REQUEST A FORMAL QUOTATION</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 5: SUCCESS ── */}
          {step === 5 && successData && (
            <div className="cq-step-content cq-fade-in cq-success-wrap">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <MandtechLogo height={32} />
              </div>
              <div className="cq-success-icon"><CheckCircle2 size={48} /></div>
              <h3 className="cq-success-title">Quotation Request Logged</h3>
              <p className="cq-success-sub">
                Your quotation request has been dispatched to Mandtech commercial sales engineers.
              </p>
              <div className="cq-ref-pill">
                <span className="cq-ref-label">Ticket ID:</span>
                <strong className="cq-ref-val">MT-Q-{successData.id.slice(0, 8).toUpperCase()}</strong>
              </div>
              <div className="cq-success-recap">
                <div className="cq-recap-row">
                  <span>Type:</span>
                  <strong>{successData.compressor_type}</strong>
                </div>
                <div className="cq-recap-row">
                  <span>Condition:</span>
                  <strong className={successData.condition === 'NEW' ? 'text-green' : 'text-amber'}>
                    {successData.condition === 'NEW' ? 'New Unit' : 'Used Unit'}
                  </strong>
                </div>
                <div className="cq-recap-row">
                  <span>Brand:</span>
                  <strong className="text-orange">{successData.brand}</strong>
                </div>
                <div className="cq-recap-row">
                  <span>Company:</span>
                  <strong>{successData.company_name}</strong>
                </div>
              </div>
              <p className="cq-sla-note">
                An official PDF quotation and technical data sheet will be emailed within <strong>2 to 4 business hours</strong>.
              </p>
              <div className="cq-success-actions">
                <button type="button" className="cq-btn-done" onClick={onClose}>Done</button>
                <button type="button" className="cq-btn-restart" onClick={handleReset}>
                  <RotateCcw size={14} />
                  <span>Request Another</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Zap, Flame, X, ArrowLeft, ArrowRight, Check,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, Sparkles, Shield, Cpu, Gauge
} from 'lucide-react';
import { submitCompressorRequest } from '../services/api';
import './CompressorQuoteModal.css';

export type CompressorType = 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR';
export type CompressorBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR';

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
  icon: React.ReactNode;
}[] = [
  {
    id: 'ATLAS COPCO',
    name: 'Atlas Copco',
    badge: 'GA / VSD+ Series',
    origin: 'Sweden',
    icon: <Gauge size={20} />,
  },
  {
    id: 'SULLAIR',
    name: 'Sullair',
    badge: 'Heavy-Duty Air-End',
    origin: 'USA',
    icon: <Shield size={20} />,
  },
  {
    id: 'INGERSOLL RAND',
    name: 'Ingersoll Rand',
    badge: 'Nirvana Series',
    origin: 'USA',
    icon: <Cpu size={20} />,
  },
  {
    id: 'DENAIR',
    name: 'Denair',
    badge: 'Dual-Stage Efficiency',
    origin: 'Germany',
    icon: <Sparkles size={20} />,
  },
];

export default function CompressorQuoteModal({
  isOpen,
  onClose,
  initialType,
  initialBrand,
}: CompressorQuoteModalProps) {
  // Step: 1 = Type, 2 = Brand, 3 = Contact Form, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<CompressorType | null>(initialType || null);
  const [selectedBrand, setSelectedBrand] = useState<CompressorBrand | null>(initialBrand || null);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    compressor_type: string;
    brand: string;
    company_name: string;
  } | null>(null);

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialType && initialBrand) {
        setSelectedType(initialType);
        setSelectedBrand(initialBrand);
        setStep(3);
      } else if (initialType) {
        setSelectedType(initialType);
        setSelectedBrand(null);
        setStep(2);
      } else {
        setSelectedType(null);
        setSelectedBrand(null);
        setStep(1);
      }
      setSubmitError(null);
      setSuccessData(null);
    }
  }, [isOpen, initialType, initialBrand]);

  // Lock background scroll when modal is open
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
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedType) {
      setSubmitError('Please select a compressor type.');
      setStep(1);
      return;
    }
    if (!selectedBrand) {
      setSubmitError('Please select a brand.');
      setStep(2);
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Please provide your company name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please provide a valid corporate email.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setSubmitError('Please provide a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCompressorRequest({
        compressor_type: selectedType,
        brand: selectedBrand,
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccessData({
        id: res.data.id,
        compressor_type: res.data.compressor_type,
        brand: res.data.brand,
        company_name: res.data.company_name,
      });

      // Clear inputs
      setPhone('');
      setEmail('');
      setCompanyName('');
      setNotes('');
      setStep(4);
    } catch (err: any) {
      console.error('Modal quote submission error:', err);
      setSubmitError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setSelectedBrand(null);
    setSuccessData(null);
    setSubmitError(null);
    setStep(1);
  };

  return (
    <div className="cq-modal-backdrop" onClick={onClose}>
      <div className="cq-modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Modal Top Bar */}
        <div className="cq-modal-topbar">
          <div className="cq-topbar-left">
            {step > 1 && step < 4 && (
              <button
                type="button"
                className="cq-back-btn"
                onClick={() => setStep((s) => (s - 1) as any)}
                title="Go back"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            )}
            <span className="cq-step-counter">
              {step < 4 ? `Step ${step} of 3` : 'Completed'}
            </span>
          </div>

          <button
            type="button"
            className="cq-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Progress Bar */}
        <div className="cq-progress-track">
          <div
            className="cq-progress-bar"
            style={{
              width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
            }}
          />
        </div>

        {/* Modal Content Area */}
        <div className="cq-modal-body">

          {/* ────────────────────────────────────────────────────────
              STEP 1: COMPRESSOR TYPE (Two clean compact cards)
             ──────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <span className="cq-mini-pill">Configuration</span>
                <h3 className="cq-title">Choose Air Compressor Type</h3>
                <p className="cq-subtitle">Select power configuration for your facility or site.</p>
              </div>

              <div className="cq-cards-two-grid">
                {/* Electric Card */}
                <div
                  className="cq-type-card electric-hover"
                  onClick={() => handleSelectType('ELECTRIC AIR COMPRESSOR')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cq-card-icon-box electric">
                    <Zap size={24} />
                  </div>
                  <div className="cq-card-info">
                    <span className="cq-card-badge">Plant &amp; Stationary</span>
                    <h4 className="cq-card-title">ELECTRIC AIR COMPRESSOR</h4>
                    <span className="cq-card-meta">400V 3-Phase • Rotary Screw VSD</span>
                  </div>
                  <div className="cq-card-arrow">
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Diesel Card */}
                <div
                  className="cq-type-card diesel-hover"
                  onClick={() => handleSelectType('DIESEL AIR COMPRESSOR')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cq-card-icon-box diesel">
                    <Flame size={24} />
                  </div>
                  <div className="cq-card-info">
                    <span className="cq-card-badge diesel">Mobile &amp; Field</span>
                    <h4 className="cq-card-title">DIESEL AIR COMPRESSOR</h4>
                    <span className="cq-card-meta">Highway Trailer • CAT/Cummins Engine</span>
                  </div>
                  <div className="cq-card-arrow">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              STEP 2: OEM BRANDS (4 compact cards with icons)
             ──────────────────────────────────────────────────────── */}
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
                    className="cq-brand-card"
                    onClick={() => handleSelectBrand(brand.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cq-brand-icon-box">
                      {brand.icon}
                    </div>
                    <div className="cq-brand-text">
                      <div className="cq-brand-name">{brand.name.toUpperCase()}</div>
                      <div className="cq-brand-badge">{brand.badge}</div>
                    </div>
                    <div className="cq-brand-origin">{brand.origin}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              STEP 3: FORMAL QUOTATION FORM
             ──────────────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <div className="cq-context-pill">
                  <span>{selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'}</span>
                  <span className="dot">•</span>
                  <strong className="text-orange">{selectedBrand}</strong>
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
                  {/* Company Name */}
                  <div className="cq-field">
                    <label htmlFor="modalCompany" className="cq-label">
                      Company Name <span className="req">*</span>
                    </label>
                    <div className="cq-input-wrap">
                      <Building size={16} className="cq-field-icon" />
                      <input
                        id="modalCompany"
                        type="text"
                        placeholder="e.g. Dangote Cement, Julius Berger"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="cq-input"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Corporate Email */}
                  <div className="cq-field">
                    <label htmlFor="modalEmail" className="cq-label">
                      Corporate / Official Email <span className="req">*</span>
                    </label>
                    <div className="cq-input-wrap">
                      <Mail size={16} className="cq-field-icon" />
                      <input
                        id="modalEmail"
                        type="email"
                        placeholder="procurement@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="cq-input"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="cq-field">
                    <label htmlFor="modalPhone" className="cq-label">
                      Telephone / WhatsApp Number <span className="req">*</span>
                    </label>
                    <div className="cq-input-wrap">
                      <Phone size={16} className="cq-field-icon" />
                      <input
                        id="modalPhone"
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="cq-input"
                      />
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div className="cq-field">
                    <label htmlFor="modalNotes" className="cq-label">
                      CFM / Pressure / Site Notes (Optional)
                    </label>
                    <input
                      id="modalNotes"
                      type="text"
                      placeholder="e.g. 375 CFM @ 10 Bar for factory in Ikeja"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="cq-input"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cq-submit-btn"
                >
                  {isSubmitting ? (
                    <span>Submitting Quotation Request...</span>
                  ) : (
                    <>
                      <span>REQUEST A FORMAL QUOTATION</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="cq-guarantees">
                  <span><Check size={12} /> Official OEM Quote</span>
                  <span><Check size={12} /> 2–4 Hour SLA</span>
                  <span><Check size={12} /> Factory Warranty</span>
                </div>
              </form>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              STEP 4: SUCCESS CONFIRMATION
             ──────────────────────────────────────────────────────── */}
          {step === 4 && successData && (
            <div className="cq-step-content cq-fade-in cq-success-wrap">
              <div className="cq-success-icon">
                <CheckCircle2 size={48} />
              </div>
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
                <button
                  type="button"
                  className="cq-btn-done"
                  onClick={onClose}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="cq-btn-restart"
                  onClick={handleReset}
                >
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

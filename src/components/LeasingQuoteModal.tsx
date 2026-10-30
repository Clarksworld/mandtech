import React, { useState, useEffect } from 'react';
import {
  Zap, Flame, X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, Shield, Wrench, Clock,
  Truck, Calendar, MapPin, HelpCircle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { submitLeasingRequest } from '../services/api';
import './LeasingQuoteModal.css';
import electricImg from '../assets/electric_compressor.jpg';
import dieselImg from '../assets/diesel_compressor.jpg';

export type LeasingCompressorType = 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR';
export type LeasingBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';

interface LeasingQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: LeasingCompressorType | null;
  initialBrand?: LeasingBrand | null;
}

export const LEASING_BRANDS: {
  id: LeasingBrand;
  name: string;
  badge: string;
  series: string;
}[] = [
  {
    id: 'ATLAS COPCO',
    name: 'Atlas Copco',
    badge: 'GA / VSD+ High Uptime',
    series: 'Industrial & Mobile Screw Units',
  },
  {
    id: 'SULLAIR',
    name: 'Sullair',
    badge: 'Heavy-Duty Field Proven',
    series: '185 - 1600 CFM Fleet Available',
  },
  {
    id: 'INGERSOLL RAND',
    name: 'Ingersoll Rand',
    badge: 'Nirvana & SSR Series',
    series: 'High-Efficiency Rotary Compressors',
  },
  {
    id: 'DENAIR',
    name: 'Denair',
    badge: 'Dual-Stage Efficiency',
    series: 'German Engineering Standards',
  },
  {
    id: 'OTHERS',
    name: 'Others',
    badge: 'Custom OEM Brand',
    series: 'Specify your compressor manufacturer',
  },
];

// Steps: 1=Type, 2=Brand, 3=Rental Form, 4=Success
type Step = 1 | 2 | 3 | 4;

export default function LeasingQuoteModal({
  isOpen,
  onClose,
  initialType,
  initialBrand,
}: LeasingQuoteModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedType, setSelectedType] = useState<LeasingCompressorType | null>(initialType || null);
  const [selectedBrand, setSelectedBrand] = useState<LeasingBrand | null>(initialBrand || null);
  const [customBrand, setCustomBrand] = useState('');

  // Form Fields
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState('1 - 3 Months (Standard Project Lease)');
  const [hub, setHub] = useState('Port Harcourt HQ (Elelenwo Ops Yard)');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<{
    id: string;
    compressor_type: string;
    brand: string;
    duration: string;
    hub: string;
    company_name: string;
  } | null>(null);

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
      setCustomBrand('');
      setSubmitError(null);
    }
  }, [isOpen, initialType, initialBrand]);

  if (!isOpen) return null;

  const handleSelectType = (type: LeasingCompressorType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleSelectBrand = (brand: LeasingBrand) => {
    setSelectedBrand(brand);
    if (brand === 'OTHERS') {
      setCustomBrand('');
      // Stay on step 2 — user must fill custom brand first
    } else {
      setStep(3);
    }
  };

  const effectiveBrand = selectedBrand === 'OTHERS' ? customBrand.trim() : (selectedBrand ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !selectedBrand) return;

    if (selectedBrand === 'OTHERS' && !customBrand.trim()) {
      setSubmitError('Please specify the compressor brand you need.');
      return;
    }
    if (!contactName.trim()) {
      setSubmitError('Contact person name is required.');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Company or organization name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('A valid corporate email address is required.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Active phone number is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitLeasingRequest({
        compressor_type: selectedType,
        brand: effectiveBrand || selectedBrand,
        duration,
        hub,
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() ? `Contact: ${contactName.trim()} | ${notes.trim()}` : `Contact: ${contactName.trim()}`,
      });

      const ticketRef = res.data?.id
        ? `LSE-${res.data.id.substring(0, 8).toUpperCase()}`
        : `LSE-${Math.floor(100000 + Math.random() * 900000)}`;

      setSuccessTicket({
        id: ticketRef,
        compressor_type: selectedType,
        brand: effectiveBrand || selectedBrand,
        duration,
        hub,
        company_name: companyName.trim(),
      });

      setStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit leasing request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedType(null);
    setSelectedBrand(null);
    setCustomBrand('');
    setContactName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSuccessTicket(null);
    setSubmitError(null);
  };

  return (
    <div className="lse-modal-overlay" onClick={onClose}>
      <div className="lse-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lse-modal-header">
          <div className="lse-modal-title-area">
            <div className="lse-brand-tag">
              <Clock size={13} />
              <span>MANDTECH INDUSTRIAL LEASING &amp; RENTALS</span>
            </div>
            <h2 className="lse-modal-heading">
              {step === 1 && 'Select Compressor Power Type'}
              {step === 2 && 'Select Compressor Brand'}
              {step === 3 && 'Complete Leasing & Rental Request'}
              {step === 4 && 'Rental Request Submitted'}
            </h2>
            <p className="lse-modal-sub">
              {step === 1 && 'Choose electric stationary or diesel mobile equipment for your facility or project site.'}
              {step === 2 && `Choose your preferred OEM manufacturer for ${selectedType}.`}
              {step === 3 && 'Specify rental duration, mobilization hub, and corporate contact details.'}
              {step === 4 && 'Your reservation ticket has been logged with our logistics dispatch center.'}
            </p>
          </div>
          <button className="lse-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        {step < 4 && (
          <div className="lse-stepper-wrap">
            <div className="lse-stepper-bar">
              <div
                className="lse-stepper-fill"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <div className="lse-step-labels">
              <span className={`lse-step-lbl ${step >= 1 ? 'active' : ''}`}>1. Power Type</span>
              <span className={`lse-step-lbl ${step >= 2 ? 'active' : ''}`}>2. OEM Brand</span>
              <span className={`lse-step-lbl ${step >= 3 ? 'active' : ''}`}>3. Rental Details</span>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="lse-modal-body">
          {/* STEP 1: Select Type */}
          {step === 1 && (
            <div className="lse-types-grid">
              {/* Electric Air Compressor */}
              <div
                className={`lse-type-card lse-type-card--img ${selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'selected' : ''}`}
                onClick={() => handleSelectType('ELECTRIC AIR COMPRESSOR')}
              >
                <div className="lse-type-img-wrap">
                  <img src={electricImg} alt="Electric Air Compressor" className="lse-type-img" />
                  <div className="lse-type-img-overlay" />
                  <div className="lse-type-img-badge electric-badge">STATIONARY INDUSTRIAL FLEET</div>
                </div>
                <div className="lse-type-content">
                  <h3 className="lse-type-title">ELECTRIC AIR COMPRESSOR</h3>
                  <p className="lse-type-desc">
                    High-efficiency stationary rotary screw compressor fleet for factories, processing plants, and manufacturing facilities (400V 3-Phase).
                  </p>
                  <ul className="lse-type-bullets">
                    <li>✓ High continuous uptime with low operating noise</li>
                    <li>✓ VSD &amp; Fixed-speed units from 15 kW to 250 kW</li>
                    <li>✓ Zero site emissions, ISO 8573.1 compliant air</li>
                  </ul>
                  <div className="lse-type-brands-row">
                    <span>Available:</span> ATLAS COPCO • SULLAIR • INGERSOLL RAND • DENAIR • OTHERS
                  </div>
                </div>
                <div className="lse-select-action">
                  <span>Select Electric</span>
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Diesel Air Compressor */}
              <div
                className={`lse-type-card lse-type-card--img ${selectedType === 'DIESEL AIR COMPRESSOR' ? 'selected' : ''}`}
                onClick={() => handleSelectType('DIESEL AIR COMPRESSOR')}
              >
                <div className="lse-type-img-wrap">
                  <img src={dieselImg} alt="Diesel Air Compressor" className="lse-type-img" />
                  <div className="lse-type-img-overlay" />
                  <div className="lse-type-img-badge diesel-badge">PORTABLE MOBILE FLEET</div>
                </div>
                <div className="lse-type-content">
                  <h3 className="lse-type-title">DIESEL AIR COMPRESSOR</h3>
                  <p className="lse-type-desc">
                    Heavy-duty trailer-mounted portable compressors for remote construction, mining, sandblasting, and offshore pipeline operations.
                  </p>
                  <ul className="lse-type-bullets">
                    <li>✓ High-volume portable units (185 CFM to 1600 CFM)</li>
                    <li>✓ Robust Caterpillar, Cummins, and Perkins engines</li>
                    <li>✓ Highway and off-road towable chassis with spill containment</li>
                  </ul>
                  <div className="lse-type-brands-row">
                    <span>Available:</span> ATLAS COPCO • SULLAIR • INGERSOLL RAND • DENAIR • OTHERS
                  </div>
                </div>
                <div className="lse-select-action">
                  <span>Select Diesel</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select Brand */}
          {step === 2 && (
            <div className="lse-brands-step">
              <div className="lse-selection-crumb">
                <span className="lse-crumb-label">Selected Type:</span>
                <span className="lse-crumb-badge">
                  {selectedType === 'ELECTRIC AIR COMPRESSOR' ? <Zap size={14} /> : <Flame size={14} />}
                  {selectedType}
                </span>
                <button
                  className="lse-crumb-change-btn"
                  onClick={() => setStep(1)}
                >
                  Change
                </button>
              </div>

              <div className="lse-brands-grid">
                {LEASING_BRANDS.map((brand) => (
                  <div
                    key={brand.id}
                    className={`lse-brand-card ${selectedBrand === brand.id ? 'selected' : ''}`}
                    onClick={() => handleSelectBrand(brand.id)}
                  >
                    <div className="lse-brand-logo-box">
                      {brand.id === 'OTHERS' ? (
                        <div className="lse-brand-others-icon">
                          <HelpCircle size={26} />
                        </div>
                      ) : (
                        <BrandLogo brand={brand.id} size="md" />
                      )}
                    </div>
                    <div className="lse-brand-info">
                      <h4 className="lse-brand-name">{brand.name}</h4>
                      <span className="lse-brand-badge">{brand.badge}</span>
                      <p className="lse-brand-series">{brand.series}</p>
                    </div>
                    <div className="lse-brand-action">
                      <span>Select</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom brand input shown when OTHERS selected */}
              {selectedBrand === 'OTHERS' && (
                <div className="lse-others-input-wrap">
                  <label className="lse-others-label">
                    Please specify the compressor brand you need:
                  </label>
                  <input
                    type="text"
                    className="lse-others-input"
                    placeholder="e.g. Kaeser, CompAir, Airman, Kaishan..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="lse-others-continue-btn"
                    disabled={!customBrand.trim()}
                    onClick={() => { if (customBrand.trim()) setStep(3); }}
                  >
                    Continue <ArrowRight size={15} />
                  </button>
                </div>
              )}

              <div className="lse-step-footer">
                <button
                  className="lse-btn-back"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={16} /> Back to Type
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Rental & Leasing Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="lse-form-step">
              {/* Selected Configuration Summary Bar */}
              <div className="lse-summary-bar">
                <div className="lse-summary-items">
                  <div className="lse-summary-item">
                    <span className="lse-sum-lbl">Equipment:</span>
                    <strong className="lse-sum-val">
                      {selectedType === 'ELECTRIC AIR COMPRESSOR' ? '⚡ ' : '🔥 '}
                      {selectedType}
                    </strong>
                  </div>
                  <div className="lse-summary-divider" />
                  <div className="lse-summary-item">
                    <span className="lse-sum-lbl">Brand:</span>
                    <strong className="lse-sum-val">
                      {selectedBrand === 'OTHERS' ? customBrand : selectedBrand}
                    </strong>
                  </div>
                  <div className="lse-summary-divider" />
                  <div className="lse-summary-item">
                    <span className="lse-sum-lbl">Purpose:</span>
                    <strong className="lse-sum-val">Industrial Lease &amp; Rental</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="lse-sum-edit-btn"
                  onClick={() => setStep(2)}
                >
                  Edit Machine
                </button>
              </div>

              {submitError && (
                <div className="lse-error-banner">
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="lse-form-grid">
                {/* Contact Name */}
                <div className="lse-field">
                  <label className="lse-field-label">
                    Contact Person Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="lse-input"
                    placeholder="e.g. Engr. Tunde Adeleke"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>

                {/* Company Name */}
                <div className="lse-field">
                  <label className="lse-field-label">
                    <Building size={14} /> Company / Organization <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="lse-input"
                    placeholder="e.g. Apex Marine & Energy Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="lse-field">
                  <label className="lse-field-label">
                    <Mail size={14} /> Corporate Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    className="lse-input"
                    placeholder="e.g. procurement@apexenergy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="lse-field">
                  <label className="lse-field-label">
                    <Phone size={14} /> Active Phone Number <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    className="lse-input"
                    placeholder="e.g. 0803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Rental Duration Term */}
                <div className="lse-field">
                  <label className="lse-field-label">
                    <Calendar size={14} /> Desired Rental Duration Term <span className="req">*</span>
                  </label>
                  <select
                    className="lse-select"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="1 - 4 Weeks (Spot Rental)">1 – 4 Weeks (Spot Rental / Emergency)</option>
                    <option value="1 - 3 Months (Standard Project Lease)">1 – 3 Months (Standard Project Lease)</option>
                    <option value="3 - 6 Months (Medium-Term Operational)">3 – 6 Months (Medium-Term Operational)</option>
                    <option value="6 - 12 Months (Extended Plant Contract)">6 – 12 Months (Extended Plant Contract)</option>
                    <option value="12+ Months (Multi-Year Dedicated Fleet)">12+ Months (Multi-Year Dedicated Fleet)</option>
                  </select>
                </div>

                {/* Mobilization Hub */}
                <div className="lse-field">
                  <label className="lse-field-label">
                    <MapPin size={14} /> Mobilization Yard / Delivery Hub <span className="req">*</span>
                  </label>
                  <select
                    className="lse-select"
                    value={hub}
                    onChange={(e) => setHub(e.target.value)}
                  >
                    <option value="Port Harcourt HQ (Elelenwo Ops Yard)">Port Harcourt HQ (Elelenwo Ops Yard)</option>
                    <option value="Lagos Hub (16 Oshuketan Street)">Lagos Hub (16 Oshuketan Street)</option>
                    <option value="Abuja Hub (Camp David Garden Estate, Karsana)">Abuja Hub (Camp David Garden Estate, Karsana)</option>
                    <option value="Custom Project Job Site Delivery">Custom Project Job Site Delivery (Enter in notes)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="lse-field" style={{ marginTop: '14px' }}>
                <label className="lse-field-label">
                  CFM Targets, Operating Pressure &amp; Site Details (Optional)
                </label>
                <textarea
                  className="lse-textarea"
                  rows={3}
                  placeholder="State required CFM/bar (e.g. 375 CFM @ 7-10 bar), continuous duty cycle hours, specific delivery site address, or request for standby operator..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Assurance Notes */}
              <div className="lse-assurance-row">
                <div className="lse-assure-item">
                  <Shield size={14} />
                  <span>Guaranteed 4-Hour Hot-Swap SLA</span>
                </div>
                <div className="lse-assure-item">
                  <Truck size={14} />
                  <span>Rapid Mobilization from PHC, Lagos &amp; Abuja</span>
                </div>
                <div className="lse-assure-item">
                  <Wrench size={14} />
                  <span>Certified Mandtech Technicians Included</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="lse-form-actions">
                <button
                  type="button"
                  className="lse-btn-back"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} /> Back to Brands
                </button>
                <button
                  type="submit"
                  className="lse-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Reservation...' : 'Submit Rental & Lease Request'}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && successTicket && (
            <div className="lse-success-view">
              <div className="lse-success-icon-wrap">
                <CheckCircle2 size={54} className="lse-check-icon" />
              </div>
              <h3 className="lse-success-title">Leasing Request Received</h3>
              <p className="lse-success-sub">
                Thank you, <strong>{contactName}</strong> ({successTicket.company_name}). Your industrial rental request has been assigned to a Mandtech heavy equipment coordinator.
              </p>

              <div className="lse-ticket-card">
                <div className="lse-ticket-header">
                  <span>RESERVATION TRACKING REFERENCE</span>
                  <strong>{successTicket.id}</strong>
                </div>
                <div className="lse-ticket-details">
                  <div className="lse-t-row">
                    <span>Equipment:</span>
                    <strong>{successTicket.compressor_type}</strong>
                  </div>
                  <div className="lse-t-row">
                    <span>OEM Brand:</span>
                    <strong>{successTicket.brand}</strong>
                  </div>
                  <div className="lse-t-row">
                    <span>Lease Term:</span>
                    <strong>{successTicket.duration}</strong>
                  </div>
                  <div className="lse-t-row">
                    <span>Dispatch Hub:</span>
                    <strong>{successTicket.hub}</strong>
                  </div>
                </div>
              </div>

              <div className="lse-success-hotlines">
                <div className="lse-hotline-col">
                  <strong>Port-Harcourt HQ Dispatch</strong>
                  <a href="tel:08064204187">08064204187</a>
                </div>
                <div className="lse-hotline-col">
                  <strong>Lagos Fleet Hub</strong>
                  <a href="tel:08027779298">08027779298</a>
                </div>
                <div className="lse-hotline-col">
                  <strong>Abuja Operations</strong>
                  <a href="tel:08067980479">08067980479</a>
                </div>
              </div>

              <div className="lse-success-actions">
                <button
                  type="button"
                  className="lse-btn-reset"
                  onClick={resetFlow}
                >
                  <RotateCcw size={15} /> Book Another Unit
                </button>
                <button
                  type="button"
                  className="lse-btn-done"
                  onClick={onClose}
                >
                  Done &amp; Return to Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

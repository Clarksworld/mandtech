import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, HelpCircle, Cpu,
  Wrench, Filter, Droplet, Wind, GitCommit,
  Thermometer, Radio, Activity,
  Sliders, Fuel, Disc, Layers
} from 'lucide-react';
import { submitSparePartsRequest } from '../services/api';
import { BrandLogo } from './BrandLogo';
import './SparePartsQuoteModal.css';

export type SparePartsBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';

export interface SparePartItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const SPARE_PARTS_LIST: SparePartItem[] = [
  { id: 'AIR FILTER', name: 'I. AIR FILTER', icon: <Wind size={18} /> },
  { id: 'OIL FILTER', name: 'II. OIL FILTER', icon: <Droplet size={18} /> },
  { id: 'OIL SEPARATOR', name: 'III. OIL SEPARATOR', icon: <Layers size={18} /> },
  { id: 'UNLOADER/INLET VALVE KIT', name: 'IV. UNLOADER/INLET VALVE KIT', icon: <Sliders size={18} /> },
  { id: 'MINIMUM PRESSURE VALVE', name: 'V. MINIMUM PRESSURE VALVE', icon: <Disc size={18} /> },
  { id: 'OIL STOP/CHECK VALVE', name: 'VI. OIL STOP/CHECK VALVE', icon: <GitCommit size={18} /> },
  { id: 'THERMOSTAT', name: 'VII. THERMOSTAT', icon: <Thermometer size={18} /> },
  { id: 'AIREND', name: 'VIII. AIREND', icon: <Wrench size={18} /> },
  { id: 'FAN MOTOR', name: 'IX. FAN MOTOR', icon: <Radio size={18} /> },
  { id: 'OIL/AIR COOLER', name: 'X. OIL/AIR COOLER', icon: <Filter size={18} /> },
  { id: 'AIR DRYER', name: 'XI. AIR DRYER', icon: <Wind size={18} /> },
  { id: 'SENSORS', name: 'XII. SENSORS', icon: <Activity size={18} /> },
  { id: 'CONTROLLER', name: 'XIII. CONTROLLER', icon: <Cpu size={18} /> },
  { id: 'LUBRICANT', name: 'XIV. LUBRICANT', icon: <Fuel size={18} /> },
];

export const BRANDS_INFO: {
  id: SparePartsBrand;
  name: string;
  tag: string;
}[] = [
  { id: 'ATLAS COPCO', name: 'Atlas Copco', tag: 'GA • GX • VSD+' },
  { id: 'SULLAIR', name: 'Sullair', tag: 'Heavy-Duty Screw' },
  { id: 'INGERSOLL RAND', name: 'Ingersoll Rand', tag: 'SSR • Nirvana' },
  { id: 'DENAIR', name: 'Denair', tag: 'Dual-Stage Units' },
  { id: 'OTHERS', name: 'Others', tag: 'Specify your brand' },
];

interface SparePartsQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrand?: SparePartsBrand | null;
  initialPart?: string | null;
}

// Steps: 1=Brand Selection, 2=Part Selection, 3=Contact Form, 4=Success
type Step = 1 | 2 | 3 | 4;

export default function SparePartsQuoteModal({
  isOpen,
  onClose,
  initialBrand,
  initialPart,
}: SparePartsQuoteModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedBrand, setSelectedBrand] = useState<SparePartsBrand | null>(initialBrand || null);
  const [selectedPart, setSelectedPart] = useState<string | null>(initialPart || null);
  const [customBrand, setCustomBrand] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    brand: string;
    part_name: string;
    company_name: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialBrand && initialPart) {
        setSelectedBrand(initialBrand);
        setSelectedPart(initialPart);
        setStep(3);
      } else if (initialBrand) {
        setSelectedBrand(initialBrand);
        setSelectedPart(null);
        setStep(2);
      } else {
        setSelectedBrand(null);
        setSelectedPart(null);
        setStep(1);
      }
      setSubmitError(null);
    }
  }, [isOpen, initialBrand, initialPart]);

  if (!isOpen) return null;

  const handleBrandSelect = (brandId: SparePartsBrand) => {
    setSelectedBrand(brandId);
    if (brandId === 'OTHERS') {
      setCustomBrand('');
      return; // stay on step 1 to show custom input
    }
    setStep(2);
  };

  const handlePartSelect = (partId: string) => {
    setSelectedPart(partId);
    setStep(3);
  };

  const handleBack = () => {
    setSubmitError(null);
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || !selectedPart) {
      setSubmitError('Please select both a brand and spare part component.');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Please enter your company name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid business email.');
      return;
    }
    if (!phone.trim() || phone.length < 5) {
      setSubmitError('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const basePartName = selectedPart.replace(/^[I|V|X]+\.\s*/, '');
      const brandToSend = selectedBrand === 'OTHERS' ? customBrand.trim() : selectedBrand;
      const response = await submitSparePartsRequest({
        brand: brandToSend,
        part_name: basePartName,
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccessData({
        id: response.data?.id || 'SPR-' + Math.floor(100000 + Math.random() * 900000),
        brand: selectedBrand,
        part_name: selectedPart,
        company_name: companyName.trim(),
      });
      setStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedPart(null);
    setCompanyName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSubmitError(null);
    setSuccessData(null);
    setStep(1);
  };

  const selectedPartItem = SPARE_PARTS_LIST.find((p) => p.name === selectedPart || p.id === selectedPart);

  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div className="sp-modal-sheet" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="sp-modal-top-bar">
          <div>
            <span className="sp-modal-brand-badge">OEM PARTS PROCUREMENT</span>
            <h2 className="sp-modal-main-title">
              {step === 1 && 'Select Equipment Manufacturer'}
              {step === 2 && `${selectedBrand} — Select Component`}
              {step === 3 && 'Request Quotation Details'}
              {step === 4 && 'Quotation Request Registered'}
            </h2>
          </div>
          <button className="sp-modal-exit-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Dots */}
        {step < 4 && (
          <div className="sp-modal-stepper">
            <div className={`sp-stepper-step ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-done' : ''}`}>
              <span className="sp-stepper-num">1</span>
              <span className="sp-stepper-text">Manufacturer</span>
            </div>
            <div className="sp-stepper-line" />
            <div className={`sp-stepper-step ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-done' : ''}`}>
              <span className="sp-stepper-num">2</span>
              <span className="sp-stepper-text">Select Component</span>
            </div>
            <div className="sp-stepper-line" />
            <div className={`sp-stepper-step ${step >= 3 ? 'is-active' : ''}`}>
              <span className="sp-stepper-num">3</span>
              <span className="sp-stepper-text">Quotation Details</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="sp-modal-scroll-area">

          {/* STEP 1: Brand Selection */}
          {step === 1 && (
            <div className="sp-step-panel">
              <p className="sp-step-prompt">
                Select your compressor manufacturer to view factory replacement components:
              </p>
              <div className="sp-brands-select-grid">
                {BRANDS_INFO.map((b) => (
                  <div
                    key={b.id}
                    className={`sp-brand-choice-card ${selectedBrand === b.id ? 'sp-brand-selected' : ''}`}
                    onClick={() => handleBrandSelect(b.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="sp-bcc-logo-box">
                      {b.id === 'OTHERS' ? (
                        <div className="sp-bcc-others-icon"><HelpCircle size={26} /></div>
                      ) : (
                        <BrandLogo brand={b.id} size="md" />
                      )}
                    </div>
                    <div className="sp-bcc-info">
                      <h4 className="sp-bcc-name">{b.name}</h4>
                      <span className="sp-bcc-tag">{b.tag}</span>
                    </div>
                    <ArrowRight size={16} className="sp-bcc-arrow" />
                  </div>
                ))}
              </div>
              {/* Custom brand input when OTHERS selected */}
              {selectedBrand === 'OTHERS' && (
                <div className="sp-others-input">
                  <label className="cq-label">Specify your compressor brand <span className="req">*</span></label>
                  <input
                    type="text"
                    className="cq-input"
                    placeholder="e.g. Kaeser, CompAir, Gardner Denver..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="sp-others-continue-btn"
                    disabled={!customBrand.trim()}
                    onClick={() => { if (customBrand.trim()) setStep(2); }}
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: The 14 Parts Selection */}
          {step === 2 && (
            <div className="sp-step-panel">
              <div className="sp-brand-lock-bar">
                <span>Selected Brand: <strong>{selectedBrand === 'OTHERS' ? customBrand : selectedBrand}</strong></span>
                <button
                  type="button"
                  className="sp-btn-link-action"
                  onClick={() => setStep(1)}
                >
                  Change Brand
                </button>
              </div>

              <p className="sp-step-prompt">
                Select the required replacement part from the certified 14-component catalog:
              </p>

              <div className="sp-parts-select-grid">
                {SPARE_PARTS_LIST.map((part) => (
                  <div
                    key={part.name}
                    className="sp-part-choice-item"
                    onClick={() => handlePartSelect(part.name)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="sp-pci-icon">{part.icon}</div>
                    <span className="sp-pci-name">{part.name}</span>
                  </div>
                ))}
              </div>

              <div className="sp-modal-nav-bar">
                <button type="button" className="sp-modal-back-btn" onClick={handleBack}>
                  <ArrowLeft size={16} />
                  <span>Back to Brands</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Quotation Contact Details */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="sp-step-panel">
              {/* Selected Part Badge */}
              <div className="sp-locked-selection-banner">
                <div className="sp-locked-col">
                  <span className="sp-locked-label">Manufacturer</span>
                  <span className="sp-locked-val">{selectedBrand}</span>
                </div>
                <div className="sp-locked-sep" />
                <div className="sp-locked-col">
                  <span className="sp-locked-label">Component</span>
                  <span className="sp-locked-val">
                    {selectedPartItem?.name || selectedPart}
                  </span>
                </div>
                <button
                  type="button"
                  className="sp-btn-link-action sp-locked-change"
                  onClick={() => setStep(2)}
                >
                  Change Part
                </button>
              </div>

              {submitError && (
                <div className="sp-alert-error">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="sp-fields-layout">
                <div className="sp-input-box">
                  <label className="sp-input-label" htmlFor="spCompanyName">
                    <Building size={14} />
                    <span>Company Name *</span>
                  </label>
                  <input
                    id="spCompanyName"
                    type="text"
                    className="sp-text-field"
                    placeholder="e.g. Dangote Cement, BUA Group, etc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-input-box">
                  <label className="sp-input-label" htmlFor="spEmail">
                    <Mail size={14} />
                    <span>Business Email *</span>
                  </label>
                  <input
                    id="spEmail"
                    type="email"
                    className="sp-text-field"
                    placeholder="procurement@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-input-box sp-col-span-2">
                  <label className="sp-input-label" htmlFor="spPhone">
                    <Phone size={14} />
                    <span>Phone / WhatsApp Number *</span>
                  </label>
                  <input
                    id="spPhone"
                    type="tel"
                    className="sp-text-field"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-input-box sp-col-span-2">
                  <label className="sp-input-label" htmlFor="spNotes">
                    <Wrench size={14} />
                    <span>Compressor Model / Serial Number / Quantity (Optional)</span>
                  </label>
                  <textarea
                    id="spNotes"
                    className="sp-text-area"
                    rows={3}
                    placeholder="Specify model (e.g. GA-37, Sullair 185), serial ID, part number if available, or delivery plant location..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="sp-modal-nav-bar">
                <button
                  type="button"
                  className="sp-modal-back-btn"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="sp-modal-confirm-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="sp-button-loader" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quotation Request</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && successData && (
            <div className="sp-step-panel sp-success-container">
              <div className="sp-success-icon-badge">
                <CheckCircle2 size={54} />
              </div>
              <h3 className="sp-success-main-title">Quotation Request Received</h3>
              <p className="sp-success-sub-text">
                Your request has been logged under reference <strong>{successData.id}</strong>.
                Our parts engineering desk will review technical compatibility and prepare your formal commercial quotation.
              </p>

              <div className="sp-success-receipt-card">
                <div className="sp-receipt-row">
                  <span className="sp-receipt-label">Brand:</span>
                  <span className="sp-receipt-val">{successData.brand}</span>
                </div>
                <div className="sp-receipt-row">
                  <span className="sp-receipt-label">Part Requested:</span>
                  <span className="sp-receipt-val font-bold">{successData.part_name}</span>
                </div>
                <div className="sp-receipt-row">
                  <span className="sp-receipt-label">Company:</span>
                  <span className="sp-receipt-val">{successData.company_name}</span>
                </div>
              </div>

              <div className="sp-success-cta-row">
                <button
                  type="button"
                  className="sp-btn-outline-action"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} />
                  <span>Request Another Part</span>
                </button>
                <button
                  type="button"
                  className="sp-btn-solid-action"
                  onClick={onClose}
                >
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

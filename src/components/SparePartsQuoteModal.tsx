import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, Sparkles, Shield, Cpu, Gauge,
  Wrench, Filter, Droplet, Wind, GitCommit,
  Thermometer, Radio, Activity,
  Sliders, Fuel, Disc, Layers
} from 'lucide-react';
import { submitSparePartsRequest } from '../services/api';
import './SparePartsQuoteModal.css';

export type SparePartsBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR';

export interface SparePartItem {
  numeral: string;
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export const SPARE_PARTS_LIST: SparePartItem[] = [
  { numeral: 'I', id: 'AIR FILTER', name: 'AIR FILTER', desc: 'Heavy-duty air intake filtration elements', icon: <Wind size={20} /> },
  { numeral: 'II', id: 'OIL FILTER', name: 'OIL FILTER', desc: 'High-pressure spin-on & cartridge oil filters', icon: <Droplet size={20} /> },
  { numeral: 'III', id: 'OIL SEPARATOR', name: 'OIL SEPARATOR', desc: 'Precision air/oil separator elements (<3 ppm carryover)', icon: <Layers size={20} /> },
  { numeral: 'IV', id: 'UNLOADER/INLET VALVE KIT', name: 'UNLOADER/INLET VALVE KIT', desc: 'Intake regulation valve kits & rebuild sets', icon: <Sliders size={20} /> },
  { numeral: 'V', id: 'MINIMUM PRESSURE VALVE', name: 'MINIMUM PRESSURE VALVE', desc: 'Discharge MPV assemblies & seal kits', icon: <Disc size={20} /> },
  { numeral: 'VI', id: 'OIL STOP/CHECK VALVE', name: 'OIL STOP/CHECK VALVE', desc: 'Non-return check valves & housing seals', icon: <GitCommit size={20} /> },
  { numeral: 'VII', id: 'THERMOSTAT', name: 'THERMOSTAT', desc: 'Thermal bypass valve elements & temperature regulators', icon: <Thermometer size={20} /> },
  { numeral: 'VIII', id: 'AIREND', name: 'AIREND', desc: 'Complete OEM rotary screw air-end exchange units', icon: <Wrench size={20} /> },
  { numeral: 'IX', id: 'FAN MOTOR', name: 'FAN MOTOR', desc: 'Cooling fan motor assemblies & dynamic impeller blades', icon: <Radio size={20} /> },
  { numeral: 'X', id: 'OIL/AIR COOLER', name: 'OIL/AIR COOLER', desc: 'Aluminum bar-plate heat exchangers & radiators', icon: <Filter size={20} /> },
  { numeral: 'XI', id: 'AIR DRYER', name: 'AIR DRYER', desc: 'Integrated & standalone refrigerated or desiccant dryers', icon: <Wind size={20} /> },
  { numeral: 'XII', id: 'SENSORS', name: 'SENSORS', desc: 'Pressure transducers, PT100 temperature sensors', icon: <Activity size={20} /> },
  { numeral: 'XIII', id: 'CONTROLLER', name: 'CONTROLLER', desc: 'Digital PLC controllers (Elektronikon, AirSmart, etc.)', icon: <Cpu size={20} /> },
  { numeral: 'XIV', id: 'LUBRICANT', name: 'LUBRICANT', desc: 'OEM synthetic compressor lubricants (8,000+ hr life)', icon: <Fuel size={20} /> },
];

export const BRANDS_DATA: {
  id: SparePartsBrand;
  name: string;
  badge: string;
  origin: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'ATLAS COPCO',
    name: 'Atlas Copco',
    badge: 'GA / GX / VSD OEM Parts',
    origin: 'Sweden',
    icon: <Gauge size={22} />,
  },
  {
    id: 'SULLAIR',
    name: 'Sullair',
    badge: 'Genuine Sullube & Spares',
    origin: 'USA',
    icon: <Shield size={22} />,
  },
  {
    id: 'INGERSOLL RAND',
    name: 'Ingersoll Rand',
    badge: 'Ultra Coolant & OEM Kits',
    origin: 'USA',
    icon: <Cpu size={22} />,
  },
  {
    id: 'DENAIR',
    name: 'Denair',
    badge: 'Dual-Stage Spares & Elements',
    origin: 'Germany',
    icon: <Sparkles size={22} />,
  },
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
      setSubmitError('Please ensure a brand and spare part are selected.');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Please enter your company or business name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please provide a valid business email.');
      return;
    }
    if (!phone.trim() || phone.length < 5) {
      setSubmitError('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitSparePartsRequest({
        brand: selectedBrand,
        part_name: selectedPart,
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

  const selectedPartItem = SPARE_PARTS_LIST.find((p) => p.id === selectedPart);

  return (
    <div className="sp-modal-overlay" onClick={onClose}>
      <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sp-modal-header">
          <div className="sp-modal-header-left">
            <div className="sp-modal-badge">
              <Sparkles size={13} />
              <span>SPARE PARTS PROCUREMENT</span>
            </div>
            <h2 className="sp-modal-title">
              {step === 1 && 'Select Equipment Brand'}
              {step === 2 && `Select Spare Part — ${selectedBrand}`}
              {step === 3 && 'Request Quotation Details'}
              {step === 4 && 'Quotation Request Received'}
            </h2>
          </div>
          <button className="sp-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="sp-progress-bar-wrap">
            <div className="sp-steps-indicator">
              <div className={`sp-step-pill ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="sp-step-number">1</span>
                <span className="sp-step-label">Brand</span>
              </div>
              <div className="sp-step-connector" />
              <div className={`sp-step-pill ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="sp-step-number">2</span>
                <span className="sp-step-label">Part Selection</span>
              </div>
              <div className="sp-step-connector" />
              <div className={`sp-step-pill ${step >= 3 ? 'active' : ''}`}>
                <span className="sp-step-number">3</span>
                <span className="sp-step-label">Contact & Details</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="sp-modal-body">

          {/* STEP 1: Brand Selection */}
          {step === 1 && (
            <div className="sp-step-content sp-animate-fade">
              <p className="sp-step-instructions">
                Select your compressor brand manufacturer to view certified OEM replacement parts:
              </p>
              <div className="sp-brands-grid">
                {BRANDS_DATA.map((brand) => (
                  <div
                    key={brand.id}
                    className={`sp-brand-card ${selectedBrand === brand.id ? 'selected' : ''}`}
                    onClick={() => handleBrandSelect(brand.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="sp-brand-card-top">
                      <div className="sp-brand-icon-box">{brand.icon}</div>
                      <span className="sp-brand-origin">{brand.origin}</span>
                    </div>
                    <div className="sp-brand-name">{brand.name}</div>
                    <div className="sp-brand-badge">{brand.badge}</div>
                    <div className="sp-brand-select-action">
                      <span>View Parts List</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: 14 Parts Selection */}
          {step === 2 && (
            <div className="sp-step-content sp-animate-fade">
              <div className="sp-sub-header">
                <p className="sp-step-instructions">
                  Choose the required spare part or service component from the certified catalog for <strong>{selectedBrand}</strong>:
                </p>
              </div>

              <div className="sp-parts-grid">
                {SPARE_PARTS_LIST.map((part) => {
                  const isSelected = selectedPart === part.id;
                  return (
                    <div
                      key={part.id}
                      className={`sp-part-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handlePartSelect(part.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="sp-part-card-numeral">{part.numeral}</div>
                      <div className="sp-part-card-icon">{part.icon}</div>
                      <div className="sp-part-card-content">
                        <div className="sp-part-card-name">{part.name}</div>
                        <div className="sp-part-card-desc">{part.desc}</div>
                      </div>
                      <div className="sp-part-card-select-arrow">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="sp-actions-bar">
                <button type="button" className="sp-back-btn" onClick={handleBack}>
                  <ArrowLeft size={16} />
                  <span>Change Brand</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Request Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="sp-step-content sp-animate-fade">
              <div className="sp-summary-card">
                <div className="sp-summary-item">
                  <span className="sp-summary-lbl">Selected Brand</span>
                  <span className="sp-summary-val font-semibold">{selectedBrand}</span>
                </div>
                <div className="sp-summary-divider" />
                <div className="sp-summary-item">
                  <span className="sp-summary-lbl">Spare Part</span>
                  <span className="sp-summary-val font-semibold">
                    {selectedPartItem?.numeral}. {selectedPartItem?.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="sp-change-link"
                  onClick={() => setStep(2)}
                >
                  Change Part
                </button>
              </div>

              {submitError && (
                <div className="sp-error-banner">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="sp-form-grid">
                <div className="sp-field-group">
                  <label className="sp-label" htmlFor="companyName">
                    <Building size={14} />
                    <span>Company Name *</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className="sp-input"
                    placeholder="e.g. Dangote Cement Plc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-field-group">
                  <label className="sp-label" htmlFor="email">
                    <Mail size={14} />
                    <span>Business Email *</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="sp-input"
                    placeholder="procurement@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-field-group full-width">
                  <label className="sp-label" htmlFor="phone">
                    <Phone size={14} />
                    <span>Phone / WhatsApp Number *</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="sp-input"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="sp-field-group full-width">
                  <label className="sp-label" htmlFor="notes">
                    <Wrench size={14} />
                    <span>Part Specifications / Machine Serial Number / Quantity</span>
                  </label>
                  <textarea
                    id="notes"
                    className="sp-textarea"
                    rows={3}
                    placeholder="Include compressor model (e.g. GA37, Sullair 185), serial number, part number if known, or quantity required..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="sp-actions-bar">
                <button type="button" className="sp-back-btn" onClick={handleBack} disabled={isSubmitting}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button type="submit" className="sp-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="sp-spinner" />
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

          {/* STEP 4: Success View */}
          {step === 4 && successData && (
            <div className="sp-step-content sp-success-view sp-animate-fade">
              <div className="sp-success-icon-wrap">
                <CheckCircle2 size={56} className="sp-success-icon" />
              </div>
              <h3 className="sp-success-title">Quotation Request Dispatched!</h3>
              <p className="sp-success-subtitle">
                Your request has been registered under reference <strong>{successData.id}</strong>.
                Our parts engineering desk will review technical compatibility and prepare your official quotation.
              </p>

              <div className="sp-success-details-card">
                <div className="sp-detail-row">
                  <span className="sp-detail-lbl">Brand:</span>
                  <span className="sp-detail-val">{successData.brand}</span>
                </div>
                <div className="sp-detail-row">
                  <span className="sp-detail-lbl">Requested Part:</span>
                  <span className="sp-detail-val font-semibold">{successData.part_name}</span>
                </div>
                <div className="sp-detail-row">
                  <span className="sp-detail-lbl">Company:</span>
                  <span className="sp-detail-val">{successData.company_name}</span>
                </div>
              </div>

              <div className="sp-success-actions">
                <button type="button" className="sp-btn-secondary" onClick={handleReset}>
                  <RotateCcw size={16} />
                  <span>Request Another Part</span>
                </button>
                <button type="button" className="sp-btn-primary" onClick={onClose}>
                  <span>Return to Site</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

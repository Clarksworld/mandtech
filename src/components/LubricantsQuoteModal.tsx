import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, Package, MapPin, HelpCircle, Droplets
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { MandtechLogo } from './Logo';
import { submitLubricantRequest } from '../services/api';
import './LubricantsQuoteModal.css';

export type LubricantBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';

export interface FluidGroup {
  group?: string;
  items: string[];
}

export interface BrandLubricantConfig {
  tagline: string;
  defaultFluid: string;
  groups: FluidGroup[];
}

export const BRAND_LUBRICANTS: Record<LubricantBrand, BrandLubricantConfig> = {
  'ATLAS COPCO': {
    tagline: '12 Factory Engineered Formulations & Food-Grade Fluids',
    defaultFluid: 'Roto Synthetic Fluid ULTRA',
    groups: [
      {
        group: 'Atlas Copco Standard & Severe Duty Fluids',
        items: [
          'Roto Synthetic Fluid ULTRA',
          'Roto XTEND Duty Fluid',
          'Roto Z Fluid',
          'Roto Inject Fluid NDURANCE',
          'ParOil M',
          'ParOil S',
          'ParOil M Xtreme',
          'ParOil S Xtreme',
          'ParOil E',
          'Roto H Plus',
          'Roto Glide Green',
        ],
      },
      {
        group: 'Atlas Copco Food Grade Certified Fluids',
        items: [
          'Food Grade - Roto Synthetic Fluid ULTRA',
          'Food Grade - Roto XTEND Duty Fluid',
          'Food Grade - Roto Z Fluid',
          'Food Grade - Roto Inject Fluid NDURANCE',
        ],
      },
      {
        group: 'Other',
        items: ['Other Atlas Copco Fluid (Specify)'],
      },
    ],
  },
  'INGERSOLL RAND': {
    tagline: 'OEM Ultra Coolants & Precision Rotary Synthetic Fluids',
    defaultFluid: 'Ultra Coolant Synthetic Rotary Coolant',
    groups: [
      {
        group: 'Ingersoll Rand Factory Coolants',
        items: [
          'Ultra Coolant Synthetic Rotary Coolant',
          'Ultra Food Grade',
          'Ultra 4k',
          'Ultra Plus Coolant',
          'Techtrol Gold CL',
          'Techtrol Gold TL',
        ],
      },
      {
        group: 'Other',
        items: ['Other Ingersoll Rand Fluid (Specify)'],
      },
    ],
  },
  'SULLAIR': {
    tagline: 'Sullube Synthetic Coolants, SRF & 24KT Formulations',
    defaultFluid: 'Sullube 32',
    groups: [
      {
        group: 'Sullair Genuine Synthetic Fluids',
        items: [
          'Sullube 32',
          'Sullube 60',
          'SRF I/4000',
          'SRF II/8000',
          '24KT',
          'AWF',
          'Pristine FG',
          'CCL',
        ],
      },
      {
        group: 'Other',
        items: ['Other Sullair Fluid (Specify)'],
      },
    ],
  },
  'DENAIR': {
    tagline: 'High-Performance Rotary Screw Lubricants',
    defaultFluid: 'Denair Screw Compressor Fluid',
    groups: [
      {
        group: 'Denair Specialized Fluids',
        items: [
          'Denair Screw Compressor Fluid',
        ],
      },
      {
        group: 'Other',
        items: ['Other Denair Fluid (Specify)'],
      },
    ],
  },
  'OTHERS': {
    tagline: 'Universal Synthetic, Mineral & High-Temperature Compressor Oils',
    defaultFluid: 'Synthetic Rotary Screw Fluid (8,000h Rating)',
    groups: [
      {
        group: 'Universal Synthetic & Mineral Formulations',
        items: [
          'Synthetic Rotary Screw Fluid (8,000h Rating)',
          'OEM Genuine Factory Fluid',
          'High-Temperature Synthetic Polyolester (POE)',
          'Food-Grade H1 Certified Compressor Oil',
          'Mineral-Based Compressor Break-In Oil',
          'Heavy-Duty Hydraulic & Turbine Oil (ISO VG 32/46/68)',
          'Flushing & Chemical Cleaning Fluid',
        ],
      },
      {
        group: 'Other',
        items: ['Other / Custom Specification (Specify)'],
      },
    ],
  },
};

export function getAllBrandFluids(brand: LubricantBrand): string[] {
  const brandData = BRAND_LUBRICANTS[brand];
  if (!brandData) return [];
  return brandData.groups.flatMap((g) => g.items.filter((item) => !item.includes('Other')));
}

export interface LubricantsQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrand?: LubricantBrand | null;
  initialFluid?: string | null;
}

export const LUBRICANT_BRANDS: {
  id: LubricantBrand;
  name: string;
}[] = [
  { id: 'ATLAS COPCO', name: 'ATLAS COPCO' },
  { id: 'SULLAIR', name: 'SULLAIR' },
  { id: 'INGERSOLL RAND', name: 'INGERSOLL RAND' },
  { id: 'DENAIR', name: 'DENAIR' },
  { id: 'OTHERS', name: 'OTHERS' },
];

// Steps: 1=Brand Selection, 2=Fluid Selection, 3=Quotation Form, 4=Success
type Step = 1 | 2 | 3 | 4;

export default function LubricantsQuoteModal({
  isOpen,
  onClose,
  initialBrand,
  initialFluid,
}: LubricantsQuoteModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedBrand, setSelectedBrand] = useState<LubricantBrand | null>(initialBrand || null);
  const [selectedFluid, setSelectedFluid] = useState<string | null>(initialFluid || null);
  const [customBrand, setCustomBrand] = useState('');
  const [customFluid, setCustomFluid] = useState('');

  // Form Fields
  const [volume, setVolume] = useState('20 Litre Pail');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hub, setHub] = useState('Port Harcourt HQ (Elelenwo Ops Yard)');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<{
    id: string;
    brand: string;
    fluidType: string;
    volume: string;
    hub: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialBrand && initialFluid) {
        setSelectedBrand(initialBrand);
        setSelectedFluid(initialFluid);
        setStep(3);
      } else if (initialBrand) {
        setSelectedBrand(initialBrand);
        setSelectedFluid(null);
        setStep(initialBrand === 'OTHERS' ? 1 : 2);
      } else {
        setSelectedBrand(null);
        setSelectedFluid(null);
        setStep(1);
      }
      setCustomBrand('');
      setCustomFluid('');
      setSubmitError(null);
      setSuccessTicket(null);
    }
  }, [isOpen, initialBrand, initialFluid]);

  if (!isOpen) return null;

  const handleSelectBrand = (brand: LubricantBrand) => {
    setSelectedBrand(brand);
    setSelectedFluid(null);
    setCustomFluid('');
    if (brand === 'OTHERS') {
      setCustomBrand('');
      // Stay on step 1 to show custom brand input
    } else {
      setStep(2);
    }
  };

  const handleSelectFluid = (fluid: string) => {
    if (fluid.includes('Other') || fluid.includes('Specify')) {
      setSelectedFluid(fluid);
      // Wait for custom text input in step 2
    } else {
      setSelectedFluid(fluid);
      setStep(3);
    }
  };

  const handleCustomFluidContinue = () => {
    if (customFluid.trim()) {
      setSelectedFluid(`Other: ${customFluid.trim()}`);
      setStep(3);
    }
  };

  const effectiveBrand = selectedBrand === 'OTHERS' ? customBrand.trim() : (selectedBrand ?? '');
  const effectiveFluid = selectedFluid?.startsWith('Other:')
    ? selectedFluid
    : selectedFluid === 'Other Atlas Copco Fluid (Specify)' ||
      selectedFluid === 'Other Ingersoll Rand Fluid (Specify)' ||
      selectedFluid === 'Other Sullair Fluid (Specify)' ||
      selectedFluid === 'Other Denair Fluid (Specify)' ||
      selectedFluid === 'Other / Custom Specification (Specify)'
    ? (customFluid.trim() ? `Other: ${customFluid.trim()}` : selectedFluid)
    : (selectedFluid || 'Standard Synthetic Fluid');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    if (selectedBrand === 'OTHERS' && !customBrand.trim()) {
      setSubmitError('Please specify the lubricant brand you need.');
      return;
    }
    if (!selectedFluid) {
      setSubmitError('Please select a fluid formulation.');
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
      setSubmitError('Valid corporate email address is required.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Active phone number is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitLubricantRequest({
        brand: effectiveBrand || selectedBrand,
        fluid_type: effectiveFluid,
        volume,
        hub,
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim() ? `Contact: ${contactName.trim()} | ${notes.trim()}` : `Contact: ${contactName.trim()}`,
      });

      const ticketRef = res.data?.id
        ? `LUB-${res.data.id.substring(0, 8).toUpperCase()}`
        : `LUB-${Math.floor(100000 + Math.random() * 900000)}`;

      setSuccessTicket({
        id: ticketRef,
        brand: effectiveBrand || selectedBrand,
        fluidType: effectiveFluid,
        volume,
        hub,
      });

      setStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit quotation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedBrand(null);
    setSelectedFluid(null);
    setCustomBrand('');
    setCustomFluid('');
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSuccessTicket(null);
    setSubmitError(null);
  };

  const currentBrandConfig = selectedBrand ? BRAND_LUBRICANTS[selectedBrand] : null;

  return (
    <div className="lub-modal-overlay" onClick={onClose}>
      <div className="lub-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lub-modal-header">
          <div>
            <span className="lub-modal-badge">MANDTECH INDUSTRIAL FLUIDS</span>
            <h2 className="lub-modal-heading">
              {step === 1 && 'Select Equipment Manufacturer'}
              {step === 2 && `${selectedBrand === 'OTHERS' ? customBrand || 'Special Fluids' : selectedBrand} — Select Formulation`}
              {step === 3 && 'Request Quotation Details'}
              {step === 4 && 'Quotation Request Registered'}
            </h2>
          </div>
          <button className="lub-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Stepper Bar */}
        {step < 4 && (
          <div className="lub-modal-stepper">
            <div className={`lub-stepper-step ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-done' : ''}`}>
              <span className="lub-stepper-num">1</span>
              <span className="lub-stepper-text">Manufacturer</span>
            </div>
            <div className="lub-stepper-line" />
            <div className={`lub-stepper-step ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-done' : ''}`}>
              <span className="lub-stepper-num">2</span>
              <span className="lub-stepper-text">Formulation</span>
            </div>
            <div className="lub-stepper-line" />
            <div className={`lub-stepper-step ${step >= 3 ? 'is-active' : ''}`}>
              <span className="lub-stepper-num">3</span>
              <span className="lub-stepper-text">Details &amp; Quote</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="lub-modal-body">
          {/* STEP 1: Select Brand */}
          {step === 1 && (
            <div className="lub-step-panel">
              <p className="lub-step-prompt">
                Select your compressor manufacturer to view factory-approved synthetic lubricants and fluids:
              </p>
              <div className="lub-brands-grid">
                {LUBRICANT_BRANDS.map((b) => (
                  <div
                    key={b.id}
                    className={`lub-brand-card ${selectedBrand === b.id ? 'lub-brand-card--selected' : ''}`}
                    onClick={() => handleSelectBrand(b.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lub-brand-logo-box">
                      {b.id === 'OTHERS' ? (
                        <div className="lub-brand-others-icon">
                          <HelpCircle size={26} />
                          <span>OTHERS</span>
                        </div>
                      ) : (
                        <BrandLogo brand={b.id} size="md" />
                      )}
                    </div>
                    <span className="lub-brand-name">{b.name}</span>
                  </div>
                ))}
              </div>

              {/* Custom brand input when OTHERS selected */}
              {selectedBrand === 'OTHERS' && (
                <div className="lub-others-input-wrap">
                  <label className="lub-others-label">
                    Please specify the compressor brand / lubricant manufacturer: <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="lub-others-input"
                    placeholder="e.g. Kaeser, CompAir, Gardner Denver, Quincy..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="lub-others-continue-btn"
                    disabled={!customBrand.trim()}
                    onClick={() => { if (customBrand.trim()) setStep(2); }}
                  >
                    Continue to Formulations <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Fluid Type Selection (The Multiple Modal Step!) */}
          {step === 2 && selectedBrand && (
            <div className="lub-step-panel">
              {/* Selected Brand Quick Bar */}
              <div className="lub-selected-bar">
                <div className="lub-selected-info">
                  <span className="lub-sel-lbl">Selected Brand:</span>
                  <span className="lub-sel-badge">
                    {selectedBrand === 'OTHERS' ? (
                      <HelpCircle size={16} />
                    ) : (
                      <BrandLogo brand={selectedBrand} size="sm" />
                    )}
                    <strong>{selectedBrand === 'OTHERS' ? customBrand : selectedBrand}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="lub-change-brand-btn"
                  onClick={() => setStep(1)}
                >
                  Change Brand
                </button>
              </div>

              <p className="lub-step-prompt">
                Select the certified fluid formulation or cooling lubricant required:
              </p>

              {/* Formulations by Category */}
              <div className="lub-fluids-select-container">
                {currentBrandConfig?.groups.map((group, gIdx) => (
                  <div key={gIdx} className="lub-modal-fluid-group">
                    <h4 className="lub-mfg-title">{group.group || 'Available Formulations'}</h4>
                    <div className="lub-mfg-grid">
                      {group.items.map((item, iIdx) => {
                        const isFoodGrade = item.includes('Food Grade') || item.includes('FG');
                        const isOther = item.includes('Other') || item.includes('Specify');
                        const isSelected = selectedFluid === item;

                        return (
                          <div
                            key={iIdx}
                            className={`lub-fluid-choice-card ${isSelected ? 'is-selected' : ''} ${isFoodGrade ? 'is-food-grade' : ''}`}
                            onClick={() => handleSelectFluid(item)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="lub-fcc-icon">
                              <Droplets size={16} />
                            </div>
                            <div className="lub-fcc-content">
                              <div className="lub-fcc-top">
                                {isFoodGrade && <span className="lub-fcc-badge food-grade">H1 Food Grade</span>}
                                {isOther && <span className="lub-fcc-badge custom">Custom Spec</span>}
                              </div>
                              <span className="lub-fcc-title">{item}</span>
                            </div>
                            <ArrowRight size={15} className="lub-fcc-arrow" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Fluid Input when "Other" option is active */}
              {selectedFluid && (selectedFluid.includes('Other') || selectedFluid.includes('Specify')) && (
                <div className="lub-custom-fluid-box">
                  <label className="lub-others-label">
                    Specify the exact fluid grade, viscosity, or OEM part number: <span className="req">*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="lub-others-input"
                      placeholder="e.g. Atlas Copco 2901 0522 00, Sullair 250022-669, ISO VG 46/68..."
                      value={customFluid}
                      onChange={(e) => setCustomFluid(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="lub-others-continue-btn"
                      disabled={!customFluid.trim()}
                      onClick={handleCustomFluidContinue}
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Nav Bar */}
              <div className="lub-modal-nav-bar">
                <button
                  type="button"
                  className="lub-btn-back"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Manufacturers</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Request For Quote Form */}
          {step === 3 && selectedBrand && (
            <form onSubmit={handleSubmit} className="lub-step-panel">
              {/* Locked Selection Banner */}
              <div className="lub-locked-selection-banner">
                <div className="lub-locked-col">
                  <span className="lub-locked-label">Manufacturer</span>
                  <span className="lub-locked-val">
                    {selectedBrand === 'OTHERS' ? customBrand : selectedBrand}
                  </span>
                </div>
                <div className="lub-locked-sep" />
                <div className="lub-locked-col" style={{ flex: 2 }}>
                  <span className="lub-locked-label">Formulation / Fluid</span>
                  <span className="lub-locked-val">{effectiveFluid}</span>
                </div>
                <button
                  type="button"
                  className="lub-locked-change"
                  onClick={() => setStep(2)}
                >
                  Change Fluid
                </button>
              </div>

              {submitError && (
                <div className="lub-error-banner">
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="lub-form-grid">
                {/* Packaging Volume */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    <Package size={14} /> Packaging Size / Volume <span className="req">*</span>
                  </label>
                  <select
                    className="lub-select"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  >
                    <option value="20 Litre Pail">20 Litre Pail</option>
                    <option value="209 Litre Drum">209 Litre Drum (Steel Barrel)</option>
                    <option value="1,000 Litre IBC Tote">1,000 Litre IBC Intermediate Bulk Container</option>
                    <option value="Multiple Drums / Full Pallet">Multiple Drums / Full Pallet (4x Drums)</option>
                    <option value="Custom Bulk Volume">Custom Bulk Volume (Specify in Notes)</option>
                  </select>
                </div>

                {/* Company Name */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    <Building size={14} /> Company Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="lub-input"
                    placeholder="e.g. Niger Delta Gas &amp; Refining"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                {/* Contact Person */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    Contact Person Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="lub-input"
                    placeholder="e.g. Engr. Michael Okon"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    <Mail size={14} /> Corporate Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    className="lub-input"
                    placeholder="e.g. maintenance@ndgas.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    <Phone size={14} /> Active Phone Number <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    className="lub-input"
                    placeholder="e.g. 0803 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Delivery Hub */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    <MapPin size={14} /> Mobilization Yard / Delivery Hub
                  </label>
                  <select
                    className="lub-select"
                    value={hub}
                    onChange={(e) => setHub(e.target.value)}
                  >
                    <option value="Port Harcourt HQ (Elelenwo Ops Yard)">Port Harcourt HQ (Elelenwo Ops Yard)</option>
                    <option value="Lagos Hub (16 Oshuketan Street)">Lagos Hub (16 Oshuketan Street)</option>
                    <option value="Abuja Hub (Camp David Garden Estate, Karsana)">Abuja Hub (Camp David Garden Estate, Karsana)</option>
                    <option value="Direct Site Delivery (Nationwide)">Direct Site Delivery (Nationwide)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="lub-field" style={{ marginTop: '14px' }}>
                <label className="lub-field-label">
                  Compressor Model or Specific Operating Conditions (Optional)
                </label>
                <textarea
                  className="lub-textarea"
                  rows={2}
                  placeholder="e.g. Operating on GA75 VSD+, ambient temperature ~38°C, or require MSDS and Certificate of Analysis..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="lub-form-actions">
                <button
                  type="button"
                  className="lub-btn-back"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} /> Back to Formulations
                </button>
                <button
                  type="submit"
                  className="lub-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quotation Request'}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && successTicket && (
            <div className="lub-success-view">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <MandtechLogo height={32} />
              </div>
              <div className="lub-success-icon-wrap">
                <CheckCircle2 size={52} className="lub-check-icon" />
              </div>
              <h3 className="lub-success-heading">Quotation Request Registered</h3>
              <p className="lub-success-text">
                Your request for <strong>{successTicket.brand}</strong> (<em>{successTicket.fluidType}</em>) has been logged. Our fluids specialist will send formal pricing and delivery ETA within 2 hours.
              </p>

              <div className="lub-ticket-box">
                <div className="lub-ticket-header">
                  <span>TRACKING REFERENCE</span>
                  <strong>{successTicket.id}</strong>
                </div>
                <div className="lub-ticket-row">
                  <span>Manufacturer:</span>
                  <strong>{successTicket.brand}</strong>
                </div>
                <div className="lub-ticket-row">
                  <span>Formulation:</span>
                  <strong>{successTicket.fluidType}</strong>
                </div>
                <div className="lub-ticket-row">
                  <span>Packaging:</span>
                  <strong>{successTicket.volume}</strong>
                </div>
                <div className="lub-ticket-row">
                  <span>Dispatch Hub:</span>
                  <strong>{successTicket.hub}</strong>
                </div>
              </div>

              <div className="lub-success-actions">
                <button
                  type="button"
                  className="lub-btn-new-request"
                  onClick={resetForm}
                >
                  <RotateCcw size={16} /> Request Another Formulation
                </button>
                <button
                  type="button"
                  className="lub-btn-close-final"
                  onClick={onClose}
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

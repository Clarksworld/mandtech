import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, HelpCircle, Cpu,
  Wrench, Filter, Droplet, Wind, GitCommit,
  Thermometer, Radio, Activity,
  Sliders, Fuel, Disc, Layers,
  Check, ShoppingCart
} from 'lucide-react';
import { submitSparePartsRequest } from '../services/api';
import { BrandLogo } from './BrandLogo';
import { MandtechLogo } from './Logo';
import { useInquiry } from '../context/InquiryContext';
import partFilter from '../assets/part_filter.png';
import partValve from '../assets/part_valve.png';
import partFan from '../assets/part_fan.png';
import partSwitch from '../assets/part_switch.png';
import partGauge from '../assets/part_gauge.png';
import partGasket from '../assets/part_gasket.png';
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

function getPartImage(partName: string): string {
  const upper = partName.toUpperCase();
  if (upper.includes('FILTER') || upper.includes('SEPARATOR')) return partFilter;
  if (upper.includes('VALVE')) return partValve;
  if (upper.includes('FAN') || upper.includes('COOLER')) return partFan;
  if (upper.includes('SENSOR') || upper.includes('CONTROLLER') || upper.includes('THERMOSTAT')) return partSwitch;
  if (upper.includes('GAUGE')) return partGauge;
  return partGasket;
}

interface SparePartsQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrand?: SparePartsBrand | null;
  initialPart?: string | null;
  onNavigateToCart?: () => void;
}

// Steps: 1=Brand Selection, 2=Parts Multi-Selection, 3=Contact Form / Add to Cart, 4=Success
type Step = 1 | 2 | 3 | 4;

export default function SparePartsQuoteModal({
  isOpen,
  onClose,
  initialBrand,
  initialPart,
  onNavigateToCart,
}: SparePartsQuoteModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedBrand, setSelectedBrand] = useState<SparePartsBrand | null>(initialBrand || null);
  const [selectedParts, setSelectedParts] = useState<string[]>(initialPart ? [initialPart] : []);
  const [customBrand, setCustomBrand] = useState('');

  // Cart integration
  const { addToInquiry, inquiryItems } = useInquiry();
  const [isCartSuccessView, setIsCartSuccessView] = useState(false);

  // Form fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    brand: string;
    part_name: string;
    parts_list: string[];
    company_name: string;
    address?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialBrand && initialPart) {
        setSelectedBrand(initialBrand);
        setSelectedParts([initialPart]);
        setStep(3);
      } else if (initialBrand) {
        setSelectedBrand(initialBrand);
        setSelectedParts([]);
        setStep(2);
      } else {
        setSelectedBrand(null);
        setSelectedParts([]);
        setStep(1);
      }
      setCustomBrand('');
      setSubmitError(null);
      setSuccessData(null);
      setIsCartSuccessView(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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

  const handleTogglePart = (partName: string) => {
    setSelectedParts((prev) =>
      prev.includes(partName) ? prev.filter((p) => p !== partName) : [...prev, partName]
    );
    setSubmitError(null);
  };

  const handleSelectAllParts = () => {
    setSelectedParts(SPARE_PARTS_LIST.map((p) => p.name));
    setSubmitError(null);
  };

  const handleClearParts = () => {
    setSelectedParts([]);
  };

  const handleContinueFromParts = () => {
    if (selectedParts.length === 0) {
      setSubmitError('Please select at least one component to proceed.');
      return;
    }
    setSubmitError(null);
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

  // Dual Action 1: Add Selected Spare Parts to Yard Cart
  const handleAddToCart = () => {
    if (selectedParts.length === 0) {
      setSubmitError('Please select at least one component to add to cart.');
      return;
    }
    const brandName = selectedBrand === 'OTHERS' ? (customBrand.trim() || 'Other OEM') : (selectedBrand || '');

    selectedParts.forEach((partName, idx) => {
      const baseName = partName.replace(/^[I|V|X]+\.\s*/, '');
      const img = getPartImage(baseName);
      const itemId = `part-${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${baseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${idx}`;

      addToInquiry({
        id: itemId,
        title: `${brandName} Genuine ${baseName}`,
        category: 'Spare Parts',
        type: 'part',
        brand: brandName,
        specSummary: `OEM Genuine Component • Brand: ${brandName}${notes.trim() ? ` • Note: ${notes.trim()}` : ''}`,
        image: img,
        quantity: 1,
      });
    });

    setIsCartSuccessView(true);
  };

  const handleCloseAndReset = () => {
    setIsCartSuccessView(false);
    handleReset();
    onClose();
  };

  const handleCheckout = () => {
    setIsCartSuccessView(false);
    handleReset();
    onClose();
    if (onNavigateToCart) {
      onNavigateToCart();
    }
  };

  // Dual Action 2: Submit Formal Quotation Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || selectedParts.length === 0) {
      setSubmitError('Please select both a brand and at least one spare part component.');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Please enter your company name.');
      return;
    }
    if (!address.trim()) {
      setSubmitError('Please enter your company address or site location.');
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
      const cleanedParts = selectedParts.map((p) => p.replace(/^[I|V|X]+\.\s*/, ''));
      const partsNamesToSend = cleanedParts.join(', ');
      const brandToSend = selectedBrand === 'OTHERS' ? customBrand.trim() : selectedBrand;
      const response = await submitSparePartsRequest({
        brand: brandToSend,
        part_name: partsNamesToSend,
        company_name: companyName.trim(),
        address: address.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: address.trim()
          ? `Company Address: ${address.trim()}${notes.trim() ? '\n' + notes.trim() : ''}`
          : notes.trim() || undefined,
      });

      setSuccessData({
        id: response.data?.id || 'SPR-' + Math.floor(100000 + Math.random() * 900000),
        brand: brandToSend,
        part_name: partsNamesToSend,
        parts_list: cleanedParts,
        company_name: companyName.trim(),
        address: address.trim(),
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
    setSelectedParts([]);
    setCustomBrand('');
    setCompanyName('');
    setAddress('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSubmitError(null);
    setSuccessData(null);
    setIsCartSuccessView(false);
    setStep(1);
  };

  const effectiveBrandName = selectedBrand === 'OTHERS' ? (customBrand.trim() || 'Other OEM') : (selectedBrand || '');

  // ── DEDICATED CART SUCCESS CONFIRMATION MODAL ──
  if (isCartSuccessView) {
    return (
      <div className="sp-modal-backdrop" onClick={handleCloseAndReset}>
        <div className="sp-modal-sheet sp-cart-modal-sheet" onClick={(e) => e.stopPropagation()}>
          {/* Top Bar */}
          <div className="sp-modal-top-bar">
            <div>
              <div className="sp-cart-pill-badge">
                <ShoppingCart size={13} />
                <span>Added to Yard Cart</span>
              </div>
            </div>
            <button
              type="button"
              className="sp-modal-exit-btn"
              onClick={handleCloseAndReset}
              aria-label="Close modal"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="sp-modal-scroll-area sp-cart-modal-body">
            <div className="sp-cart-success-badge">
              <CheckCircle2 size={38} className="text-emerald-500" />
            </div>

            <h3 className="sp-cart-modal-title">Spare Parts Added to Cart!</h3>
            <p className="sp-cart-modal-subtitle">
              Your selected {selectedParts.length} replacement component{selectedParts.length > 1 ? 's are' : ' is'} staged in your Yard Cart requisition basket.
            </p>

            {/* Components Preview Card */}
            <div className="sp-cart-items-preview">
              <div className="sp-cart-preview-header">
                <span className="sp-cart-brand-tag">{effectiveBrandName}</span>
                <span className="sp-cart-qty-pill">{selectedParts.length} Component{selectedParts.length > 1 ? 's' : ''}</span>
              </div>
              <div className="sp-cart-pills-wrap">
                {selectedParts.map((p, idx) => (
                  <span key={idx} className="sp-cart-component-chip">
                    <Check size={12} className="text-emerald-500" />
                    <span>{p.replace(/^[I|V|X]+\.\s*/, '')}</span>
                  </span>
                ))}
              </div>
              {notes.trim() && (
                <p className="sp-preview-note">"{notes.trim()}"</p>
              )}
            </div>

            <div className="sp-cart-status-pill">
              <ShoppingCart size={14} />
              <span>
                Yard Cart Total: <strong>{inquiryItems.length} item{inquiryItems.length === 1 ? '' : 's'}</strong>
              </span>
            </div>

            {/* Dual CTAs: Continue Shopping vs Checkout */}
            <div className="sp-cart-modal-actions">
              <button
                type="button"
                className="sp-btn-continue-shopping"
                onClick={handleCloseAndReset}
              >
                Continue Shopping
              </button>

              <button
                type="button"
                className="sp-btn-checkout"
                onClick={handleCheckout}
              >
                <ShoppingCart size={16} />
                <span>Checkout (View Cart)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div className="sp-modal-sheet" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="sp-modal-top-bar">
          <div>
            <span className="sp-modal-brand-badge">OEM PARTS PROCUREMENT</span>
            <h2 className="sp-modal-main-title">
              {step === 1 && 'Select Equipment Manufacturer'}
              {step === 2 && `${effectiveBrandName} — Select Components`}
              {step === 3 && 'Component Procurement Details'}
              {step === 4 && 'Quotation Request Registered'}
            </h2>
          </div>
          <button className="sp-modal-exit-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Stepper */}
        {step < 4 && (
          <div className="sp-modal-stepper">
            <div className={`sp-stepper-step ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-done' : ''}`}>
              <span className="sp-stepper-num">1</span>
              <span className="sp-stepper-text">Manufacturer</span>
            </div>
            <div className="sp-stepper-line" />
            <div className={`sp-stepper-step ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-done' : ''}`}>
              <span className="sp-stepper-num">2</span>
              <span className="sp-stepper-text">Select Components</span>
            </div>
            <div className="sp-stepper-line" />
            <div className={`sp-stepper-step ${step >= 3 ? 'is-active' : ''}`}>
              <span className="sp-stepper-num">3</span>
              <span className="sp-stepper-text">Quote / Order</span>
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

          {/* STEP 2: The 14 Parts Selection (Multi-select) */}
          {step === 2 && (
            <div className="sp-step-panel">
              <div className="sp-brand-lock-bar">
                <span>Selected Brand: <strong>{effectiveBrandName}</strong></span>
                <button
                  type="button"
                  className="sp-btn-link-action"
                  onClick={() => setStep(1)}
                >
                  Change Brand
                </button>
              </div>

              {/* Multi-Select Toolbar */}
              <div className="sp-multiselect-toolbar">
                <div className="sp-parts-count-pill">
                  <span className="sp-count-num">{selectedParts.length}</span>
                  <span>of {SPARE_PARTS_LIST.length} components selected</span>
                </div>
                <div className="sp-toolbar-actions">
                  <button
                    type="button"
                    className="sp-toolbar-btn-link"
                    onClick={handleSelectAllParts}
                  >
                    Select All
                  </button>
                  {selectedParts.length > 0 && (
                    <>
                      <span className="sp-toolbar-sep">•</span>
                      <button
                        type="button"
                        className="sp-toolbar-btn-link sp-toolbar-clear"
                        onClick={handleClearParts}
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="sp-step-prompt">
                Select one or multiple genuine replacement components from the certified 14-component catalog:
              </p>

              {submitError && (
                <div className="sp-alert-error">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="sp-parts-select-grid">
                {SPARE_PARTS_LIST.map((part) => {
                  const isSelected = selectedParts.includes(part.name);
                  return (
                    <div
                      key={part.name}
                      className={`sp-part-choice-item ${isSelected ? 'sp-part-choice-item--selected' : ''}`}
                      onClick={() => handleTogglePart(part.name)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`sp-part-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div className="sp-pci-icon">{part.icon}</div>
                      <span className="sp-pci-name">{part.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="sp-modal-nav-bar">
                <button type="button" className="sp-modal-back-btn" onClick={handleBack}>
                  <ArrowLeft size={16} />
                  <span>Back to Brands</span>
                </button>

                <button
                  type="button"
                  className="sp-modal-confirm-btn"
                  disabled={selectedParts.length === 0}
                  onClick={handleContinueFromParts}
                >
                  <span>
                    Continue with {selectedParts.length > 0 ? `${selectedParts.length} Selected Component${selectedParts.length > 1 ? 's' : ''}` : 'Components'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Quotation Contact Details & Dual Flow */}
          {step === 3 && (
            <div className="sp-step-panel">
              {/* Selected Parts Summary Banner */}
              <div className="sp-locked-selection-banner">
                <div className="sp-locked-header-row">
                  <div className="sp-locked-col">
                    <span className="sp-locked-label">Manufacturer</span>
                    <span className="sp-locked-val">{effectiveBrandName}</span>
                  </div>
                  <button
                    type="button"
                    className="sp-btn-link-action sp-locked-change"
                    onClick={() => setStep(2)}
                  >
                    Edit Components ({selectedParts.length})
                  </button>
                </div>

                <div className="sp-selected-parts-pills">
                  {selectedParts.map((partName) => (
                    <span key={partName} className="sp-part-pill-tag">
                      <Check size={12} className="text-emerald-500" />
                      <span>{partName.replace(/^[I|V|X]+\.\s*/, '')}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Fast Add-to-Cart Action Block */}
              <div className="sp-quick-cart-block">
                <button
                  type="button"
                  className="sp-quick-cart-btn"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={17} />
                  <span>Add {selectedParts.length} Selected Component{selectedParts.length > 1 ? 's' : ''} to Yard Cart</span>
                </button>
                <span className="sp-quick-or-divider">OR REQUEST AN OFFICIAL PROFORMA INVOICE VIA EMAIL</span>
              </div>

              {/* Formal Quotation Form */}
              <form onSubmit={handleSubmit} className="sp-quote-form">
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
                    <label className="sp-input-label" htmlFor="spAddress">
                      <Building size={14} />
                      <span>Company Address / Site Location *</span>
                    </label>
                    <input
                      id="spAddress"
                      type="text"
                      className="sp-text-field"
                      placeholder="e.g. Dangote Cement Plant, Obajana, Kogi State"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                      <span>Compressor Model / Serial Number / Specific Quantities (Optional)</span>
                    </label>
                    <textarea
                      id="spNotes"
                      className="sp-text-area"
                      rows={3}
                      placeholder="Specify model (e.g. GA-37, Sullair 185), serial ID, part numbers if available, or delivery plant location..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dual Actions Row: Add to Cart & Submit Quotation */}
                <div className="sp-actions-dual-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="sp-secondary-cart-btn"
                    title="Add all selected components to Yard Cart"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart ({selectedParts.length})</span>
                  </button>

                  <button
                    type="submit"
                    className="sp-modal-confirm-btn flex-1"
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
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && successData && (
            <div className="sp-step-panel sp-success-container">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <MandtechLogo height={32} />
              </div>
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
                  <span className="sp-receipt-val font-bold">{successData.brand}</span>
                </div>
                <div className="sp-receipt-row">
                  <span className="sp-receipt-label">Components:</span>
                  <div className="sp-receipt-components-pills">
                    {successData.parts_list.map((p, idx) => (
                      <span key={idx} className="sp-receipt-chip">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="sp-receipt-row">
                  <span className="sp-receipt-label">Company:</span>
                  <span className="sp-receipt-val">{successData.company_name}</span>
                </div>
                {successData.address && (
                  <div className="sp-receipt-row">
                    <span className="sp-receipt-label">Address:</span>
                    <span className="sp-receipt-val">{successData.address}</span>
                  </div>
                )}
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

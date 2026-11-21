import React, { useState, useEffect } from 'react';
import {
  Zap, Flame, X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, HelpCircle,
  PackageCheck, Wrench, ShoppingCart, Check
} from 'lucide-react';
import { submitCompressorRequest } from '../services/api';
import { BrandLogo } from './BrandLogo';
import { MandtechLogo } from './Logo';
import { useInquiry } from '../context/InquiryContext';
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
  onNavigateToCart?: () => void;
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

// Steps: 1=Type, 2=Brands (multi-select), 3=Condition (New/Used), 4=Quote or Add to Cart, 5=Success
type Step = 1 | 2 | 3 | 4 | 5;
const TOTAL_STEPS = 4;

export default function CompressorQuoteModal({
  isOpen,
  onClose,
  initialType,
  initialBrand,
  onNavigateToCart,
}: CompressorQuoteModalProps) {
  const [step, setStep] = useState<Step>(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<CompressorType | null>(initialType || null);
  const [selectedCondition, setSelectedCondition] = useState<CompressorCondition | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<CompressorBrand[]>(initialBrand ? [initialBrand] : []);
  const [customBrand, setCustomBrand] = useState('');

  // Cart integration
  const { addToInquiry, inquiryItems } = useInquiry();
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

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
    compressor_type: string;
    brand: string;
    condition: string;
    company_name: string;
    address?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialType && initialBrand) {
        setSelectedType(initialType);
        setSelectedBrands([initialBrand]);
        setSelectedCondition(null);
        setStep(2);
      } else if (initialType) {
        setSelectedType(initialType);
        setSelectedBrands([]);
        setSelectedCondition(null);
        setStep(2);
      } else {
        setSelectedType(null);
        setSelectedBrands([]);
        setSelectedCondition(null);
        setStep(1);
      }
      setCustomBrand('');
      setSubmitError(null);
      setSuccessData(null);
      setAddedToCartSuccess(false);
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

  const handleToggleBrand = (brand: CompressorBrand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handleSelectAllBrands = () => {
    setSelectedBrands(BRANDS_DATA.map((b) => b.id));
  };

  const handleClearBrands = () => {
    setSelectedBrands([]);
    setCustomBrand('');
  };

  const isOthersSelected = selectedBrands.includes('OTHERS');
  const hasValidBrands =
    selectedBrands.length > 0 &&
    (!isOthersSelected || customBrand.trim().length > 0 || selectedBrands.length > 1);

  const getEffectiveBrandsList = () => {
    return selectedBrands.map((b) =>
      b === 'OTHERS' ? (customBrand.trim() || 'Other Specified Brands') : b
    );
  };
  const effectiveBrandsDisplay = getEffectiveBrandsList().join(', ');

  const handleContinueFromBrands = () => {
    if (!hasValidBrands) {
      setSubmitError('Please select at least one OEM brand to proceed.');
      return;
    }
    setSubmitError(null);
    setStep(3);
  };

  const handleSelectCondition = (condition: CompressorCondition) => {
    setSelectedCondition(condition);
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep((s) => (s - 1) as Step);
      setSubmitError(null);
      setAddedToCartSuccess(false);
    }
  };

  // Dual Action 1: Add to Yard Cart
  const handleAddToCart = () => {
    if (!selectedType) return;
    const brandsText = effectiveBrandsDisplay || 'Multiple OEM Brands';
    const conditionText = selectedCondition === 'NEW' ? 'Brand New' : 'Used / Refurbished';

    const newItemId = `compressor-${selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'elec' : 'dsl'}-${Date.now()}`;
    addToInquiry({
      id: newItemId,
      title: `${selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'} Air Compressor`,
      category: 'Equipment Sales',
      type: 'equipment',
      brand: brandsText,
      specSummary: `${conditionText} • Brands: ${brandsText}${notes.trim() ? ` • Note: ${notes.trim()}` : ''}`,
      image: selectedType === 'ELECTRIC AIR COMPRESSOR' ? electricImg : dieselImg,
      quantity: 1,
    });

    setAddedToCartSuccess(true);
  };

  // Dual Action 2: Direct Formal Quotation Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedType) { setSubmitError('Please select a compressor type.'); setStep(1); return; }
    if (selectedBrands.length === 0) { setSubmitError('Please select at least one brand.'); setStep(2); return; }
    if (isOthersSelected && !customBrand.trim() && selectedBrands.length === 1) {
      setSubmitError('Please specify the brand name.'); setStep(2); return;
    }
    if (!selectedCondition) { setSubmitError('Please select a compressor condition.'); setStep(3); return; }
    if (!companyName.trim()) { setSubmitError('Please provide your company name.'); return; }
    if (!address.trim()) { setSubmitError('Please provide your company address or site location.'); return; }
    if (!email.trim() || !email.includes('@')) { setSubmitError('Please provide a valid corporate email.'); return; }
    if (!phone.trim() || phone.trim().length < 6) { setSubmitError('Please provide a valid phone number.'); return; }

    setIsSubmitting(true);
    try {
      const res = await submitCompressorRequest({
        compressor_type: selectedType,
        brand: effectiveBrandsDisplay,
        condition: selectedCondition,
        company_name: companyName.trim(),
        address: address.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: address.trim()
          ? `Company Address: ${address.trim()}${notes.trim() ? '\n' + notes.trim() : ''}`
          : notes.trim() || undefined,
      });

      setSuccessData({
        id: res.data.id,
        compressor_type: res.data.compressor_type,
        brand: res.data.brand,
        condition: selectedCondition,
        company_name: res.data.company_name,
        address: address.trim(),
      });

      setPhone('');
      setEmail('');
      setCompanyName('');
      setAddress('');
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
    setSelectedBrands([]);
    setCustomBrand('');
    setSuccessData(null);
    setSubmitError(null);
    setAddedToCartSuccess(false);
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
                <div
                  className="cq-type-card cq-type-card--img electric-hover"
                  onClick={() => handleSelectType('ELECTRIC AIR COMPRESSOR')}
                  role="button"
                  tabIndex={0}
                >
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

                <div
                  className="cq-type-card cq-type-card--img diesel-hover"
                  onClick={() => handleSelectType('DIESEL AIR COMPRESSOR')}
                  role="button"
                  tabIndex={0}
                >
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

          {/* ── STEP 2: OEM BRANDS (MULTI-SELECT) ── */}
          {step === 2 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <div className="cq-context-pill">
                  <span>Type:</span>
                  <strong>{selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'}</strong>
                </div>
                <h3 className="cq-title">Select Manufacturer Brand(s)</h3>
                <p className="cq-subtitle">
                  Choose one or multiple brands you want included in your quote or cart.
                </p>
              </div>

              {/* Multi-Select Toolbar */}
              <div className="cq-multiselect-toolbar">
                <span className="cq-multiselect-count">
                  {selectedBrands.length === 0
                    ? 'Select one or more brands:'
                    : `${selectedBrands.length} brand${selectedBrands.length > 1 ? 's' : ''} selected`}
                </span>
                <div className="cq-multiselect-actions">
                  <button
                    type="button"
                    onClick={handleSelectAllBrands}
                    className="cq-toolbar-link-btn"
                  >
                    Select All
                  </button>
                  {selectedBrands.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearBrands}
                      className="cq-toolbar-link-btn text-rose"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="cq-error-pill" style={{ marginBottom: '12px' }}>
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Brands Grid with Checkboxes / Active States */}
              <div className="cq-brands-grid">
                {BRANDS_DATA.map((brand) => {
                  const isChecked = selectedBrands.includes(brand.id);
                  return (
                    <div
                      key={brand.id}
                      className={`cq-brand-card cq-brand-multiselect ${isChecked ? 'cq-brand-card--selected' : ''}`}
                      onClick={() => handleToggleBrand(brand.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {/* Checkmark Indicator */}
                      <div className={`cq-brand-checkbox ${isChecked ? 'checked' : ''}`}>
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>

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
                  );
                })}
              </div>

              {/* Custom brand input if OTHERS is selected */}
              {isOthersSelected && (
                <div className="cq-others-input-wrap">
                  <label className="cq-label">Specify Additional Brand Name(s) <span className="req">*</span></label>
                  <input
                    type="text"
                    className="cq-input"
                    placeholder="e.g. Kaeser, CompAir, Gardner Denver, ELGi..."
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {/* Continue Button */}
              <div className="cq-brand-step-footer">
                <button
                  type="button"
                  className="cq-submit-btn"
                  disabled={!hasValidBrands}
                  onClick={handleContinueFromBrands}
                >
                  <span>
                    Continue with {selectedBrands.length > 0 ? `${selectedBrands.length} Selected Brand${selectedBrands.length > 1 ? 's' : ''}` : 'Brands'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: CONDITION (New / Used) ── */}
          {step === 3 && (
            <div className="cq-step-content cq-fade-in">
              <div className="cq-header-block">
                <div className="cq-context-pill">
                  <span>{selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'}</span>
                  <span className="dot">•</span>
                  <strong className="text-orange">{effectiveBrandsDisplay}</strong>
                </div>
                <h3 className="cq-title">Select Compressor Condition</h3>
                <p className="cq-subtitle">Are you requesting a quote for a new or used unit?</p>
              </div>
              <div className="cq-cards-two-grid">
                {/* New */}
                <div
                  className="cq-type-card cq-condition-card new-hover"
                  onClick={() => handleSelectCondition('NEW')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cq-card-icon-box new-condition"><PackageCheck size={24} /></div>
                  <div className="cq-card-info">
                    <span className="cq-card-badge new-badge">Brand New</span>
                    <h4 className="cq-card-title">NEW UNIT</h4>
                    <span className="cq-card-meta">Factory-fresh • Full OEM Warranty</span>
                  </div>
                  <div className="cq-card-arrow"><ArrowRight size={16} /></div>
                </div>

                {/* Used */}
                <div
                  className="cq-type-card cq-condition-card used-hover"
                  onClick={() => handleSelectCondition('USED')}
                  role="button"
                  tabIndex={0}
                >
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

          {/* ── STEP 4: QUOTATION OR ADD TO CART (DUAL FLOW) ── */}
          {step === 4 && (
            <div className="cq-step-content cq-fade-in">
              {/* Configuration Summary Badge Card */}
              <div className="cq-summary-card">
                <div className="cq-summary-header">
                  <span className="cq-summary-title">Configured Equipment Specification</span>
                  <span className={`cq-condition-tag ${selectedCondition === 'NEW' ? 'new' : 'used'}`}>
                    {selectedCondition === 'NEW' ? 'Brand New Unit' : 'Pre-Owned Unit'}
                  </span>
                </div>
                <div className="cq-summary-body">
                  <div className="cq-summary-row">
                    <span className="cq-summary-label">Type:</span>
                    <span className="cq-summary-val font-bold">
                      {selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric Air Compressor (400V 3-Phase)' : 'Diesel Air Compressor (Trailer)'}
                    </span>
                  </div>
                  <div className="cq-summary-row">
                    <span className="cq-summary-label">Brands:</span>
                    <div className="cq-summary-brands-pills">
                      {getEffectiveBrandsList().map((b, i) => (
                        <span key={i} className="cq-brand-pill-tag">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* If already added to cart, show success banner */}
              {addedToCartSuccess ? (
                <div className="cq-added-cart-banner cq-fade-in">
                  <div className="cq-added-cart-header">
                    <div className="cq-cart-icon-wrap">
                      <CheckCircle2 size={32} className="text-green" />
                    </div>
                    <div>
                      <h4 className="cq-added-title">Air Compressor Added to Yard Cart!</h4>
                      <p className="cq-added-sub">
                        {selectedType === 'ELECTRIC AIR COMPRESSOR' ? 'Electric' : 'Diesel'} Compressor ({effectiveBrandsDisplay}) is staged in your cart.
                      </p>
                    </div>
                  </div>

                  <div className="cq-added-cart-actions">
                    {onNavigateToCart && (
                      <button
                        type="button"
                        className="cq-btn-view-cart"
                        onClick={() => {
                          onClose();
                          onNavigateToCart();
                        }}
                      >
                        <ShoppingCart size={16} />
                        <span>View Cart &amp; Place Order ({inquiryItems.length})</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="cq-btn-continue-browsing"
                      onClick={onClose}
                    >
                      Continue Browsing Machinery
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Option A: Fast Add to Cart Button */}
                  <div className="cq-quick-cart-block">
                    <button
                      type="button"
                      className="cq-add-cart-btn"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={17} />
                      <span>Add Configured Compressor to Yard Cart</span>
                    </button>
                    <span className="cq-quick-or-divider">OR REQUEST AN OFFICIAL PROFORMA INVOICE VIA EMAIL</span>
                  </div>

                  {/* Option B: Formal Quotation Form */}
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

                      <div className="cq-field">
                        <label htmlFor="modalAddress" className="cq-label">Company Address / Site Location <span className="req">*</span></label>
                        <div className="cq-input-wrap">
                          <Building size={16} className="cq-field-icon" />
                          <input
                            id="modalAddress"
                            type="text"
                            placeholder="e.g. 12 Industrial Road, Port Harcourt"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="cq-input"
                          />
                        </div>
                      </div>

                      <div className="cq-field-row-two">
                        <div className="cq-field">
                          <label htmlFor="modalEmail" className="cq-label">Corporate Email <span className="req">*</span></label>
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

                        <div className="cq-field">
                          <label htmlFor="modalPhone" className="cq-label">WhatsApp / Telephone <span className="req">*</span></label>
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
                      </div>

                      <div className="cq-field">
                        <label htmlFor="modalNotes" className="cq-label">CFM / Pressure / Site Notes (Optional)</label>
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

                    <div className="cq-actions-dual-row">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="cq-secondary-cart-btn"
                        title="Add to Yard Cart Requisition Basket"
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cq-submit-btn flex-1"
                      >
                        {isSubmitting ? (
                          <span>Dispatching Quotation Request...</span>
                        ) : (
                          <>
                            <span>Request Formal Quotation</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
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
                  <span>Brand(s):</span>
                  <strong className="text-orange">{successData.brand}</strong>
                </div>
                <div className="cq-recap-row">
                  <span>Company:</span>
                  <strong>{successData.company_name}</strong>
                </div>
                {successData.address && (
                  <div className="cq-recap-row">
                    <span>Address:</span>
                    <strong>{successData.address}</strong>
                  </div>
                )}
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

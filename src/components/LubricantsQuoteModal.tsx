import React, { useState, useEffect } from 'react';
import {
  X, ArrowLeft, ArrowRight,
  Phone, Mail, Building, CheckCircle2, RotateCcw,
  AlertCircle, Shield, Cpu, Gauge, Wrench, Droplet,
  Package, MapPin
} from 'lucide-react';
import { submitInquiry } from '../services/api';
import './LubricantsQuoteModal.css';

export type LubricantBrand = 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR' | 'OTHERS';

export interface LubricantsQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrand?: LubricantBrand | null;
}

export const LUBRICANT_BRANDS: {
  id: LubricantBrand;
  name: string;
  icon: React.ReactNode;
}[] = [
  { id: 'ATLAS COPCO', name: 'ATLAS COPCO', icon: <Gauge size={24} /> },
  { id: 'SULLAIR', name: 'SULLAIR', icon: <Shield size={24} /> },
  { id: 'INGERSOLL RAND', name: 'INGERSOLL RAND', icon: <Cpu size={24} /> },
  { id: 'DENAIR', name: 'DENAIR', icon: <Wrench size={24} /> },
  { id: 'OTHERS', name: 'OTHERS', icon: <Droplet size={24} /> },
];

export default function LubricantsQuoteModal({
  isOpen,
  onClose,
  initialBrand,
}: LubricantsQuoteModalProps) {
  const [selectedBrand, setSelectedBrand] = useState<LubricantBrand | null>(initialBrand || null);
  const [step, setStep] = useState<1 | 2 | 3>(initialBrand ? 2 : 1);

  // Form Fields
  const [fluidType, setFluidType] = useState('Synthetic Compressor Oil (8,000h Rating)');
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
      if (initialBrand) {
        setSelectedBrand(initialBrand);
        setStep(2);
      } else {
        setSelectedBrand(null);
        setStep(1);
      }
      setSubmitError(null);
    }
  }, [isOpen, initialBrand]);

  if (!isOpen) return null;

  const handleSelectBrand = (brand: LubricantBrand) => {
    setSelectedBrand(brand);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    if (!contactName.trim()) {
      setSubmitError('Contact person name is required.');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Company or organization name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Valid business email address is required.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Active phone number is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const interests = [
        'Lubricants',
        `Brand: ${selectedBrand}`,
        `Grade: ${fluidType}`,
        `Packaging: ${volume}`,
        `Hub: ${hub}`,
      ];

      const fullMessage = `LUBRICANTS & SPECIAL FLUIDS QUOTE REQUEST:
Brand: ${selectedBrand}
Fluid Specification: ${fluidType}
Volume / Packaging: ${volume}
Delivery Hub: ${hub}
Contact Person: ${contactName}
${notes.trim() ? `Application / Equipment Notes: ${notes.trim()}` : ''}`;

      const res = await submitInquiry({
        name: contactName.trim(),
        company: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: fullMessage,
        equipment_interests: interests,
      });

      const ticketRef = res.data?.id
        ? `LUB-${res.data.id.substring(0, 8).toUpperCase()}`
        : `LUB-${Math.floor(100000 + Math.random() * 900000)}`;

      setSuccessTicket({
        id: ticketRef,
        brand: selectedBrand,
        fluidType,
        volume,
        hub,
      });

      setStep(3);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit quotation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedBrand(null);
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSuccessTicket(null);
    setSubmitError(null);
  };

  return (
    <div className="lub-modal-overlay" onClick={onClose}>
      <div className="lub-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lub-modal-header">
          <div>
            <span className="lub-modal-badge">MANDTECH INDUSTRIAL FLUIDS</span>
            <h2 className="lub-modal-heading">
              {step === 1 && 'Select Lubricant Brand'}
              {step === 2 && 'Request Lubricant Quotation'}
              {step === 3 && 'Quotation Request Submitted'}
            </h2>
          </div>
          <button className="lub-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="lub-modal-body">
          {/* STEP 1: Select Brand */}
          {step === 1 && (
            <div className="lub-brands-grid">
              {LUBRICANT_BRANDS.map((b) => (
                <div
                  key={b.id}
                  className="lub-brand-card"
                  onClick={() => handleSelectBrand(b.id)}
                >
                  <div className="lub-brand-icon">
                    {b.icon}
                  </div>
                  <span className="lub-brand-name">{b.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: Request For Quote Form */}
          {step === 2 && selectedBrand && (
            <form onSubmit={handleSubmit} className="lub-form">
              {/* Selected Brand Quick Bar */}
              <div className="lub-selected-bar">
                <div className="lub-selected-info">
                  <span className="lub-sel-lbl">Selected Brand:</span>
                  <span className="lub-sel-badge">
                    {LUBRICANT_BRANDS.find((b) => b.id === selectedBrand)?.icon}
                    <strong>{selectedBrand}</strong>
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

              {submitError && (
                <div className="lub-error-banner">
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="lub-form-grid">
                {/* Fluid Type / Grade */}
                <div className="lub-field">
                  <label className="lub-field-label">
                    Fluid Specification / Grade <span className="req">*</span>
                  </label>
                  <select
                    className="lub-select"
                    value={fluidType}
                    onChange={(e) => setFluidType(e.target.value)}
                  >
                    <option value="Synthetic Rotary Screw Fluid (8,000h Rating)">Synthetic Rotary Screw Fluid (8,000h Rating)</option>
                    <option value="OEM Genuine Factory Fluid (Roto-Inject / Sullube / Ultra Coolant)">OEM Genuine Factory Fluid (Roto-Inject / Sullube / Ultra Coolant)</option>
                    <option value="High-Temperature Synthetic Polyolester (POE)">High-Temperature Synthetic Polyolester (POE)</option>
                    <option value="Food-Grade H1 Certified Compressor Oil">Food-Grade H1 Certified Compressor Oil</option>
                    <option value="Mineral-Based Compressor Break-In Oil">Mineral-Based Compressor Break-In Oil</option>
                    <option value="Heavy-Duty Hydraulic & Turbine Oil (ISO VG 32/46/68)">Heavy-Duty Hydraulic &amp; Turbine Oil (ISO VG 32/46/68)</option>
                    <option value="Flushing & Chemical Cleaning Fluid">Flushing &amp; Chemical Cleaning Fluid</option>
                  </select>
                </div>

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
              </div>

              {/* Delivery Hub */}
              <div className="lub-field" style={{ marginTop: '14px' }}>
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

              {/* Notes */}
              <div className="lub-field" style={{ marginTop: '14px' }}>
                <label className="lub-field-label">
                  Compressor Model or Specific Part Number (Optional)
                </label>
                <textarea
                  className="lub-textarea"
                  rows={2}
                  placeholder="e.g. Sullair 3700 / Atlas Copco GA75, Part # 2901 0522 00, or require MSDS &amp; certificate of analysis..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="lub-form-actions">
                <button
                  type="button"
                  className="lub-btn-back"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} /> Select Brand
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

          {/* STEP 3: Success Screen */}
          {step === 3 && successTicket && (
            <div className="lub-success-view">
              <div className="lub-success-icon-wrap">
                <CheckCircle2 size={52} className="lub-check-icon" />
              </div>
              <h3 className="lub-success-heading">Quotation Request Received</h3>
              <p className="lub-success-text">
                Your request for <strong>{successTicket.brand}</strong> lubricants has been logged. Our fluids specialist will send formal pricing and delivery ETA within 2 hours.
              </p>

              <div className="lub-ticket-box">
                <div className="lub-ticket-header">
                  <span>TRACKING REFERENCE</span>
                  <strong>{successTicket.id}</strong>
                </div>
                <div className="lub-ticket-row">
                  <span>Brand:</span>
                  <strong>{successTicket.brand}</strong>
                </div>
                <div className="lub-ticket-row">
                  <span>Fluid Grade:</span>
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

              <div className="lub-hotlines-row">
                <div>
                  <span>Port-Harcourt HQ</span>
                  <a href="tel:08064204187">08064204187</a>
                </div>
                <div>
                  <span>Lagos Branch</span>
                  <a href="tel:08027779298">08027779298</a>
                </div>
                <div>
                  <span>Abuja Operations</span>
                  <a href="tel:08067980479">08067980479</a>
                </div>
              </div>

              <div className="lub-success-actions">
                <button
                  type="button"
                  className="lub-btn-reset"
                  onClick={resetForm}
                >
                  <RotateCcw size={15} /> Request Another Grade
                </button>
                <button
                  type="button"
                  className="lub-btn-done"
                  onClick={onClose}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Clock, Shield, Truck, Zap, CheckCircle2, ArrowRight,
  Phone, Mail, Building, MapPin, RotateCcw, AlertCircle, Wrench
} from 'lucide-react';
import { MandtechLogo } from '../components/Logo';
import { submitLeasingRequest } from '../services/api';
import './LeasingPage.css';
import heroBg from '../assets/hero_bg.png';

export const EQUIPMENT_OPTIONS = [
  'Air Compressor',
  'Generator',
  'Pumps',
  'Air Dryer / Moisture Separator',
  'Nitrogen Generator',
  'Lighting Tower',
  'Other Industrial Equipment',
];

export const CFM_OPTIONS = [
  '100 cfm',
  '250 cfm',
  '350 cfm',
  '400 cfm',
  '450 cfm',
  '600 cfm',
  '750 cfm',
  '900 cfm',
  '1000 cfm',
  '1200 cfm',
  '1600 cfm',
  '1800 cfm',
];

export const PRESSURE_OPTIONS = [
  '8 bar',
  '10 bar',
  '12 bar',
  '14 bar',
  '20 bar',
  '25 bar',
  '30 bar',
  '40 bar',
];

export const DURATION_OPTIONS = [
  'Spot Rental (1 - 7 Days)',
  '1 - 3 Months (Standard Project Lease)',
  '3 - 6 Months (Extended Project Lease)',
  '6 - 12 Months (Turnkey Maintenance Lease)',
  '1+ Year Long-Term Operational Lease',
];

interface LeasingPageProps {
  onNavigateToContact?: () => void;
  onOpenLeasingModal?: (type?: any, brand?: any) => void;
}

export const LeasingPage: React.FC<LeasingPageProps> = () => {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [equipmentNeeded, setEquipmentNeeded] = useState(EQUIPMENT_OPTIONS[0]);
  const [cfmFlowRate, setCfmFlowRate] = useState(CFM_OPTIONS[3]); // 400 cfm default
  const [desiredPressure, setDesiredPressure] = useState(PRESSURE_OPTIONS[1]); // 10 bar default
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    equipment: string;
    cfm: string;
    pressure: string;
    company: string;
    name: string;
    address: string;
    duration: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!name.trim()) {
      setSubmitError('Contact person name is required.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Phone number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('A valid corporate email address is required.');
      return;
    }
    if (!companyName.trim()) {
      setSubmitError('Company or organization name is required.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setSubmitError('Delivery address / site location is required.');
      return;
    }
    if (!equipmentNeeded) {
      setSubmitError('Please select the equipment needed.');
      return;
    }
    if (!cfmFlowRate) {
      setSubmitError('Please select the CFM / flow rate.');
      return;
    }
    if (!desiredPressure) {
      setSubmitError('Please select the desired pressure.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitLeasingRequest({
        name: name.trim(),
        contact_name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        company_name: companyName.trim(),
        delivery_address: deliveryAddress.trim(),
        equipment_needed: equipmentNeeded,
        flow_rate_cfm: cfmFlowRate,
        desired_pressure: desiredPressure,
        compressor_type: `${equipmentNeeded} (${cfmFlowRate} @ ${desiredPressure})`,
        brand: equipmentNeeded,
        duration: duration,
        hub: deliveryAddress.trim(),
        notes: notes.trim() || undefined,
      });

      const ticketId = res.data?.id
        ? String(res.data.id).slice(0, 8).toUpperCase()
        : `LSE-${Math.floor(100000 + Math.random() * 900000)}`;

      setSubmittedTicket({
        id: ticketId,
        equipment: equipmentNeeded,
        cfm: cfmFlowRate,
        pressure: desiredPressure,
        company: companyName.trim(),
        name: name.trim(),
        address: deliveryAddress.trim(),
        duration: duration,
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to submit leasing request. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setDeliveryAddress('');
    setEquipmentNeeded(EQUIPMENT_OPTIONS[0]);
    setCfmFlowRate(CFM_OPTIONS[3]);
    setDesiredPressure(PRESSURE_OPTIONS[1]);
    setDuration(DURATION_OPTIONS[1]);
    setNotes('');
    setSubmittedTicket(null);
    setSubmitError(null);
  };

  return (
    <div className="leasing-page-container">
      {/* Hero Section */}
      <section className="leasing-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="leasing-hero-overlay" />
        <div className="container leasing-hero-content">
          <div className="leasing-badge">
            <Clock size={14} /> LEASING &amp; RENTALS DISPATCH
          </div>
          <h1 className="leasing-hero-title">
            Industrial Equipment Leasing and Rentals.<br />
            Zero CapEx. 100% Operational Readiness.
          </h1>
          <p className="leasing-hero-desc">
            Deploy tier-1 electric and diesel rotary screw air compressors, generators, and industrial pumping systems on flexible spot or project terms. Backed by guaranteed 4-hour hot-swap SLA, OEM parts, and certified on-site technicians across Nigeria.
          </p>
          <div className="leasing-hero-highlights">
            <div className="hero-highlight-pill">
              <Shield size={16} /> 24/7 Field Techs Included
            </div>
            <div className="hero-highlight-pill">
              <Truck size={16} /> Rapid Mobilization in PHC, Lagos &amp; Abuja
            </div>
            <div className="hero-highlight-pill">
              <Zap size={16} /> Full Load Bank Tested Before Dispatch
            </div>
          </div>
        </div>
      </section>

      {/* Main Requisition Form Section */}
      <section className="container leasing-form-section">
        <div className="lse-form-wrapper">
          {!submittedTicket ? (
            <>
              <div className="lse-form-header">
                <span className="lse-form-badge">
                  EQUIPMENT LEASE &amp; RENTAL SPECIFICATION
                </span>
                <h2 className="lse-form-title">
                  Request Lease or Rental Equipment
                </h2>
                <p className="lse-form-subtitle">
                  Specify your site and operational requirements below. Our fleet logistics coordinator will verify live unit availability and dispatch an official rate card &amp; mobilization SLA within 2 hours.
                </p>
              </div>

              {submitError && (
                <div className="lse-error-banner">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="lse-form-body">
                {/* Section 1: Client & Contact Info */}
                <div className="lse-form-block">
                  <div className="lse-block-heading">
                    <span className="lse-step-num">1</span>
                    <div>
                      <h3>Client &amp; Delivery Information</h3>
                      <p>Details for invoicing, dispatch coordination, and site clearance.</p>
                    </div>
                  </div>

                  <div className="lse-fields-grid">
                    {/* Name */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="client-name">
                        Name <span className="lse-req">*</span>
                      </label>
                      <div className="lse-input-box">
                        <input
                          id="client-name"
                          type="text"
                          required
                          placeholder="e.g. Engr. David Clarkson"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Phone No */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="client-phone">
                        Phone No <span className="lse-req">*</span>
                      </label>
                      <div className="lse-input-box">
                        <Phone size={16} className="lse-input-icon" />
                        <input
                          id="client-phone"
                          type="tel"
                          required
                          placeholder="e.g. 0806 420 4187"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email ID */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="client-email">
                        Email ID <span className="lse-req">*</span>
                      </label>
                      <div className="lse-input-box">
                        <Mail size={16} className="lse-input-icon" />
                        <input
                          id="client-email"
                          type="email"
                          required
                          placeholder="e.g. d.clarkson@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="company-name">
                        Company Name <span className="lse-req">*</span>
                      </label>
                      <div className="lse-input-box">
                        <Building size={16} className="lse-input-icon" />
                        <input
                          id="company-name"
                          type="text"
                          required
                          placeholder="e.g. TotalEnergies E&amp;P Nigeria Ltd"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="lse-field-group lse-field-full">
                      <label className="lse-label" htmlFor="delivery-address">
                        Delivery Address / Site Location <span className="lse-req">*</span>
                      </label>
                      <div className="lse-input-box">
                        <MapPin size={16} className="lse-input-icon" />
                        <input
                          id="delivery-address"
                          type="text"
                          required
                          placeholder="e.g. Pier 4, Onne Free Trade Zone, Port Harcourt, Rivers State"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Equipment & Technical Specs */}
                <div className="lse-form-block">
                  <div className="lse-block-heading">
                    <span className="lse-step-num">2</span>
                    <div>
                      <h3>Equipment &amp; Technical Specifications</h3>
                      <p>Select machinery type, airflow rating, and pressure boundaries.</p>
                    </div>
                  </div>

                  <div className="lse-fields-grid">
                    {/* Equipment Needed (Drop down Menu) */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="equipment-needed">
                        Equipment Needed <span className="lse-req">*</span>
                      </label>
                      <select
                        id="equipment-needed"
                        className="lse-select"
                        value={equipmentNeeded}
                        onChange={(e) => setEquipmentNeeded(e.target.value)}
                      >
                        {EQUIPMENT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* CFM / Flow rate (Drop Down Menu) */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="cfm-flow-rate">
                        CFM / Flow Rate <span className="lse-req">*</span>
                      </label>
                      <select
                        id="cfm-flow-rate"
                        className="lse-select"
                        value={cfmFlowRate}
                        onChange={(e) => setCfmFlowRate(e.target.value)}
                      >
                        {CFM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Desired Pressure (Drop down menu) */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="desired-pressure">
                        Desired Pressure <span className="lse-req">*</span>
                      </label>
                      <select
                        id="desired-pressure"
                        className="lse-select"
                        value={desiredPressure}
                        onChange={(e) => setDesiredPressure(e.target.value)}
                      >
                        {PRESSURE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rental Duration */}
                    <div className="lse-field-group">
                      <label className="lse-label" htmlFor="rental-duration">
                        Estimated Lease Duration
                      </label>
                      <select
                        id="rental-duration"
                        className="lse-select"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        {DURATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Notes */}
                    <div className="lse-field-group lse-field-full">
                      <label className="lse-label" htmlFor="project-notes">
                        Additional Operational Notes (Optional)
                      </label>
                      <textarea
                        id="project-notes"
                        className="lse-textarea"
                        rows={3}
                        placeholder="State any specific offshore safety clearance, duty cycle hours, fuel supply terms, or request for certified standby operator..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Assurance Trust Strip */}
                <div className="lse-assurance-row">
                  <div className="lse-assure-item">
                    <Shield size={16} />
                    <span>Guaranteed 4-Hour Hot-Swap SLA</span>
                  </div>
                  <div className="lse-assure-item">
                    <Truck size={16} />
                    <span>Rapid Mobilization from PHC, Lagos &amp; Abuja</span>
                  </div>
                  <div className="lse-assure-item">
                    <Wrench size={16} />
                    <span>Certified Mandtech Field Technicians Included</span>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="lse-form-actions">
                  <button
                    type="submit"
                    className="lse-btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Verifying Availability & Submitting...' : 'Submit Lease / Rental Request'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success Receipt View */
            <div className="lse-success-view">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <MandtechLogo height={32} />
              </div>
              <div className="lse-success-icon-wrap">
                <CheckCircle2 size={56} className="lse-check-icon" />
              </div>
              <h2 className="lse-success-title">Leasing Requisition Received</h2>
              <p className="lse-success-sub">
                Thank you, <strong>{submittedTicket.name}</strong> ({submittedTicket.company}). Your equipment leasing requisition has been registered and assigned to a Mandtech heavy fleet operations coordinator.
              </p>

              <div className="lse-ticket-card">
                <div className="lse-ticket-header">
                  <span>REQUISITION REFERENCE</span>
                  <strong>{submittedTicket.id}</strong>
                </div>
                <div className="lse-ticket-grid">
                  <div className="lse-t-cell">
                    <span className="lse-t-label">Equipment Needed:</span>
                    <strong className="lse-t-val">{submittedTicket.equipment}</strong>
                  </div>
                  <div className="lse-t-cell">
                    <span className="lse-t-label">CFM / Flow Rate:</span>
                    <strong className="lse-t-val">{submittedTicket.cfm}</strong>
                  </div>
                  <div className="lse-t-cell">
                    <span className="lse-t-label">Desired Pressure:</span>
                    <strong className="lse-t-val">{submittedTicket.pressure}</strong>
                  </div>
                  <div className="lse-t-cell">
                    <span className="lse-t-label">Estimated Term:</span>
                    <strong className="lse-t-val">{submittedTicket.duration}</strong>
                  </div>
                  <div className="lse-t-cell" style={{ gridColumn: 'span 2' }}>
                    <span className="lse-t-label">Delivery Address:</span>
                    <strong className="lse-t-val">{submittedTicket.address}</strong>
                  </div>
                </div>
              </div>

              {/* Fast Mobilization Hotlines */}
              <div className="lse-success-hotlines">
                <div className="lse-hotline-card">
                  <span className="lse-hotline-loc">Port-Harcourt HQ Dispatch</span>
                  <a href="tel:08064204187" className="lse-hotline-num">08064204187</a>
                  <span className="lse-hotline-hours">24/7 Yard Operations</span>
                </div>
                <div className="lse-hotline-card">
                  <span className="lse-hotline-loc">Lagos Fleet Hub</span>
                  <a href="tel:08027779298" className="lse-hotline-num">08027779298</a>
                  <span className="lse-hotline-hours">Oshodi &amp; Ikeja Dispatch</span>
                </div>
                <div className="lse-hotline-card">
                  <span className="lse-hotline-loc">Abuja Regional Operations</span>
                  <a href="tel:08067980479" className="lse-hotline-num">08067980479</a>
                  <span className="lse-hotline-hours">Karsana Heavy Fleet Yard</span>
                </div>
              </div>

              <div className="lse-success-actions">
                <button
                  type="button"
                  className="lse-btn-reset"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} /> Submit Another Requisition
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LeasingPage;

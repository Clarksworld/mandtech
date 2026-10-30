import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Check, Clock, X } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import { InputField, CheckboxItem } from '../components/FormFields';
import { Button } from '../components/Button';
import { InfoCard } from '../components/Card';
import { submitInquiry } from '../services/api';
import './ContactPage.css';

const BRANCHES = [
  {
    city: 'Port-Harcourt (Headquarters)',
    isHq: true,
    company: 'Mandtech Services Limited',
    addr: '42 Old Refinery Road, Elelenwo, Port-Harcourt, Rivers',
    phone: '08064204187',
    email: 'info@mandtech.com.ng',
    gps: '4.8324° N, 7.0712° E',
  },
  {
    city: 'Lagos Branch',
    isHq: false,
    company: 'Mandtech Services Limited',
    addr: '16 Oshuketan Street, Return, Lagos',
    phone: '08027779298',
    email: 'info@mandtech.com.ng',
    gps: '6.5956° N, 3.3854° E',
  },
  {
    city: 'Abuja Branch',
    isHq: false,
    company: 'Mandtech Services Limited',
    addr: 'Camp David Garden Estate, Karsana District, Abuja',
    phone: '08067980479',
    email: 'sales@mandtech.com.ng',
    gps: '9.1352° N, 7.3218° E',
  },
];

export const ContactPage: React.FC = () => {
  const { inquiryItems, removeFromInquiry, clearInquiry } = useInquiry();

  // Inquiry form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Selected product lines of interest
  const [interestCompressors, setInterestCompressors] = useState(false);
  const [interestAirDryer, setInterestAirDryer] = useState(false);
  const [interestAirReceiver, setInterestAirReceiver] = useState(false);
  const [interestSpareParts, setInterestSpareParts] = useState(false);
  const [interestLubricants, setInterestLubricants] = useState(false);

  // Selected services of interest
  const [interestRentals, setInterestRentals] = useState(false);
  const [interestMaintenance, setInterestMaintenance] = useState(false);
  const [interestAudit, setInterestAudit] = useState(false);
  const [interestTechSupport, setInterestTechSupport] = useState(false);
  const [interestInstallation, setInterestInstallation] = useState(false);
  const [interestTroubleshooting, setInterestTroubleshooting] = useState(false);

  const [newsletter, setNewsletter] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTicketNo, setSubmittedTicketNo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-check classes if items are in the basket
  useEffect(() => {
    inquiryItems.forEach(item => {
      const title = item.title.toLowerCase();
      const cat = item.category.toLowerCase();
      if (item.type === 'equipment' || title.includes('compressor')) setInterestCompressors(true);
      if (title.includes('dryer') || cat.includes('dryer')) setInterestAirDryer(true);
      if (title.includes('receiver') || cat.includes('receiver')) setInterestAirReceiver(true);
      if (item.type === 'part' || title.includes('part') || title.includes('filter')) setInterestSpareParts(true);
      if (title.includes('lubricant') || title.includes('oil') || title.includes('fluid')) setInterestLubricants(true);
      if (item.type === 'lease') setInterestRentals(true);
      if (cat.includes('service') || title.includes('maintenance')) setInterestMaintenance(true);
    });
  }, [inquiryItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full contact person name.');
      return;
    }
    if (!company.trim()) {
      setFormError('Please enter your organization or company name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid business email address.');
      return;
    }
    if (!message.trim() && inquiryItems.length === 0) {
      setFormError('Please describe your equipment requirements or attach items from the catalog.');
      return;
    }

    const interests: string[] = [];
    if (interestCompressors) interests.push('Air Compressors');
    if (interestAirDryer) interests.push('Air Dryer');
    if (interestAirReceiver) interests.push('Air Receiver');
    if (interestSpareParts) interests.push('Spare Parts');
    if (interestLubricants) interests.push('Lubricants');

    if (interestRentals) interests.push('Equipment Rentals');
    if (interestMaintenance) interests.push('On-Site Maintenance');
    if (interestAudit) interests.push('System Audit');
    if (interestTechSupport) interests.push('Technical Support / Advice');
    if (interestInstallation) interests.push('Installation');
    if (interestTroubleshooting) interests.push('Troubleshooting');

    inquiryItems.forEach(item => {
      interests.push(`${item.title} (${item.category})`);
    });

    setSubmitting(true);
    try {
      const response = await submitInquiry({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || (inquiryItems.length > 0 ? `Inquiry for ${inquiryItems.length} selected catalog item(s)` : 'General RFQ inquiry'),
        equipment_interests: interests,
        newsletter_opt_in: newsletter,
      });

      const refNo = response.data?.id ? `RFQ-${response.data.id.substring(0, 8).toUpperCase()}` : 'RFQ-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicketNo(refNo);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear state and cart
      clearInquiry();
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
      setInterestCompressors(false);
      setInterestAirDryer(false);
      setInterestAirReceiver(false);
      setInterestSpareParts(false);
      setInterestLubricants(false);
      setInterestRentals(false);
      setInterestMaintenance(false);
      setInterestAudit(false);
      setInterestTechSupport(false);
      setInterestInstallation(false);
      setInterestTroubleshooting(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit proposal inquiry. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="container">
        {/* Submitted notification banner */}
        {submitted && (
          <div className="contact-success-banner">
            <span className="success-banner-badge"><Check size={18} /></span>
            <div className="success-banner-content">
              <h4 className="success-banner-title">Formal Proposal Inquiry Received ({submittedTicketNo})</h4>
              <p className="success-banner-text">
                Your technical specifications have been submitted successfully. A regional engineering coordinator will review and respond within <strong>2 hours</strong> with formal pricing and mobilization timeline.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#065f46' }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Header Block */}
        <div className="contact-header">
          <h1 className="contact-title">Contact &amp; Proposal Intake</h1>
          <p className="contact-subtitle">
            Partner with our field application team to configure equipment sizing, procure genuine spares, or contract heavy industrial fleet leases.
          </p>
        </div>

        <div className="contact-grid-layout">
          {/* Left Side: Regional Directories */}
          <div className="contact-info-column">
            <h2 className="column-section-title">OUR REGIONAL HUBS</h2>
            <div className="branches-list">
              {BRANCHES.map((b, i) => (
                <InfoCard key={i} className="branch-info-card">
                  <div className="branch-card-header">
                    <span className="orange-indicator-dot"></span>
                    <h3 className="branch-card-city">
                      {b.city}
                      {b.isHq && <span style={{ marginLeft: '8px', fontSize: '10px', background: 'var(--primary-container)', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>HQ</span>}
                    </h3>
                  </div>
                  <p className="branch-card-addr"><MapPin size={14} /> {b.addr}</p>
                  <span className="branch-gps-coord">GPS: {b.gps}</span>

                  <div className="branch-card-footer">
                    <a href={`tel:${b.phone}`} className="branch-footer-link">
                      <Phone size={14} /> {b.phone}
                    </a>
                    <a href={`mailto:${b.email}`} className="branch-footer-link">
                      <Mail size={14} /> {b.email}
                    </a>
                  </div>
                </InfoCard>
              ))}
            </div>

            {/* Quick Contact triggers */}
            <div className="quick-tiles-grid">
              <a href="tel:08064204187" className="quick-contact-tile">
                <span className="tile-icon-wrapper">📞</span>
                <span className="tile-title">PHC HQ Hotline</span>
                <span className="tile-desc">08064204187 — Direct corporate line.</span>
              </a>
              <a href="mailto:info@mandtech.com.ng" className="quick-contact-tile">
                <span className="tile-icon-wrapper">✉️</span>
                <span className="tile-title">General Inquiries</span>
                <span className="tile-desc">info@mandtech.com.ng</span>
              </a>
              <a href="mailto:sales@mandtech.com.ng" className="quick-contact-tile">
                <span className="tile-icon-wrapper">📑</span>
                <span className="tile-title">Sales &amp; RFQ Desk</span>
                <span className="tile-desc">sales@mandtech.com.ng</span>
              </a>
            </div>

            {/* Operating Hours card */}
            <InfoCard className="operating-hours-card">
              <span className="hours-icon"><Clock size={20} /></span>
              <h3 className="hours-card-title">Operating &amp; Dispatch Hours</h3>
              <div className="hours-rows-list">
                <div className="hours-row">
                  <span>Monday – Friday</span>
                  <strong>8:00 AM – 5:00 PM</strong>
                </div>
                <div className="hours-row">
                  <span>Saturday (Emergency only)</span>
                  <strong>9:00 AM – 1:00 PM</strong>
                </div>
                <div className="hours-row">
                  <span>Sunday &amp; Public Holidays</span>
                  <span className="closed-label">Emergency Fleet Hotline Active (24/7)</span>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Right Side: Heavy Industry Intake Form */}
          <div className="contact-form-column">
            <InfoCard className="contact-form-wrapper">
              <h3 className="form-inner-title">Submit a Technical Consulting &amp; Proposal Inquiry</h3>
              <p className="form-inner-sub">
                Complete our technical intake form to receive custom configuration proposals, sizing metrics, and contracted quotes.
              </p>

              {/* Form Validation Error Banner */}
              {formError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  color: '#b91c1c',
                  fontSize: '13.5px',
                  fontWeight: 600
                }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* Attached Inquiry Items from Catalog / Equipment / Leasing */}
              {inquiryItems.length > 0 && (
                <div className="attached-inquiry-box">
                  <div className="attached-inquiry-header">
                    <h4 className="attached-inquiry-title">
                      Attached Procurement Items ({inquiryItems.length})
                    </h4>
                    <button
                      type="button"
                      className="attached-clear-all-btn"
                      onClick={clearInquiry}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="attached-items-list">
                    {inquiryItems.map((item) => (
                      <div key={item.id} className="attached-item-row">
                        <div className="attached-item-info">
                          <span className="attached-item-name">{item.title}</span>
                          <span className="attached-item-sub">
                            {item.category} {item.sku ? `• SKU: ${item.sku}` : ''} {item.specSummary ? `• ${item.specSummary}` : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="attached-remove-btn"
                          onClick={() => removeFromInquiry(item.id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <InputField
                  label="Contact Person Name"
                  placeholder="e.g. Kola Adesina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <InputField
                  label="Organization Name"
                  placeholder="e.g. Dangote Fertilizer Annex"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />

                <div className="form-row-double">
                  <InputField
                    label="Business Email"
                    placeholder="e.g. k.adesina@dangote.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <InputField
                    label="Active Phone Number"
                    placeholder="e.g. +234 803 123 4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>
                  Product Line of Interest
                </label>
                <div className="equipment-checkboxes-grid" style={{ marginBottom: '14px' }}>
                  <CheckboxItem
                    label="Air Compressors"
                    checked={interestCompressors}
                    onToggle={() => setInterestCompressors(!interestCompressors)}
                  />
                  <CheckboxItem
                    label="Air Dryer"
                    checked={interestAirDryer}
                    onToggle={() => setInterestAirDryer(!interestAirDryer)}
                  />
                  <CheckboxItem
                    label="Air Receiver"
                    checked={interestAirReceiver}
                    onToggle={() => setInterestAirReceiver(!interestAirReceiver)}
                  />
                  <CheckboxItem
                    label="Spare Parts"
                    checked={interestSpareParts}
                    onToggle={() => setInterestSpareParts(!interestSpareParts)}
                  />
                  <CheckboxItem
                    label="Lubricants"
                    checked={interestLubricants}
                    onToggle={() => setInterestLubricants(!interestLubricants)}
                  />
                </div>

                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>
                  Industrial Services Required
                </label>
                <div className="equipment-checkboxes-grid">
                  <CheckboxItem
                    label="Equipment Rentals"
                    checked={interestRentals}
                    onToggle={() => setInterestRentals(!interestRentals)}
                  />
                  <CheckboxItem
                    label="On-Site Maintenance"
                    checked={interestMaintenance}
                    onToggle={() => setInterestMaintenance(!interestMaintenance)}
                  />
                  <CheckboxItem
                    label="System Audit"
                    checked={interestAudit}
                    onToggle={() => setInterestAudit(!interestAudit)}
                  />
                  <CheckboxItem
                    label="Technical Support / Advice"
                    checked={interestTechSupport}
                    onToggle={() => setInterestTechSupport(!interestTechSupport)}
                  />
                  <CheckboxItem
                    label="Installation"
                    checked={interestInstallation}
                    onToggle={() => setInterestInstallation(!interestInstallation)}
                  />
                  <CheckboxItem
                    label="Troubleshooting"
                    checked={interestTroubleshooting}
                    onToggle={() => setInterestTroubleshooting(!interestTroubleshooting)}
                  />
                </div>

                <div style={{ height: '16px' }} />

                <InputField
                  label="Project Requirements &amp; Scope Details"
                  placeholder="Detail CFM/pressure targets, prime power requirements, project duration, site delivery locations, or specific model inquiries..."
                  multiline
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required={inquiryItems.length === 0}
                />

                <CheckboxItem
                  label="Keep my corporate contact verified for quarterly industrial technical bulletins and promotional spare discounts."
                  checked={newsletter}
                  onToggle={() => setNewsletter(!newsletter)}
                />

                <div style={{ height: '28px' }} />

                <Button
                  label={submitting ? 'Submitting Proposal...' : `Submit Sizing Proposal Request ${inquiryItems.length > 0 ? `(${inquiryItems.length} items)` : ''}`}
                  variant="primary"
                  type="submit"
                  loading={submitting}
                  fullWidth
                />
              </form>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

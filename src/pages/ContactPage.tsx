import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Check, Clock, X } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import { InputField, CheckboxItem } from '../components/FormFields';
import { Button } from '../components/Button';
import { InfoCard } from '../components/Card';
import './ContactPage.css';

const BRANCHES = [
  {
    city: 'Lagos Headquarters & Yard',
    addr: 'Industrial Park Phase II, Victoria Island, Lagos, Nigeria',
    phone: '+234 (1) 460-7000',
    email: 'lagos@mandtech.com.ng',
    gps: '6.4281° N, 3.4219° E',
  },
  {
    city: 'Port Harcourt Trans-Amadi Hub',
    addr: 'Plot 15, Trans-Amadi Industrial Layout, Port Harcourt, Nigeria',
    phone: '+234 (84) 303-900',
    email: 'ph@mandtech.com.ng',
    gps: '4.8156° N, 7.0498° E',
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
  
  // Selected equipment checkbox states
  const [equipCompressors, setEquipCompressors] = useState(false);
  const [equipGenerators, setEquipGenerators] = useState(false);
  const [equipPumps, setEquipPumps] = useState(false);
  const [equipDryers, setEquipDryers] = useState(false);
  
  const [newsletter, setNewsletter] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTicketNo, setSubmittedTicketNo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-check equipment categories if items are in the basket
  useEffect(() => {
    inquiryItems.forEach(item => {
      const cat = item.category.toLowerCase();
      const title = item.title.toLowerCase();
      if (cat.includes('compress') || title.includes('compress') || title.includes('cfm')) setEquipCompressors(true);
      if (cat.includes('gen') || title.includes('gen') || title.includes('kva')) setEquipGenerators(true);
      if (cat.includes('pump') || title.includes('pump') || title.includes('gpm')) setEquipPumps(true);
      if (cat.includes('dry') || title.includes('dry')) setEquipDryers(true);
    });
  }, [inquiryItems]);

  const handleSubmit = (e: React.FormEvent) => {
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

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const ticket = 'RFQ-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicketNo(ticket);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear state and cart
      clearInquiry();
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
      setEquipCompressors(false);
      setEquipGenerators(false);
      setEquipPumps(false);
      setEquipDryers(false);
      
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    }, 1500);
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
                    <h3 className="branch-card-city">{b.city}</h3>
                  </div>
                  <p className="branch-card-addr"><MapPin size={14} /> {b.addr}</p>
                  <span className="branch-gps-coord">GPS: {b.gps}</span>
                  
                  <div className="branch-card-footer">
                    <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className="branch-footer-link">
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
              <a href="tel:+23414607000" className="quick-contact-tile">
                <span className="tile-icon-wrapper">📞</span>
                <span className="tile-title">Lagos Dispatch Annex</span>
                <span className="tile-desc">Direct hotline for emergency dispatch.</span>
              </a>
              <a href="mailto:proposals@mandtech.com.ng" className="quick-contact-tile">
                <span className="tile-icon-wrapper">✉️</span>
                <span className="tile-title">Corporate RFQ Mailbox</span>
                <span className="tile-desc">Fast-track route for bid tender packages.</span>
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

                <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Equipment Class of Interest
                </label>
                <div className="equipment-checkboxes-grid">
                  <CheckboxItem
                    label="Air Compressors"
                    checked={equipCompressors}
                    onToggle={() => setEquipCompressors(!equipCompressors)}
                  />
                  <CheckboxItem
                    label="Power Generators"
                    checked={equipGenerators}
                    onToggle={() => setEquipGenerators(!equipGenerators)}
                  />
                  <CheckboxItem
                    label="Fluid Pumps"
                    checked={equipPumps}
                    onToggle={() => setEquipPumps(!equipPumps)}
                  />
                  <CheckboxItem
                    label="Air Dryers"
                    checked={equipDryers}
                    onToggle={() => setEquipDryers(!equipDryers)}
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

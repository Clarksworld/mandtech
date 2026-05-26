import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Clock } from 'lucide-react';
import { InputField, CheckboxItem } from '../components/FormFields';
import { Button } from '../components/Button';
import { InfoCard } from '../components/Card';
import './ContactPage.css';

const BRANCHES = [
  {
    city: 'Lagos Headquarters',
    addr: 'Industrial Park Phase II, Victoria Island, Lagos, Nigeria',
    phone: '+234 (1) 460-7000',
    email: 'lagos@mandtech.com.ng',
    gps: '6.4281° N, 3.4219° E',
  },
  {
    city: 'Port Harcourt Yard',
    addr: 'Plot 15, Trans-Amadi Industrial Layout, Port Harcourt, Nigeria',
    phone: '+234 (84) 303-900',
    email: 'ph@mandtech.com.ng',
    gps: '4.8156° N, 7.0498° E',
  },
];

export const ContactPage: React.FC = () => {
  // Inquiry state
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!company.trim()) {
      alert('Please enter your company name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid business email.');
      return;
    }
    if (!message.trim()) {
      alert('Please describe your requirements.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset state
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
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-page-container">
      <div className="container">
        {/* Submitted notification banner */}
        {submitted && (
          <div className="contact-success-banner">
            <span className="success-banner-badge"><Check size={16} /></span>
            <div className="success-banner-content">
              <h4 className="success-banner-title">Proposal Inquiry Received</h4>
              <p className="success-banner-text">
                Your technical specifications have been submitted successfully. A regional engineering coordinator will respond within <strong>2 hours</strong> with formal proposals.
              </p>
            </div>
          </div>
        )}

        {/* Header Block */}
        <div className="contact-header">
          <h1 className="contact-title">Contact &amp; Proposal Intake</h1>
          <p className="contact-subtitle">
            Partner with our field application team to configure, dispatch, or contract heavy industrial assets.
          </p>
        </div>

        <div className="contact-grid-layout">
          {/* Left Side: Regional Directories */}
          <div className="contact-info-column">
            <h2 className="column-section-title">OUR REGIONAL YARDS</h2>
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
                <span className="tile-desc">Tap to dial Lagos yard instantly.</span>
              </a>
              <a href="mailto:info@mandtech.com.ng" className="quick-contact-tile">
                <span className="tile-icon-wrapper">✉️</span>
                <span className="tile-title">Corporate RFQ Mailbox</span>
                <span className="tile-desc">Direct route for RFQ files.</span>
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
                  <span>Sunday &amp; Holidays</span>
                  <span className="closed-label">Closed (Hotline Active)</span>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Right Side: Heavy Industry Intake Form */}
          <div className="contact-form-column">
            <InfoCard className="contact-form-wrapper">
              <h3 className="form-inner-title">Submit a Technical Consulting Inquiry</h3>
              <p className="form-inner-sub">
                Complete our technical intake form to receive custom configuration proposals, sizing metrics, and contracted quotes.
              </p>
              
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
                  label="Project Requirements &amp; Message"
                  placeholder="Sizing specs, flow rate GPM/CFM targets, electricity kVA prime capacities, or site dispatch schedules needed..."
                  multiline
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <CheckboxItem
                  label="Keep my corporate contact verified for quarterly industrial technical bulletins and promotional spare discounts."
                  checked={newsletter}
                  onToggle={() => setNewsletter(!newsletter)}
                />

                <div style={{ height: '28px' }} />

                <Button
                  label="Submit Sizing Proposal Request"
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

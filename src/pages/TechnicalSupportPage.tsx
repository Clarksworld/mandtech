import React, { useState } from 'react';
import { Check, X, ChevronLeft, Wrench, ClipboardList, RefreshCw, FileText, Lightbulb } from 'lucide-react';
import { InputField } from '../components/FormFields';
import { Button } from '../components/Button';
import { InfoCard } from '../components/Card';
import { submitInquiry } from '../services/api';
import './TechnicalSupportPage.css';

export type TechnicalServiceType =
  | 'CONSULTATIONS/INSPECTION'
  | 'PREVENTIVE/CORRECTIVE MAINTENANCE'
  | 'ANNUAL MAINTENANCE CONTRACTS (AMCs)'
  | 'DEPUTATION OF ENGINEERS'
  | 'TECHNICAL ADVICE';

interface TechnicalSupportPageProps {
  initialService?: TechnicalServiceType | null;
  onBack?: () => void;
}

const SERVICES: { id: TechnicalServiceType; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'CONSULTATIONS/INSPECTION',
    icon: <ClipboardList size={22} />,
    desc: 'Expert site surveys, equipment audits & professional engineering assessments.',
  },
  {
    id: 'PREVENTIVE/CORRECTIVE MAINTENANCE',
    icon: <Wrench size={22} />,
    desc: 'Scheduled upkeep and corrective intervention to maximize uptime.',
  },
  {
    id: 'ANNUAL MAINTENANCE CONTRACTS (AMCs)',
    icon: <FileText size={22} />,
    desc: 'Comprehensive yearly service plans with priority dispatch and SLA guarantees.',
  },
  {
    id: 'DEPUTATION OF ENGINEERS',
    icon: <RefreshCw size={22} />,
    desc: 'Dedicated resident engineers deployed to your site for ongoing support.',
  },
  {
    id: 'TECHNICAL ADVICE',
    icon: <Lightbulb size={22} />,
    desc: 'Professional guidance on system configuration, upgrades & best practices.',
  },
];

const TechnicalSupportPage: React.FC<TechnicalSupportPageProps> = ({ initialService, onBack }) => {
  const [selectedService, setSelectedService] = useState<TechnicalServiceType | null>(
    initialService || null
  );

  // Form fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTicketNo, setSubmittedTicketNo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSelectService = (service: TechnicalServiceType) => {
    setSelectedService(service);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedService) {
      setSelectedService(null);
      setFormError(null);
    } else {
      onBack?.();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) { setFormError('Please enter your full name.'); return; }
    if (!address.trim()) { setFormError('Please enter your address.'); return; }
    if (!companyName.trim()) { setFormError('Please enter your company name.'); return; }
    if (!email.trim() || !email.includes('@')) { setFormError('Please enter a valid email address.'); return; }
    if (!phone.trim()) { setFormError('Please enter your phone number.'); return; }

    setSubmitting(true);
    try {
      const response = await submitInquiry({
        name: name.trim(),
        company: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: `Technical Support Request: ${selectedService}\nAddress: ${address.trim()}`,
        equipment_interests: [selectedService!],
        newsletter_opt_in: false,
      });

      const refNo = response.data?.id
        ? `TS-${response.data.id.substring(0, 8).toUpperCase()}`
        : 'TS-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicketNo(refNo);
      setSubmitted(true);

      // Reset form
      setName('');
      setAddress('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tech-support-page">
      <div className="container">
        {/* Back button */}
        <button className="ts-back-btn" onClick={handleBack}>
          <ChevronLeft size={18} />
          {selectedService ? 'Back to Services' : 'Back'}
        </button>

        {/* Page Header */}
        <div className="ts-page-header">
          <div className="ts-header-badge">TECHNICAL SUPPORT</div>
          <h1 className="ts-page-title">
            {selectedService ? selectedService : 'Select a Technical Service'}
          </h1>
          <p className="ts-page-subtitle">
            {selectedService
              ? 'Complete the form below and our engineering team will get back to you promptly.'
              : 'Choose the type of technical service you require. Our team of expert engineers is ready to assist.'}
          </p>
        </div>

        {/* Service Selection Grid */}
        {!selectedService && (
          <div className="ts-services-grid">
            {SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="ts-service-card"
                onClick={() => handleSelectService(svc.id)}
              >
                <div className="ts-service-icon">{svc.icon}</div>
                <div className="ts-service-info">
                  <h3 className="ts-service-title">{svc.id}</h3>
                  <p className="ts-service-desc">{svc.desc}</p>
                </div>
                <div className="ts-service-arrow">→</div>
              </div>
            ))}
          </div>
        )}

        {/* Form Section */}
        {selectedService && (
          <div className="ts-form-wrapper">
            {/* Success Banner */}
            {submitted && (
              <div className="ts-success-banner">
                <span className="ts-success-icon"><Check size={18} /></span>
                <div className="ts-success-content">
                  <h4 className="ts-success-title">Request Submitted ({submittedTicketNo})</h4>
                  <p className="ts-success-text">
                    Your technical service request has been received. An engineer will contact you within <strong>2 business hours</strong>.
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

            <InfoCard className="ts-form-card">
              <div className="ts-selected-service-badge">
                <span className="ts-selected-icon">
                  {SERVICES.find(s => s.id === selectedService)?.icon}
                </span>
                <span className="ts-selected-label">{selectedService}</span>
              </div>

              <h3 className="ts-form-title">Service Request Form</h3>
              <p className="ts-form-subtitle">
                All fields are required. A technical coordinator will review your request and reach out within 2 business hours.
              </p>

              {formError && (
                <div className="ts-form-error">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="ts-form">
                <InputField
                  label="Full Name"
                  placeholder="e.g. Chukwuemeka Obi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <InputField
                  label="Address"
                  placeholder="e.g. 12 Industrial Layout, Trans-Amadi, Port-Harcourt"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <InputField
                  label="Company Name"
                  placeholder="e.g. Obi Industrial Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />

                <div className="ts-form-row">
                  <InputField
                    label="Email Address"
                    placeholder="e.g. c.obi@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    placeholder="e.g. +234 803 123 4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div style={{ height: '24px' }} />

                <Button
                  label={submitting ? 'Submitting...' : 'Submit Technical Service Request'}
                  variant="primary"
                  type="submit"
                  loading={submitting}
                  fullWidth
                />
              </form>
            </InfoCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalSupportPage;


import React from 'react';
import { Phone, HeadphonesIcon, ClipboardList, Wrench, FileText, RefreshCw, Lightbulb, MessageCircle, Mail } from 'lucide-react';
import './SupportPage.css';

interface SupportPageProps {
  onNavigateToTechSupport: (service?: string) => void;
  onOpenContactSupport: () => void;
}

const TECH_SERVICES = [
  { id: 'CONSULTATIONS/INSPECTION', icon: <ClipboardList size={20} />, desc: 'Expert site surveys & engineering assessments' },
  { id: 'PREVENTIVE/CORRECTIVE MAINTENANCE', icon: <Wrench size={20} />, desc: 'Scheduled upkeep & corrective interventions' },
  { id: 'ANNUAL MAINTENANCE CONTRACTS (AMCs)', icon: <FileText size={20} />, desc: 'Yearly service plans with SLA guarantees' },
  { id: 'DEPUTATION OF ENGINEERS', icon: <RefreshCw size={20} />, desc: 'Dedicated resident engineers on your site' },
  { id: 'TECHNICAL ADVICE', icon: <Lightbulb size={20} />, desc: 'Professional guidance on systems & upgrades' },
];

const CONTACT_CHANNELS = [
  {
    id: 'phone',
    icon: <Phone size={24} />,
    label: 'Phone Call',
    desc: 'Speak directly with our support team',
    value: '08064204187',
    href: 'tel:08064204187',
    colorClass: 'sp-channel-phone',
  },
  {
    id: 'whatsapp',
    icon: <MessageCircle size={24} />,
    label: 'WhatsApp Chat',
    desc: 'Chat with us instantly',
    value: '08064204187',
    href: 'https://wa.me/2348064204187',
    colorClass: 'sp-channel-whatsapp',
  },
  {
    id: 'email',
    icon: <Mail size={24} />,
    label: 'Email',
    desc: 'Send us a detailed message',
    value: 'info@mandtech.com.ng',
    href: 'mailto:info@mandtech.com.ng',
    colorClass: 'sp-channel-email',
  },
];

const SupportPage: React.FC<SupportPageProps> = ({ onNavigateToTechSupport, onOpenContactSupport }) => {
  return (
    <div className="support-landing-page">
      <div className="container">
        {/* Header */}
        <div className="sp-header">
          <div className="sp-header-badge">SUPPORT CENTER</div>
          <h1 className="sp-header-title">How Can We Help You?</h1>
          <p className="sp-header-subtitle">
            Choose from our support options below. Whether you need hands-on engineering services or just want to reach out, we're here for you.
          </p>
        </div>

        <div className="sp-sections-grid">
          {/* Contact Support Section */}
          <div className="sp-section-card sp-contact-section">
            <div className="sp-section-header">
              <div className="sp-section-icon-wrap sp-contact-icon-wrap">
                <Phone size={24} />
              </div>
              <div>
                <h2 className="sp-section-title">Contact Support</h2>
                <p className="sp-section-desc">Get in touch with us through your preferred channel</p>
              </div>
            </div>

            <div className="sp-channels-grid">
              {CONTACT_CHANNELS.map((ch) => (
                <a
                  key={ch.id}
                  href={ch.href}
                  target={ch.id === 'whatsapp' ? '_blank' : undefined}
                  rel={ch.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                  className={`sp-channel-card ${ch.colorClass}`}
                >
                  <div className="sp-channel-icon">{ch.icon}</div>
                  <div className="sp-channel-info">
                    <span className="sp-channel-label">{ch.label}</span>
                    <span className="sp-channel-desc">{ch.desc}</span>
                  </div>
                  <span className="sp-channel-value">{ch.value}</span>
                </a>
              ))}
            </div>

            <button
              className="sp-section-cta sp-contact-cta"
              onClick={onOpenContactSupport}
            >
              View All Contact Options →
            </button>
          </div>

          {/* Technical Support Section */}
          <div className="sp-section-card sp-tech-section">
            <div className="sp-section-header">
              <div className="sp-section-icon-wrap sp-tech-icon-wrap">
                <HeadphonesIcon size={24} />
              </div>
              <div>
                <h2 className="sp-section-title">Technical Support</h2>
                <p className="sp-section-desc">Engineering services, maintenance & expert consultations</p>
              </div>
            </div>

            <div className="sp-services-list">
              {TECH_SERVICES.map((svc) => (
                <div
                  key={svc.id}
                  className="sp-service-item"
                  onClick={() => onNavigateToTechSupport(svc.id)}
                >
                  <div className="sp-service-icon">{svc.icon}</div>
                  <div className="sp-service-info">
                    <span className="sp-service-name">{svc.id}</span>
                    <span className="sp-service-desc">{svc.desc}</span>
                  </div>
                  <span className="sp-service-arrow">→</span>
                </div>
              ))}
            </div>

            <button
              className="sp-section-cta sp-tech-cta"
              onClick={() => onNavigateToTechSupport()}
            >
              Request Technical Support →
            </button>
          </div>
        </div>

        {/* Emergency Hotline Banner */}
        <div className="sp-emergency-banner">
          <div className="sp-emergency-dot" />
          <div className="sp-emergency-info">
            <strong>24/7 Emergency Technical Hotline</strong>
            <span>For critical equipment failures or urgent field support requirements</span>
          </div>
          <div className="sp-emergency-numbers">
            <a href="tel:08064204187">08064204187</a>
            <span className="sp-emergency-divider">|</span>
            <a href="tel:08027779298">08027779298</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;


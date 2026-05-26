import React, { useState } from 'react';
import { ClipboardList, Search, BookOpen, Check, ArrowRight, ShieldAlert, PhoneCall } from 'lucide-react';
import { InputField, CheckboxItem, RadioGroup } from '../components/FormFields';
import { Button } from '../components/Button';
import { InfoCard } from '../components/Card';
import './AfterSalesPage.css';

const SERVICE_TYPES = [
  'Preventive Maintenance',
  'Emergency Breakdown Servicing',
  'Equipment Installation',
  'Calibration & Diagnostic Check',
];

const GUIDES = [
  { id: '1', title: 'Daily Air Compressor Field Checklist', size: 'PDF (2.4 MB)', duration: '5 min read', icon: '📋' },
  { id: '2', title: 'Standard Operating Procedures: Kaeser Dryer Lines', size: 'PDF (4.8 MB)', duration: '12 min read', icon: '📖' },
  { id: '3', title: 'Emergency Troubleshooting for Generator Overheating', size: 'PDF (1.2 MB)', duration: '8 min read', icon: '⚠️' },
];

export const AfterSalesPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'intake' | 'track' | 'library'>('intake');

  // Intake form state
  const [assetId, setAssetId] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Standard');
  const [agreeLogs, setAgreeLogs] = useState(false);
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [successIntakeTicket, setSuccessIntakeTicket] = useState<string | null>(null);

  // Tracker state
  const [ticketSearch, setTicketSearch] = useState('');
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackedTicket, setTrackedTicket] = useState<any>(null);

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId.trim()) {
      alert('Please fill out the Asset ID/Serial Number.');
      return;
    }
    if (!description.trim()) {
      alert('Please fill out the service request description.');
      return;
    }
    if (!agreeLogs) {
      alert('Please authorize dispatch terms to proceed.');
      return;
    }

    setIntakeLoading(true);
    setTimeout(() => {
      setIntakeLoading(false);
      const newTicket = 'MT-' + Math.floor(100000 + Math.random() * 900000);
      setSuccessIntakeTicket(newTicket);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset form
      setAssetId('');
      setDescription('');
      setAgreeLogs(false);
    }, 1500);
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;

    setTrackerLoading(true);
    setTrackedTicket(null);
    setTimeout(() => {
      setTrackerLoading(false);
      const code = ticketSearch.toUpperCase().trim();
      if (code.startsWith('MT-') || code.length >= 5) {
        setTrackedTicket({
          id: code,
          status: 'IN DISPATCH',
          engineer: 'Engr. Emeka Obi (Senior Rotary Specialist)',
          eta: 'Today, 2:30 PM',
          severity: 'High Priority',
          logs: [
            { time: '09:00 AM', text: 'Service ticket received and approved by yard dispatcher.' },
            { time: '10:30 AM', text: 'Rotary engineering kit and spare components logged.' },
            { time: '11:15 AM', text: 'Lead field specialist team dispatched from Lagos yard.' },
            { time: '12:00 PM', text: 'En route via Victoria Island expressway.' },
          ],
        });
      } else {
        setTrackedTicket({
          error: true,
          message: 'Ticket not found. Make sure to input your correct MT ticket number (e.g. MT-824021).',
        });
      }
    }, 1200);
  };

  return (
    <div className="aftersales-page-container">
      <div className="container">
        {/* Header Block */}
        <div className="aftersales-header">
          <h1 className="aftersales-title">Service Intake &amp; After-Sales</h1>
          <p className="aftersales-subtitle">
            Routine calibration, scheduled preventative maintenance contracts, and rapid emergency dispatch alerts.
          </p>
        </div>

        {/* Dynamic page subtabs */}
        <div className="aftersales-tabs-row">
          <button
            className={`subtab-btn ${activeSubTab === 'intake' ? 'subtab-active' : ''}`}
            onClick={() => { setActiveSubTab('intake'); setSuccessIntakeTicket(null); }}
          >
            <ClipboardList size={16} />
            <span>Service Intake Portal</span>
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'track' ? 'subtab-active' : ''}`}
            onClick={() => setActiveSubTab('track')}
          >
            <Search size={16} />
            <span>Track Dispatch Ticket</span>
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'library' ? 'subtab-active' : ''}`}
            onClick={() => setActiveSubTab('library')}
          >
            <BookOpen size={16} />
            <span>Technical Library</span>
          </button>
        </div>

        <div className="aftersales-content-body">
          {/* Subtab 1: Service Intake Form */}
          {activeSubTab === 'intake' && (
            <div className="intake-panel-layout">
              <div className="intake-form-side">
                {successIntakeTicket && (
                  <div className="intake-success-card">
                    <span className="success-badge-icon"><Check size={20} /></span>
                    <h3 className="success-card-title">Intake Submitted Successfully</h3>
                    <p className="success-card-text">
                      Your industrial ticket has been cataloged under <strong>{successIntakeTicket}</strong>. Copy this code to track technical dispatches in real-time.
                    </p>
                    <button 
                      className="success-track-trigger"
                      onClick={() => {
                        setTicketSearch(successIntakeTicket);
                        setActiveSubTab('track');
                        // Trigger immediate track
                        setTimeout(() => {
                          setTrackedTicket({
                            id: successIntakeTicket,
                            status: 'IN DISPATCH',
                            engineer: 'Engr. Emeka Obi (Senior Rotary Specialist)',
                            eta: 'Calculating...',
                            severity: 'Standard',
                            logs: [
                              { time: 'Just now', text: 'Ticket successfully initialized at web portal.' },
                              { time: 'Pending', text: 'Assigning nearest dispatcher in Lagos yard.' }
                            ]
                          });
                        }, 500);
                      }}
                    >
                      Track This Ticket Now →
                    </button>
                  </div>
                )}

                <InfoCard className="form-card-wrapper">
                  <h3 className="form-inner-title">Log a New Support Request</h3>
                  <form onSubmit={handleSubmitIntake}>
                    <InputField
                      label="Asset Serial ID / Machine Tag"
                      placeholder="e.g. SL-185-8294A"
                      value={assetId}
                      onChange={(e) => setAssetId(e.target.value)}
                      required
                    />

                    <RadioGroup
                      label="Requested Service Category"
                      options={SERVICE_TYPES}
                      selected={serviceType}
                      onSelect={setServiceType}
                    />

                    <div style={{ height: '16px' }} />

                    <InputField
                      label="Detailed Symptom / Service Requirements"
                      placeholder="Describe what pressure anomalies, leaks, start failures, or servicing specifications are needed..."
                      multiline
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />

                    <RadioGroup
                      label="Operational Dispatch Urgency"
                      options={['Standard Route', 'High Priority', 'Emergency Site Breakdown']}
                      selected={urgency}
                      onSelect={setUrgency}
                    />

                    <div style={{ height: '16px' }} />

                    <CheckboxItem
                      label="I authorize immediate dispatch of an emergency support technician subject to our active SLA logistics and diagnostic parameters."
                      checked={agreeLogs}
                      onToggle={() => setAgreeLogs(!agreeLogs)}
                    />

                    <div style={{ height: '24px' }} />

                    <Button
                      label="Submit Service Intake Ticket"
                      variant="primary"
                      type="submit"
                      loading={intakeLoading}
                      fullWidth
                    />
                  </form>
                </InfoCard>
              </div>

              {/* Informative side bar */}
              <div className="intake-info-side">
                <InfoCard className="info-guide-card accent-left-orange">
                  <h3 className="guide-side-title">Mandtech Service Standards</h3>
                  <ul className="guide-points-list">
                    <li>
                      <strong>Standard Route:</strong> Responded within 4–6 business hours. Scheduled routinely.
                    </li>
                    <li>
                      <strong>High Priority:</strong> Field specialists dispatched within 2 hours. Active for logistics/production lines.
                    </li>
                    <li>
                      <strong>Emergency Breakdown:</strong> Instant team mobilization. Available 24/7 strictly for contracted SLA partners.
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard className="info-guide-card accent-left-tertiary">
                  <h3 className="guide-side-title">Global Fleet Coverage</h3>
                  <p className="guide-side-desc">
                    Our technical yards house diagnostic rigs, testing calibration meters, and heavy spares parts. Engineers are equipped to manage Atlas Copco, Ingersoll Rand, and Sullair frameworks directly.
                  </p>
                </InfoCard>
              </div>
            </div>
          )}

          {/* Subtab 2: Tracker Panel */}
          {activeSubTab === 'track' && (
            <div className="tracker-panel-layout">
              <InfoCard className="tracker-search-card">
                <h3 className="tracker-card-title">Real-Time Dispatch Tracker</h3>
                <p className="tracker-card-sub">
                  Input your Mandtech Service Ticket ID (MT-xxxxxx) to locate your assigned field engineers and ETA logs.
                </p>
                <form onSubmit={handleTrackTicket} className="tracker-search-row">
                  <div className="tracker-search-input">
                    <Search size={18} className="search-field-icon" />
                    <input
                      type="text"
                      placeholder="e.g. MT-829401"
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="tracker-input-box"
                    />
                  </div>
                  <Button
                    label="Search Dispatch"
                    variant="charcoal"
                    type="submit"
                    loading={trackerLoading}
                  />
                </form>
              </InfoCard>

              {/* Tracker results log */}
              {trackedTicket && !trackedTicket.error && (
                <div className="tracker-results-card">
                  <div className="tracker-results-header">
                    <div>
                      <h4 className="tracker-results-id">TICKET ID: {trackedTicket.id}</h4>
                      <span className="tracker-severity-tag">{trackedTicket.severity}</span>
                    </div>
                    <div className="tracker-status-badge">
                      <span className="tracker-pulse"></span>
                      <span>{trackedTicket.status}</span>
                    </div>
                  </div>

                  <div className="tracker-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Assigned Specialist:</span>
                      <span className="detail-value">{trackedTicket.engineer}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estimated Yard Arrival:</span>
                      <span className="detail-value text-orange-bold">{trackedTicket.eta}</span>
                    </div>
                  </div>

                  {/* Log timeline */}
                  <h4 className="logs-timeline-title">DISPATCH TIME LOGS</h4>
                  <div className="timeline-container">
                    {trackedTicket.logs.map((log: any, idx: number) => (
                      <div key={idx} className="timeline-row">
                        <span className="timeline-time">{log.time}</span>
                        <div className="timeline-bullet-wrapper">
                          <span className="timeline-bullet"></span>
                          {idx < trackedTicket.logs.length - 1 && <span className="timeline-line"></span>}
                        </div>
                        <p className="timeline-text">{log.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error lookup ticket */}
              {trackedTicket && trackedTicket.error && (
                <div className="tracker-error-card">
                  <span className="error-badge-icon"><ShieldAlert size={20} /></span>
                  <p className="error-text-content">{trackedTicket.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Subtab 3: Library Index */}
          {activeSubTab === 'library' && (
            <div className="library-panel-layout">
              <div className="library-left-list">
                <h3 className="library-panel-title">Document Reference Catalog</h3>
                <p className="library-panel-sub">
                  Download preventative maintenance logs, operating specifications, and fluid diagrams.
                </p>

                <div className="guides-list-grid">
                  {GUIDES.map((g) => (
                    <div key={g.id} className="library-guide-card">
                      <div className="guide-icon-wrapper">
                        <span className="guide-icon-emoji">{g.icon}</span>
                      </div>
                      <div className="guide-card-content">
                        <h4 className="guide-card-title">{g.title}</h4>
                        <div className="guide-card-meta">
                          <span>{g.size}</span>
                          <span className="meta-divider">|</span>
                          <span>{g.duration}</span>
                        </div>
                      </div>
                      <button 
                        className="guide-download-btn"
                        onClick={() => alert(`Downloading technical manual: "${g.title}"`)}
                      >
                        Download <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotline panel */}
              <div className="library-right-hotline">
                <InfoCard className="hotline-card-wrapper">
                  <span className="hotline-icon"><PhoneCall size={32} /></span>
                  <h3 className="hotline-card-title">Enterprise Support Hotline</h3>
                  <p className="hotline-card-desc">
                    Need immediate diagnostic assistance over the phone? Contracted SLA partners have 24/7 dedicated access.
                  </p>
                  <span className="hotline-number">+234 (1) 460-7000</span>
                  <p className="hotline-email">support@mandtech.com.ng</p>
                </InfoCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AfterSalesPage;

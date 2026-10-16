import React, { useState } from 'react';
import {
  Calendar, Zap, Shield, Check, Clock, Truck,
  FileCheck, ArrowRight, Activity, Wrench
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import './LeasingPage.css';

// Assets
import heroBg from '../assets/hero_bg.png';
import portableUnit from '../assets/portable_unit.png';
import industrialGenerator from '../assets/industrial_generator.png';
import highCapacity from '../assets/high_capacity.png';
import catalogBg from '../assets/catalog_bg.png';

interface FleetItem {
  id: string;
  title: string;
  category: string;
  image: string;
  availUnits: number;
  specs: string[];
  startingRate: string;
}

const FLEET_ITEMS: FleetItem[] = [
  {
    id: 'lease-comp-185',
    title: 'Sullair 185 CFM Mobile Compressor',
    category: 'Air Compression',
    image: portableUnit,
    availUnits: 4,
    specs: ['185 CFM @ 100 PSI', 'Tier 4 Diesel Engine', 'Towable Trailer Mount'],
    startingRate: '₦185,000 / week',
  },
  {
    id: 'lease-gen-500',
    title: 'Perkins 500 kVA Prime Silent Generator',
    category: 'Power Generation',
    image: industrialGenerator,
    availUnits: 2,
    specs: ['500 kVA / 400 kW', 'Sound-Attenuated Enclosure', 'Auto-Transfer Switch Included'],
    startingRate: '₦620,000 / week',
  },
  {
    id: 'lease-pump-900',
    title: 'High-Flow 900 GPM Dewatering Pump',
    category: 'Fluid Management',
    image: highCapacity,
    availUnits: 3,
    specs: ['900 GPM Flow Capacity', 'Solids Handling up to 3"', 'Diesel Auto-Prime'],
    startingRate: '₦240,000 / week',
  },
  {
    id: 'lease-comp-750',
    title: 'Atlas Copco 750 CFM Heavy-Duty Air End',
    category: 'Air Compression',
    image: catalogBg,
    availUnits: 2,
    specs: ['750 CFM @ 150 PSI', 'Offshore Rig Certified', 'Dual Spark Arrestor'],
    startingRate: '₦480,000 / week',
  },
];

interface LeasingPageProps {
  onNavigateToContact: () => void;
}

export const LeasingPage: React.FC<LeasingPageProps> = ({ onNavigateToContact }) => {
  const { addToInquiry } = useInquiry();

  // Estimator State
  const [calcCategory, setCalcCategory] = useState('Air Compressors');
  const [calcDuration, setCalcDuration] = useState('1-3 Months');
  const [calcHub, setCalcHub] = useState('Lagos VI Yard');
  const [calcUnits, setCalcUnits] = useState(1);
  const [addedItemMsg, setAddedItemMsg] = useState<string | null>(null);

  // Dynamic estimate calculation based on selections
  const calculateRate = () => {
    let base = 250000;
    if (calcCategory === 'Power Generators') base = 650000;
    if (calcCategory === 'Fluid Management Pumps') base = 280000;
    if (calcCategory === 'Desiccant Dryers') base = 220000;

    let discount = 1.0;
    if (calcDuration === '1-3 Months') discount = 0.88;
    if (calcDuration === '3-12 Months') discount = 0.78;
    if (calcDuration === '1+ Year (Project SLA)') discount = 0.68;

    const total = Math.round(base * discount * calcUnits);
    return total.toLocaleString();
  };

  const handleAddEstimateToInquiry = () => {
    const title = `${calcCategory} (${calcUnits}x unit, ${calcDuration} lease at ${calcHub})`;
    addToInquiry({
      id: `lease-est-${Date.now()}`,
      title,
      category: 'Leasing & Rentals',
      type: 'lease',
      specSummary: `Hub: ${calcHub} • Estimated Bracket: ₦${calculateRate()}/mo`,
    });

    setAddedItemMsg(title);
    setTimeout(() => setAddedItemMsg(null), 4000);
  };

  const handleAddFleetToInquiry = (item: FleetItem) => {
    addToInquiry({
      id: item.id,
      title: item.title,
      category: item.category,
      type: 'lease',
      image: item.image,
      specSummary: item.specs.join(' • '),
    });

    setAddedItemMsg(item.title);
    setTimeout(() => setAddedItemMsg(null), 4000);
  };

  return (
    <div className="leasing-page-container">
      {/* Hero */}
      <section className="leasing-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="leasing-hero-overlay" />
        <div className="container leasing-hero-content">
          <div className="leasing-badge">
            <Clock size={14} /> FLEET LEASING &amp; DISPATCH
          </div>
          <h1 className="leasing-hero-title">
            Industrial Equipment Leasing.<br />
            Zero CapEx. 100% Operational Readiness.
          </h1>
          <p className="leasing-hero-desc">
            Deploy tier-1 air compressors, emergency power gensets, and high-volume fluid pumps on flexible project terms. Backed by guaranteed 4-hour swap SLA and certified on-site maintenance.
          </p>
          <div className="leasing-hero-highlights">
            <div className="hero-highlight-pill">
              <Shield size={16} /> 24/7 Field Techs Included
            </div>
            <div className="hero-highlight-pill">
              <Truck size={16} /> Rapid Mobilization in Lagos &amp; PH
            </div>
            <div className="hero-highlight-pill">
              <Zap size={16} /> Load Bank Tested Before Dispatch
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Estimator / Calculator */}
      <section className="container leasing-calculator-section">
        {addedItemMsg && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '14px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#065f46',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <span>✓ Added <strong>{addedItemMsg}</strong> to your Inquiry Ticket.</span>
            <button
              onClick={onNavigateToContact}
              style={{
                background: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Complete Proposal →
            </button>
          </div>
        )}

        <div className="calc-card-wrapper">
          <div className="calc-header-row">
            <div>
              <h2 className="calc-title">Interactive Rental &amp; Lease Estimator</h2>
              <p className="calc-subtitle">Configure operational specifications to obtain immediate monthly bracket estimates.</p>
            </div>
            <span className="calc-hub-badge">
              <Truck size={14} /> Dispatch Hubs: Lagos VI &amp; Port Harcourt
            </span>
          </div>

          <div className="calc-grid-form">
            <div className="calc-field-group">
              <label className="calc-label">Equipment Class</label>
              <select
                value={calcCategory}
                onChange={(e) => setCalcCategory(e.target.value)}
                className="calc-select"
              >
                <option value="Air Compressors">Air Compressors (185 - 1600 CFM)</option>
                <option value="Power Generators">Power Generators (50 - 1250 kVA)</option>
                <option value="Fluid Management Pumps">Fluid Pumps (300 - 1500 GPM)</option>
                <option value="Desiccant Dryers">Desiccant Dryers (200 - 800 CFM)</option>
              </select>
            </div>

            <div className="calc-field-group">
              <label className="calc-label">Lease Duration Term</label>
              <select
                value={calcDuration}
                onChange={(e) => setCalcDuration(e.target.value)}
                className="calc-select"
              >
                <option value="1-4 Weeks (Short-Term Spot)">1–4 Weeks (Short-Term Spot)</option>
                <option value="1-3 Months">1–3 Months (Standard Project)</option>
                <option value="3-12 Months">3–12 Months (Discounted Long-Term)</option>
                <option value="1+ Year (Project SLA)">1+ Year (Dedicated SLA Contract)</option>
              </select>
            </div>

            <div className="calc-field-group">
              <label className="calc-label">Mobilization Yard</label>
              <select
                value={calcHub}
                onChange={(e) => setCalcHub(e.target.value)}
                className="calc-select"
              >
                <option value="Lagos VI Yard">Lagos VI Engineering Annex</option>
                <option value="Port Harcourt Yard">Port Harcourt Trans-Amadi Yard</option>
                <option value="Offshore / Escravos Barge">Offshore Escravos / Bonny Island</option>
              </select>
            </div>

            <div className="calc-field-group">
              <label className="calc-label">Quantity</label>
              <select
                value={calcUnits}
                onChange={(e) => setCalcUnits(Number(e.target.value))}
                className="calc-select"
              >
                <option value={1}>1 Unit</option>
                <option value={2}>2 Units (Redundant Setup)</option>
                <option value={3}>3 Units</option>
                <option value={5}>5+ Units (Fleet Contract)</option>
              </select>
            </div>
          </div>

          <div className="calc-result-strip">
            <div className="calc-price-block">
              <span className="calc-price-label">Estimated Monthly Rate Bracket</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="calc-price-figure">₦{calculateRate()}</span>
                <span className="calc-price-period">/ month (maintenance included)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="calc-cta-btn" onClick={handleAddEstimateToInquiry}>
                Add Estimate to Inquiry Ticket <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Fleet Showcase */}
      <section className="container leasing-fleet-section">
        <div className="section-header-block">
          <span className="section-tag">IMMEDIATE YARD DISPATCH</span>
          <h2 className="section-main-title">Ready-to-Deploy Rental Fleet</h2>
          <p className="section-main-desc">
            All rental machines undergo mandatory 50-point diagnostic checks and full load-banking prior to gate clearance.
          </p>
        </div>

        <div className="fleet-grid">
          {FLEET_ITEMS.map((item) => (
            <div key={item.id} className="fleet-card">
              <div className="fleet-img-wrap">
                <img src={item.image} alt={item.title} className="fleet-img" />
                <span className="fleet-avail-chip">
                  <span className="avail-dot" /> {item.availUnits} Units Ready
                </span>
              </div>
              <div className="fleet-card-body">
                <span className="fleet-card-cat">{item.category}</span>
                <h3 className="fleet-card-title">{item.title}</h3>
                <div className="fleet-specs-list">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="fleet-spec-item">
                      <Activity size={14} /> <span>{spec}</span>
                    </div>
                  ))}
                </div>
                <div className="fleet-card-footer">
                  <div className="fleet-rate-box">
                    <span className="fleet-rate-label">Starting At</span>
                    <span className="fleet-rate-val">{item.startingRate}</span>
                  </div>
                  <button
                    className="fleet-inquire-btn"
                    onClick={() => handleAddFleetToInquiry(item)}
                  >
                    Add to Inquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lease Models Comparison */}
      <section className="lease-models-section">
        <div className="container">
          <div className="section-header-block">
            <span className="section-tag">FLEXIBLE CONTRACTING</span>
            <h2 className="section-main-title">Select Your Leasing Structure</h2>
            <p className="section-main-desc">
              Tailored capital arrangements matching upstream, mining, manufacturing, and construction project lifecycles.
            </p>
          </div>

          <div className="models-grid">
            {/* Spot Rental */}
            <div className="model-card">
              <h3 className="model-name">Spot Rental</h3>
              <span className="model-duration">1 Day to 4 Weeks</span>
              <p className="model-desc">
                Ideal for plant maintenance shutdowns, unexpected equipment outages, or sudden capacity surges.
              </p>
              <div className="model-features">
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Same-day or next-day yard dispatch</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Pre-filled fluid &amp; oil service filters</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>On-site technician for commissioning</span>
                </div>
              </div>
              <button className="model-action-btn" onClick={onNavigateToContact}>
                Book Spot Rental
              </button>
            </div>

            {/* Managed Long-Term Lease (Featured) */}
            <div className="model-card featured-model">
              <span className="featured-pill">MOST POPULAR</span>
              <h3 className="model-name">Managed Project Lease</h3>
              <span className="model-duration">1 to 12 Months</span>
              <p className="model-desc">
                Comprehensive operational lease covering equipment, scheduled preventive servicing, oil analysis, and 4-hour hot-swap SLA.
              </p>
              <div className="model-features">
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Substantial monthly rate discounts</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Mandtech technicians handle all 250h &amp; 500h PMs</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Free equipment exchange if downtime exceeds 4 hours</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>100% OPEX tax deductible</span>
                </div>
              </div>
              <button className="model-action-btn" onClick={onNavigateToContact}>
                Configure Managed Lease
              </button>
            </div>

            {/* Lease to Own */}
            <div className="model-card">
              <h3 className="model-name">Lease-to-Own</h3>
              <span className="model-duration">12 to 36 Months</span>
              <p className="model-desc">
                Spread capital asset purchase over operational milestones with guaranteed buyout equity at contract conclusion.
              </p>
              <div className="model-features">
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Preserve cash reserves for project execution</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Option to purchase or roll into newer models</span>
                </div>
                <div className="model-feat-row">
                  <Check size={16} className="feat-check" /> <span>Full warranty protection during entire term</span>
                </div>
              </div>
              <button className="model-action-btn" onClick={onNavigateToContact}>
                Inquire on Lease-to-Own
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mandtech Fleet Advantage SLA */}
      <section className="container leasing-sla-section">
        <div className="sla-grid">
          <div className="sla-box">
            <div className="sla-icon-wrap"><Wrench size={22} /></div>
            <div>
              <h4 className="sla-title">All Maintenance Included</h4>
              <p className="sla-desc">Our certified engineers perform all routine filter, lubricant, and belt replacements at your job site.</p>
            </div>
          </div>

          <div className="sla-box">
            <div className="sla-icon-wrap"><Truck size={22} /></div>
            <div>
              <h4 className="sla-title">4-Hour Hot Swap SLA</h4>
              <p className="sla-desc">In the rare event of major mechanical failure, replacement units are mobilized from our regional yards immediately.</p>
            </div>
          </div>

          <div className="sla-box">
            <div className="sla-icon-wrap"><FileCheck size={22} /></div>
            <div>
              <h4 className="sla-title">Certified &amp; Calibrated</h4>
              <p className="sla-desc">Every rig arrives with load bank certificates, calibration reports, and lifting gear inspection logs.</p>
            </div>
          </div>

          <div className="sla-box">
            <div className="sla-icon-wrap"><Calendar size={22} /></div>
            <div>
              <h4 className="sla-title">Flexible Demobilization</h4>
              <p className="sla-desc">Extend or demobilize without prohibitive contract penalties as project requirements shift.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="container">
        <div className="leasing-cta-banner">
          <div>
            <h3 className="leasing-cta-title">Need multi-unit fleet mobilization?</h3>
            <p className="leasing-cta-sub">
              Our regional operations directors can prepare turnkey logistics plans, including fuel bladders, telemetry, and dedicated resident mechanics.
            </p>
          </div>
          <button className="leasing-cta-btn" onClick={onNavigateToContact}>
            Speak with Fleet Director
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeasingPage;

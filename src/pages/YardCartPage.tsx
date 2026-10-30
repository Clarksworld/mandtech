import React, { useState, useEffect } from 'react';
import {
  PackageCheck, Truck, MapPin, Search,
  ArrowRight, CheckCircle2, ShieldCheck,
  AlertCircle, ShoppingCart,
  LogIn, UserCheck, RefreshCw, X
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, trackOrder, type OrderRecord } from '../services/api';
import { MandtechLogo } from '../components/Logo';
import './YardCartPage.css';

interface YardCartPageProps {
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onNavigateToCatalog: () => void;
}

export const YardCartPage: React.FC<YardCartPageProps> = ({
  onOpenAuthModal,
  onNavigateToCatalog,
}) => {
  const { inquiryItems, removeFromInquiry, clearInquiry } = useInquiry();
  const { user, isAuthenticated, logout } = useAuth();

  // Tab: 'cart' (Fulfillment & Checkout) vs 'track' (Order Tracking)
  const [activeTab, setActiveTab] = useState<'cart' | 'track'>('cart');

  // Checkout form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [fulfillmentHub, setFulfillmentHub] = useState('Port-Harcourt Yard (Elelenwo Ops)');
  const [notes, setNotes] = useState('');

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderRecord | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Tracking tab states
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Sync user profile if login state updates
  useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.company && !company) setCompany(user.company);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (inquiryItems.length === 0) {
      setCheckoutError('Your yard cart is empty. Please select industrial machinery or spare parts from the catalog.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const res = await createOrder({
        user_id: user?.id || null,
        customer_name: customerName,
        company,
        email,
        phone,
        delivery_address: deliveryAddress,
        fulfillment_hub: fulfillmentHub,
        items: inquiryItems,
        notes: notes.trim() || undefined,
      });

      setOrderSuccess(res.order);
      clearInquiry();
    } catch (err: any) {
      setCheckoutError(err.message || 'Failed to place yard requisition order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setTrackingLoading(true);
    setTrackError(null);
    setTrackedOrder(null);

    try {
      const res = await trackOrder(trackQuery.trim());
      setTrackedOrder(res.order);
    } catch (err: any) {
      setTrackError(err.message || 'Order reference not found.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'order_placed':
        return { label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'confirmed':
        return { label: 'Yard Confirmed', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'processing':
        return { label: 'Staging & QC', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'in_transit':
        return { label: 'In Transit', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="yard-cart-container">
      {/* Top Hero Banner */}
      <div className="yard-hero-banner">
        <div className="container yard-hero-content">
          <div className="yard-hero-text">
            <div className="yard-status-badge">
              <span className="pulse-green-dot"></span>
              <span>YARD OPERATIONS: ONLINE &amp; STAGED</span>
            </div>
            <h1 className="yard-hero-title">Yard Cart &amp; Order Logistics Hub</h1>
            <p className="yard-hero-subtitle">
              Verify your equipment requisition, place delivery reservations, and track dispatch stages directly with our regional operations hubs.
            </p>
          </div>

          {/* User Auth Card Widget */}
          <div className="yard-user-card">
            {isAuthenticated && user ? (
              <div className="yard-user-logged">
                <div className="yard-user-avatar">
                  <UserCheck size={20} />
                </div>
                <div className="yard-user-info">
                  <span className="yard-user-name">{user.name || user.email}</span>
                  <span className="yard-user-sub">{user.company || 'Verified Client'}</span>
                </div>
                <button onClick={logout} className="yard-auth-btn-logout">
                  Logout
                </button>
              </div>
            ) : (
              <div className="yard-user-guest">
                <div className="yard-guest-text">
                  <strong>Corporate Portal Access</strong>
                  <span>Sign in or register to track all requisitions</span>
                </div>
                <div className="yard-guest-actions">
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="yard-auth-btn-login"
                  >
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuthModal('register')}
                    className="yard-auth-btn-register"
                  >
                    <span>Register</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container yard-main-layout">
        {/* Navigation Tabs (Cart & Checkout vs Track Orders) */}
        <div className="yard-tabs-nav">
          <button
            className={`yard-tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            <ShoppingCart size={18} />
            <span>Yard Requisition Cart</span>
            {inquiryItems.length > 0 && (
              <span className="yard-tab-badge">{inquiryItems.length}</span>
            )}
          </button>

          <button
            className={`yard-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Truck size={18} />
            <span>Track Live Order / Shipment</span>
          </button>
        </div>

        {/* TAB 1: CART & CHECKOUT */}
        {activeTab === 'cart' && (
          <div>
            {orderSuccess ? (
              <div className="yard-order-success-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <MandtechLogo height={32} />
                </div>
                <div className="success-icon-wrap">
                  <PackageCheck size={48} />
                </div>
                <h2>Order Successfully Placed!</h2>
                <div className="success-order-number">
                  <span>Tracking Reference ID:</span>
                  <strong>{orderSuccess.id}</strong>
                </div>
                <p className="success-desc">
                  Your yard requisition has been logged. Our dispatch officers at{' '}
                  <strong>{orderSuccess.fulfillment_hub}</strong> are reviewing stock clearance and scheduling mobilization.
                </p>

                <div className="success-actions">
                  <button
                    onClick={() => {
                      setTrackQuery(orderSuccess.id);
                      setActiveTab('track');
                      setTrackedOrder(orderSuccess);
                      setOrderSuccess(null);
                    }}
                    className="btn-track-now"
                  >
                    <Truck size={16} />
                    <span>Track Order Timeline Now</span>
                  </button>
                  <button
                    onClick={() => {
                      setOrderSuccess(null);
                      onNavigateToCatalog();
                    }}
                    className="btn-continue-catalog"
                  >
                    Continue Browsing Machinery
                  </button>
                </div>
              </div>
            ) : (
              <div className="yard-cart-grid">
                {/* Left: Requisition Items */}
                <div className="yard-items-column">
                  <div className="yard-box-header">
                    <div>
                      <h3 className="yard-box-title">Requisition Basket ({inquiryItems.length} items)</h3>
                      <p className="yard-box-sub">Items staged from parts catalog, compressors, and rentals.</p>
                    </div>
                    {inquiryItems.length > 0 && (
                      <button onClick={clearInquiry} className="yard-clear-btn">
                        Clear All
                      </button>
                    )}
                  </div>

                  {inquiryItems.length === 0 ? (
                    <div className="yard-empty-cart">
                      <div className="empty-cart-icon">
                        <ShoppingCart size={40} />
                      </div>
                      <h4>Your Yard Cart is Empty</h4>
                      <p>
                        Explore our OEM parts inventory or industrial compressor fleet to stage items for reservation and quotation.
                      </p>
                      <button onClick={onNavigateToCatalog} className="btn-explore-catalog">
                        Browse Machinery &amp; Parts Catalog →
                      </button>
                    </div>
                  ) : (
                    <div className="yard-items-list">
                      {inquiryItems.map((item) => (
                        <div key={item.id} className="yard-cart-item-card">
                          <div className="item-icon-box">
                            <span className="material-symbols-outlined">
                              {item.type === 'equipment' ? 'precision_manufacturing' : 'build'}
                            </span>
                          </div>
                          <div className="item-content">
                            <div className="item-title-row">
                              <h4 className="item-name">{item.title}</h4>
                              <span className="item-category-pill">{item.category}</span>
                            </div>
                            <div className="item-specs-row">
                              {item.sku && <span>SKU: {item.sku}</span>}
                              {item.brand && <span>Brand: {item.brand}</span>}
                              {item.specSummary && <span>• {item.specSummary}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromInquiry(item.id)}
                            className="item-remove-btn"
                            title="Remove from requisition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}

                      <div className="yard-add-more-row">
                        <button onClick={onNavigateToCatalog} className="btn-add-more">
                          + Add More Spare Parts or Compressors
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Operational Yard Clearance Guarantee */}
                  <div className="yard-assurance-card">
                    <ShieldCheck size={28} />
                    <div>
                      <strong>100% Genuine OEM &amp; Pre-Tested Assurance</strong>
                      <p>
                        All items ordered through Mandtech Services undergo mechanical diagnostics and warranty validation prior to site delivery.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Checkout & Delivery Form */}
                <div className="yard-checkout-column">
                  <div className="yard-checkout-card">
                    <h3 className="checkout-title">Yard Delivery &amp; Requisition Details</h3>
                    <p className="checkout-sub">
                      Complete delivery information to generate an official order reservation and logistics tracking reference.
                    </p>

                    {checkoutError && (
                      <div className="checkout-alert-error">
                        <AlertCircle size={18} />
                        <span>{checkoutError}</span>
                      </div>
                    )}

                    <form onSubmit={handleCheckout} className="checkout-form">
                      <div className="checkout-field">
                        <label>Contact Person Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kolawole Adams"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>

                      <div className="checkout-field">
                        <label>Company / Organization *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dangote Fertilizer Annex"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </div>

                      <div className="checkout-field-row">
                        <div className="checkout-field">
                          <label>Corporate Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="checkout-field">
                          <label>Active Telephone *</label>
                          <input
                            type="tel"
                            required
                            placeholder="08064204187"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="checkout-field">
                        <label>Delivery / Site Address *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Exact plant location, warehouse dock, or offshore staging base..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                      </div>

                      <div className="checkout-field">
                        <label>Preferred Fulfillment Hub</label>
                        <select
                          value={fulfillmentHub}
                          onChange={(e) => setFulfillmentHub(e.target.value)}
                        >
                          <option value="Port-Harcourt Yard (Elelenwo Ops)">
                            Port-Harcourt Yard (42 Old Refinery Rd, Elelenwo)
                          </option>
                          <option value="Lagos Logistics Hub (Oshuketan)">
                            Lagos Logistics Hub (16 Oshuketan St)
                          </option>
                          <option value="Abuja Dispatch Depot (Karsana)">
                            Abuja Dispatch Depot (Camp David Estate, Karsana)
                          </option>
                        </select>
                      </div>

                      <div className="checkout-field">
                        <label>Project Notes / Urgency (Optional)</label>
                        <input
                          type="text"
                          placeholder="CFM requirements, site safety pass needed, delivery timeline..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingOrder || inquiryItems.length === 0}
                        className="btn-place-order"
                      >
                        {submittingOrder ? (
                          <span>Processing Logistics Order...</span>
                        ) : (
                          <>
                            <span>Generate Order &amp; Reserve Yard Stock</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER TRACKING */}
        {activeTab === 'track' && (
          <div className="yard-tracking-view">
            {/* Search Track Form */}
            <div className="track-search-card">
              <div className="track-search-header">
                <div className="track-search-icon">
                  <Truck size={24} />
                </div>
                <div>
                  <h3>Track Equipment &amp; Spares Order</h3>
                  <p>Enter your 6-digit order reference (e.g. ORD-839201) to view staging, dispatch, and delivery timeline.</p>
                </div>
              </div>

              <form onSubmit={handleTrackSubmit} className="track-search-form">
                <div className="track-input-wrap">
                  <Search size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Enter Order Reference (e.g. ORD-839201)..."
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={trackingLoading} className="track-submit-btn">
                  {trackingLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Track Order'}
                </button>
              </form>

              {trackError && (
                <div className="track-error-alert">
                  <AlertCircle size={16} />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Tracked Order Details */}
            {trackedOrder && (
              <div className="tracked-order-results">
                {/* Order Overview Header */}
                <div className="tracked-header-card">
                  <div className="tracked-main-info">
                    <span className="tracked-id-badge">{trackedOrder.id}</span>
                    <h3 className="tracked-client-name">{trackedOrder.company}</h3>
                    <p className="tracked-contact-sub">
                      Contact: {trackedOrder.customer_name} • {trackedOrder.phone} • {trackedOrder.email}
                    </p>
                  </div>

                  <div className="tracked-status-box">
                    <span className="status-label">Current Logistics Status:</span>
                    <span className={`status-pill ${getStatusBadge(trackedOrder.status).color}`}>
                      {getStatusBadge(trackedOrder.status).label}
                    </span>
                    <span className="status-hub-sub">
                      <MapPin size={12} /> {trackedOrder.fulfillment_hub}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="tracked-timeline-card">
                  <h4 className="timeline-title">Live Dispatch &amp; Fulfillment Milestones</h4>
                  <div className="timeline-steps">
                    {trackedOrder.tracking_history && trackedOrder.tracking_history.length > 0 ? (
                      trackedOrder.tracking_history.map((step, idx) => (
                        <div key={idx} className="timeline-step-row active">
                          <div className="step-marker-col">
                            <div className="step-dot">
                              <CheckCircle2 size={16} />
                            </div>
                            {idx < trackedOrder.tracking_history.length - 1 && <div className="step-line" />}
                          </div>
                          <div className="step-body">
                            <div className="step-top-line">
                              <strong className="step-name">{step.label}</strong>
                              <span className="step-time">
                                {new Date(step.time).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {step.location && (
                              <div className="step-location">
                                <MapPin size={12} /> {step.location}
                              </div>
                            )}
                            {step.note && <p className="step-note">{step.note}</p>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-logs">Initial order confirmation logged.</p>
                    )}
                  </div>
                </div>

                {/* Staged Items List */}
                <div className="tracked-items-card">
                  <h4 className="items-title">Dispatched Items ({trackedOrder.items.length})</h4>
                  <div className="tracked-items-grid">
                    {trackedOrder.items.map((it, i) => (
                      <div key={i} className="tracked-item-pill">
                        <span className="material-symbols-outlined item-pill-icon">inventory_2</span>
                        <div className="item-pill-info">
                          <strong>{it.title}</strong>
                          <span>{it.category} {it.sku ? `• SKU: ${it.sku}` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

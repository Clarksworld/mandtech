const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mandtech-backend-rho.vercel.app';

export interface InquiryPayload {
  name: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
  equipment_interests?: string[];
  newsletter_opt_in?: boolean;
}

export interface InquiryResponse {
  message: string;
  data: {
    id: string;
    name: string;
    company: string;
    email: string;
    created_at: string;
  };
}

export interface TicketPayload {
  asset_serial_id: string;
  service_type: string;
  description: string;
  urgency: 'Standard Route' | 'High Priority' | 'Emergency Site Breakdown';
  authorize_dispatch: boolean;
}

export interface TicketResponse {
  message: string;
  ticket_id: string;
}

export interface TrackedTicket {
  id: string;
  asset_serial_id: string;
  service_type: string;
  description: string;
  urgency: string;
  status: string;
  assigned_engineer: string | null;
  eta: string | null;
  created_at: string;
  logs: Array<{ time: string; text: string }>;
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Failed to submit inquiry (${res.status})`);
  }
  return res.json();
}

export async function submitServiceTicket(payload: TicketPayload): Promise<TicketResponse> {
  const res = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Failed to submit service ticket (${res.status})`);
  }
  return res.json();
}

export async function trackServiceTicket(ticketId: string): Promise<TrackedTicket> {
  const res = await fetch(`${API_BASE_URL}/api/tickets/${encodeURIComponent(ticketId.trim())}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Ticket not found. Make sure to input your correct MT ticket number (e.g. MT-824021).');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchProducts(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/products${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchParts(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/parts${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch parts');
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE_URL}/api/documents`);
  if (!res.ok) throw new Error('Failed to fetch technical documents');
  return res.json();
}

export interface CompressorRequestPayload {
  compressor_type: 'ELECTRIC AIR COMPRESSOR' | 'DIESEL AIR COMPRESSOR';
  brand: 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR';
  condition?: 'NEW' | 'USED';
  company_name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface CompressorRequestResponse {
  message: string;
  data: {
    id: string;
    compressor_type: string;
    brand: string;
    company_name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
  };
}

export async function submitCompressorRequest(payload: CompressorRequestPayload): Promise<CompressorRequestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/compressor-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Failed to submit compressor request (${res.status})`);
  }
  return res.json();
}

export interface SparePartsRequestPayload {
  brand: 'ATLAS COPCO' | 'SULLAIR' | 'INGERSOLL RAND' | 'DENAIR';
  part_name: string;
  company_name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface SparePartsRequestResponse {
  message: string;
  data: {
    id: string;
    brand: string;
    part_name: string;
    company_name: string;
    email: string;
    phone: string;
    notes?: string;
    status: string;
    created_at: string;
  };
}

export async function submitSparePartsRequest(payload: SparePartsRequestPayload): Promise<SparePartsRequestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/spare-parts-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Failed to submit spare parts request (${res.status})`);
  }
  return res.json();
}


export interface LeasingRequestPayload {
  compressor_type: string;
  brand: string;
  duration: string;
  hub: string;
  company_name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface LeasingRequestResponse {
  message: string;
  data: {
    id: string;
    compressor_type: string;
    brand: string;
    duration: string;
    hub: string;
    company_name: string;
    email: string;
    phone: string;
    status: string;
    notes?: string;
    created_at: string;
  };
}

export async function submitLeasingRequest(payload: LeasingRequestPayload): Promise<LeasingRequestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/leasing-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Failed to submit leasing request (${res.status})`);
  }
  return res.json();
}

export interface LubricantRequestPayload {
  brand: string;
  fluid_type: string;
  volume: string;
  hub: string;
  company_name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface LubricantRequestResponse {
  message: string;
  data: {
    id: string;
    brand: string;
    fluid_type: string;
    volume: string;
    hub: string;
    company_name: string;
    email: string;
    phone: string;
    status: string;
    notes?: string;
    created_at: string;
  };
}

export async function submitLubricantRequest(payload: LubricantRequestPayload): Promise<LubricantRequestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/lubricant-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Failed to submit lubricant quotation request (${res.status})`);
  }
  return res.json();
}


// ── Customer Auth & Order Management ──────────────────────
export interface CustomerUser {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  role: string;
}

export interface AuthSuccessResponse {
  message: string;
  token: string;
  user: CustomerUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  company: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TrackingStep {
  status: string;
  label: string;
  time: string;
  location?: string;
  note?: string;
}

export interface OrderItem {
  id: string | number;
  title: string;
  category: string;
  type: string;
  quantity?: number;
  sku?: string;
  brand?: string;
  specSummary?: string;
}

export interface OrderRecord {
  id: string;
  user_id?: string | null;
  customer_name: string;
  company: string;
  email: string;
  phone: string;
  delivery_address: string;
  fulfillment_hub: string;
  items: OrderItem[];
  subtotal: number;
  status: 'order_placed' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_history: TrackingStep[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  user_id?: string | null;
  customer_name: string;
  company: string;
  email: string;
  phone: string;
  delivery_address: string;
  fulfillment_hub?: string;
  items: OrderItem[];
  subtotal?: number;
  notes?: string;
}

export async function registerCustomer(payload: RegisterPayload): Promise<AuthSuccessResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Registration failed');
  }
  return res.json();
}

export async function loginCustomer(payload: LoginPayload): Promise<AuthSuccessResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Invalid email or password');
  }
  return res.json();
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ message: string; order: OrderRecord }> {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Failed to place order');
  }
  return res.json();
}

export async function trackOrder(orderId: string): Promise<{ order: OrderRecord }> {
  const res = await fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(orderId.trim().toUpperCase())}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Order ${orderId} not found`);
  }
  return res.json();
}

export async function fetchUserOrders(email?: string, userId?: string): Promise<{ orders: OrderRecord[] }> {
  const query = new URLSearchParams();
  if (email) query.append('email', email);
  if (userId) query.append('user_id', userId);
  const res = await fetch(`${API_BASE_URL}/api/orders/user/history?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

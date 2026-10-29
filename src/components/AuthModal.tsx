import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMsg('Logged in successfully!');
      } else {
        await register({ email, password, name, company, phone });
        setSuccessMsg('Customer account created successfully!');
      }

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccessMsg(null);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-modal-badge">
            {mode === 'login' ? 'CUSTOMER ACCESS' : 'NEW CLIENT PORTAL'}
          </div>
          <button className="auth-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="auth-modal-title-wrap">
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Sign in to Yard Portal' : 'Register Yard Account'}
          </h2>
          <p className="auth-modal-sub">
            {mode === 'login'
              ? 'Access real-time order tracking, fleet contracts, and yard requisitions.'
              : 'Register your engineering firm to track orders, manage yard logistics, and checkout.'}
          </p>
        </div>

        {error && (
          <div className="auth-modal-alert auth-error">
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-modal-alert auth-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {mode === 'register' && (
            <>
              <div className="auth-input-group">
                <label>Contact Person Full Name</label>
                <div className="auth-input-wrap">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolawole Adams"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Company / Organization</label>
                <div className="auth-input-wrap">
                  <Building size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dangote Fertilizer Logistics"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Active Telephone / WhatsApp</label>
                <div className="auth-input-wrap">
                  <Phone size={16} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08064204187"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-input-group">
            <label>Corporate Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Customer Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          {mode === 'login' ? (
            <p>
              Don't have a registered account yet?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

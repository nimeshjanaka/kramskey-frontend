import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return setError('Email is required');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">CRAMSKEY</div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, marginBottom: 8 }}>CHECK YOUR EMAIL</div>
            <div style={{ color: 'var(--text3)', fontSize: 13, lineHeight: 1.6 }}>
              We sent a password reset link to<br />
              <strong style={{ color: 'var(--text1)' }}>{email}</strong>
            </div>
          </div>
          <Link to="/signin">
            <button className="btn-secondary" style={{ marginTop: 20 }}>BACK TO SIGN IN</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">CRAMSKEY</div>
        <div className="auth-subtitle">Machine Monitor</div>
        <div className="auth-heading">Reset Password</div>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 20 }}>
          Enter your email and we'll send you a reset link.
        </p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SENDING...' : 'SEND RESET LINK'}
        </button>

        <div className="auth-footer">
          <Link to="/signin" className="auth-link">← Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
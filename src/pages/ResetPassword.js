import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/signin'), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-screen">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22 }}>PASSWORD RESET!</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 8 }}>Redirecting to sign in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">CRAMSKEY</div>
        <div className="auth-heading">New Password</div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Repeat new password"
            value={form.confirmPassword}
            onChange={e => { setForm(p => ({ ...p, confirmPassword: e.target.value })); setError(''); }}
          />
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SAVING...' : 'SET NEW PASSWORD'}
        </button>

        <div className="auth-footer">
          <Link to="/signin" className="auth-link">← Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
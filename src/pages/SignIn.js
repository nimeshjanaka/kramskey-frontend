import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signin } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁 NEW

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.email.trim() || !form.password.trim())
      return setError('Email and password are required');

    setLoading(true);
    try {
      const data = await signin(form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">CRAMSKEY</div>
        <div className="auth-subtitle">Machine Monitor</div>
        <div className="auth-heading">Sign In</div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            name="email"
            type="email"
            placeholder="john@company.com"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          {/* Password wrapper for show/hide */}
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
                color: 'var(--text3)',
                padding: 0,
                lineHeight: 1,
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>

        <div className="auth-footer" style={{ marginTop: 8 }}>
          No account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
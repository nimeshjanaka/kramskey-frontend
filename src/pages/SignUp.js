import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: '', companyId: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return setError('Full name is required');
    if (!form.companyId.trim()) return setError('Company ID is required');
    if (!form.email.trim()) return setError('Email is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      const data = await signup({ fullName: form.fullName, companyId: form.companyId, email: form.email, password: form.password });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">CRAMSKEY</div>
        <div className="auth-subtitle">Machine Monitor</div>
        <div className="auth-heading">Create Account</div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" name="fullName" placeholder="John Silva" value={form.fullName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Company ID *</label>
          <input className="form-input" name="companyId" placeholder="EMP-001" value={form.companyId} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className="form-input" name="email" type="email" placeholder="john@company.com" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <input className="form-input" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password *</label>
          <input className="form-input" name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
        </div>

        <div className="auth-note">
          💡 The first person to sign up becomes the <strong>Lead Mechanic</strong> automatically.
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMachine } from '../services/api';

export default function AddMachine() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ machineName: '', machineNumber: '', machineType: '', status: 'operational' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.machineName.trim()) return setError('Please enter machine name');
    if (!form.machineNumber.trim()) return setError('Please enter machine number');
    if (!form.machineType.trim()) return setError('Please enter machine type');
    setLoading(true);
    try {
      await createMachine(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header">
        <button className="header-back" onClick={() => navigate('/')}>←</button>
        <div className="header-title">ADD MACHINE</div>
        <button className="btn-icon" onClick={() => navigate('/')} title="Dashboard" style={{ marginLeft: 'auto' }}>🏠</button>
      </div>

      <div className="page">
        <div className="section-label" style={{ marginBottom: 20 }}>Machine Information</div>

        <div className="form-group">
          <label className="form-label">Machine Name *</label>
          <input className="form-input" name="machineName" placeholder="e.g. Main Compressor A" value={form.machineName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Machine Number *</label>
          <input className="form-input" name="machineNumber" placeholder="e.g. MCH-001" value={form.machineNumber} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Machine Type *</label>
          <input className="form-input" name="machineType" placeholder="e.g. CNC Machine, Lathe, Compressor..." value={form.machineType} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Initial Status</label>
          <div className="status-selector">
            {['operational', 'breakdown', 'maintenance'].map(s => (
              <button
                key={s}
                type="button"
                className={`status-btn ${form.status === s ? s === 'operational' ? 'active-op' : s === 'breakdown' ? 'active-bd' : 'active-mt' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, status: s }))}
              >
                {s === 'operational' ? '✓ Operational' : s === 'breakdown' ? '✕ Breakdown' : '⚙ Maintenance'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 13, fontFamily: 'IBM Plex Mono', marginBottom: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px' }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SAVING...' : 'ADD MACHINE'}
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>CANCEL</button>
      </div>
    </>
  );
}
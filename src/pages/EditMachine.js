import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMachine, updateMachine } from '../services/api';

export default function EditMachine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ machineName: '', machineNumber: '', machineType: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMachine(id)
      .then(m => {
        setForm({ machineName: m.machineName, machineNumber: m.machineNumber, machineType: m.machineType });
      })
      .catch(() => setError('Failed to load machine'))
      .finally(() => setFetching(false));
  }, [id]);

  if (fetching) return <div className="loading" style={{ marginTop: 80 }}>LOADING...</div>;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.machineName.trim()) return setError('Machine name is required');
    if (!form.machineNumber.trim()) return setError('Machine number is required');
    if (!form.machineType.trim()) return setError('Machine type is required');
    setLoading(true);
    try {
      await updateMachine(id, form);
      navigate(`/machine/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header">
        <button className="header-back" onClick={() => navigate(`/machine/${id}`)}>←</button>
        <div className="header-title">EDIT MACHINE</div>
        <button className="btn-icon" onClick={() => navigate('/')} title="Dashboard" style={{ marginLeft: 'auto' }}>🏠</button>
      </div>

      <div className="page">
        <div className="section-label" style={{ marginBottom: 20 }}>Edit Machine Details</div>

        <div className="form-group">
          <label className="form-label">Machine Name *</label>
          <input className="form-input" name="machineName" value={form.machineName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Machine Number *</label>
          <input className="form-input" name="machineNumber" value={form.machineNumber} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Machine Type *</label>
          <input className="form-input" name="machineType" value={form.machineType} onChange={handleChange} />
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 13, fontFamily: 'IBM Plex Mono', marginBottom: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px' }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
        <button className="btn-secondary" onClick={() => navigate(`/machine/${id}`)}>CANCEL</button>
      </div>
    </>
  );
}
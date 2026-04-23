import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMachine, updateMachine } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EditMachine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState({ machineName: '', machineNumber: '', machineType: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [machine, setMachineState] = useState(null);

  useEffect(() => {
    getMachine(id)
      .then(m => {
        setMachineState(m);
        // Check if current user is the creator
        if (m.createdBy && m.createdBy._id !== user?._id) {
          setError('You can only edit machines you created');
          setTimeout(() => navigate(`/machine/${id}`), 2000);
        } else {
          setForm({ machineName: m.machineName, machineNumber: m.machineNumber, machineType: m.machineType });
        }
      })
      .catch(() => setError('Failed to load machine'))
      .finally(() => setFetching(false));
  }, [id, user, navigate]);

  if (fetching) return <div className="loading" style={{ marginTop: 80 }}>LOADING...</div>;
  
  if (error && !fetching) {
    return (
      <div className="page" style={{ marginTop: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🚫</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, marginTop: 12 }}>ACCESS DENIED</div>
        <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 8 }}>{error}</div>
        <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate(`/machine/${id}`)}>GO BACK</button>
      </div>
    );
  }

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
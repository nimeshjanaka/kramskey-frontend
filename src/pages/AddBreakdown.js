import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachine, addBreakdown } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AddBreakdown() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [machine, setMachine] = useState(null);
  const [note, setNote] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());
  const fileInputRef = useRef();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getMachine(id).then(setMachine).catch(() => {});
  }, [id]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    setImages(prev => [...prev, ...toAdd]);
    if (files.length > remaining) setError(`Max 5 images. Added ${toAdd.length}.`);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!note.trim()) return setError('Please enter a breakdown note');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('note', note);
      images.forEach(img => formData.append('images', img));
      await addBreakdown(id, formData);
      navigate(`/machine/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => date.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <>
      <div className="header">
        <button className="header-back" onClick={() => navigate(`/machine/${id}`)}>←</button>
        <div>
          <div className="header-title">REPORT BREAKDOWN</div>
          {machine && <div className="header-sub">{machine.machineName}</div>}
        </div>
        <button className="btn-icon" onClick={() => navigate('/')} title="Dashboard" style={{ marginLeft: 'auto' }}>🏠</button>
      </div>

      <div className="page">
        <div className="form-group">
          <label className="form-label">📅 Date & Time (Automatic)</label>
          <div className="datetime-display"><span>🕐</span><span>{formatDateTime(now)}</span></div>
        </div>

        <div className="form-group">
          <label className="form-label">Reported By</label>
          <div className="datetime-display">
            <span>👤</span>
            <span>{user?.fullName} ({user?.companyId})</span>
          </div>
        </div>

        {machine && (
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 1 }}>{machine.machineName}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>#{machine.machineNumber} · {machine.machineType}</div>
            </div>
            <div className={`status-badge ${machine.status}`}>{machine.status}</div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Breakdown Note *</label>
          <textarea
            className="form-textarea"
            placeholder="Describe what happened, symptoms, what stopped working..."
            value={note}
            onChange={e => { setNote(e.target.value); setError(''); }}
            rows={5}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photos ({images.length}/5)</label>
          {images.length < 5 && (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageSelect} />
              <div className="img-upload-area" onClick={() => fileInputRef.current.click()}>
                <div className="img-upload-icon">📷</div>
                <div className="img-upload-text">Tap to add photos</div>
                <div className="img-upload-sub">{5 - images.length} remaining · JPG, PNG, HEIC</div>
              </div>
            </>
          )}
          {previews.length > 0 && (
            <div className="img-preview-grid">
              {previews.map((src, i) => (
                <div key={i} className="img-preview-item">
                  <img src={src} alt={`preview ${i + 1}`} />
                  <button className="img-remove-btn" onClick={() => removeImage(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 13, fontFamily: 'IBM Plex Mono', marginBottom: 12 }}>⚠ {error}</div>
        )}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SUBMITTING...' : '⚠ SUBMIT BREAKDOWN REPORT'}
        </button>
        <button className="btn-secondary" onClick={() => navigate(`/machine/${id}`)}>CANCEL</button>
      </div>
    </>
  );
}
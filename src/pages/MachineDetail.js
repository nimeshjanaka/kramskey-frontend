import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachine, updateStatus, deleteMachine, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MachineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [lightbox, setLightbox] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = async () => {
    try {
      const data = await getMachine(id);
      setMachine(data);
    } catch {
      showToast('Failed to load machine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusChange = async (status) => {
    try {
      await updateStatus(id, status);
      setMachine(prev => ({ ...prev, status }));
      showToast('Status updated');
    } catch {
      showToast('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this machine and all its records?')) return;
    try {
      await deleteMachine(id);
      navigate('/');
    } catch (err) {
      showToast(err.message);
    }
  };

  if (loading) return <div className="loading" style={{ marginTop: 80 }}>LOADING...</div>;
  if (!machine) return <div className="loading" style={{ marginTop: 80 }}>NOT FOUND</div>;

  const statusBtnClass = (s) => {
    if (machine.status !== s) return 'status-btn';
    if (s === 'operational') return 'status-btn active-op';
    if (s === 'breakdown') return 'status-btn active-bd';
    return 'status-btn active-mt';
  };

  return (
    <>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close">✕</button>
          <img src={lightbox} alt="breakdown" />
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}

      <div className="header">
        <button className="header-back" onClick={() => navigate('/')}>←</button>
        <div>
          <div className="header-title">{machine.machineName}</div>
          <div className="header-sub" style={{ fontSize: 10 }}>#{machine.machineNumber}</div>
        </div>
        <button className="btn-icon" onClick={() => navigate('/')} title="Dashboard" style={{ marginLeft: 'auto' }}>🏠</button>
      </div>

      <div className="page">
        <div className="machine-detail-header">
          <div className="machine-detail-name">{machine.machineName}</div>
          <div className="machine-detail-num">Machine No. {machine.machineNumber}</div>
          <div className="machine-type-tag">{machine.machineType}</div>
          
          {machine.createdBy && (
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, fontFamily: 'IBM Plex Mono' }}>
              Added by: {machine.createdBy.fullName}
            </div>
          )}
          
          <hr className="divider" style={{ marginTop: 12, marginBottom: 12 }} />
          <div className="section-label">Update Status</div>
          <div className="status-selector">
            <button className={statusBtnClass('operational')} onClick={() => handleStatusChange('operational')}>✓ Operational</button>
            <button className={statusBtnClass('breakdown')} onClick={() => handleStatusChange('breakdown')}>✕ Breakdown</button>
            <button className={statusBtnClass('maintenance')} onClick={() => handleStatusChange('maintenance')}>⚙ Maintenance</button>
          </div>
          <div className="machine-meta" style={{ marginTop: 16 }}>
            <span>📅</span>
            <span>Last updated: {new Date(machine.updatedAt).toLocaleString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}</span>
          </div>
        </div>

        <button className="add-breakdown-btn" onClick={() => navigate(`/machine/${id}/breakdown`)}>
          ⚠ ADD BREAKDOWN REPORT
        </button>

        <button className="btn-secondary" style={{ marginBottom: 12 }} onClick={() => navigate(`/machine/${id}/edit`)}>
          ✏ EDIT MACHINE DETAILS
        </button>

        <div className="section-label">Breakdown History ({machine.breakdowns?.length || 0})</div>

        {!machine.breakdowns || machine.breakdowns.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <div className="empty-icon">✅</div>
            <div className="empty-text">NO BREAKDOWNS REPORTED</div>
          </div>
        ) : (
          machine.breakdowns.map((bd, i) => (
            <div key={bd._id || i} className="breakdown-item">
              <div className="breakdown-date">
                <span>📅</span>
                <span>{new Date(bd.createdAt).toLocaleString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}</span>
              </div>
              {bd.addedByName && (
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--accent)', marginBottom: 6 }}>
                  🔧 {bd.addedByName}
                </div>
              )}
              <div className="breakdown-note">{bd.note}</div>
              {bd.images && bd.images.length > 0 && (
                <div className="breakdown-imgs">
                  {bd.images.map((img, j) => (
                    <div key={j} className="breakdown-img" onClick={() => setLightbox(getImageUrl(img))}>
                      <img src={getImageUrl(img)} alt={`breakdown ${j + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        <hr className="divider" />

        <button className="btn-secondary" onClick={handleDelete} style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
          🗑 DELETE MACHINE
        </button>
      </div>
    </>
  );
}
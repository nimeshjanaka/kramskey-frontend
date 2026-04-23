import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, updateUserRole } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TeamManagement() {
  const navigate = useNavigate();
  const { user: currentUser, isLeadMechanic } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    if (!isLeadMechanic) return;
    getUsers()
      .then(setUsers)
      .catch(() => showToast('Failed to load users'))
      .finally(() => setLoading(false));
  }, [isLeadMechanic]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'mechanic' ? 'lead_mechanic' : 'mechanic';
    if (!window.confirm(`Change this person to ${newRole === 'lead_mechanic' ? 'Lead Mechanic' : 'Mechanic'}?`)) return;
    try {
      const updated = await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: updated.role } : u));
      showToast('Role updated');
    } catch (err) {
      showToast(err.message);
    }
  };

  if (!isLeadMechanic) {
    return (
      <div className="page" style={{ marginTop: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🚫</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, marginTop: 12 }}>ACCESS DENIED</div>
        <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>GO BACK</button>
      </div>
    );
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="header">
        <button className="header-back" onClick={() => navigate('/')}>←</button>
        <div className="header-title">TEAM</div>
        <button className="btn-icon" onClick={() => navigate('/')} title="Dashboard" style={{ marginLeft: 'auto' }}>🏠</button>
      </div>

      <div className="page">
        <div className="section-label" style={{ marginBottom: 16 }}>
          All Members ({users.length})
        </div>

        {loading ? (
          <div className="loading">LOADING...</div>
        ) : (
          users.map(u => (
            <div key={u._id} className="breakdown-item" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 17, letterSpacing: 0.5 }}>
                    {u.fullName}
                    {u._id === currentUser._id && (
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text3)', marginLeft: 8 }}>(you)</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                    {u.email} · {u.companyId}
                  </div>
                </div>
                <span className={`role-badge ${u.role}`}>
                  {u.role === 'lead_mechanic' ? '⭐ Lead' : '🔧 Mech'}
                </span>
              </div>

              {u._id !== currentUser._id && (
                <button
                  className="btn-secondary"
                  style={{ marginTop: 10, fontSize: 11, padding: '6px 12px' }}
                  onClick={() => toggleRole(u._id, u.role)}
                >
                  {u.role === 'mechanic' ? '↑ Promote to Lead' : '↓ Demote to Mechanic'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
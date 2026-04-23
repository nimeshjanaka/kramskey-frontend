import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMachines, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout, isLeadMechanic } = useAuth();

  const fetchMachines = useCallback(async () => {
    try {
      const data = await getMachines(search);
      setMachines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchMachines, 300);
    return () => clearTimeout(timer);
  }, [fetchMachines]);

  const counts = {
    total: machines.length,
    breakdown: machines.filter(m => m.status === 'breakdown').length,
    operational: machines.filter(m => m.status === 'operational').length,
  };

  // Avatar src for header
  const avatarSrc = user?.profilePicture ? getImageUrl(user.profilePicture) : null;

  return (
    <>
      <div className="header">
        {/* Clickable logo → goes to dashboard (home) */}
        <div
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          title="Dashboard"
        >
          <div className="header-logo">CRAMSKEY</div>
          <div className="header-sub">Machine Monitor</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
          {isLeadMechanic && (
            <button
              className="btn-icon"
              onClick={() => navigate('/team')}
              title="Manage Team"
            >
              👥
            </button>
          )}

          {/* Profile button — shows avatar thumbnail if set */}
          <button
            className="btn-icon"
            onClick={() => navigate('/profile')}
            title="Profile"
            style={{
              overflow: 'hidden',
              padding: avatarSrc ? 0 : undefined,
            }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              '👤'
            )}
          </button>

          <button
            className="btn-icon"
            onClick={logout}
            title="Sign Out"
            style={{ color: 'var(--danger)' }}
          >
            ⏻
          </button>
        </div>
      </div>

      <div className="page">
        {/* User greeting */}
        <div className="user-greeting">
          <span>👋 {user?.fullName}</span>
          <span className={`role-badge ${user?.role}`}>
            {user?.role === 'lead_mechanic' ? '⭐ Lead Mechanic' : '🔧 Mechanic'}
          </span>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num orange">{counts.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-num red">{counts.breakdown}</div>
            <div className="stat-label">Down</div>
          </div>
          <div className="stat-card">
            <div className="stat-num green">{counts.operational}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Search machine name, type, number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* List */}
        <div className="section-label">
          {search ? `Results for "${search}"` : 'All Machines'}
        </div>

        {loading ? (
          <div className="loading">LOADING...</div>
        ) : machines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚙️</div>
            <div className="empty-text">
              {search ? 'NO MACHINES FOUND' : 'NO MACHINES ADDED YET'}
            </div>
          </div>
        ) : (
          machines.map(machine => (
            <div
              key={machine._id}
              className="machine-card"
              onClick={() => navigate(`/machine/${machine._id}`)}
            >
              <div className="machine-card-top">
                <div>
                  <div className="machine-name">{machine.machineName}</div>
                  <div className="machine-num">#{machine.machineNumber}</div>
                </div>
                <div className={`status-badge ${machine.status}`}>{machine.status}</div>
              </div>
              <div className="machine-type-tag">{machine.machineType}</div>
              <div className="machine-meta">
                <span>🕐</span>
                <span>{new Date(machine.updatedAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}</span>
                <span className="breakdown-count">
                  {machine.breakdowns?.length || 0} report{machine.breakdowns?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Only lead mechanic can add machines */}
      {isLeadMechanic && (
        <button className="fab" onClick={() => navigate('/add-machine')}>
          ＋ ADD MACHINE
        </button>
      )}
    </>
  );
}
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar, getImageUrl } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const data = await uploadAvatar(file);
      login(localStorage.getItem('cramskey_token'), { ...user, profilePicture: data.profilePicture });
      showToast('Profile picture updated!');
    } catch (err) {
      showToast('Upload failed: ' + err.message);
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = avatarPreview || (user?.profilePicture ? getImageUrl(user.profilePicture) : null);

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="header">
        <button className="header-back" onClick={() => navigate('/')}>←</button>
        <div className="header-title">PROFILE</div>
        <button className="btn-icon" onClick={() => navigate('/')} title="Dashboard" style={{ marginLeft: 'auto' }}>🏠</button>
      </div>

      <div className="page">
        <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <div
              onClick={handleAvatarClick}
              style={{
                width: 88, height: 88, borderRadius: '50%',
                background: avatarSrc ? 'transparent' : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: avatarSrc ? 0 : 36, cursor: 'pointer',
                overflow: 'hidden', border: '3px solid var(--accent)', position: 'relative',
              }}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : '👤'}
              <div style={{
                position: 'absolute', inset: 0,
                background: uploading ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'background 0.2s',
              }}>
                {uploading && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'white' }}>...</span>}
              </div>
            </div>
            <div
              onClick={handleAvatarClick}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--bg4)', border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, cursor: 'pointer',
              }}
            >✏️</div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
            Tap photo to change
          </div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: 1 }}>{user?.fullName}</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{user?.email}</div>
          <div style={{ marginTop: 10 }}>
            <span className={`role-badge ${user?.role}`} style={{ fontSize: 13, padding: '4px 14px' }}>
              {user?.role === 'lead_mechanic' ? '⭐ Lead Mechanic' : '🔧 Mechanic'}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 24 }}>
          {[
            { label: 'Full Name', value: user?.fullName },
            { label: 'Company ID', value: user?.companyId },
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role === 'lead_mechanic' ? 'Lead Mechanic' : 'Mechanic' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text3)' }}>{row.label}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--text1)' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <button
          className="btn-secondary"
          style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
          onClick={() => { logout(); navigate('/signin'); }}
        >
          ⏻ SIGN OUT
        </button>
      </div>
    </>
  );
}
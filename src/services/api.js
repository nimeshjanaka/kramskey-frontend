const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('cramskey_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// ── AUTH ──────────────────────────────────────────────
export const signup = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Signup failed');
  return json;
};

export const signin = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Signin failed');
  return json;
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Reset failed');
  return json;
};

// ── USERS ─────────────────────────────────────────────
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${BASE_URL}/users/${id}/role`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ role })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update role');
  return json;
};

// ── AVATAR ────────────────────────────────────────────
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${BASE_URL}/auth/upload-avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json;
};

// ── MACHINES ──────────────────────────────────────────
export const getMachines = async (search = '') => {
  const res = await fetch(`${BASE_URL}/machines?search=${encodeURIComponent(search)}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Failed to fetch machines');
  return res.json();
};

export const getMachine = async (id) => {
  const res = await fetch(`${BASE_URL}/machines/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Failed to fetch machine');
  return res.json();
};

export const createMachine = async (data) => {
  const res = await fetch(`${BASE_URL}/machines`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create machine');
  return json;
};

export const updateMachine = async (id, data) => {
  const res = await fetch(`${BASE_URL}/machines/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update machine');
  return json;
};

export const addBreakdown = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/machines/${id}/breakdown`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add breakdown');
  return json;
};

export const updateStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/machines/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const deleteMachine = async (id) => {
  const res = await fetch(`${BASE_URL}/machines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Failed to delete machine');
  return res.json();
};

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const serverBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
  return `${serverBase}${path}`;
};
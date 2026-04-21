const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getMachines = async (search = '') => {
  const res = await fetch(`${BASE_URL}/machines?search=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error('Failed to fetch machines');
  return res.json();
};

export const getMachine = async (id) => {
  const res = await fetch(`${BASE_URL}/machines/${id}`);
  if (!res.ok) throw new Error('Failed to fetch machine');
  return res.json();
};

export const createMachine = async (data) => {
  const res = await fetch(`${BASE_URL}/machines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create machine');
  }
  return res.json();
};

export const addBreakdown = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/machines/${id}/breakdown`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add breakdown');
  }
  return res.json();
};

export const updateStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/machines/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const deleteMachine = async (id) => {
  const res = await fetch(`${BASE_URL}/machines/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete machine');
  return res.json();
};

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const serverBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
  return `${serverBase}${path}`;
};
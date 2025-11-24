const API_BASE = 'http://localhost:3000/api';

const api = {
  // Helper to attach JWT token
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }),

  // Auth Routes
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  registerSuper: async (data) => {
    const res = await fetch(`${API_BASE}/auth/register-super`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Vendor Hierarchy Routes
  getHierarchy: async () => {
    const res = await fetch(`${API_BASE}/vendor/hierarchies`, {
      headers: api.getHeaders()
    });
    return res.json();
  },

  createSubVendor: async (data) => {
    const res = await fetch(`${API_BASE}/vendor/create-subvendor`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  delegate: async (data) => {
    const res = await fetch(`${API_BASE}/vendor/delegate`, {
      method: 'PATCH',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Fleet Routes
  onboardDriver: async (data) => {
    const res = await fetch(`${API_BASE}/fleet/onboard-driver`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  addVehicle: async (data) => {
    const res = await fetch(`${API_BASE}/fleet/add-vehicle`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getVehicles: async () => {
    const res = await fetch(`${API_BASE}/fleet/vehicles`, {
      headers: api.getHeaders()
    });
    return res.json();
  },

  uploadDocument: async (data) => {
    const res = await fetch(`${API_BASE}/fleet/upload-doc`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export default api;
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

// ─── helpers ────────────────────────────────────────────────────────────────

function authHeaders() {
  const token = sessionStorage.getItem('api_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', accept: 'application/json' };
}

// ─── GET /api/v1/services ────────────────────────────────────────────────────
// Returns a list of all active services available for subscription.
// [{ name, display_name, description }]
export async function getServices() {
  const res = await axios.get(`${API_URL}/services`, { headers: authHeaders() });
  return res.data;
}

// ─── GET /api/v1/services/{service_name}/status ──────────────────────────────
// Check whether the authenticated user has subscribed to a specific service.
// { name, display_name, is_subscribed, is_enabled, is_expired }
export async function getServiceStatus(serviceName) {
  const res = await axios.get(`${API_URL}/services/${serviceName}/status`, { headers: authHeaders() });
  return res.data;
}

// ─── POST /api/v1/services/{service_name}/subscribe ──────────────────────────
// Subscribe the authenticated user to a service with auto-generated credentials.
// Returns { service_name, client_id, client_secret, message }
export async function subscribeToService(serviceName) {
  const res = await axios.post(`${API_URL}/services/${serviceName}/subscribe`, {}, { headers: authHeaders() });
  return res.data;
}

// api.js - Centralized API service (mirrors Android's Retrofit interface)
const API_BASE = 'http://localhost:3000/api';

const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  async login(email, password) {
    return await fetchJSON(`${API_BASE}/auth/login`, 'POST', { email, password });
  },

  async register(userData) {
    return await fetchJSON(`${API_BASE}/auth/register`, 'POST', userData);
  },

  // ── Users / Profiles ──────────────────────────────────────────────────────
  async getMyProfile() {
    return await fetchJSON(`${API_BASE}/users/profile`, 'GET', null, getToken());
  },

  async updateProfile(data) {
    return await fetchJSON(`${API_BASE}/users/profile`, 'PUT', data, getToken());
  },

  async searchRoommates(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await fetchJSON(`${API_BASE}/users/search?${params}`, 'GET', null, getToken());
  },

  async getUserById(id) {
    return await fetchJSON(`${API_BASE}/users/${id}`, 'GET', null, getToken());
  },

  // ── Contacts ──────────────────────────────────────────────────────────────
  async sendContactRequest(receiver_id, message = '') {
    return await fetchJSON(`${API_BASE}/contacts/request`, 'POST', { receiver_id, message }, getToken());
  },

  async getContactRequests() {
    return await fetchJSON(`${API_BASE}/contacts/requests`, 'GET', null, getToken());
  },

  async respondToRequest(requestId, status) {
    return await fetchJSON(`${API_BASE}/contacts/request/${requestId}`, 'PUT', { status }, getToken());
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function fetchJSON(url, method, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function getToken() {
  return sessionStorage.getItem('rc_token');
}

function saveSession(token, user) {
  sessionStorage.setItem('rc_token', token);
  sessionStorage.setItem('rc_user', JSON.stringify(user));
}

function getUser() {
  const u = sessionStorage.getItem('rc_user');
  return u ? JSON.parse(u) : null;
}

function logout() {
  sessionStorage.removeItem('rc_token');
  sessionStorage.removeItem('rc_user');
  window.location.href = 'index.html';
}

function requireAuth() {
  if (!getToken()) window.location.href = 'index.html';
}

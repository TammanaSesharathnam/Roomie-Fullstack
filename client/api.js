// ─── Roomie Connect API Client v2.0 ──────────────────────────────
// Auto-detect: works on browser, emulator, and real phone
const API_BASE = (() => {
  const host = window.location.hostname;
  // Emulator
  if (host === '10.0.2.2')   return 'http://10.0.2.2:3000/api';
  // Browser on PC
  if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:3000/api';
  // Real phone — use whatever host the page loaded from
  return `http://${host}:3000/api`;
})();

function getToken() { return localStorage.getItem('rc_token'); }
function getUser()  { try { return JSON.parse(localStorage.getItem('rc_user')); } catch(e) { return null; } }
function saveSession(token, user) {
  localStorage.setItem('rc_token', token);
  localStorage.setItem('rc_user', JSON.stringify(user));
}
function logout() {
  localStorage.removeItem('rc_token');
  localStorage.removeItem('rc_user');
  window.location.href = 'index.html';
}
function requireAuth() { if (!getToken()) window.location.href = 'index.html'; }

async function fetchJSON(url, method='GET', body=null, token=null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(url, opts);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

const api = {
  // ── Auth ──────────────────────────────────────────────────────
  login:    (email, password) => fetchJSON(`${API_BASE}/auth/login`,   'POST', { email, password }),
  register: (data)            => fetchJSON(`${API_BASE}/auth/register`, 'POST', data),

  // ── Users ─────────────────────────────────────────────────────
  getMyProfile:    ()     => fetchJSON(`${API_BASE}/users/profile`,                          'GET',  null, getToken()),
  updateProfile:   (data) => fetchJSON(`${API_BASE}/users/profile`,                          'PUT',  data, getToken()),
  searchRoommates: (p={}) => fetchJSON(`${API_BASE}/users/search?${new URLSearchParams(p)}`, 'GET',  null, getToken()),
  getUserById:     (id)   => fetchJSON(`${API_BASE}/users/${id}`,                            'GET',  null, getToken()),

  // ── Photo upload ──────────────────────────────────────────────
  uploadPhoto: async (file) => {
    const form = new FormData();
    form.append('photo', file);
    const res  = await fetch(`${API_BASE}/users/upload-photo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: form
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },

  // ── Contacts ──────────────────────────────────────────────────
  sendContactRequest: (receiver_id, message) => fetchJSON(`${API_BASE}/contacts/request`,    'POST', { receiver_id, message }, getToken()),
  getContactRequests: ()           => fetchJSON(`${API_BASE}/contacts/requests`,              'GET',  null, getToken()),
  getSentRequests:    ()           => fetchJSON(`${API_BASE}/contacts/sent`,                  'GET',  null, getToken()),
  getConnections:     ()           => fetchJSON(`${API_BASE}/contacts/connections`,           'GET',  null, getToken()),
  respondToRequest:   (id, status) => fetchJSON(`${API_BASE}/contacts/request/${id}`,        'PUT',  { status }, getToken()),

  // ── Messages ──────────────────────────────────────────────────
  getMessages: (userId)          => fetchJSON(`${API_BASE}/messages/${userId}`,              'GET',  null,        getToken()),
  sendMessage: (userId, message) => fetchJSON(`${API_BASE}/messages/${userId}`,              'POST', { message }, getToken()),

  // ── Notifications ─────────────────────────────────────────────
  getNotifications: ()   => fetchJSON(`${API_BASE}/notifications`,            'GET', null, getToken()),
  markAllRead:      ()   => fetchJSON(`${API_BASE}/notifications/read`,       'PUT', null, getToken()),
  markOneRead:      (id) => fetchJSON(`${API_BASE}/notifications/${id}/read`, 'PUT', null, getToken()),

  // ── Block / Report ────────────────────────────────────────────
  blockUser:   (blocked_id)          => fetchJSON(`${API_BASE}/blocks/block`,  'POST',   { blocked_id },          getToken()),
  unblockUser: (blocked_id)          => fetchJSON(`${API_BASE}/blocks/unblock`,'DELETE', { blocked_id },          getToken()),
  getBlocked:  ()                    => fetchJSON(`${API_BASE}/blocks/list`,   'GET',    null,                    getToken()),
  reportUser:  (reported_id, reason) => fetchJSON(`${API_BASE}/blocks/report`, 'POST',   { reported_id, reason }, getToken()),

  // ── Forgot Password ───────────────────────────────────────────
  forgotPassword: (email)                  => fetchJSON(`${API_BASE}/forgot/request`, 'POST', { email }),
  resetPassword:  (email, token, password) => fetchJSON(`${API_BASE}/forgot/reset`,   'POST', { email, token, password }),
};
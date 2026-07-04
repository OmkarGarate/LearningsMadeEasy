// API client with automatic JWT refresh
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ACCESS_KEY = 'bm:access';
const REFRESH_KEY = 'bm:refresh';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

let isRefreshing = false;
let refreshPromise = null;

async function refreshTokens() {
  const refresh = tokenStore.getRefresh();
  if (!refresh) throw new Error('No refresh token');
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) {
    tokenStore.clear();
    throw new Error('Refresh failed');
  }
  const data = await res.json();
  tokenStore.set(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function apiFetch(path, options = {}) {
  const makeRequest = async (token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  let res = await makeRequest(tokenStore.getAccess());
  if (res.status === 401) {
    const data = await res.clone().json().catch(() => ({}));
    if (data.code === 'TOKEN_EXPIRED' && tokenStore.getRefresh()) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshTokens().finally(() => { isRefreshing = false; });
        }
        const newAccess = await refreshPromise;
        res = await makeRequest(newAccess);
      } catch (err) {
        tokenStore.clear();
        throw err;
      }
    }
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const error = new Error(err.error || 'Request failed');
    error.status = res.status;
    error.data = err;
    throw error;
  }
  return res.json();
}

export const api = {
  // Auth — direct code
  loginWithCode: (code) => apiFetch('/auth/code', { method: 'POST', body: JSON.stringify({ code }) }),
  logout: (refreshToken) => apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  getMe: () => apiFetch('/auth/me'),

  // AI tutor
  aiChat: (messages, conceptId) => apiFetch('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, conceptId }),
  }),

  // Progress
  toggleConcept: (conceptId) => apiFetch(`/user/progress/${conceptId}/toggle`, { method: 'POST' }),

  // MCQ answers
  recordMcqAnswer: ({ conceptId, mcqId, selected, correct }) =>
    apiFetch('/user/mcq/answer', { method: 'POST', body: JSON.stringify({ conceptId, mcqId, selected, correct }) }),

  // Problem solved
  markProblemSolved: (conceptId, problemTitle) =>
    apiFetch('/user/problem/solved', { method: 'POST', body: JSON.stringify({ conceptId, problemTitle }) }),

  // Notes
  setNote: (conceptId, text) => apiFetch(`/user/notes/${conceptId}`, { method: 'PUT', body: JSON.stringify({ text }) }),

  // Preferences
  setPreferences: (prefs) => apiFetch('/user/preferences', { method: 'PUT', body: JSON.stringify(prefs) }),

  // Badges
  syncBadges: (badges) => apiFetch('/user/badges/sync', { method: 'POST', body: JSON.stringify({ badges }) }),
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('neuroblitz_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  signup: (name, email, password) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  getScores: () => request('/scores'),
  saveScore: (gameId, score) =>
    request(`/scores/${gameId}`, { method: 'POST', body: JSON.stringify({ score }) }),
  syncScores: (scores) =>
    request('/scores/sync', { method: 'POST', body: JSON.stringify({ scores }) })
}
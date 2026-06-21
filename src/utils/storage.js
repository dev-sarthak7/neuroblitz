const KEY = 'neuroblitz_scores'

export function loadScores() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveScores(scores) {
  try {
    localStorage.setItem(KEY, JSON.stringify(scores))
  } catch {}
}
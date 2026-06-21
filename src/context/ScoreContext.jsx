import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { loadScores, saveScores } from '../utils/storage'
import { useAuth } from './AuthContext'
import { api } from '../utils/api'

const ScoreContext = createContext()

export function ScoreProvider({ children }) {
  const { user } = useAuth()
  const [scores, setScores] = useState(loadScores)
  const hasSynced = useRef(false)

  // save to localStorage always (guest fallback + offline cache)
  useEffect(() => {
    saveScores(scores)
  }, [scores])

  // when user logs in, sync local scores to DB then pull merged scores back
  useEffect(() => {
    if (!user || hasSynced.current) return
    hasSynced.current = true

    const localScores = loadScores()
    const hasLocal = Object.keys(localScores).length > 0

    const syncPromise = hasLocal ? api.syncScores(localScores) : Promise.resolve()

    syncPromise
      .then(() => api.getScores())
      .then(dbScores => setScores(dbScores))
      .catch(() => {})
  }, [user])

  // reset sync flag on logout so next login re-syncs
  useEffect(() => {
    if (!user) hasSynced.current = false
  }, [user])

  async function updateScore(gameId, newScore) {
    setScores(prev => ({
      ...prev,
      [gameId]: {
        best: Math.max(newScore, prev[gameId]?.best || 0),
        last: newScore,
        plays: (prev[gameId]?.plays || 0) + 1,
        lastPlayed: new Date().toISOString()
      }
    }))

    if (user) {
      try { await api.saveScore(gameId, newScore) } catch {}
    }
  }

  return (
    <ScoreContext.Provider value={{ scores, updateScore }}>
      {children}
    </ScoreContext.Provider>
  )
}

export function useScoreContext() {
  return useContext(ScoreContext)
}
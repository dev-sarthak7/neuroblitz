import { useEffect, useState } from 'react'
import { useScoreContext } from '../context/ScoreContext'
import { GAMES } from '../utils/gameConfig'
import styles from './Dashboard.module.css'

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    let raf
    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function Dashboard() {
  const { scores } = useScoreContext()

  const totalPlaysTarget = Object.values(scores).reduce((acc, s) => acc + (s?.plays || 0), 0)
  const totalScoreTarget = Object.values(scores).reduce((acc, s) => acc + (s?.best || 0), 0)
  const gamesPlayed = Object.keys(scores).length

  const totalPlays = useCountUp(totalPlaysTarget)
  const totalScore = useCountUp(totalScoreTarget)

  return (
    <main className={styles.main}>
      <div className={styles.statusPill}>
        <span className={styles.dot} />
        PERFORMANCE LOG
      </div>
      <h1 className={styles.heading}>Your Dashboard</h1>

      <div className={styles.statRow}>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statNum}>{totalPlays}</span>
          <span className={styles.statLabel}>Total Plays</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statNum}>{totalScore}</span>
          <span className={styles.statLabel}>Total Best Score</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statNum}>{gamesPlayed} / {GAMES.length}</span>
          <span className={styles.statLabel}>Games Tried</span>
        </div>
      </div>

      <h2 className={styles.subheading}>Game Stats</h2>
      <div className={`${styles.table} glass-panel`}>
        <div className={styles.tableHeader}>
          <span>Game</span>
          <span>Best Score</span>
          <span>Last Score</span>
          <span>Plays</span>
          <span>Last Played</span>
        </div>
        {GAMES.map(game => {
          const s = scores[game.id]
          return (
            <div key={game.id} className={styles.tableRow}>
              <span className={styles.gameName}>
                <span className={styles.gameIcon}>{game.icon}</span>
                {game.title}
              </span>
              <span className={s ? styles.best : styles.empty}>{s ? s.best : '—'}</span>
              <span className={styles.muted}>{s ? s.last : '—'}</span>
              <span className={styles.muted}>{s ? s.plays : '—'}</span>
              <span className={styles.date}>
                {s ? new Date(s.lastPlayed).toLocaleDateString() : '—'}
              </span>
            </div>
          )
        })}
      </div>

      {totalPlaysTarget === 0 && (
        <p className={styles.emptyState}>No games played yet. Go play something.</p>
      )}
    </main>
  )
}
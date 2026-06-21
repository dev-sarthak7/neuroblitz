import { GAMES } from '../utils/gameConfig'
import GameCard from '../components/GameCard'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.statusPill}>
        <span className={styles.dot} />
        SYSTEM ONLINE
      </div>
      <div className={styles.hero}>
        <h1>Train your brain.</h1>
        <p>5 games targeting memory, speed, attention, and focus.</p>
      </div>
      <div className={styles.grid}>
        {GAMES.map(g => <GameCard key={g.id} game={g} />)}
      </div>
    </main>
  )
}
import { useNavigate } from 'react-router-dom'
import { useScoreContext } from '../context/ScoreContext'
import styles from './GameCard.module.css'

export default function GameCard({ game }) {
  const navigate = useNavigate()
  const { scores } = useScoreContext()
  const s = scores[game.id]

  return (
    <div className={`${styles.card} glass-panel`} onClick={() => navigate(game.path)} style={{ '--accent-color': game.color }}>
      <div className={styles.iconWrap}>
        <span className={styles.icon}>{game.icon}</span>
      </div>
      <h3 className={styles.title}>{game.title}</h3>
      <p className={styles.desc}>{game.description}</p>
      <span className={styles.skill}>{game.skill}</span>
      {s && <div className={styles.best}>Best <strong>{s.best}</strong></div>}
    </div>
  )
}
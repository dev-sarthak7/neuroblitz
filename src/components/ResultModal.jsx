import styles from './ResultModal.module.css'

export default function ResultModal({ score, best, onReplay, onHome }) {
  const isNewBest = score >= best
  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass-panel`}>
        {isNewBest && <div className={styles.newBest}>NEW BEST</div>}
        <h2>Round Complete</h2>
        <div className={styles.scoreDisplay}>{score}</div>
        <p className={styles.bestLabel}>Best: {best}</p>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={onReplay}>Play Again</button>
          <button className={styles.secondary} onClick={onHome}>Home</button>
        </div>
      </div>
    </div>
  )
}
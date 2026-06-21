import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScoreContext } from '../../context/ScoreContext'
import ResultModal from '../../components/ResultModal'
import styles from './NBack.module.css'

const LETTERS = 'BCDFGHJKLMNPQRSTVWXYZ'.split('')
const TOTAL_TRIALS = 20
const INTERVAL = 2500
const N = 2

export default function NBack() {
  const navigate = useNavigate()
  const { scores, updateScore } = useScoreContext()

  const [phase, setPhase] = useState('idle')
  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState('')
  const [trial, setTrial] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [responded, setResponded] = useState(false)
  const historyRef = useRef([])
  const trialRef = useRef(0)
  const scoreRef = useRef(0)
  const respondedRef = useRef(false)
  const intervalRef = useRef(null)

  function startGame() {
    historyRef.current = []; trialRef.current = 0; scoreRef.current = 0
    setHistory([]); setTrial(0); setScore(0)
    setFeedback(null); setShowModal(false); setResponded(false)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    intervalRef.current = setInterval(() => {
      if (trialRef.current >= TOTAL_TRIALS) {
        clearInterval(intervalRef.current)
        setPhase('done')
        updateScore('nback', scoreRef.current)
        setShowModal(true)
        return
      }
      const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)]
      setCurrent(letter)
      setFeedback(null)
      setResponded(false)
      respondedRef.current = false
      historyRef.current = [...historyRef.current, letter]
      setHistory([...historyRef.current])
      trialRef.current += 1
      setTrial(trialRef.current)
    }, INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [phase])

  function handleMatch() {
    if (respondedRef.current || phase !== 'playing') return
    respondedRef.current = true
    setResponded(true)
    const h = historyRef.current
    const isMatch = h.length > N && h[h.length - 1] === h[h.length - 1 - N]
    if (isMatch) {
      scoreRef.current += 15
      setScore(scoreRef.current)
      setFeedback('correct')
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 5)
      setScore(scoreRef.current)
      setFeedback('wrong')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.stats}>
          <span>Trial <strong>{trial}</strong>/{TOTAL_TRIALS}</span>
          <span>Score <strong>{score}</strong></span>
          <span>N = <strong>{N}</strong></span>
        </div>
      </div>

      <div className={styles.arena}>
        {phase === 'idle' && (
          <div className={styles.center}>
            <h2>🧠 N-Back</h2>
            <p>Letters appear one by one. Press <strong>Match</strong> if the current letter matches the one from <strong>{N} steps ago</strong>.</p>
            <p className={styles.hint}>+15 for correct match, −5 for false alarm.</p>
            <button className={styles.startBtn} onClick={startGame}>Start Game</button>
          </div>
        )}

        {phase === 'playing' && (
          <div className={styles.center}>
            <p className={styles.sub}>Does this match {N} steps back?</p>
            <div className={`${styles.letterBox} glass-panel`}>{current}</div>
            <div className={styles.historyRow}>
              {history.slice(-6).map((l, i) => (
                <span key={i} className={i === history.slice(-6).length - 1 ? styles.histCurrent : styles.histItem}>{l}</span>
              ))}
            </div>
            {feedback && (
              <div className={feedback === 'correct' ? styles.correct : styles.wrong}>
                {feedback === 'correct' ? '✓ Correct match! +15' : '✗ Wrong! −5'}
              </div>
            )}
            <button
              className={`${styles.matchBtn} ${responded ? styles.matchUsed : ''}`}
              onClick={handleMatch}
              disabled={responded}
            >
              {responded ? 'Responded' : '⚡ Match!'}
            </button>
            <p className={styles.hint}>Or wait if it's not a match.</p>
          </div>
        )}
      </div>

      {showModal && (
        <ResultModal
          score={score}
          best={scores['nback']?.best || score}
          onReplay={startGame}
          onHome={() => navigate('/')}
        />
      )}
    </div>
  )
}
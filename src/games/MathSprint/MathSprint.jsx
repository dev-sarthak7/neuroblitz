import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScoreContext } from '../../context/ScoreContext'
import ResultModal from '../../components/ResultModal'
import styles from './MathSprint.module.css'

const TIME = 60

function generateQuestion(level) {
  const ops = level < 3 ? ['+', '-'] : ['+', '-', '*']
  const op = ops[Math.floor(Math.random() * ops.length)]
  const max = level < 3 ? 10 : level < 5 ? 20 : 50
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  const answer = op === '+' ? a + b : op === '-' ? a - b : a * b
  return { question: `${a} ${op} ${b}`, answer }
}

export default function MathSprint() {
  const navigate = useNavigate()
  const { scores, updateScore } = useScoreContext()

  const [phase, setPhase] = useState('idle')
  const [timeLeft, setTimeLeft] = useState(TIME)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [current, setCurrent] = useState(null)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  function startGame() {
    setScore(0); setStreak(0); setLevel(1)
    setTimeLeft(TIME); setShowModal(false)
    setCurrent(generateQuestion(1))
    setInput(''); setFeedback(null)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); endGame(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function endGame() {
    setPhase('done')
    setShowModal(true)
    updateScore('math-sprint', score)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (phase !== 'playing' || !current) return
    const val = parseInt(input.trim(), 10)
    if (isNaN(val)) return
    if (val === current.answer) {
      const newStreak = streak + 1
      const newLevel = Math.floor(newStreak / 5) + 1
      const pts = 10 + newStreak * 2
      setScore(s => s + pts)
      setStreak(newStreak)
      setLevel(newLevel)
      setFeedback('correct')
      setCurrent(generateQuestion(newLevel))
    } else {
      setStreak(0)
      setFeedback('wrong')
    }
    setInput('')
    setTimeout(() => { setFeedback(null); inputRef.current?.focus() }, 400)
  }

  const pct = (timeLeft / TIME) * 100
  const timerColor = timeLeft > 20 ? 'var(--success)' : timeLeft > 10 ? 'var(--warning)' : 'var(--danger)'

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.stats}>
          <span>Score <strong>{score}</strong></span>
          <span>Streak <strong>{streak}</strong></span>
          <span>Level <strong>{level}</strong></span>
        </div>
      </div>

      <div className={styles.arena}>
        {phase === 'idle' && (
          <div className={styles.center}>
            <h2>➕ Math Sprint</h2>
            <p>Solve as many equations as possible in 60 seconds.</p>
            <p className={styles.hint}>Streak bonuses unlock harder questions.</p>
            <button className={styles.startBtn} onClick={startGame}>Start Game</button>
          </div>
        )}

        {phase === 'playing' && current && (
          <div className={styles.center}>
            <div className={styles.timerBar}>
              <div className={styles.timerFill} style={{ width: `${pct}%`, background: timerColor }} />
            </div>
            <div className={styles.timerNum} style={{ color: timerColor }}>{timeLeft}s</div>
            <div className={styles.question}>{current.question} = ?</div>
            <div className={feedback ? (feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong) : styles.feedbackHidden}>
              {feedback === 'correct' ? '✓' : feedback === 'wrong' ? '✗' : '·'}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                type="number"
                placeholder="answer..."
                autoComplete="off"
              />
            </form>
          </div>
        )}
      </div>

      {showModal && (
        <ResultModal
          score={score}
          best={scores['math-sprint']?.best || score}
          onReplay={startGame}
          onHome={() => navigate('/')}
        />
      )}
    </div>
  )
}
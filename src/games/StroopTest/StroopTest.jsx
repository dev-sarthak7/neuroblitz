import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScoreContext } from '../../context/ScoreContext'
import ResultModal from '../../components/ResultModal'
import { STROOP_COLORS } from '../../utils/gameConfig'
import styles from './StroopTest.module.css'

const ROUNDS = 15
const TIME_PER_ROUND = 3000

function getQuestion() {
  const ink = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  let word = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  while (word.name === ink.name) word = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  return { word: word.name, inkColor: ink.hex, inkName: ink.name }
}

export default function StroopTest() {
  const navigate = useNavigate()
  const { scores, updateScore } = useScoreContext()

  const [phase, setPhase] = useState('idle')
  const [question, setQuestion] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND)
  const [showModal, setShowModal] = useState(false)
  const timerRef = useRef(null)
  const roundRef = useRef(0)
  const scoreRef = useRef(0)

  function startGame() {
    setScore(0); setStreak(0); setRound(0)
    roundRef.current = 0; scoreRef.current = 0
    setShowModal(false)
    loadRound(0)
  }

  function loadRound(r) {
    if (r >= ROUNDS) { endGame(); return }
    setQuestion(getQuestion())
    setFeedback(null)
    setTimeLeft(TIME_PER_ROUND)
    setRound(r)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 100) {
          clearInterval(timerRef.current)
          handleAnswer(null)
          return 0
        }
        return t - 100
      })
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [phase, round])

  function endGame() {
    setPhase('done')
    updateScore('stroop-test', scoreRef.current)
    setShowModal(true)
  }

  function handleAnswer(colorName) {
    clearInterval(timerRef.current)
    if (phase !== 'playing') return
    setPhase('feedback')
    const correct = colorName === question.inkName
    if (correct) {
      const bonus = Math.floor(timeLeft / 500)
      const pts = 10 + bonus
      scoreRef.current += pts
      setScore(s => s + pts)
      setStreak(s => s + 1)
      setFeedback('correct')
    } else {
      setStreak(0)
      setFeedback('wrong')
    }
    setTimeout(() => loadRound(roundRef.current + 1), 800)
    roundRef.current += 1
  }

  const pct = (timeLeft / TIME_PER_ROUND) * 100

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.stats}>
          <span>Round <strong>{round + 1}</strong>/{ROUNDS}</span>
          <span>Score <strong>{score}</strong></span>
          <span>Streak <strong>{streak}</strong></span>
        </div>
      </div>

      <div className={styles.arena}>
        {phase === 'idle' && (
          <div className={styles.center}>
            <h2>🎨 Stroop Test</h2>
            <p>Click the <strong>ink color</strong> of the word — not what it says!</p>
            <p className={styles.hint}>Faster answers give bonus points.</p>
            <button className={styles.startBtn} onClick={startGame}>Start Game</button>
          </div>
        )}

        {(phase === 'playing' || phase === 'feedback') && question && (
          <div className={styles.center}>
            <div className={styles.timerBar}>
              <div className={styles.timerFill} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.word} style={{ color: question.inkColor }}>
              {question.word}
            </div>
            {feedback && (
              <div className={feedback === 'correct' ? styles.correct : styles.wrong}>
                {feedback === 'correct' ? '✓ Correct!' : `✗ It was ${question.inkName}`}
              </div>
            )}
            <div className={styles.choices}>
              {STROOP_COLORS.map(c => (
                <button
                  key={c.name}
                  className={styles.choiceBtn}
                  style={{ '--btn-color': c.hex }}
                  onClick={() => handleAnswer(c.name)}
                  disabled={phase === 'feedback'}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ResultModal
          score={score}
          best={scores['stroop-test']?.best || score}
          onReplay={startGame}
          onHome={() => navigate('/')}
        />
      )}
    </div>
  )
}
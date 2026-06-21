import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScoreContext } from '../../context/ScoreContext'
import { useScore } from '../../hooks/useScore'
import ResultModal from '../../components/ResultModal'
import { FLASH_WORDS } from '../../utils/gameConfig'
import styles from './FlashType.module.css'

const ROUNDS = 10

export default function FlashType() {
  const navigate = useNavigate()
  const { scores, updateScore } = useScoreContext()
  const { score, streak, level, addPoints, breakStreak, reset } = useScore()

  const [phase, setPhase] = useState('idle') // idle | show | type | result | done
  const [currentWord, setCurrentWord] = useState('')
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [round, setRound] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const showDuration = Math.max(400, 1600 - (level - 1) * 150)

  function startGame() {
    reset()
    setRound(0)
    setShowModal(false)
    nextRound(0)
  }

  function nextRound(currentRound) {
    if (currentRound >= ROUNDS) {
      setPhase('done')
      setShowModal(true)
      return
    }
    const word = FLASH_WORDS[Math.floor(Math.random() * FLASH_WORDS.length)]
    setCurrentWord(word)
    setInput('')
    setFeedback(null)
    setRound(currentRound)
    setPhase('show')
  }

  useEffect(() => {
    if (phase === 'show') {
      timerRef.current = setTimeout(() => {
        setPhase('type')
        setTimeout(() => inputRef.current?.focus(), 50)
      }, showDuration)
    }
    return () => clearTimeout(timerRef.current)
  }, [phase, showDuration])

  useEffect(() => {
    if (phase === 'done') {
      updateScore('flash-type', score)
      setShowModal(true)
    }
  }, [phase])

  function handleSubmit(e) {
    e.preventDefault()
    if (phase !== 'type') return
    const correct = input.trim().toLowerCase() === currentWord
    if (correct) { addPoints(10); setFeedback('correct') }
    else { breakStreak(); setFeedback('wrong') }
    setPhase('result')
    setTimeout(() => nextRound(round + 1), 1000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.stats}>
          <span>Round <strong>{round + 1}</strong>/{ROUNDS}</span>
          <span>Score <strong>{score}</strong></span>
          <span>Streak <strong>{streak}</strong></span>
          <span>Level <strong>{level}</strong></span>
        </div>
      </div>

      <div className={styles.arena}>
        {phase === 'idle' && (
          <div className={styles.center}>
            <h2>⚡ Flash Type</h2>
            <p>A word will flash briefly. Type it before it vanishes!</p>
            <p className={styles.hint}>Speed increases every 3 correct answers.</p>
            <button className={styles.startBtn} onClick={startGame}>Start Game</button>
          </div>
        )}

        {phase === 'show' && (
          <div className={styles.center}>
            <p className={styles.roundLabel}>Round {round + 1}</p>
            <div className={styles.flashWord}>{currentWord}</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ animationDuration: `${showDuration}ms` }} />
            </div>
          </div>
        )}

        {phase === 'type' && (
          <div className={styles.center}>
            <p className={styles.typePrompt}>What was the word?</p>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="type here..."
                autoComplete="off"
              />
            </form>
          </div>
        )}

        {phase === 'result' && (
          <div className={styles.center}>
            <div className={feedback === 'correct' ? styles.correct : styles.wrong}>
              {feedback === 'correct' ? `✓ Correct! +${10 + (streak - 1) * 2} pts` : `✗ It was "${currentWord}"`}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ResultModal
          score={score}
          best={scores['flash-type']?.best || score}
          onReplay={startGame}
          onHome={() => navigate('/')}
        />
      )}
    </div>
  )
}
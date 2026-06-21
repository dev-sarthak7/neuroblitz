import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScoreContext } from '../../context/ScoreContext'
import ResultModal from '../../components/ResultModal'
import styles from './SequenceGrid.module.css'

const GRID_SIZE = 9
const BASE_DELAY = 600

export default function SequenceGrid() {
  const navigate = useNavigate()
  const { scores, updateScore } = useScoreContext()

  const [phase, setPhase] = useState('idle')
  const [sequence, setSequence] = useState([])
  const [userInput, setUserInput] = useState([])
  const [activeTile, setActiveTile] = useState(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [feedback, setFeedback] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const timeoutRefs = useRef([])

  function clearTimeouts() { timeoutRefs.current.forEach(clearTimeout) }

  function startGame() {
    setScore(0); setLevel(1); setLives(3)
    setShowModal(false); setFeedback(null)
    beginLevel(1, [])
  }

  function beginLevel(lvl, prevSeq) {
    const newTile = Math.floor(Math.random() * GRID_SIZE)
    const newSeq = [...prevSeq, newTile]
    setSequence(newSeq)
    setUserInput([])
    setPhase('watching')
    playSequence(newSeq)
  }

  function playSequence(seq) {
    clearTimeouts()
    const delay = Math.max(300, BASE_DELAY - (seq.length * 20))
    seq.forEach((tile, i) => {
      const t1 = setTimeout(() => setActiveTile(tile), i * (delay + 200))
      const t2 = setTimeout(() => setActiveTile(null), i * (delay + 200) + delay)
      timeoutRefs.current.push(t1, t2)
    })
    const done = setTimeout(() => setPhase('input'), seq.length * (delay + 200) + 300)
    timeoutRefs.current.push(done)
  }

  function handleTileClick(idx) {
    if (phase !== 'input') return
    const newInput = [...userInput, idx]
    setActiveTile(idx)
    setTimeout(() => setActiveTile(null), 200)

    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      const newLives = lives - 1
      setLives(newLives)
      setFeedback('wrong')
      if (newLives <= 0) {
        setPhase('done')
        updateScore('sequence-grid', score)
        setTimeout(() => setShowModal(true), 500)
      } else {
        setTimeout(() => {
          setFeedback(null)
          setUserInput([])
          setPhase('watching')
          playSequence(sequence)
        }, 1000)
      }
      return
    }

    setUserInput(newInput)
    if (newInput.length === sequence.length) {
      const pts = level * 15
      setScore(s => s + pts)
      setFeedback('correct')
      const nextLevel = level + 1
      setLevel(nextLevel)
      setTimeout(() => {
        setFeedback(null)
        beginLevel(nextLevel, sequence)
      }, 800)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.stats}>
          <span>Level <strong>{level}</strong></span>
          <span>Score <strong>{score}</strong></span>
          <span>Lives <strong>{'❤️'.repeat(lives)}</strong></span>
        </div>
      </div>

      <div className={styles.arena}>
        {phase === 'idle' && (
          <div className={styles.center}>
            <h2>🔲 Sequence Grid</h2>
            <p>Watch the tiles light up, then repeat the sequence.</p>
            <p className={styles.hint}>Sequences get longer each level.</p>
            <button className={styles.startBtn} onClick={startGame}>Start Game</button>
          </div>
        )}

        {phase !== 'idle' && (
          <div className={styles.center}>
            <p className={styles.phaseLabel}>
              {phase === 'watching' ? '👀 Watch the sequence...' : '👆 Your turn! Repeat it.'}
            </p>
            {feedback && (
              <div className={feedback === 'correct' ? styles.correct : styles.wrong}>
                {feedback === 'correct' ? `✓ +${level * 15} pts` : '✗ Wrong! Watch again...'}
              </div>
            )}
            <div className={styles.grid}>
              {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.tile} ${activeTile === i ? styles.active : ''} ${phase === 'input' ? styles.clickable : ''}`}
                  onClick={() => handleTileClick(i)}
                />
              ))}
            </div>
            <p className={styles.progress}>{userInput.length} / {sequence.length}</p>
          </div>
        )}
      </div>

      {showModal && (
        <ResultModal
          score={score}
          best={scores['sequence-grid']?.best || score}
          onReplay={startGame}
          onHome={() => navigate('/')}
        />
      )}
    </div>
  )
}
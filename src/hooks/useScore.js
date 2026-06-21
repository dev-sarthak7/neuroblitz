import { useState } from 'react'

export function useScore(initialScore = 0) {
  const [score, setScore]   = useState(initialScore)
  const [streak, setStreak] = useState(0)
  const [level, setLevel]   = useState(1)

  function addPoints(base = 10) {
    const bonus = streak * 2
    setScore(s => s + base + bonus)
    setStreak(s => {
      const next = s + 1
      if (next % 3 === 0) setLevel(l => l + 1)
      return next
    })
  }

  function breakStreak() { setStreak(0) }

  function reset() { setScore(0); setStreak(0); setLevel(1) }

  return { score, streak, level, addPoints, breakStreak, reset }
}
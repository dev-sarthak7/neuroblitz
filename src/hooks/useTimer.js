import { useState, useEffect, useRef } from 'react'

export function useTimer(initialSeconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const onExpireRef = useRef(onExpire)

  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      setRunning(false)
      onExpireRef.current?.()
      return
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [running, timeLeft])

  function start() { setTimeLeft(initialSeconds); setRunning(true) }
  function stop()  { setRunning(false) }
  function reset() { setRunning(false); setTimeLeft(initialSeconds) }

  return { timeLeft, running, start, stop, reset }
}
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={`${styles.card} glass-panel`} onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className={styles.sub}>Log in to sync your scores across devices.</p>

        {error && <div className={styles.error}>{error}</div>}

        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />

        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>

        <p className={styles.switch}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
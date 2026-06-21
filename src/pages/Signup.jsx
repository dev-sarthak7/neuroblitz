import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
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
        <h2>Create account</h2>
        <p className={styles.sub}>Save your scores and track progress over time.</p>

        {error && <div className={styles.error}>{error}</div>}

        <label>Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />

        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} />

        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}
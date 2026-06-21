import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>NeuroBlitz</Link>
      <div className={styles.links}>
        <Link to="/" className={pathname === '/' ? styles.active : ''}>Games</Link>
        <Link to="/dashboard" className={pathname === '/dashboard' ? styles.active : ''}>Dashboard</Link>
        {user ? (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login" className={pathname === '/login' ? styles.active : ''}>Log in</Link>
        )}
      </div>
    </nav>
  )
}
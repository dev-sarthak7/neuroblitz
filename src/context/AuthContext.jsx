import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('neuroblitz_token')
    if (!token) { setLoading(false); return }
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('neuroblitz_token'))
      .finally(() => setLoading(false))
  }, [])

  async function signup(name, email, password) {
    const { token, user } = await api.signup(name, email, password)
    localStorage.setItem('neuroblitz_token', token)
    setUser(user)
    return user
  }

  async function login(email, password) {
    const { token, user } = await api.login(email, password)
    localStorage.setItem('neuroblitz_token', token)
    setUser(user)
    return user
  }

  function logout() {
    localStorage.removeItem('neuroblitz_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
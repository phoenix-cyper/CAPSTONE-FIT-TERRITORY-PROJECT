
import { createContext, useContext, useEffect, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/localAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser())

    window.addEventListener('storage', syncUser)
    return () => window.removeEventListener('storage', syncUser)
  }, [])

  const login = async (credentials) => {
    const loggedInUser = await loginUser(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (details) => {
    const newUser = await registerUser(details)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

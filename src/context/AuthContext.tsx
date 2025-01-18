import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserAuthenticated } from '../types'

interface AuthContextType {
  auth: UserAuthenticated | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  hasError: boolean
  errorMessage: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<UserAuthenticated | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('data')
    if (storedUser) {
      setAuth(JSON.parse(storedUser))
    }
  }, [])

  const resetError = () => {
    setHasError(false)
    setErrorMessage('')
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      resetError()
      setLoading(true)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) throw new Error('Registration failed')

      await login(email, password)
      setLoading(false)
    } catch (error) {
      console.error('Registration error:', error)
      setHasError(true)
      setErrorMessage('Registration failed. Please try again.')
    }
  }

  const login = async (email: string, password: string) => {
    try {
      resetError()
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const authData = await response.json()
      setAuth(authData)
      localStorage.setItem('data', JSON.stringify(authData))
      setLoading(false)
    } catch (error) {
      console.error('Login error:', error)
      setHasError(true)
      setErrorMessage('Invalid email or password')
    }
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem('data')
    localStorage.removeItem('notes')
  }

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, register, loading, hasError, errorMessage }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

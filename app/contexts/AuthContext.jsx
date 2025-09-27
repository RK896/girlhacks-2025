'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const signup = async (email, password, name) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Store token in cookie
      setCookie('token', data.token, { maxAge: 7 * 24 * 60 * 60 }) // 7 days
      setCurrentUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store token in cookie
      setCookie('token', data.token, { maxAge: 7 * 24 * 60 * 60 }) // 7 days
      setCurrentUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async () => {
    // For now, we'll implement a simple Google OAuth flow
    // In production, you'd want to use a proper OAuth library
    throw new Error('Google login not implemented yet')
  }

  const logout = () => {
    deleteCookie('token')
    setCurrentUser(null)
  }

  const checkAuth = async () => {
    try {
      const token = getCookie('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      } else {
        deleteCookie('token')
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      deleteCookie('token')
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

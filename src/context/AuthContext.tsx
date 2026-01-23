import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as apiLogin, register as apiRegister, LoginData, RegisterData, User, LoginResponse } from '../api/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')

    if (accessToken && refreshToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (data: LoginData) => {
    const response: LoginResponse = await apiLogin(data)
    localStorage.setItem('access_token', response.access)
    localStorage.setItem('refresh_token', response.refresh)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }

  const register = async (data: RegisterData) => {
    await apiRegister(data)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
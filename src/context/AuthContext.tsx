import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as apiLogin, register as apiRegister, updateUsername as apiUpdateUsername, LoginData, RegisterData, User, LoginResponse } from '../api/auth'
import { useLocalStorage, useAuthToken } from '../hooks'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUsername: (username: string) => Promise<void>
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
  const [user, setUser] = useLocalStorage<User | null>('user', null)
  const [accessToken, setAccessToken] = useAuthToken('access_token')
  const [refreshToken, setRefreshToken] = useAuthToken('refresh_token')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (accessToken && refreshToken && user) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [accessToken, refreshToken, user])

  const login = async (data: LoginData) => {
    const response: LoginResponse = await apiLogin(data)
    setAccessToken(response.access)
    setRefreshToken(response.refresh)
    setUser(response.user)
  }

  const register = async (data: RegisterData) => {
    await apiRegister(data)
  }

  const logout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const updateUsername = async (username: string) => {
    const updatedUser = await apiUpdateUsername(username)
    setUser(updatedUser)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUsername,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
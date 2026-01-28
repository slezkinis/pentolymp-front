import api from './client'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  password2: string
}

export interface Rating {
  score: number
  matches_played: number
  matches_won: number
  matches_lost: number
  matches_drawn: number
}

export interface User {
  id: number
  email: string
  username: string
  rating?: Rating
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post('/api/auth/login/', data)
  return response.data
}

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post('/api/auth/register/', data)
  return response.data
}

export const updateUsername = async (username: string): Promise<User> => {
  const response = await api.patch('/api/auth/profile/', { username })
  return response.data
}

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/api/auth/profile/')
  return response.data
}
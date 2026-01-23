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

export interface User {
  id: number
  email: string
  username: string
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
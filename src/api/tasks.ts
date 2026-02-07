import api from './client'

export interface Topic {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard'

export interface Task {
  id: number
  name: string
  description: string
  difficulty_level: DifficultyLevel
  is_solved: boolean
  topic: string
  subject: string
}

export interface Tip {
  id: number
  tip: string | null
}

export interface CheckAnswerRequest {
  answer: string
}

export interface CheckAnswerResponse {
  is_correct: boolean
}

export const getSubjects = async (page?: number) => {
  const params = page ? { page } : {}
  const response = await api.get('/api/tasks/subjects/', { params })
  return response.data
}

export const getTopics = async (subjectId: number, page?: number): Promise<PaginatedResponse<Topic>> => {
  const params = page ? { page } : {}
  const response = await api.get(`/api/tasks/subjects/${subjectId}/topics/`, { params })
  return response.data
}

export const getTasks = async (params?: {
  difficulty_level?: DifficultyLevel
  name?: string
  page?: number
  subject_id?: number
  topic_id?: number
}): Promise<PaginatedResponse<Task>> => {
  const response = await api.get('/api/tasks/tasks/', { params })
  return response.data
}

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get(`/api/tasks/tasks/${id}/`)
  return response.data
}

export const checkAnswer = async (id: number, answer: string): Promise<CheckAnswerResponse> => {
  const response = await api.post(`/api/tasks/tasks/${id}/`, { answer })
  return response.data
}

export const getTip = async (id: number): Promise<Tip> => {
  const response = await api.get(`/api/tasks/tasks/${id}/tip/`)
  return response.data
}
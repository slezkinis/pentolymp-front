import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Subject } from '../api/tasks'

export type MatchStatus = 'waiting' | 'playing' | 'finished' | 'cancelled' | 'technical_error'
export type MatchResult = 'player1_win' | 'player2_win' | 'draw' | 'technical'

export interface Task {
  id: number
  name: string
  description: string
  order: number
}

export interface MatchProgress {
  tasks_solved: number
  time_taken: number
  current_task_time?: number
  current_task_index?: number
}

export interface Player {
  user_id: number
  username: string
  tasks_solved: number
  time_taken: number
  result?: 'win' | 'loss' | 'draw'
  rating_change: number
}

export interface PvpMatch {
  id: number
  status: MatchStatus
  subject: string
  current_task: Task | null
  time_remaining: number
  current_task_index: number
  total_tasks: number
  my_progress: MatchProgress
  opponent_progress: MatchProgress
  opponent_username?: string
  result?: MatchResult
  participants?: Player[]
}

export interface QueueState {
  isActive: boolean
  subject: Subject | null
  waitTime: number
  playersSearching: number
}

export interface PvpState {
  queue: QueueState
  match: PvpMatch | null
  connectionStatus: 'disconnected' | 'connecting' | 'connected'
  error: string | null
}

type PvpAction =
  | { type: 'SET_QUEUE_STATUS'; payload: Partial<QueueState> }
  | { type: 'SET_MATCH'; payload: PvpMatch | null }
  | { type: 'UPDATE_MATCH_PROGRESS'; payload: Partial<PvpMatch> }
  | { type: 'SET_CONNECTION_STATUS'; payload: PvpState['connectionStatus'] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_PVP_STATE' }

const initialState: PvpState = {
  queue: {
    isActive: false,
    subject: null,
    waitTime: 0,
    playersSearching: 0,
  },
  match: null,
  connectionStatus: 'disconnected',
  error: null,
}

function pvpReducer(state: PvpState, action: PvpAction): PvpState {
  switch (action.type) {
    case 'SET_QUEUE_STATUS':
      return {
        ...state,
        queue: { ...state.queue, ...action.payload },
      }
    case 'SET_MATCH':
      return {
        ...state,
        match: action.payload,
        queue: { ...initialState.queue },
      }
    case 'UPDATE_MATCH_PROGRESS':
      if (!state.match) return state
      return {
        ...state,
        match: { ...state.match, ...action.payload },
      }
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: action.payload,
        error: action.payload === 'disconnected' ? 'Connection lost' : null,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'RESET_PVP_STATE':
      return initialState
    default:
      return state
  }
}

interface PvpContextType {
  state: PvpState
  dispatch: React.Dispatch<PvpAction>
  startQueue: (subject: Subject) => void
  cancelQueue: () => void
  joinMatch: (matchId: number) => void
  leaveMatch: () => void
  submitAnswer: (answer: string) => void
  requestTask: () => void
  clearError: () => void
}

const PvpContext = createContext<PvpContextType | undefined>(undefined)

export function usePvp() {
  const context = useContext(PvpContext)
  if (context === undefined) {
    throw new Error('usePvp must be used within a PvpProvider')
  }
  return context
}

interface PvpProviderProps {
  children: ReactNode
}

export function PvpProvider({ children }: PvpProviderProps) {
  const [state, dispatch] = useReducer(pvpReducer, initialState)

  const startQueue = (subject: Subject) => {
    dispatch({ type: 'SET_QUEUE_STATUS', payload: { isActive: true, subject } })
  }

  const cancelQueue = () => {
    dispatch({ type: 'SET_QUEUE_STATUS', payload: initialState.queue })
  }

  const joinMatch = (matchId: number) => {
    const newMatch: PvpMatch = {
      id: matchId,
      status: 'waiting',
      subject: '',
      current_task: null,
      time_remaining: 300,
      current_task_index: 0,
      total_tasks: 5,
      my_progress: { tasks_solved: 0, time_taken: 0 },
      opponent_progress: { tasks_solved: 0, time_taken: 0 },
    }
    dispatch({ type: 'SET_MATCH', payload: newMatch })
  }

  const leaveMatch = () => {
    dispatch({ type: 'SET_MATCH', payload: null })
  }

  const submitAnswer = (answer: string) => {
    console.log('Submitting answer:', answer)
    dispatch({
      type: 'UPDATE_MATCH_PROGRESS',
      payload: {
        my_progress: {
          ...state.match!.my_progress,
          current_task_time: 0,
        },
      },
    })
  }

  const requestTask = () => {
    if (state.match?.status === 'playing') {
      const newTask: Task = {
        id: Math.random(),
        name: 'Sample Task',
        description: 'Sample task description',
        order: 1,
      }
      dispatch({
        type: 'UPDATE_MATCH_PROGRESS',
        payload: { current_task: newTask },
      })
    }
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  const value: PvpContextType = {
    state,
    dispatch,
    startQueue,
    cancelQueue,
    joinMatch,
    leaveMatch,
    submitAnswer,
    requestTask,
    clearError,
  }

  return <PvpContext.Provider value={value}>{children}</PvpContext.Provider>
}
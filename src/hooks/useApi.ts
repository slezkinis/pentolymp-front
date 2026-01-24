import { useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (request: Promise<any>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await request
      const data = response.data || response
      
      setState({
        data,
        loading: false,
        error: null
      })
      
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка'
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

export default useApi
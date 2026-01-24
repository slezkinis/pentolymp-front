import { useState, useCallback } from 'react'

function useAuthToken(key: string) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(key) || null
  })

  const updateToken = useCallback((value: string | null) => {
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem(key, value)
      } else {
        localStorage.removeItem(key)
      }
    }
    setToken(value)
  }, [key])

  const removeToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
    setToken(null)
  }, [key])

  return [token, updateToken, removeToken] as const
}

export default useAuthToken
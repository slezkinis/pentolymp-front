import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePvp } from '../context/PvpContext'

export function useMatchNavigationGuard() {
  const navigate = useNavigate()
  const { state } = usePvp()
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const navigationGuardRef = useRef<{ shouldBlock: boolean }>({ shouldBlock: false })

  // Блокируем навигацию если идет активный матч
  useEffect(() => {
    navigationGuardRef.current.shouldBlock = !!(state.match && state.match.status === 'playing')
  }, [state.match])

  useEffect(() => {
    // Перехватываем клики по всем ссылкам в Header
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && navigationGuardRef.current.shouldBlock) {
        const url = new URL(link.href)
        const currentPath = window.location.pathname
        
        // Если ссылка ведет на другую страницу (не /pvp)
        if (url.pathname !== currentPath && url.pathname !== '/pvp') {
          e.preventDefault()
          e.stopPropagation()
          setPendingPath(url.pathname)
          setShowConfirm(true)
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  const confirmNavigation = () => {
    navigationGuardRef.current.shouldBlock = false
    setShowConfirm(false)
    if (pendingPath) {
      navigate(pendingPath)
      setPendingPath(null)
    }
  }

  const cancelNavigation = () => {
    setShowConfirm(false)
    setPendingPath(null)
  }

  return {
    showConfirm,
    confirmNavigation,
    cancelNavigation
  }
}
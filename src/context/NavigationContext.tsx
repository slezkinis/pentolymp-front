import { createContext, useContext, ReactNode, useState } from 'react'

interface NavigationContextType {
  isNavigationBlocked: boolean
  requestNavigation: (path: string) => void
  confirmNavigation: () => void
  cancelNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function useNavigationGuard() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigationGuard must be used within a NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const requestNavigation = (path: string) => {
    if (isNavigationBlocked) {
      setPendingPath(path)
      return true // Показать подтверждение
    }
    return false // Разрешить навигацию
  }

  const confirmNavigation = () => {
    setIsNavigationBlocked(false)
    if (pendingPath) {
      window.location.href = pendingPath
      setPendingPath(null)
    }
  }

  const cancelNavigation = () => {
    setPendingPath(null)
  }

  const value: NavigationContextType = {
    isNavigationBlocked,
    requestNavigation,
    confirmNavigation,
    cancelNavigation
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
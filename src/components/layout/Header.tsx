import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePvp } from '../../context/PvpContext'
import ConfirmDialog from '../ui/ConfirmDialog'

interface HeaderProps {
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const location = useLocation()
  const { state } = usePvp()
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const isMatchActive = state.match && state.match.status === 'playing' && location.pathname === '/pvp'

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    if (isMatchActive && path !== '/pvp') {
      e.preventDefault()
      setPendingPath(path)
      setShowConfirm(true)
    }
  }

  const confirmNavigation = () => {
    setShowConfirm(false)
    if (pendingPath) {
      window.location.href = pendingPath
    }
  }

  const cancelNavigation = () => {
    setShowConfirm(false)
    setPendingPath(null)
  }

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <a 
                href="/"
                onClick={(e) => handleNavigation(e, '/')}
                className="hover:opacity-80 transition-opacity"
              >
                <h1 className="text-2xl font-bold text-gray-900">ПентОлимп</h1>
              </a>
              <nav className="md:flex space-x-6">
                <a
                  href="/"
                  onClick={(e) => handleNavigation(e, '/')}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Предметы
                </a>
                <a
                  href="/pvp"
                  onClick={(e) => handleNavigation(e, '/pvp')}
                  className="text-gray-700 hover:text-gray-900 transition-colors font-semibold"
                >
                  PvP
                </a>
              </nav>
            </div>
            {children}
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Подтверждение выхода"
        message="Вы уверены, что хотите покинуть страницу?"
        confirmText="Выйти"
        cancelText="Остаться"
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  )
}

export default Header
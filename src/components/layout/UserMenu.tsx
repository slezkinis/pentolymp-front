import { useState } from 'react'
import { FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { usePvp } from '../../context/PvpContext'
import { useLocation } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth()
  const { state } = usePvp()
  const location = useLocation()
  const [showConfirm, setShowConfirm] = useState(false)
  
  const isMatchActive = state.match && state.match.status === 'playing' && location.pathname === '/pvp'

  const handleProfileClick = () => {
    if (isMatchActive) {
      setShowConfirm(true)
    } else {
      window.location.href = '/profile'
    }
  }

  const confirmNavigation = () => {
    setShowConfirm(false)
    window.location.href = '/profile'
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleProfileClick}
          className="text-gray-700 hover:text-gray-900 transition-colors flex items-center space-x-2"
        >
          <FaUser />
          <span>{user?.username}</span>
        </button>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
          title="Выйти"
        >
          <FaSignOutAlt />
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Подтверждение выхода"
        message="Вы уверены, что хотите покинуть страницу?"
        confirmText="Выйти"
        cancelText="Остаться"
        onConfirm={confirmNavigation}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}

export default UserMenu
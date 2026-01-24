import React from 'react'
import { FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => navigate('/profile')}
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
  )
}

export default UserMenu
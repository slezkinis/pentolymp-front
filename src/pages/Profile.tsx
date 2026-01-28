import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserProfileInfo from '../components/profile/UserProfileInfo'
import UsernameForm from '../components/profile/UsernameForm'
import RatingStats from '../components/profile/RatingStats'

const Profile: React.FC = () => {
  const { user, updateUsername, refreshUserProfile } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      refreshUserProfile()
    }
  }, [])

  const handleUsernameUpdate = async (username: string) => {
    await updateUsername(username)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Профиль</h1>
        
        <div className="space-y-6">
          <UserProfileInfo user={user} />
          
          {user.rating && (
            <RatingStats rating={user.rating} />
          )}
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Изменить
                </button>
              )}
            </div>
            
            {isEditing ? (
              <UsernameForm
                initialUsername={user.username}
                onSubmit={handleUsernameUpdate}
                onCancel={handleCancelEdit}
              />
            ) : (
              <p className="text-gray-900">{user.username}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
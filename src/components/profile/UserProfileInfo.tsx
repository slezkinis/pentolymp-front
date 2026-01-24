import React from 'react'
import { User } from '../../api/auth'

interface UserProfileInfoProps {
  user: User
}

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ user }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <p className="text-gray-900">{user.email}</p>
    </div>
  )
}

export default UserProfileInfo
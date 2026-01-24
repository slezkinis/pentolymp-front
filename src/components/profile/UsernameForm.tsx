import React, { useState } from 'react'

interface UsernameFormProps {
  initialUsername: string
  onSubmit: (username: string) => Promise<void>
  onCancel: () => void
}

const UsernameForm: React.FC<UsernameFormProps> = ({ 
  initialUsername, 
  onSubmit, 
  onCancel 
}) => {
  const [username, setUsername] = useState(initialUsername)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Имя пользователя не может быть пустым')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onSubmit(username.trim())
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении имени пользователя')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Введите новое имя пользователя"
      />
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

export default UsernameForm
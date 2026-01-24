import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoginData } from '../../api/auth'
import { Button, Input } from '../ui'

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData)
      navigate('/')
    } catch (err: any) {
      let errorMessage = 'Ошибка входа'
      if (err.response?.status === 401) {
        errorMessage = 'Неверный логин или пароль'
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail
      } else if (err.response?.data?.non_field_errors?.[0]) {
        errorMessage = err.response.data.non_field_errors[0]
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Электронная почта"
          placeholder="Введите email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        loading={isLoading}
        fullWidth
      >
        Войти
      </Button>
    </form>
  )
}

export default LoginForm
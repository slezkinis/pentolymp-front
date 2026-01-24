import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { RegisterData } from '../../api/auth'
import { Button, Input } from '../ui'

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.password2) {
      setError('Пароли не совпадают')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await register(formData)
      navigate('/login')
    } catch (err: any) {
      let errorMessage = 'Ошибка регистрации'
      if (err.response?.data) {
        const data = err.response.data
        if (data.detail) {
          errorMessage = data.detail
        } else if (data.non_field_errors?.[0]) {
          errorMessage = data.non_field_errors[0]
        } else {
          const fieldErrors = []
          if (data.email) fieldErrors.push(`Email: ${data.email[0]}`)
          if (data.username) fieldErrors.push(`Имя пользователя: ${data.username[0]}`)
          if (data.password) fieldErrors.push(`Пароль: ${data.password[0]}`)
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          }
        }
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
          id="username"
          name="username"
          type="text"
          label="Имя пользователя"
          placeholder="Введите имя пользователя"
          value={formData.username}
          onChange={handleChange}
          required
          fullWidth
        />
        
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
        
        <Input
          id="password2"
          name="password2"
          type="password"
          label="Подтвердите пароль"
          placeholder="Введите пароль еще раз"
          value={formData.password2}
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
        Зарегистрироваться
      </Button>
    </form>
  )
}

export default RegisterForm
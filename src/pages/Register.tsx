import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import RegisterForm from '../components/forms/RegisterForm'

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">Регистрация в ПентОлимп</h2>
          </div>
          
          <RegisterForm />
          
          <div className="text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Register
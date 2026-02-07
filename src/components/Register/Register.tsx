"use client"
import Styles from "./Register.module.css";
import { useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import { RegisterData } from "../../api/auth";
import { useNavigate } from 'react-router-dom'


export const Register = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    password2: ''
  })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    if (formData.password !== formData.password2) {
      setError('Пароли не совпадают')
      return
    }
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
            errorMessage = fieldErrors.join(' ')
          }
        }
      }
      setError(errorMessage)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  return (
      <form className={Styles.register} onSubmit={handleSubmit}>
        <h1 className={Styles.title}>Войти в ПентОлимп</h1>
        <div className={Styles.input_text}>Имя пользователя</div>
        <input id='username' type='text'  name='username' placeholder='Введите имя пользователя' value={formData.username} className={Styles.input} onChange={handleChange} required></input>
        <div className={Styles.input_text}>Электронная почта</div>
        <input id='email' type='email'  name='email' placeholder='Введите email' value={formData.email} className={Styles.input} onChange={handleChange} required></input>
        <div className={Styles.input_text}>Пароль</div>
        <input id='password' type='password'  name='password' placeholder='Введите пароль' value={formData.password} className={Styles.input} onChange={handleChange} required></input>
        <div className={Styles.input_text}>Подтвердите пароль</div>
        <input id='password2' type='password'  name='password2' placeholder='Введите пароль ещё раз' value={formData.password2} className={Styles.input} onChange={handleChange} required></input>
        {error && (
          <div className={Styles.error_message}>{error}</div>
        )}
        <button type='submit' className={Styles.register_button}>Зарегистрироваться</button>
        <a href='/login' className={Styles.link}>Уже есть аккаунт? Войти</a>
      </form>
      
  );
};

"use client"
import Styles from "./Login.module.css";
import { useState } from 'react'
import { useAuth } from "../../context/AuthContext";
import { LoginData } from "../../api/auth";
import { useNavigate } from 'react-router-dom'


export const Login = () => {
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  return (
    <form className={Styles.login} onSubmit={handleSubmit}>
        <h1 className={Styles.title}>Войти в ПентОлимп</h1>
        <div className={Styles.input_text}>Электронная почта</div>
        <input id='email' name='email' type='email' placeholder='Введите email' className={Styles.input} value={formData.email} onChange={handleChange} required></input>
        <div className={Styles.input_text}>Пароль</div>
        <input id='password' name='password' type='password' placeholder='Введите пароль' className={Styles.input} value={formData.password} onChange={handleChange} required></input>
        {error && (
          <div className={Styles.error_message}>{error}</div>
        )}
        <button type='submit' className={Styles.login_button}>Войти</button>
        <a href='/register' className={Styles.link}>Нет аккаунта? Зарегистрироваться</a>
    </form>
  );
};

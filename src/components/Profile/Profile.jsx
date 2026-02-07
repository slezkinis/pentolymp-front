"use client"
import { useState, useEffect } from "react";
import Styles from "./Profile.module.css";
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'


export const Profile = () => {
  const { user, updateUsername, refreshUserProfile } = useAuth()
  const navigate = useNavigate()
  if (!user) {
    navigate('/login')
    return null
  }
  const [username, setUsername] = useState(user?.username)
  const [error, setError] = useState('')
  const [isChanging, setIsChanging] = useState(false);
  const winRate = user.rating.matches_played > 0 
    ? Math.round((user.rating.matches_won / user.rating.matches_played) * 100)
    : 0


  useEffect(() => {
    if (user) {
      refreshUserProfile()
    }
  }, [])

  const changeUsername = async (username) => {
    await updateUsername(username)
    setIsChanging(false)
  }

  function handleChangeClick() {
    setIsChanging(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Имя пользователя не может быть пустым')
      return
    }
    setError('')
    try {
      await changeUsername(username.trim())
    } catch (err) {
      console.log(err )
      setError(err.response.data.username || 'Ошибка при обновлении имени пользователя')
    }
  }

  return (
    <div className={Styles.profile}>
        <h1 className={Styles.profile_header}>Профиль</h1>
        <p className={Styles.email_text}>Email</p>
        <p className={Styles.email}>{user.email}</p>
        <div className={Styles.statistic}>
            <h3 className={Styles.statistic_header}>Статистика рейтинга</h3>
            <div className={Styles.statistic_container}>
                <div className={Styles.statistic_rating}>
                    <div className={Styles.rating_number}>{user.rating.score}</div>
                    <div className={Styles.rating_text}>Рейтинг</div>
                </div>
                <div className={Styles.statistic_rating}>
                    <div className={Styles.win_number}>{winRate}%</div>
                    <div className={Styles.rating_text}>Побед</div>
                </div>
            </div>
            <div className={Styles.statistic_numbers}>
                <div className={Styles.statistic_text}>
                    <div>Всего игр: </div>
                    <div style={{color: 'rgb(0, 0, 0)'}}>{user.rating.matches_played}</div>
                </div>
                <div className={Styles.statistic_text}>
                    <div>Побед: </div>
                    <div style={{color: 'rgb(31, 151, 31)'}}>{user.rating.matches_won}</div>
                </div>
                <div className={Styles.statistic_text}>
                    <div>Поражений: </div>
                    <div style={{color: 'rgb(250, 0, 0)'}}>{user.rating.matches_lost}</div>
                </div>
                <div className={Styles.statistic_text}>
                    <div>Ничьих: </div>
                    <div style={{color: 'rgb(250, 151, 31)'}}>{user.rating.matches_drawn}</div>
                </div>
            </div>
        </div>
        <div className={Styles.line_container}>
            <div>Имя пользователя</div>
            {(isChanging != 1)
                ? <button className={Styles.change_button} onClick={handleChangeClick}>Изменить</button>
                : <></>
            }
        </div>
        {(isChanging != 1)
          ? <div className={Styles.nickname}>{username}</div>
          : <form className={Styles.change_nickname_form} onSubmit={handleSubmit}>
            <input onChange={(e) => setUsername(e.target.value)} value={username} type='text' maxLength='20' placeholder='Введите новое имя пользователя' className={Styles.change_nickname_input}></input>
            <div className={Styles.error}>{error}</div>
          </form>
        }
    </div>
  );
};

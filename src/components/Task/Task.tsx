"use client"
import { useState, useEffect } from "react";
import Styles from "./Task.module.css";
import Confetti from 'react-confetti'
import { useParams } from 'react-router-dom'
import { getTask, checkAnswer, getTip, Task, Tip } from "../../api/tasks";


export default function Task_details() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false);
  const [isHelping, setIsHelping] = useState(false);
  const [answer, setAnswer] = useState('')
  const [task, setTaskInfo] = useState<Task | null>(null)
  const { id } = useParams<{ id: string }>()
  const [correct, setCorrect] = useState(false)
  const [hint, setHint] = useState<Tip | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (id) {
      loadTask()
    }
  }, [id])

  useEffect(() => {
    if (id) {
      loadTask()
    }
  }, [correct])

  const getHint = async () => {
    try {
      const hint_data = await getTip(parseInt(id!))
      setHint(hint_data)
    } catch (error) {
      console.error('Failed to get tip', error)
    }
  }

  const loadTask = async () => {
    try {
      const taskData = await getTask(parseInt(id!))
      setTaskInfo(taskData)
    } catch (error) {
      console.error('Failed to load task', error)
    }
  }

  const handleCheckAnswer = async () => {
    setChecking(true)
    const response = await checkAnswer(parseInt(id!), answer)
    if (response.is_correct) {
      setCorrect(true)
      setTaskInfo(prev => prev ? { ...prev, is_solved: true } : null)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 10000)
    } else {
      setCorrect(false)
  } 
  setChecking(false)
  setIsAnswered(true)
  }

  function handleHintClick() {
    getHint()
    setIsHelping(true)
  }
  
  if (!task) return (<div>Задача не найдена</div>)
  return (
    <div className={Styles.task_main}>
      {showConfetti && <Confetti recycle={false} tweenDuration={8000} gravity={0.3} className={Styles.confetti}/>}
      <h1 style={{marginTop: 'auto'}} className={Styles.task_name}>{task.name}</h1>
      <div className={Styles.task_info}>
        <div className={Styles.level_icon}>{task.difficulty_level === 'Easy' ? 'Легко' : task.difficulty_level === 'Medium' ? 'Средне' : 'Трудно'}</div>
        <div className={Styles.task_subject}>{task.subject} - {task.topic}</div>
        <div className={Styles.task_status}>{task.is_solved ? '✓ Решена' : 'Не решена'}</div>
      </div>
      <div className={Styles.task_text} dangerouslySetInnerHTML={{ __html: task.description }}></div>
      <div style={{marginTop: '1%', paddingLeft: '2%'}}>Ваш ответ</div>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} type='text' placeholder="Введите ваш ответ" className={Styles.answer_input}></input>
      <div className={Styles.button_container}>
        <button className={Styles.check_button} onClick={handleCheckAnswer} disabled={checking || !answer.trim()}>
          <svg className={Styles.button_icon} stroke="currentColor" fill="currentColor" viewBox="0 0 512 512" width="8%" xmlns="http://www.w3.org/2000/svg">
            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
            </path>
          </svg>
          <div className={Styles.button_text}>{checking ? 'Проверка...' : 'Проверить ответ'}</div>
        </button>
        <button className={Styles.help_button} onClick={handleHintClick}>
          <svg className={Styles.button_icon} stroke="currentColor" fill="currentColor" viewBox="0 0 512 512" width="11%" xmlns="http://www.w3.org/2000/svg">
            <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z">
            </path>
          </svg>
          <div className={Styles.button_text} style={{marginLeft:'-3%'}}>Получить подсказку</div>
        </button>
      </div>
      {isAnswered === true ?
         (correct === true
            ? (<div className={Styles.task_status_banner} style={{backgroundColor: 'rgb(170, 236, 181)', color: 'rgb(39, 104, 50)'}}>Правильно! Молодец!</div>)
            : (<div className={Styles.task_status_banner} style={{backgroundColor: 'rgb(238, 150, 150)', color: 'rgb(104, 38, 38)'}}>Неправильно. Попробуйте ещё раз или получите подсказку</div>)
          )
        : <></>
      }
      {isHelping === true ?
         (hint !== null
            ? (<div className={Styles.task_hint_banner} style={{backgroundColor: 'rgb(226, 224, 255)', color: 'rgb(33, 27, 105)'}}>
                <div style={{fontSize: '20px', marginBottom: '0.5%'}}>Подсказка</div>
                <div>{hint.tip}</div>
              </div>)
            : (<div className={Styles.task_hint_banner} style={{backgroundColor: 'rgb(226, 224, 255)', color: 'rgb(33, 27, 105)'}}>
                <div style={{fontSize: '20px', marginBottom: '0.5%'}}>Подсказка</div>
                <div>Подсказка недоступна</div>
              </div>)
          )
        : <></>
      }
      <div style={{visibility: 'hidden'}}>Пасхалка</div>
    </div>
  );
}

"use client"
import { useState, useEffect } from "react";
import Styles from "./PvP_task.module.css";


interface Task {
  id: number
  name: string
  description: string
  order: number
}

interface TaskComponentProps {
  task: Task | null
  onSubmitAnswer: (answer: string) => void
  disabled?: boolean
  answerResult?: {correct: boolean} | null
}

export default function PvP_task_details({ task, onSubmitAnswer, disabled = false, answerResult }: TaskComponentProps) {
  const [answer, setAnswer] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || disabled) return

    onSubmitAnswer(answer.trim())
    setAnswer('')
  }
  
  if (!task) return (<div style={{textAlign: 'center'}}>В предмете отсутствуют задачи</div>)
  return (
    <div className={Styles.task_main}>
      <h1 style={{marginTop: 'auto'}} className={Styles.task_name}>{task.name}</h1>
      <div className={Styles.task_text} dangerouslySetInnerHTML={{ __html: task.description }}></div>
      <div style={{marginTop: '1%', paddingLeft: '2%'}}>Ваш ответ</div>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} type='text' placeholder="Введите ваш ответ" className={Styles.answer_input}></input>
      <form onSubmit={handleSubmit} className={Styles.button_container_2}>
        <button type="submit" className={Styles.check_button} disabled={disabled || !answer.trim()}>
          <svg className={Styles.button_icon} stroke="currentColor" fill="currentColor" viewBox="0 0 512 512" width="8%" xmlns="http://www.w3.org/2000/svg">
            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
            </path>
          </svg>
          <div className={Styles.button_text}>Отправить</div>
        </button>
      </form>
      {answerResult &&
         (answerResult.correct === true
            ? (<div className={Styles.task_status_banner} style={{backgroundColor: 'rgb(170, 236, 181)', color: 'rgb(39, 104, 50)'}}>Правильно! Молодец!</div>)
            : (<div className={Styles.task_status_banner} style={{backgroundColor: 'rgb(238, 150, 150)', color: 'rgb(104, 38, 38)'}}>Неправильно. Попробуйте ещё раз</div>)
          )
      }
      <div style={{visibility: 'hidden'}}>Пасхалка</div>
    </div>
  );
}

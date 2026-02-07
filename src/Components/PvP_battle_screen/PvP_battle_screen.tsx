"use client"
import { Match_status } from "../Match_status/Match_status";
import Styles from "./PvP_battle_screen.module.css";
import PvP_task_details from '../../Components/PvP_task/PvP_task'
import { useState, useEffect } from 'react'
import { usePvp } from '../../context/PvPContext'
import { PvpMatchService, WebSocketManager } from '../../services/pvpServices'
import Technical_end_page from "../../pages/techinical_end";
import PvP_result_page from "../../pages/pvp_result";


interface PvpMatchScreenProps {
  matchId: number
  onExit: () => void
}

export default function Pvp_match_screen({ matchId, onExit }: PvpMatchScreenProps) {
  const { state, submitAnswer, leaveMatch, dispatch, joinMatch } = usePvp()
  const [matchService, setMatchService] = useState<PvpMatchService | null>(null)
  const [matchResults, setMatchResults] = useState<any>(null)
  const [matchEndTime, setMatchEndTime] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [technicalResult, setTechnicalResult] = useState(false)
  const [answerResult, setAnswerResult] = useState<{correct: boolean} | null>(null)

  useEffect(() => {
    initializeMatch()
    
    return () => {
      if (matchService) {
        matchService.disconnect()
      }
    }
  }, [matchId])

  useEffect(() => {
    if (!matchEndTime) return

    const timer = setInterval(() => {
      const newTime = new Date()
      setCurrentTime(newTime)
      const diff = matchEndTime.getTime() - newTime.getTime()
    }, 1000)

    return () => clearInterval(timer)
  }, [matchEndTime])

  const initializeMatch = async () => {
    joinMatch(matchId)
    try {
      const wsManager = new WebSocketManager()
      const service = new PvpMatchService(wsManager)
      
      wsManager.setMessageHandler('match_started', (data) => {
        console.log('Match started:', data)
        if (data.end_at) {
          setMatchEndTime(new Date(data.end_at))
        }
        service.getTask()
      })

      wsManager.setMessageHandler('opponent_answer', (data) => {
        console.log('Opponent answered:', data)
        service.send({ type: 'get_opponent_progress' })
        service.send({ type: 'get_opponent_progress' })
      })

      wsManager.setMessageHandler('match_state', (data) => {
        console.log('Match state in component:', data)
        if (data.match) {
          const currentUserId = parseInt(localStorage.getItem('user_id') || '0')
          const myParticipant = data.match.participants.find((p: any) => p.user_id === currentUserId)
          const opponentParticipant = data.match.participants.find((p: any) => p.user_id !== currentUserId)
          
          dispatch({
            type: 'UPDATE_MATCH_PROGRESS',
            payload: {
              id: data.match.id,
              subject: data.match.subject,
              status: data.match.status,
              time_remaining: data.match.duration_minutes * 60,
              total_tasks: data.match.max_tasks,
              current_task_index: myParticipant?.current_task_index || 0,
              my_progress: {
                tasks_solved: myParticipant?.tasks_solved || 0,
                time_taken: myParticipant?.time_taken || 0,
                current_task_index: myParticipant?.current_task_index || 0,
              },
              opponent_progress: {
                tasks_solved: opponentParticipant?.tasks_solved || 0,
                time_taken: opponentParticipant?.time_taken || 0,
                current_task_index: opponentParticipant?.current_task_index || 0,
              },
              opponent_username: opponentParticipant?.username,
            }
          })
        }
      })

      service.onTaskUpdate((task) => {
        console.log('Task updated:', task)
        if (task) {
          dispatch({
            type: 'UPDATE_MATCH_PROGRESS',
            payload: { current_task: task }
          })
          service.send({ type: 'get_my_progress' })
        }
      })

      service.onAnswerResult((data) => {
        console.log('Answer result:', data)
        
        if (data.correct) {
          setAnswerResult({correct: true})
          service.send({ type: 'get_my_progress' })
          setTimeout(() => {
            setAnswerResult(null)
            service.getTask()
          }, 2000)
        } else {
          setAnswerResult({correct: false})
          setTimeout(() => {
            setAnswerResult(null)
          }, 3000)
        }
      })

      service.onOpponentAnswer((data) => {
        console.log('Дебил answered:', data)
        console.log('ДОЛБОЕБ ОТВЕТИЛ')
        if (data.correct) {
          dispatch({
            type: 'UPDATE_MATCH_PROGRESS',
            payload: {
              opponent_progress: {
                ...state.match!.opponent_progress,
                tasks_solved: state.match!.opponent_progress.tasks_solved + 1,
              }
            }
          })
        }
      })

      service.onMatchFinished((data) => {
        console.log('Match finished:', data)
        handleMatchFinished(data)
      })

      wsManager.setMessageHandler('match_finished', (data) => {
        console.log('Match finished:', data)
        handleMatchFinished(data)
      })

      wsManager.setMessageHandler('send_my_progress', (data) => {
        console.log('My progress received:', data)
        if (data && data.data) {
          dispatch({
            type: 'UPDATE_MATCH_PROGRESS',
            payload: {
              current_task_index: data.data.current_task_index,
              my_progress: {
                tasks_solved: data.data.tasks_solved,
                time_taken: data.data.time_taken,
                current_task_time: data.data.current_task_time,
              }
            }
          })
        }
      })

      wsManager.setMessageHandler('my_progress', (data) => {
        console.log('My progress (alternative):', data)
        if (data && data.data) {
          dispatch({
            type: 'UPDATE_MATCH_PROGRESS',
            payload: {
              current_task_index: data.data.current_task_index,
              my_progress: {
                tasks_solved: data.data.tasks_solved,
                time_taken: data.data.time_taken,
                current_task_time: data.data.current_task_time,
              }
            }
          })
        }
      })

      wsManager.setMessageHandler('opponent_progress', (data) => {
        console.log('Opponent progress:', data)
        if (data.data) {
          dispatch({
            type: 'UPDATE_MATCH_PROGRESS',
            payload: {
              opponent_progress: {
                tasks_solved: data.data.tasks_solved,
                current_task_index: data.data.current_task_index,
                time_taken: data.data.time_taken,
              }
            }
          })
        }
      })

      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      await service.connect(matchId, token)
      setMatchService(service)
    } catch (error) {
      console.error('Failed to initialize match:', error)
    }
  }
  
  const handleSubmitAnswer = (answer: string) => {
    if (matchService) {
      submitAnswer(answer)
      matchService.submitAnswer(answer)
    }
  }

  const handleMatchFinished = (data: any) => {
    console.log('Match completed:', data)
    
  if (data.result === 'technical') {
      setTechnicalResult(true)
    } else {
      setMatchResults(data)
    }
  }

  const handleExit = () => {
    if (matchService) {
      matchService.disconnect()
    }
    leaveMatch()
    onExit()
  }

  const getRemainingTime = () => {
    if (!matchEndTime) return 0
    const diff = matchEndTime.getTime() - currentTime.getTime()
    return Math.max(0, Math.floor(diff / 1000))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (solved: number, total: number) => {
    return (solved / total) * 100
  }

  if (technicalResult) {
    return (
      <Technical_end_page />
    )
  }

  if (matchResults) {
    const res: any = matchResults
    return (
      <PvP_result_page result={res}/>
    )
  }

  if (state.match) {
    const enemy_progress = `${state.match.opponent_progress.tasks_solved}/${state.match.total_tasks}`
    const my_progress = `${state.match.current_task_index + 1}/${state.match.total_tasks}`
    let task_id: any = state.match.current_task?.id
    return (
      <div className={Styles.pvp_menu}>
          <div><PvP_task_details 
            task={state.match.current_task}
            onSubmitAnswer={handleSubmitAnswer}
            disabled={state.match.status !== 'playing'}
            answerResult={answerResult}/></div>
          <div>
            <Match_status title='Статус матча' t1='Время:' t2={formatTime(getRemainingTime())} t3='Предмет:' t4={state.match?.subject} t5='Задание:' t6={my_progress} t7='Прогресс матча' t8={`${Math.round(getProgressPercentage(state.match.current_task_index, state.match.total_tasks))}%`} />
            <Match_status title='Противник' t1='Имя:' t2={state.match.opponent_username} t3='Решено:' t4={state.match.opponent_progress.tasks_solved} t5='Время' t6={formatTime(getRemainingTime())} t7='Прогресс противника:' t8={enemy_progress} />
            <button onClick={handleExit} className={Styles.exit_button}>Выйти из матча</button>
          </div>
      </div>
    );
}
};

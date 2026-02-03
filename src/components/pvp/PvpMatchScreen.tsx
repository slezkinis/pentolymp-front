import { useState, useEffect } from 'react'
import { usePvp } from '../../context/PvpContext'
import { PvpMatchService, WebSocketManager } from '../../services/pvpServices'
import TaskComponent from './TaskComponent'
import MatchResults from './MatchResults'
import TechnicalResult from './TechnicalResult'
import ConfirmDialog from '../ui/ConfirmDialog'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface PvpMatchScreenProps {
  matchId: number
  onExit: () => void
}

export default function PvpMatchScreen({ matchId, onExit }: PvpMatchScreenProps) {
  const { state, submitAnswer, leaveMatch, dispatch, joinMatch } = usePvp()
  const [matchService, setMatchService] = useState<PvpMatchService | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answerResult, setAnswerResult] = useState<{correct: boolean, message: string} | null>(null)
  const [matchResults, setMatchResults] = useState<any>(null)
  const [technicalResult, setTechnicalResult] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [matchEndTime, setMatchEndTime] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    initializeMatch()
    
    return () => {
      if (matchService) {
        matchService.disconnect()
      }
    }
  }, [matchId])

  // Таймер обратного отсчета
  useEffect(() => {
    if (!matchEndTime) return

    const timer = setInterval(() => {
      const newTime = new Date()
      setCurrentTime(newTime)
      
      // Проверяем, не закончилось ли время
      const diff = matchEndTime.getTime() - newTime.getTime()
      if (diff <= 0) {
        // Время вышло, можно завершить матч или обработать на сервере
        console.log('Time is up!')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [matchEndTime])

  const getRemainingTime = () => {
    if (!matchEndTime) return 0
    const diff = matchEndTime.getTime() - currentTime.getTime()
    return Math.max(0, Math.floor(diff / 1000))
  }

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
        
        // Запрашиваем прогресс оппонента после его ответа
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
          // Запрашиваем актуальный прогресс при получении новой задачи
          service.send({ type: 'get_my_progress' })
        }
      })

      service.onAnswerResult((data) => {
        console.log('Answer result:', data)
        setIsSubmitting(false)
        
        if (data.correct) {
          setAnswerResult({correct: true, message: 'Ответ верный!'})
          // Запрашиваем свой прогресс после правильного ответа
          service.send({ type: 'get_my_progress' })
          
          // Запрашиваем следующую задачу
          setTimeout(() => {
            setAnswerResult(null)
            service.getTask()
          }, 2000)
        } else {
          setAnswerResult({correct: false, message: 'Ответ неверный, попробуйте еще раз'})
          setTimeout(() => {
            setAnswerResult(null)
          }, 3000)
        }
      })

      service.onOpponentAnswer((data) => {
        console.log('Opponent answered:', data)
        
        // Обновляем прогресс оппонента
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

      // Также добавим обработчик для 'my_progress' на всякий случай
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

  const handleMatchFinished = (data: any) => {
    console.log('Match completed:', data)
    
    if (data.result === 'technical' || (data.result !== 'draw' && !data.winner)) {
      setTechnicalResult(true)
    } else {
      setMatchResults(data)
    }
  }

  const handleSubmitAnswer = (answer: string) => {
    if (matchService && !isSubmitting) {
      setIsSubmitting(true)
      submitAnswer(answer)
      matchService.submitAnswer(answer)
    }
  }

  const handleExit = () => {
    if (matchService) {
      matchService.disconnect()
    }
    leaveMatch()
    onExit()
  }

  const handleExitWithConfirm = () => {
    setShowExitConfirm(true)
  }

  const confirmExit = () => {
    setShowExitConfirm(false)
    handleExit()
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
      <TechnicalResult 
        onExit={handleExit}
      />
    )
  }

  if (matchResults) {
    return (
      <MatchResults 
        result={matchResults} 
        onExit={handleExit}
      />
    )
  }

  if (!state.match) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Загрузка матча...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskComponent
            task={state.match.current_task}
            onSubmitAnswer={handleSubmitAnswer}
            disabled={state.match.status !== 'playing' || isSubmitting}
            answerResult={answerResult}
          />
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Статус матча</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Время:</span>
                <span className="font-medium">{formatTime(getRemainingTime())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Предмет:</span>
                <span className="font-medium">{state.match.subject}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Задание:</span>
                <span className="font-medium">
                  {state.match.current_task_index + 1}/{state.match.total_tasks}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Прогресс матча</span>
                <span>{Math.round(getProgressPercentage(state.match.current_task_index, state.match.total_tasks))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(state.match.current_task_index, state.match.total_tasks)}%` }}
                ></div>
              </div>
            </div>
          </Card>



          {state.match.opponent_username && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Противник</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Имя:</span>
                  <span className="font-medium">{state.match.opponent_username}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Решено:</span>
                  <span className="font-medium">{state.match.opponent_progress.tasks_solved}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Время:</span>
                  <span className="font-medium">{formatTime(Math.floor(state.match.opponent_progress.time_taken))}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс противника</span>
                  <span>{state.match.opponent_progress.tasks_solved}/{state.match.total_tasks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(state.match.opponent_progress.tasks_solved, state.match.total_tasks)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          )}

          <Button
            onClick={handleExitWithConfirm}
            variant="secondary"
            className="w-full"
          >
            Выйти из матча
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Подтверждение выхода"
        message="Вы уверены, что хотите выйти из матча?"
        confirmText="Выйти"
        cancelText="Остаться"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />


    </div>
  )
}
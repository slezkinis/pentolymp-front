import { useState, useEffect } from 'react'
import { usePvp } from '../../context/PvpContext'
import { PvpQueueService, WebSocketManager } from '../../services/pvpServices'
import { Subject, getSubjects } from '../../api/tasks'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface PvpQueueScreenProps {
  onMatchFound: (matchId: number) => void
}

export default function PvpQueueScreen({ onMatchFound }: PvpQueueScreenProps) {
  const { state, startQueue, cancelQueue } = usePvp()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [queueService, setQueueService] = useState<PvpQueueService | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSubjects()
    
    return () => {
      if (queueService) {
        queueService.disconnect()
      }
    }
  }, [])

  const loadSubjects = async () => {
    try {
      const response = await getSubjects()
      setSubjects(response.results)
    } catch (error) {
      console.error('Failed to load subjects:', error)
      setError('Не удалось загрузить предметы')
    }
  }

  const handleStartSearch = async () => {
    if (!selectedSubject) {
      setError('Выберите предмет для соревнования')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const wsManager = new WebSocketManager()
      const service = new PvpQueueService(wsManager)
      
      wsManager.setConnectionChangeHandler((status) => {
        console.log('Queue connection status:', status)
      })

      service.onQueueUpdate((data) => {
        console.log('Queue update:', data)
      })

      service.onMatchFound((data) => {
        console.log('Match found:', data)
        service.disconnect()
        onMatchFound(data.match_id)
      })

      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      await service.connect(token)
      service.findMatch(selectedSubject.id)
      
      setQueueService(service)
      startQueue(selectedSubject)
    } catch (error) {
      console.error('Failed to start queue search:', error)
      setError('Не удалось начать поиск противника')
      setLoading(false)
    }
  }

  const handleCancelSearch = () => {
    if (queueService) {
      queueService.cancelSearch()
      queueService.disconnect()
      setQueueService(null)
    }
    cancelQueue()
    setLoading(false)
  }

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (state.queue.isActive) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <h2 className="text-2xl font-bold mb-4">Поиск противника</h2>
          
          <div className="mb-6">
            <div className="text-lg font-medium text-gray-600">
              Предмет: {state.queue.subject?.name}
            </div>
            <div className="text-sm text-gray-500">
              Время ожидания: {formatWaitTime(state.queue.waitTime)}
            </div>
            <div className="text-sm text-gray-500">
              Игроков в поиске: {state.queue.playersSearching}
            </div>
          </div>

          <div className="mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ищем соперника...</p>
          </div>

          <Button 
            onClick={handleCancelSearch}
            variant="secondary"
            disabled={loading}
          >
            Отменить поиск
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <h2 className="text-2xl font-bold mb-6 text-center">PvP Соревнование</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            Выберите предмет и найдите соперника для увлекательного соревнования!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите предмет:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${selectedSubject?.id === subject.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setSelectedSubject(subject)}
              >
                <div className="font-medium">{subject.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleStartSearch}
            disabled={!selectedSubject || loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Поиск...' : 'Найти противника'}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Рейтинг: {state.rating.current} ({state.rating.rank})</p>
        </div>
      </Card>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaCheck, FaLightbulb } from 'react-icons/fa'
import { getTask, checkAnswer, getTip, Task, Tip, CheckAnswerResponse } from '../api/tasks'

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [answer, setAnswer] = useState('')
  const [tip, setTip] = useState<Tip | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (id) {
      loadTask()
    }
  }, [id])

  const loadTask = async () => {
    try {
      const taskData = await getTask(parseInt(id!))
      setTask(taskData)
    } catch (error) {
      console.error('Failed to load task', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckAnswer = async () => {
    if (!answer.trim()) return
    setChecking(true)
    try {
      const response: CheckAnswerResponse = await checkAnswer(parseInt(id!), answer)
      if (response.is_correct) {
        setFeedback('Правильно! Молодец!')
        setTask(prev => prev ? { ...prev, is_solved: true } : null)
      } else {
        setFeedback('Неправильно. Попробуйте ещё раз или получите подсказку.')
      }
    } catch (error) {
      setFeedback('Ошибка при проверке ответа.')
    } finally {
      setChecking(false)
    }
  }

  const handleGetTip = async () => {
    try {
      const tipData = await getTip(parseInt(id!))
      setTip(tipData)
    } catch (error) {
      console.error('Failed to get tip', error)
    }
  }

  if (loading) return <div className="text-center py-8">Загрузка задачи...</div>
  if (!task) return <div className="text-center py-8">Задача не найдена</div>

  return (
    <div>
      <Link to="/tasks" className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
        ← Назад к задачам
      </Link>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.difficulty_level === 'Easy' ? 'bg-green-100 text-green-800' :
              task.difficulty_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {task.difficulty_level === 'Easy' ? 'Легко' : task.difficulty_level === 'Medium' ? 'Средне' : 'Трудно'}
            </span>
            <span className="text-gray-600">{task.subject} - {task.topic}</span>
            <span className={`text-sm ${task.is_solved ? 'text-green-600' : 'text-gray-500'}`}>
              {task.is_solved ? '✓ Решена' : 'Не решена'}
            </span>
          </div>
          <div className="text-gray-700 text-lg" dangerouslySetInnerHTML={{ __html: task.description }} />
        </div>
        {task.is_solved && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
            Задача решена! Вы можете решить её ещё раз.
          </div>
        )}

        <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Ваш ответ
            </label>
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Введите ваш ответ"
            />
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleCheckAnswer}
                disabled={checking || !answer.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <FaCheck />
                <span>{checking ? 'Проверка...' : 'Проверить ответ'}</span>
              </button>
              <button
                onClick={handleGetTip}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <FaLightbulb />
                <span>Получить подсказку</span>
              </button>
            </div>
          </div>

        {feedback && (
          <div className={`mb-6 p-4 rounded-md ${feedback.includes('Правильно') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback}
          </div>
        )}

        {tip && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Подсказка</h3>
            <p className="text-blue-800">{tip.tip || 'Подсказка недоступна'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetail
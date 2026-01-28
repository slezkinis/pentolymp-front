import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

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
  answerResult?: {correct: boolean, message: string} | null
}

export default function TaskComponent({ task, onSubmitAnswer, disabled = false, answerResult }: TaskComponentProps) {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || disabled || isSubmitting) return

    setIsSubmitting(true)
    onSubmitAnswer(answer.trim())
    setAnswer('')
    setIsSubmitting(false)
  }



  if (!task) {
    return (
      <Card className="p-6 text-center">
        <div className="text-gray-500">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4">Загрузка задания...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Задание {task.order}
          </span>
          <div className="text-sm text-gray-500">
            ID: {task.id}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{task.name}</h3>
        <div 
          className="text-gray-800 bg-gray-50 p-4 rounded-lg"
          dangerouslySetInnerHTML={{ __html: task.description }}
        />
      </div>

      {answerResult && (
        <div className={`p-4 rounded-lg ${
          answerResult.correct 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {answerResult.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
            Ваш ответ:
          </label>
          <input
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={disabled || isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите ваш ответ здесь..."
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!answer.trim() || disabled || isSubmitting}
            className="min-w-32"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить ответ'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
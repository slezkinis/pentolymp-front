import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaTasks, FaSmile, FaMeh, FaFrown } from 'react-icons/fa'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getTasks, Task, PaginatedResponse, DifficultyLevel } from '../api/tasks'

const TasksList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    difficulty_level: (searchParams.get('difficulty_level') || '') as DifficultyLevel | '',
    name: searchParams.get('name') || '',
  })

  const loadTasks = async (pageNum: number, currentFilters = filters) => {
    setLoading(true)
    try {
      const params: any = { page: pageNum }
      if (currentFilters.difficulty_level) params.difficulty_level = currentFilters.difficulty_level
      if (currentFilters.name) params.name = currentFilters.name
      const subjectId = searchParams.get('subject_id')
      const topicId = searchParams.get('topic_id')
      if (subjectId) params.subject_id = subjectId
      if (topicId) params.topic_id = topicId

      const response: PaginatedResponse<Task> = await getTasks(params)
      const results = response.results || []
      if (pageNum === 1) {
        setTasks(results)
      } else {
        setTasks(prev => [...prev, ...results])
      }
      setHasMore(!!response.next)
    } catch (error) {
      console.error('Failed to load tasks', error)
      setTasks([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks(1)
  }, [filters])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadTasks(nextPage)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPage(1)
    // Update URL
    const newParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v)
    })
    // Preserve subject_id and topic_id if present
    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    if (subjectId) newParams.set('subject_id', subjectId)
    if (topicId) newParams.set('topic_id', topicId)
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({
      difficulty_level: '',
      name: '',
    })
    // Keep subject_id and topic_id
    const newParams = new URLSearchParams()
    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    if (subjectId) newParams.set('subject_id', subjectId)
    if (topicId) newParams.set('topic_id', topicId)
    setSearchParams(newParams)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Задачи</h1>
      <Link to="/" className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
        ← Назад к предметам
      </Link>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.difficulty_level || ''}
            onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Все сложности</option>
            <option value="Easy">Легко</option>
            <option value="Medium">Средне</option>
            <option value="Hard">Трудно</option>
          </select>
          <input
            type="text"
            placeholder="Название задачи"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={clearFilters}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Очистить фильтры
        </button>
      </div>

      <InfiniteScroll
        dataLength={tasks.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center py-4">Загрузка...</div>}
        endMessage={<div className="text-center py-4 text-gray-500">Больше задач нет</div>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <FaTasks className="text-blue-500 mr-3 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-800">{task.name}</h2>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {task.difficulty_level === 'Easy' && <FaSmile className="text-green-500 mr-2" />}
                  {task.difficulty_level === 'Medium' && <FaMeh className="text-yellow-500 mr-2" />}
                  {task.difficulty_level === 'Hard' && <FaFrown className="text-red-500 mr-2" />}
                  <span className="text-sm text-gray-600">
                    {task.difficulty_level === 'Easy' ? 'Легко' : task.difficulty_level === 'Medium' ? 'Средне' : 'Трудно'}
                  </span>
                </div>
                <span className={`text-sm ${task.is_solved ? 'text-green-600' : 'text-gray-500'}`}>
                  {task.is_solved ? 'Решена' : 'Не решена'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
      {loading && tasks.length === 0 && (
        <div className="text-center py-8">Loading tasks...</div>
      )}
    </div>
  )
}

export default TasksList
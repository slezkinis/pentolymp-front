import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaList } from 'react-icons/fa'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getTopics, Topic, PaginatedResponse } from '../api/tasks'

const TopicsList: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [topics, setTopics] = useState<Topic[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadTopics = async (pageNum: number) => {
    if (!subjectId) return
    setLoading(true)
    try {
      const response: PaginatedResponse<Topic> = await getTopics(parseInt(subjectId), pageNum)
      const results = response.results || []
      if (pageNum === 1) {
        setTopics(results)
      } else {
        setTopics(prev => [...prev, ...results])
      }
      setHasMore(!!response.next)
    } catch (error) {
      console.error('Failed to load topics', error)
      setTopics([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopics(1)
  }, [subjectId])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadTopics(nextPage)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Темы</h1>
      <Link to="/" className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
        ← Назад к предметам
      </Link>
      <InfiniteScroll
        dataLength={topics.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center py-4">Загрузка...</div>}
        endMessage={<div className="text-center py-4 text-gray-500">Больше тем нет</div>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => (
            <Link
              key={topic.id}
              to={`/tasks?topic_id=${topic.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-2">
                <FaList className="text-green-500 mr-3 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-800">{topic.name}</h2>
              </div>
              <p className="text-gray-600">Нажмите, чтобы посмотреть задачи</p>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
      {loading && topics.length === 0 && (
        <div className="text-center py-8">Загрузка тем...</div>
      )}
    </div>
  )
}

export default TopicsList
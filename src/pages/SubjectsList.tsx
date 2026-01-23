import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBook } from 'react-icons/fa'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSubjects, Subject, PaginatedResponse } from '../api/tasks'

const SubjectsList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadSubjects = async (pageNum: number) => {
    setLoading(true)
    try {
      const response: PaginatedResponse<Subject> = await getSubjects(pageNum)
      const results = response.results || []
      if (pageNum === 1) {
        setSubjects(results)
      } else {
        setSubjects(prev => [...prev, ...results])
      }
      setHasMore(!!response.next)
    } catch (error) {
      console.error('Failed to load subjects', error)
      setSubjects([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects(1)
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadSubjects(nextPage)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Предметы</h1>
      <InfiniteScroll
        dataLength={subjects.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center py-4">Загрузка...</div>}
        endMessage={<div className="text-center py-4 text-gray-500">Больше предметов нет</div>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}/topics`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-2">
                <FaBook className="text-indigo-500 mr-3 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-800">{subject.name}</h2>
              </div>
              <p className="text-gray-600">Нажмите, чтобы посмотреть темы</p>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
      {loading && subjects.length === 0 && (
        <div className="text-center py-8">Загрузка предметов...</div>
      )}
    </div>
  )
}

export default SubjectsList
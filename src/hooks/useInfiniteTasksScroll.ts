import { useState, useEffect } from 'react'
import { PaginatedResponse, DifficultyLevel } from '../api/tasks'

interface UseInfiniteScrollResult<T> {
  data: T[]
  hasMore: boolean
  loadMore: () => void
  reset: () => void
}

function useInfiniteTasksScroll<T>(
  searchParams: any, 
  filters: any,
  fetchFunction: (params: {
    difficulty_level?: DifficultyLevel
    name?: string
    page?: number
    subject_id?: number
    topic_id?: number
  }) => Promise<PaginatedResponse<T>>
): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const loadData = async (pageNum: number, currentFilters = filters) => {
    try {
      const params: any = { page: pageNum }
      if (currentFilters.difficulty_level) params.difficulty_level = currentFilters.difficulty_level
      if (currentFilters.name) params.name = currentFilters.name
      const topicId = searchParams.get('topic_id')
      if (topicId) params.topic_id = topicId

      const response = await fetchFunction(params)
      const results = response.results || []
      
      if (pageNum === 1) {
        setData(results)
      } else {
        setData(prev => [...prev, ...results])
      }
      
      setHasMore(!!response.next)
    } catch (error) {
      console.error('Failed to load data', error)
      setData([])
      setHasMore(false)
    }
  }

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadData(nextPage, filters)
    }
  }

  const reset = () => {
    setData([])
    setPage(1)
    setHasMore(true)
    loadData(1, filters)
  }

  useEffect(() => {
    loadData(1, filters)
  }, [fetchFunction])

  return {
    data,
    hasMore,
    loadMore,
    reset
  }
}

export default useInfiniteTasksScroll
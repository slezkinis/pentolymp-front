import { useState, useEffect } from 'react'
import { PaginatedResponse } from '../api/tasks'

interface UseInfiniteScrollResult<T> {
  data: T[]
  hasMore: boolean
  loadMore: () => void
  reset: () => void
}

function useInfiniteSubjectsScroll<T>(
  fetchFunction: (page: number) => Promise<PaginatedResponse<T>>
): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadData = async (pageNum: number) => {
    try {
      const response = await fetchFunction(pageNum)
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
      loadData(nextPage)
    }
  }

  const reset = () => {
    setData([])
    setPage(1)
    setHasMore(true)
  }

  useEffect(() => {
    loadData(1)
  }, [fetchFunction])

  return {
    data,
    hasMore,
    loadMore,
    reset
  }
}

export default useInfiniteSubjectsScroll
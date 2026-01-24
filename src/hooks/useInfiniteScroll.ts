import { useState, useEffect } from 'react'
import { PaginatedResponse } from '../api/tasks'

interface UseInfiniteScrollResult<T> {
  data: T[]
  loading: boolean
  hasMore: boolean
  loadMore: () => void
  reset: () => void
}

function useInfiniteScroll<T>(
  fetchFunction: (page: number) => Promise<PaginatedResponse<T>>
): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadData = async (pageNum: number) => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadData(nextPage)
    }
  }

  const reset = () => {
    setData([])
    setPage(1)
    setHasMore(true)
    setLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [fetchFunction])

  return {
    data,
    loading,
    hasMore,
    loadMore,
    reset
  }
}

export default useInfiniteScroll
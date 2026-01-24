import React from 'react'
import { getSubjects } from '../api/tasks'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import SubjectGrid from '../components/lists/SubjectGrid'

const SubjectsList: React.FC = () => {
  const { data: subjects, hasMore, loading, loadMore } = useInfiniteScroll(getSubjects)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Предметы</h1>
      
      {loading && subjects.length === 0 ? (
        <div className="text-center py-8">Загрузка предметов...</div>
      ) : (
        <SubjectGrid
          subjects={subjects}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  )
}

export default SubjectsList
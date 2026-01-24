import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Subject } from '../../api/tasks'
import SubjectCard from './SubjectCard'

interface SubjectGridProps {
  subjects: Subject[]
  hasMore: boolean
  onLoadMore: () => void
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ 
  subjects, 
  hasMore, 
  onLoadMore 
}) => {
  return (
    <InfiniteScroll
      dataLength={subjects.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={<div className="text-center py-4">Загрузка...</div>}
      endMessage={<div className="text-center py-4 text-gray-500">Больше предметов нет</div>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </InfiniteScroll>
  )
}

export default SubjectGrid
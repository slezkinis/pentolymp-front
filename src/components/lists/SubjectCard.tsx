import React from 'react'
import { Link } from 'react-router-dom'
import { FaBook } from 'react-icons/fa'
import { Subject } from '../../api/tasks'
import { Card } from '../ui'

interface SubjectCardProps {
  subject: Subject
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link to={`/subjects/${subject.id}/topics`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center mb-2">
          <FaBook className="text-indigo-500 mr-3 text-2xl" />
          <h2 className="text-xl font-semibold text-gray-800">{subject.name}</h2>
        </div>
        <p className="text-gray-600">Нажмите, чтобы посмотреть темы</p>
      </Card>
    </Link>
  )
}

export default SubjectCard
import React from 'react'
import { Rating } from '../../api/auth'

interface RatingStatsProps {
  rating: Rating
}

const RatingStats: React.FC<RatingStatsProps> = ({ rating }) => {
  const winRate = rating.matches_played > 0 
    ? Math.round((rating.matches_won / rating.matches_played) * 100) 
    : 0

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика рейтинга</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{rating.score}</div>
          <div className="text-sm text-gray-600">Рейтинг</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{winRate}%</div>
          <div className="text-sm text-gray-600">Побед</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Всего игр:</span>
            <span className="font-medium">{rating.matches_played}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Побед:</span>
            <span className="font-medium text-green-600">{rating.matches_won}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Поражений:</span>
            <span className="font-medium text-red-600">{rating.matches_lost}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ничьих:</span>
            <span className="font-medium text-yellow-600">{rating.matches_drawn}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingStats
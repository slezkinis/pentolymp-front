import Card from '../ui/Card'
import Button from '../ui/Button'

interface MatchResultsProps {
  result: {
    winner: {
      user_id: number
      username: string
    }
    participants: Array<{
      user_id: number
      username: string
      tasks_solved: number
      time_taken: number
    }>
    result: 'player1_win' | 'player2_win' | 'draw'
  }
  onExit: () => void
}

export default function MatchResults({ result, onExit }: MatchResultsProps) {
  const currentUserId = parseInt(localStorage.getItem('user_id') || '0')
  const isWinner = result.winner?.user_id === currentUserId
  const isDraw = result.result === 'draw'
  
  const myResult = result.participants.find(p => p.user_id === currentUserId)
  const opponentResult = result.participants.find(p => p.user_id !== currentUserId)

  const getResultEmoji = () => {
    if (isDraw) return '🤝'
    return isWinner ? '🎉' : '😔'
  }

  const getResultTitle = () => {
    if (isDraw) return 'Ничья!'
    return isWinner ? 'Победа!' : 'Поражение'
  }

  const getResultMessage = () => {
    if (isDraw) return 'Матч закончился вничью'
    return isWinner ? 'Поздравляем с отличной игрой!' : 'В следующий раз получится!'
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}с`
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}м ${secs}с`
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="text-center p-8">
        <div className="mb-8">
          <div className="text-6xl mb-4">{getResultEmoji()}</div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            {getResultTitle()}
          </h1>
          <p className="text-lg text-gray-600">
            {getResultMessage()}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Результаты матча</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ваш результат */}
            <div className={`p-6 rounded-lg border-2 ${
              isWinner 
                ? 'border-green-500 bg-green-50' 
                : isDraw 
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {myResult?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{myResult?.username}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Решено задач: <span className="font-bold">{myResult?.tasks_solved}</span></div>
                <div>Время: <span className="font-bold">{formatTime(myResult?.time_taken || 0)}</span></div>
                <div>Статус: <span className="font-bold">{isWinner ? '🏆 Победитель' : isDraw ? '🤝 Ничья' : 'Участник'}</span></div>
              </div>
            </div>

            {/* Результат оппонента */}
            <div className={`p-6 rounded-lg border-2 ${
              !isWinner && !isDraw
                ? 'border-green-500 bg-green-50' 
                : isDraw 
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {opponentResult?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{opponentResult?.username}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Решено задач: <span className="font-bold">{opponentResult?.tasks_solved}</span></div>
                <div>Время: <span className="font-bold">{formatTime(opponentResult?.time_taken || 0)}</span></div>
                <div>Статус: <span className="font-bold">{!isWinner && !isDraw ? '🏆 Победитель' : isDraw ? '🤝 Ничья' : 'Участник'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {isWinner && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800 font-semibold">
              🏆 Отличный результат! Вы решили больше задач, чем ваш соперник.
            </p>
          </div>
        )}

        {!isWinner && !isDraw && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 rounded-lg">
            <p className="text-blue-800">
              💪 Продолжайте тренироваться! В следующий раз вы обязательно победите.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={onExit} className="px-8 py-3">
            Выйти в меню
          </Button>
        </div>
      </Card>
    </div>
  )
}
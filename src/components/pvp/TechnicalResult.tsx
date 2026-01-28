import Card from '../ui/Card'
import Button from '../ui/Button'

interface TechnicalResultProps {
  onExit: () => void
}

export default function TechnicalResult({ onExit }: TechnicalResultProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="text-center p-8">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Техническое завершение
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Матч был завершен технически
          </p>
          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
            <p className="font-semibold">
              Это могло произойти из-за:
            </p>
            <ul className="text-left mt-2 space-y-1">
              <li>• Потери соединения с сервером</li>
              <li>• Выхода одного из игроков</li>
              <li>• Технической проблемы на сервере</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Не волнуйтесь, это не повлияет на ваш рейтинг. Попробуйте начать новый матч.
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={onExit} className="px-8 py-3">
            Выйти в меню
          </Button>
        </div>
      </Card>
    </div>
  )
}
import { useState } from 'react'
import PvpQueueScreen from '../components/pvp/PvpQueueScreen'
import PvpMatchScreen from '../components/pvp/PvpMatchScreen'

export default function PvpPage() {
  const [currentMatchId, setCurrentMatchId] = useState<number | null>(null)

  const handleMatchFound = (matchId: number) => {
    setCurrentMatchId(matchId)
  }

  const handleExitMatch = () => {
    setCurrentMatchId(null)
  }

  if (currentMatchId) {
    return (
      <div>
        <PvpMatchScreen 
          matchId={currentMatchId} 
          onExit={handleExitMatch} 
        />
      </div>
    )
  }

  return (
    <div>
      <PvpQueueScreen onMatchFound={handleMatchFound} />
    </div>
  )
}
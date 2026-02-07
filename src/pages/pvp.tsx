'use client'
import PvP_match_screen from '../components/PvP_battle_screen/PvP_battle_screen';
import PvP_menu from '../components/PvP_menu/PvP_menu'
import { useState } from 'react';


const PvP_page = () => {
    const [currentMatchId, setCurrentMatchId] = useState<number | null>(null)
    
    const handleMatchFound = (matchId: number) => {
        setCurrentMatchId(matchId)
    }

    const handleExitMatch = () => {
        setCurrentMatchId(null)
    }

    if (currentMatchId) {
        return (
            <PvP_match_screen 
            matchId={currentMatchId} 
            onExit={handleExitMatch} 
            />
        )
    }
    return (
        <>
            <main>
                <PvP_menu onMatchFound={handleMatchFound}/>
            </main>
        </>
    );
}

export default PvP_page
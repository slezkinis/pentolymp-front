import { PvP_result } from '../components/PvP_result/PvP_result'


interface ResultProps {
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
}

const PvP_result_page = ({result}: ResultProps) => {
    return (
        <>
            <main>
                <PvP_result result_object={result}/>
            </main>
        </>
    );
}

export default PvP_result_page
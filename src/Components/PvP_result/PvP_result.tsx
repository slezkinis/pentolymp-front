import Styles from "./PvP_result.module.css";



interface MatchResultsProps {
  result_object: {
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


export const PvP_result = ({result_object}: MatchResultsProps) => {
  const currentUserId = parseInt(localStorage.getItem('user_id') || '0')
  const isDraw = result_object.result === 'draw'
  const isWinner = result_object.winner?.user_id === currentUserId
  const myResult = result_object.participants.find(p => p.user_id === currentUserId)
  const opponentResult = result_object.participants.find(p => p.user_id !== currentUserId)
  let result_text;
  if (isWinner) {
    result_text = 'win'
  } else {
    if (isDraw) {
        result_text = 'draw'
    } else {
        result_text = 'loose'
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}с`
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}м ${secs}с`
  }
  
  return (
    <div className={Styles.result_menu}>
        {result_text === 'win'
        ? (<>
            <div className={Styles.result_emoji}>🎉</div>
            <h1 className={Styles.result_title}>Победа!</h1>
            <div className={Styles.result_undertext}>Поздравляем с отличной игрой</div>
        </>
        )
        : (result_text === 'loose'
            ? (
                <>
                    <div className={Styles.result_emoji}>😔</div>
                    <h1 className={Styles.result_title}>Поражение</h1>
                    <div className={Styles.result_undertext}>В следующий раз получится!</div>
                </>
            )
            : (
                <>
                    <div className={Styles.result_emoji}>🤝</div>
                    <h1 className={Styles.result_title}>Ничья!</h1>
                    <div className={Styles.result_undertext}>Матч закончился вничью</div>
                </>
            )
        )
        }
        <h2>Результаты матча</h2>
        <div className={Styles.players_container}>
            <div className={`${Styles.player} ${result_text === 'win' ? (Styles.winner) : (result_text === 'loose' ? (Styles.player) : (Styles.draw))}`}>
                <h1 className={Styles.player_nickname}>{myResult?.username}</h1>
                <div className={Styles.line_container}>
                    <div>Решено задач:</div>
                    <div>{myResult?.tasks_solved}</div>
                </div>
                <div className={Styles.line_container}>
                    <div>Время:</div>
                    <div>{formatTime(myResult?.time_taken || 0)}</div>
                </div>
                <div className={Styles.line_container}>
                    <div>Статус:</div>
                    <div style={{paddingBottom: '15%'}}>{result_text === 'win' ? 'Победитель' : (result_text === 'loose' ? 'Участник' : 'Ничья')}</div>
                </div>
            </div>
            <div className={`${Styles.player} ${result_text === 'win' ? (Styles.player) : (result_text === 'loose' ? (Styles.winner) : (Styles.draw))}`}>
                <h1 className={Styles.player_nickname}>{opponentResult?.username}</h1>
                <div className={Styles.line_container}>
                    <div>Решено задач:</div>
                    <div>{opponentResult?.tasks_solved}</div>
                </div>
                <div className={Styles.line_container}>
                    <div>Время:</div>
                    <div>{formatTime(opponentResult?.time_taken || 0)}</div>
                </div>
                <div className={Styles.line_container}>
                    <div>Статус:</div>
                    <div style={{paddingBottom: '15%'}}>{result_text === 'win' ? 'Участник' : (result_text === 'loose' ? 'Победитель' : 'Ничья')}</div>
                </div>
            </div>
        </div>
        
        {result_text === 'win'
        ? (
            <div className={Styles.result_win_message}>🏆 Отличный результат! Вы решили больше задач, чем ваш соперник.</div>
        )
        : (result_text === 'loose'
            ? (
                <div className={Styles.result_loose_message}>💪 Продолжайте тренироваться! В следующий раз вы обязательно победите.</div>
            )
            : (
                <></>
            )
        )
        }

        <button className={Styles.exit_button}><a className={Styles.exit_link} href='/pvp'>Выйти в меню</a></button>
    </div>
  );
};

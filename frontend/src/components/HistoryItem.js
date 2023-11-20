function HistoryItem({player1, player2, player1_score, player2_score, played_at}){
    return (
        <li>
            [ {played_at} ] {' '}
            {player1?.username} {player1_score < 0 ? 'Gave Up' : player1_score} : {' '}
            {player2?.username} {player2_score < 0 ? 'Gave Up' : player2_score}
        </li>
    )
}

export default HistoryItem;
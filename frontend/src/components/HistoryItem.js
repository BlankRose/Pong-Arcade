import { Link } from 'react-router-dom';
import {useState} from 'react'
import '../styles/HistoryItem.css'


function HistoryItem({player1, player2, player1_score, player2_score, played_at}){

	const [ display, setDisplay ] = useState({display: 'none'});
	const date = new Date(played_at); // Convert to Date object
	const min_ago = Math.floor((Date.now() - date.getTime()) / 60000);
	const hour_ago = Math.floor((Date.now() - date.getTime()) / 3600000);
	const days_ago = Math.floor((Date.now() - date.getTime()) / 86400000);

	return (
		<li className='history-item'
			onMouseEnter={() => setDisplay({display: 'block'})}
			onMouseLeave={() => setDisplay({display: 'none'})}>

			<Link className='link-name' to={`/profile/${player1?.id}`}>{player1?.username}</Link> {' '}
			{player1_score < 0 ? 'Gave Up' :  player1_score}  : {' '}
			<Link className='link-name' to={`/profile/${player2?.id}`}>{player2?.username}</Link> {' '}
			{player2_score < 0 ? 'Gave Up' : player2_score}
			<div className='history-date' style={display}>
				Played on: {date.toLocaleString()} ({
					min_ago <= 0
						? 'Just now'
					: hour_ago <= 0
						? `${min_ago} minutes ago`
					: days_ago <= 0
						? `${hour_ago} hours ago`
						: `${days_ago} days ago`
				})
			</div>
			<br></br>
		</li>
		
	)
}

export default HistoryItem;
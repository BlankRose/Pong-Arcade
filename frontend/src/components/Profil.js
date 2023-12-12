import React, { useEffect, useState } from 'react';
import apiHandle, { withAuth } from './API_Access';
import Avatar from '../assets/avatar.jpeg';
import {Link} from 'react-router-dom';
import ProgressBar from './ProgressBar/bar';
import HistoryItem from './HistoryItem';

import '../styles/Profil.css';

function Profil({ username }) {
	const [user, setUser] = useState(null);
	const [avatar, setAvatar] = useState(Avatar);
	const [isHistory, setIsHistory] = useState(false);
	const [history, setHistory] = useState(null);

	useEffect(() => {
		apiHandle.get(`/users/${username || 'me'}`, withAuth())
			.then(response => {
				setUser(response.data);
				if (response.data && response.data.avatar)
					setAvatar(response.data.avatar);
				else
					setAvatar(Avatar);
			})
			.catch(_ => {
				console.error('Failed to fetch user data')
			});

		apiHandle.get(`/users/${username || 'me'}/history`, withAuth())
			.then(response => {
				setHistory(response.data)
			})
			.catch(_ => {
				console.error('Failed to fetch user history')
			})
	}, [username]);

	return (
		user
			?
			 <div className= "Container">
				<div className='CardProfil'>
					<div className='profil'>
						<img className='Profil-avatar' alt='profil' src= {avatar}/>
						<h2 className="Profil-username">{user ? user.username : undefined }<br/>>> { user?.status ? user.status : 'offline' }</h2>
						{ (!username && <Link to='/updateProfile' className= "updateProfile" >Modifier Profil</Link>)
							|| <Link to='/' className= "updateProfile" >Retour</Link> }
					</div>
					<div className = 'stats'>
						<ul className='list-stat'>
							<li className='Profil-stat'>Rank: {user ? user.rank : undefined} ( {user ? user.xp : undefined} / {user ? user.rank * 100 : undefined} )
								<ProgressBar bgcolor={'green'} progress={user ? (user.xp / user.rank).toFixed(2) : undefined} height={30} />
							</li>
							<li className='Profil-stat'>Wins: {user ? user.win : undefined}</li>
							<li className='Profil-stat'>Lose: {user ? user.lose : undefined}</li>
							<li className='Profil-stat'>Ratio: {user ? Number(user.streak).toFixed(2) : undefined}</li>
						</ul>
					</div>
					<div className='historique'>
  					{isHistory ? (
    				<>
      				<button className='button-h' onClick={() => setIsHistory(false)}>Historique des match</button>
      				{history && history.length > 0 ? (
        			<ul className='history-list'>
          				{history.map(game => (
            			<HistoryItem
              				key={game.id}
              				player1={game.playerOne}
              				player2={game.playerTwo}
              				player1_score={game.scorePlayerOne}
              				player2_score={game.scorePlayerTwo}
              				played_at={game.playedOn}
            			/>
          				))}
        			</ul>
      					) : (
        					<p className="empty-h">Aucun historique disponible.</p>
    		 	 )}
    				</>
  			) : (
    			<>
      			<button className='button-h' onClick={() => setIsHistory(true)}>Historique des match</button>
    			</>
  )}
				</div>

				</div>
				<div className='Friend-list'>
					Comming Soon (TM)
				</div>
			</div>
			: <p className='Profil-load alert alert-warning'>Loading... Are you sure the user exists?</p>
	)
}

export default Profil

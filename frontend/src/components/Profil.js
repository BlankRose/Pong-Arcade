import React, { useEffect, useState } from 'react';
import apiHandle, { withAuth } from './API_Access';
import Avatar from '../assets/avatar.jpeg';
import {Link} from 'react-router-dom';

import '../styles/Profil.css';

function Profil({ username }) {
	const [user, setUser] = useState(null);
	const [avatar, setAvatar] = useState(Avatar);

	useEffect(() => {
		apiHandle.get(`/users/${username || 'me'}`, withAuth() )
			.then(response => {
				setUser(response.data);
				if (response.data && response.data.avatar)
					setAvatar(response.data.avatar);
			})
			.catch(_ => {
				console.error('Failed to fetch user data')
			});
	}, [username]);

	return (
		user
			? <div className= "Container">
				<div className='CardProfil'>
					<div className='profil'>
						<img className='Profil-avatar' alt='profil' src= {avatar}/>
						<h2 className="Profil-username">{user ? user.username : undefined }</h2>
						{ (!username && <Link to='/updateProfil' className= "updateProfile" >Modifier Profil</Link>)
							|| <Link to='/' className= "updateProfile" >Retour</Link> }
					</div>
					<div className = 'stats'>
						<ul className='list-stat'>
							<li className='Profil-stat'>Rank: {user ? user.rank : undefined} </li>
							<li className='Profil-stat'>Wins: {user ? user.win : undefined}</li>
							<li className='Profil-stat'>Lose: {user ? user.lose : undefined}</li>
							<li className='Profil-stat'>Ratio: {user ? user.streak : undefined}</li>
						</ul>
					</div>
					<div className = 'historique'>
						<button className='button-h'>Historique des match</button>
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

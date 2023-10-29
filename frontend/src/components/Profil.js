import React, { useEffect, useState } from 'react';
import apiHandle, { withAuth } from './API_Access';
import Avatar from '../assets/avatar.jpeg';
import '../styles/Profil.css'
import {Link} from 'react-router-dom';

function Profil() {
	const [user, setUser] = useState(null);
	const [avatar, setAvatar] = useState(Avatar);
	const [pseudo, setPseudo] = useState('')

	//Recuperation de l'utilisateur connecté via le token d'authentification. 

	useEffect(() => {
		apiHandle.get('/users/me', withAuth() )
			.then(response => {
				setUser(response.data)
			})
			.catch(err => {
				console.error(err);
			});
		
		if (user && user.avatar) {
			// Requete de l avatar sur le back
		}
	}, []);


	return (
		<div className= "Container">
			<div className='CardProfil'>
				<div className='profil'>
						<img className='Profil-avatar' alt='profil' src= {avatar}/>
						<h2 className="Profil-username">{user ? user.username : undefined }</h2>
						<Link to='/updateProfil' className= "updateProfile" >Modifier Profil</Link>
					</div>
					<div className = 'stats'>
						<ul className='list-stat'>
							<li className='Profil-stat'>Rank: {user ? user.rank : undefined} </li>
							<li className='Profil-stat'> Victoire: {user ? user.win : undefined}</li>
							<li className='Profil-stat'> Defaite: {user ? user.lose : undefined}</li>
							<li className='Profil-stat'> Ratio: {user ? user.streak : undefined}</li>
						</ul>
					</div>
					<div className = 'historique'>
						<button className='button-h'>Historique des match</button>
					</div>
			</div>				
			<div className='Friend-list'>
				en construction ....
			</div>			
		</div>
	)
}

export default Profil

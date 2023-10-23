import React, { useEffect, useState } from 'react';
import apiHandle, { withAuth } from './API_Access';
import Avatar from '../assets/avatar.jpeg';
import '../styles/Profil.css'

function Profil() {
	const [user, setUser] = useState(null);
	const [avatar, setAvatar] = useState(Avatar);

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
		<div className='CardProfil'>
				<div className='row_1'>
					<img className='Profil-avatar' alt='profil' src= {avatar}/>
					<h2 className="Profil-username">{user ? user.username : undefined }</h2>
				</div>
				<div className = 'row_2'>
					<p>Rank: {user ? user.rank : undefined}</p>
					<p>Victoire: {user ? user.win : undefined} </p>
					<p>Defaite: {user ? user.lose : undefined} </p>
					<p>Ratio: {user ? user.streak : undefined}</p>
										
										

				</div>				
				
		</div>
	)
}

export default Profil

import React, { useEffect, useState } from 'react';
import apiHandle, { withAuth } from './API_Access';

function Profil() {
	const [user, setUser] = useState(null);

	//Recuperation de l'utilisateur connecté via le token d'authentification. 

	useEffect(() => {
		apiHandle.get('/users/me', withAuth() )
			.then(response => {
				setUser(response.data)
			});
	}, []);

	return (
		<div className='CardProfil'>

			<img className='Profil-avatar' alt='photo-de-profil' src= "../assets/avatar2.jpg"/>
			<h2>{user ? user.username : undefined } </h2>
			<p>Victoire: {user ? user.win : undefined}</p>
			<p>Defaite: {user ? user.lose : undefined}</p>
			<p>Ratio: {user ? user.streak : undefined}</p>
		</div>
	)
}

export default Profil

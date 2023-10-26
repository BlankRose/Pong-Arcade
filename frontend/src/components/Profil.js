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
		<div className= "CardProfil">
				<div className='row_1'>
					<img className='Profil-avatar' alt='profil' src= {avatar}/>
					<h2 className="Profil-username">{user ? user.username : undefined }</h2>
					<Link className="btn btn-primary m-5 h-25" to='/updateProfil/${user.id}'>Modifier Profil</Link>
				</div>
				<div className = 'row_2'>
					<p className='Profil-stat'>Rank: {user ? user.rank : undefined}</p>
					<p className='Profil-stat'>Victoire: {user ? user.win : undefined} </p>
					<p className='Profil-stat'>Defaite: {user ? user.lose : undefined} </p>
					<p className='Profil-stat'>Ratio: {user ? user.streak : undefined}</p>
				</div>
				<div className = 'row_3'>
					<button className='historique'>Historique des match</button>
				</div>			
		</div>
	)
}

export default Profil

import {Outlet, Link} from "react-router-dom";
import '../styles/Header.css'
import Avatar from '../assets/avatar.jpeg'
import { useState, useEffect } from "react";
import apiHandle, { withAuth } from './API_Access'

const Header = ({ onLogout }) => {

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
        <>
        <header>
            <div className="title-header">Pong_42</div>
            <nav>
                <ul className="list-inline m-4">
                    <li className="list-inline-item me-4">
                        <Link to ="/" className="text-nav">Home</Link>
                    </li>
                    <li className="list-inline-item me-4">
                        <Link to ="/game" className="text-nav">Jeu</Link>
                    </li>
                    <li className="list-inline-item me-4">
                        <Link to ="/chat" className="text-nav">Chat</Link>
                    </li>
                    <li className="list-inline-item me-4">
                        <Link to = "/profil" className="text-nav">Profil</Link>
                    </li>
                </ul>
                <div className="Avatar">
                    <button className="invisible-button" onClick={onLogout}> 
                        <img className="Avatar-profil" alt='profil' src= {avatar} />
                    </button>                    
                    <span>Deconnexion</span>

                </div>
                    
            </nav>
        <Outlet />
        </header>
        </>
    )
}

export default Header;
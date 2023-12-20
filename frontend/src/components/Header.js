import {Outlet, Link} from "react-router-dom";
import Avatar from '../assets/avatar.jpeg'
import { useState, useEffect } from "react";
import apiHandle, { withAuth } from './API_Access';

import '../styles/Header.css';

const Header = ({ onLogout }) => {

	const [avatar, setAvatar] = useState(Avatar);

	useEffect(() => {
		apiHandle.get('/users/me', withAuth() )
			.then(response => {
				if (response.data && response.data.avatar)
					setAvatar(response.data.avatar);
			})
			.catch(_ => {
				console.error('Failed to fetch user data1')
			});
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
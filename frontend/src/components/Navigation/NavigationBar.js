import styles from './NavigationBar.module.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faGamepad, faTrophy } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from '../Logout/LogoutButton'
import React, { useEffect, useState } from 'react';
import apiHandle from '../API_Access';
import { withAuth } from '../API_Access';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(useSelector((state) => state.user.status));

    const navLinks = [
        { to: '/profile', text: 'Profile', icon: faUser },
        // { to: '/2fa', text: '2FA', icon: faLock },
        { to: '/chat', text: 'Chat', icon: faComments },
        { to: '/game', text: 'Game', icon: faGamepad },
        {to: '/leader', text: 'Leader', icon: faTrophy },
        { to: '/friends', text: 'Friends', icon: faUser}
    ];

    useEffect (()=> {
		apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
            console.log("&&&&&&&&&&&", res.data)
			setIsLoggedIn(res.data)
		})
		.catch(err => {
			console.warn(err.response);
		});
	})
console.log ("(((((((((((((((((", isLoggedIn)
    
    return (
        <header>
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.leftContainer}>
                        {isLoggedIn === 'online' &&
                            navLinks.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        isActive ? styles.active : undefined
                                    }
                                >
                                    <FontAwesomeIcon icon={link.icon} />
                                    {link.text}
                                </NavLink>
                                
                            ))
                        }
                    </div>
                    <div className={styles.centerContainer}>
                        {isLoggedIn === 'online' && (
                            <LogoutButton></LogoutButton>
                        )}
        
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

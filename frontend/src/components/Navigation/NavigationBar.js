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
	const [refresh, setRefresh] = useState(0);
		
		
  const handleLogout = () => {
	if (refresh === 0)
	{
		setRefresh((prevRefresh) => prevRefresh + 1);
	}
	else {
		setRefresh((prevRefresh) => prevRefresh - 1);
	}
  };


	const navLinks = [
		{ to: '/home', text: 'Pong', icon: undefined },
		{ to: '/profile', text: 'Profile', icon: faUser },
		{ to: '/chat', text: 'Chat', icon: faComments },
		{ to: '/game', text: 'Game', icon: faGamepad },
		{ to: '/leader', text: 'Leader', icon: faTrophy },
		{ to: '/friends', text: 'Friends', icon: faUser}
	];

	useEffect (() => {
		const fetchData = () => {
			apiHandle.get('/auth/loginStatus', withAuth())
			.then(res => {
				if (res){
					setIsLoggedIn(res.data)
				} else {
					setIsLoggedIn('offline')
				}
			})
			.catch(err => {
				setIsLoggedIn('offline')
				console.warn(err.response);
			});
		}

		fetchData();
		const intervalId = setInterval(fetchData, 5000);
		return () => clearInterval(intervalId);
	},[refresh])
		
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
							<LogoutButton onLogout={handleLogout}/>
						)}
		
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;

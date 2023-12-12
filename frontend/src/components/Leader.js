import React, { useEffect, useState} from 'react';
import apiHandle, { withAuth } from './API_Access';
import '../styles/Leader.css';
import { Link } from 'react-router-dom';

import Avatar from "../assets/avatar.jpeg";

const Leader = () => {

	const [listUser, setlistUser] = useState([]);

	const elolist = listUser.sort((a,b) => (a.elo < b.elo ? 1 : -1));

	const rankClass = (position) => {
		switch(position) {
			case 1:
				return 'first';
			case 2:
				return 'second';
			case 3:
				return 'third';
			default:
				return 'others';
		}
	};

	useEffect(() => {
		apiHandle.get('/users/all', withAuth())
		.then(response => {
			if (response.data)
				setlistUser(response.data);
		})
		.catch(error => {
			console.error('Failed to fetched all users data', error);
		});
	}, []);

	return (
		<div className = "Container_two">
			<h1 className='leader-title'>Leaderboard</h1>
			<br/>
			<ul className='leader-list'>
				{elolist.map((user, index) => (
					<li key={user.id} className='leader'>
						<div className='leader-user'>
							<div className={`${rankClass(index + 1)}`}> {index === 0 ? index + 1 + 'ST':
								index === 1 ? index + 1 + 'ND' :
								index === 2 ? index + 1 + 'RD ' :
								index + 1 + 'TH '}
							</div>
							<Link className='link' to={`/profile/${user?.id}`}>
								<img src={user?.avatar ? user.avatar : Avatar} alt='avatar'/>
								{user?.username}
							</Link>
							<div>{user.elo} pts</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Leader;
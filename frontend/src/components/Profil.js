import React, { useEffect, useState } from 'react';
import apiHandle, { withAuth } from './API_Access';

function Profil() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		apiHandle.get('/users/me', withAuth() )
			.then(response => {
				setUser(response.data)
			});
	}, []);

	return (
		<div>
			<h1>Bonjour {user ? user.username : undefined}</h1>
		</div>
	)
}

export default Profil

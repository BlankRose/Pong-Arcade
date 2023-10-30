import React, { useEffect, useState} from 'react';
import apiHandle, { withAuth } from './API_Access';

function UpdateProfil() {

	const [user, setUser] = useState(null);

	useEffect(() => {
		apiHandle.get('/users/me', withAuth() )
			.then(response => {
				setUser(response.data);
			})
			.catch(err => {
				console.error(err);
			});
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault();
		apiHandle.patch('/users/me',user, withAuth())
		.then(_ => {
			console.log(user.username);
		})
		.catch(err => console.log(err))
		if (user.avatar) {
			apiHandle.post('/users/me/avatar', { isUrl: true, data: user.avatar }, withAuth())
				.then(_ => {
					console.log('Avatar defined');
				})
				.catch(_ => {
					console.error('Failed to set avatar');
				});
		} else {
			apiHandle.delete('/users/me/avatar', withAuth());
		}
	}

	return(
		<div className="d-block w-100 vh-100 m-4">
			<div className='border bg-gray w-50 p-5 mx-auto'>
				<h2>Modifier votre profil</h2>
				<br></br>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor='username'>Pseudo</label>
						<input type="text"
							id='username'
							className='form-control'
							placeholder='modifier votre pseudo'
							value={user ? user.username : undefined}
							onChange={e =>setUser({...user, username: e.target.value})}
						/>
						<label htmlFor='avatarUrl'>Avatar</label>
						<input type="text"
							id='avatarUrl'
							className='form-control'
							placeholder='modifier votre avatar'
							value={user ? user.avatar : undefined}
							onChange={e =>setUser({...user, avatar: e.target.value})}
						/>
						</div>
						<br></br>
						<button className="btn-info">Valider</button>
				</form>
			</div>						   
		</div>	   
	)
}

export default UpdateProfil;
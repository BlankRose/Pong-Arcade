import React, { useEffect, useState} from 'react';
import apiHandle, { withAuth } from './API_Access';

function UpdateProfil() {

	const [user, setUser] = useState(null);
	const [avatar, setAvatar] = useState(null);

	const [errorName, setErrorName] = useState(null);
	const [errorAvatar, setErrorAvatar] = useState(null);

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
			setErrorName(null);
		})
		.catch(err => {
			setErrorName(err.response.data.message);
		});

		if (user.avatar) {
			apiHandle.post('/users/me/avatar', {
					data: avatar ? avatar : user.avatar
				}, withAuth())
				.then(_ => {
					setErrorAvatar(null);
				})
				.catch(err => {
					if (413 === err.response.status)
						setErrorAvatar('Provided image is too large');
					else
						setErrorAvatar(err.response.data.message);
				});
		} else {
			apiHandle.delete('/users/me/avatar', withAuth())
				.then(_ => {
					setErrorAvatar(null);
				})
				.catch(err => {
					setErrorAvatar(err.response.data.message);
				});
		}
	}

	const handleUpload = (img) => {
		if (!img)
			return;
		const reader = new FileReader();
		reader.onload = () => {
			setAvatar(reader.result);
			setErrorAvatar(null);
		}
		reader.onerror = (err) => {
			setAvatar(null);
			setErrorAvatar('Impossible de charger l\'image: ', err.target.error.message);
		}
		reader.readAsDataURL(img);
	}

	return (
		<div className="d-block w-100 vh-100 m-4">
			<div className='border bg-gray w-50 p-5 mx-auto'>
				<h2>Modify your profile</h2>
				<br></br>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor='username'>
							Username
							{ errorName
								? <span className='inline text-danger'> X</span>
								: <span className='inline text-success'> V</span> }
						</label>
						<input type="text"
							id='username'
							className='form-control'
							placeholder='Modify your username'
							value={user ? user.username : undefined}
							onChange={e =>setUser({...user, username: e.target.value})}
						/>
						<label htmlFor='avatarUrl'>
							Avatar
							{ errorAvatar
								? <span className='text-danger'> X</span>
								: <span className='text-success'> V</span> }
						</label>
						<input type="text"
							id='avatarUrl'
							className='form-control'
							placeholder='Modify avatar, via URL or upload a file'
							value={user && user.avatar && user.avatar.startsWith('http') ? user.avatar : undefined}
							onChange={e =>setUser({...user, avatar: e.target.value})}
						/>
						<input type="file"
							id='avatarFile'
							className='form-control'
							onChange={e => handleUpload(e.target.files[0])}
							onClick={e => {e.target.value = null && setAvatar(null)}}
						/>
						</div>
						<br></br>
						<button className="btn-info">Valider</button>
				</form>
				{
					(errorName || errorAvatar ) && 
					<div className='alert alert-danger mt-3'>
						{errorName && <p className='m-0'>{errorName}</p>}
						{errorAvatar && <p className='m-0'>{errorAvatar}</p>}
					</div>
				}
			</div>
		</div>
	)
}

export default UpdateProfil;
import React, { useEffect, useState} from 'react';
import apiHandle, { withAuth } from './API_Access';

function UpdateProfil() {

    const [user, setUser] = useState(null);

    //Recuperation de l'utilisateur connecté via le token d'authentification. 

	useEffect(() => {
		apiHandle.get('/users/me', withAuth() )
			.then(response => {
				setUser({...user, username: response.data.username})
			})
			.catch(err => {
				console.error(err);
			});
        }, [])

        //update de username avec Patch

        const handleSubmit = (e) => {
            e.preventDefault();
            apiHandle.patch('/users/me',user, withAuth())
            .then(res => {
                console.log(user.username);
            })
            .catch(err => console.log(err))
        }



    return(
        <div className="d-block w-100 vh-100 m-4">
            <div className='border bg-gray w-50 p-5 mx-auto'>
                <h2>Modifier votre profil</h2>
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='username'> Pseudo</label>
                        <input type="text"
                        id='username'
                        className='form-control'
                        placeholder='modifier votre pseudo'
                        value={user ? user.username : undefined}
                        onChange={e =>setUser({...user, username: e.target.value})}
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
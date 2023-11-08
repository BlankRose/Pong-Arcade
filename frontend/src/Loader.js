import store from './store/index.js'
import apiHandle, { withAuth } from './components/API_Access.js'
import userSlice from './store/user.js';

export async function statusLoader() {

	apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
			if (res.data === 'online') {
                console.log("aa")
				store.dispatch(userSlice.actions.setOnline())
			} else {
				store.dispatch(userSlice.actions.setOffline())
			}
		})
		.catch(err => {
			console.warn(err.response);
        
		});
        
	/*
    const response = await fetch('http://localhost:5501/auth/loginStatus', {
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })

    console.log(response.status, response)
    if (response.status !== 200) {
        throw new Response(JSON.stringify({message: 'Error getting user info'}), {
            status: 400,
        })
    }

	const data = await response.json()

	if (data.status === 'online') {
        store.dispatch(userSlice.actions.setOnline())
    } else if (data.status === 'offline') {
        store.dispatch(userSlice.actions.setOffline())
    }
*/
	return null;
	
}

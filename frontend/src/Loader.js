import store from './store/index.js'
import apiHandle, { withAuth } from './components/API_Access.js'
import userSlice from './store/user.js';

const key_name = "lastAttempt";

export async function statusLoader({ connectSockets, disconnectSockets })
{
	// ANTI-FLICKERING: ALLOW TIME FOR BACKEND TO REGISTER CORRECTLY
	const last = parseInt(localStorage.getItem(key_name)) || 0;
	if (Date.now() < last + 500) // 500 MS
		return null;
	apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
			if (res.data !== 'offline') {
				connectSockets();
				store.dispatch(userSlice.actions.setOnline())
				localStorage.setItem(key_name, Date.now().toString());
			} else {
				disconnectSockets();
				store.dispatch(userSlice.actions.setOffline());
				localStorage.removeItem(key_name);
			}
		})
		.catch(err => {
			console.warn(err.response);
		});
	return null;
}
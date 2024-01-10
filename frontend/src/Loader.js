import store from './store/index.js'
import apiHandle, { withAuth } from './components/API_Access.js'
import userSlice from './store/user.js';

const key_name = "lastAttempt";

export async function statusLoader({ connectSockets, disconnectSockets })
{
	// const userStatus = useSelector(state=> state.user.status)
    // console.log("userstatus: ", userStatus)
    console.log("statusLoader")
	apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
            console.log("res: ", res)
			if (res.data !== 'offline') {
				connectSockets();
				store.dispatch(userSlice.actions.setOnline())
			} else {
				disconnectSockets();
				store.dispatch(userSlice.actions.setOffline());
			}
		})
		.catch(err => {
			console.warn(err.response);
		});
	return null;
}

apiHandle.get('/auth/loginStatus', withAuth())
.then(() => {/* IGNORED */})
.catch(err => {
    console.warn(err.response);
});
import store from './store/index.js'
import apiHandle, { withAuth } from './components/API_Access.js'
import userSlice from './store/user.js';
import { useSelector } from 'react-redux';

export async function statusLoader() {

    // const userStatus = useSelector(state=> state.user.status)
    // console.log("userstatus: ", userStatus)
    console.log("statusLoader")
	apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
            console.log("res: ", res)
			if (res.data === 'online') {
				store.dispatch(userSlice.actions.setOnline())
			} else {
				store.dispatch(userSlice.actions.setOffline())
			}
		})
		.catch(err => {
			console.warn(err.response);
		});
	return null;

}


apiHandle.get('/auth/loginStatus', withAuth())
.then(res => {

})
.catch(err => {
    console.warn(err.response);

});
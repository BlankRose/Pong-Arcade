import apiHandle, { withAuth } from "./components/API_Access";
import userSlice from "./store/user";
import store from './store/index' 


export async function UserLoader() {
    apiHandle.get('/users/me', withAuth())
    .then (res=>{
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$", res.data)
        store.dispatch(userSlice.actions.updateUser(res.data))
    })
    .catch (err => {
    const offlineData = {
            id: -1,
            username: '',
            avatar: '',
            win: 0,
            lose: 0,
            rank: 0,
            _2FAEnabled: false,
            is2FANeeded: false,
            status: 'offline'
        }
        store.dispatch(userSlice.actions.updateUser(offlineData))
        console.error(err.response)
    })

    return null;

}

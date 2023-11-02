import {createSlice} from '@reduxjs/toolkit'
// import User from '../types/userType'

const userSlice = createSlice ({
    name: 'user',
    initialState: { 
        id: -1,
        username: '',
        avatarUrl: '',
        win: 0,
        lose: 0,
        rank: 0,
        is2FAEnabled: false,
        status: 'offline'
       
    },
    reducers: {
        updateUser(state, action) {
            state.user = action.payload;
        },
        setOnline(state) {
            state.status = 'online';
        },
        setOffline(state) {
            state.status = 'offline';
        },
    },
})

export default userSlice
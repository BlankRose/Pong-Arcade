import {createSlice} from '@reduxjs/toolkit'
// import User from '../types/userType'

const userSlice = createSlice ({
    name: 'user',
    initialState: { 
        id: -1,
        username: '',
        avatar: '',
        win: 0,
        lose: 0,
        rank: 0,
        _2FAEnabled: false,
        is2FANeeded: false,
        status: 'offline'
       
    },
    reducers: {
        updateUser(state, action) {
            return {
                ...state,
               ...action.payload
                
            }
        },
        setOnline(state){
            return{
                ...state,
                ...{status: 'online'}
            }
        },
        setOffline(state){
            return{
                ...state,
                ...{status: 'offline'}
            }
        },
    }
})

export default userSlice
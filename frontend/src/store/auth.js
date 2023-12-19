import { createSlice } from '@reduxjs/toolkit'



const authSlice = createSlice({
    name: 'auth',
    initialState: {need2FA: true},
    reducers: {
        confirm2FAAuth: (state, action) => {
            return {...state, need2FA: action.payload}
        }, 
        require2FAAuth: (state) => {
        }
    },
})


export default authSlice;

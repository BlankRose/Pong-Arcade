import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'


const store = configureStore ({
    reducer: {
        user: userSlice.reducer
    },
})

export default store

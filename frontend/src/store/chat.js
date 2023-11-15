import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: { selectedChat: 0 },
    reducers: {
        selectChat(state, action) {
            state.selectedChat = action.payload
        },
    },
})

export default chatSlice

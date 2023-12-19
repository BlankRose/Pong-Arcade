import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: { selectedChat: 0, chatName: "", mutedMembers: [-1, -1] },
    reducers: {
        selectChat(state, action) {
            state.selectedChat = action.payload
        },
        selectChatName(state, action){
            state.chatName = action.payload
        },
        setMutedMembers(state, action){
            state.mutedMembers = [...action.payload]
        }
    },
})

export default chatSlice

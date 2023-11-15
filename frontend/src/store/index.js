import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user";
import authSlice from "./auth";
import chatSlice from "./chat";

const store = configureStore ({
    reducer: {
        auth: authSlice.reducer,
        user: userSlice.reducer,
        chat: chatSlice.reducer
    },
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
})

export default store


// import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevTools } from 'remote-redux-devtools'

// const composeEnhancers = composeWithDevTools({
//   realtime: true,
//   name: 'Your Instance Name',
//   hostname: 'localhost',
//   port: 1024 // the port your remotedev server is running at
// })

// const store = createStore(
//   yourReducer,
//   composeEnhancers(
//     applyMiddleware(/* put your middlewares here */)
//   )
// )
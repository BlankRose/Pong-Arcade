import './styles/App.css';

import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from 'react';

import Login from './components/Login';
import Login42 from './components/42Login';

import Template from './components/Template/template';
import Profil from './components/Profil';
import UpdateProfil from './components/UpdateProfil';
import ChatPage from './pages/Chat';

import TFATurnOn from './pages/2FATurnOn';
import TFACodeVerification from './pages/2FACodeVerification';

// import { statusLoader } from './Loader';389
import {useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom'
import { UserLoader } from './userLoader';
import {statusLoader} from './Loader'
import FriendsPage from './pages/FriendsPage';


const Check2FAForSignIn = ({children}) => {
	const loggedIn = useSelector(state => state.user.status)
	const is2FANeeded = useSelector (state => state.user.is2FANeeded)
	const is2FAEnabled = useSelector (state => state.user._2FAEnabled)


	if (loggedIn === 'offline') {
		return children
	}
	else if (loggedIn === 'online' && is2FAEnabled && is2FANeeded) {
		return <Navigate to="/TFAVerify"/>
	}
	else if (loggedIn === 'online' && is2FANeeded === false ) {
		return <Navigate to="/profile"/>
	}
	else {
	    return children
	}
}

const Check2FAForOtherRoutes  = ({children}) => {
	const loggedIn = useSelector(state => state.user.status)
	const is2FANeeded = useSelector (state => state.user.is2FANeeded)


	if (loggedIn === 'offline') {

		return <Navigate to="/"/>
	}
	else if (loggedIn === 'online' && is2FANeeded === true) {
		return <Navigate to="/TFAVerify"/>
	}
	else {
	    return children
	}
}



function App() {

	const [rerenderKey, setRerenderKey] = useState(0);
	const handleLRerender = () => {
        setRerenderKey(prevKey => prevKey + 1);
    };


	const router = createBrowserRouter([
        {
            path: '/',
            // element: isLoggedIn ? <Template /> : <main><Outlet></Outlet></main>,
			element: <Template />,
            loader: statusLoader,
            children: [
                {
                    path: 'profile',
                    element: <Check2FAForOtherRoutes><Profil /></Check2FAForOtherRoutes>,
					loader: UserLoader
                },
                {
                    path: 'updateProfile',
                    loader: UserLoader,
                    element: <Check2FAForOtherRoutes><UpdateProfil /></Check2FAForOtherRoutes>,
                },
                {
                    path: 'game',
                    element: <Check2FAForOtherRoutes><p>tempo</p></Check2FAForOtherRoutes>,
                },
                {
                    path: 'chat',
                    element: <Check2FAForOtherRoutes><ChatPage/></Check2FAForOtherRoutes>,
                },
				{
                    path: 'friends',
                    element: <Check2FAForOtherRoutes><FriendsPage/></Check2FAForOtherRoutes>,
                },
                {
                    path: '2fa',
					loader: UserLoader,
                    element: <TFATurnOn />,
                },
				{
					path: '/',
					loader: statusLoader,
					element: 
							<Check2FAForSignIn>
							   		<>
		                                <Login  DoRerender={handleLRerender}/>,
	                                	<Login42  DoRerender={handleLRerender} />, 
	                                </> 
							</Check2FAForSignIn>
				},
            ] 
        },
        {
            path: 'TFAVerify',
			loader: UserLoader,
            element: <TFACodeVerification />,
        },

    ]);


	return (
		<RouterProvider router={router} />
	)
}

export default App;


// import './styles/App.css';

// import { useState } from 'react';
// import ReactDom from "react-dom/client";
// import {BrowserRouter, Routes, Route} from "react-router-dom";

// import Login from './components/Login';
// import Login42 from './components/42Login';
// import ChatPage from './components/Chat';
// import Nav from './components/Nav';

// function App() {
// 	const [isLoggedIn, setIsLoggedIn] = useState(false); // état de la connexion

// 	const onLoginSuccess = () => {
// 		setIsLoggedIn(true);
// 	};

// 	const onLogout = () => {
// 		localStorage.removeItem('token');
// 		setIsLoggedIn(false);
// 	};

// 	return (
// 		<div className="App">
// 			{isLoggedIn ? (
// 				<>
// 					<BrowserRouter>
// 					<Routes>
// 					<Route path="/" element={<Nav />}>
// 						<Route index element={<p>tempo</p>} />
// 						<Route path="game" element={<p>tempo</p>} />
// 						<Route path= "chat" element={<ChatPage onLogout={onLogout}/>} />
// 						<Route path="*" element={<p>tempo</p>} />
// 					</Route>

// 					</Routes>
// 					</BrowserRouter>
// 				</>
// 			) : (
// 				<>
// 					<Login onLoginSuccess={onLoginSuccess} />
// 					<Login42 onLoginSuccess={onLoginSuccess} />
// 				</>
// 			)}
// 		</div>
// 	);
// }

// export default App;
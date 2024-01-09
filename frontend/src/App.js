/*import './styles/App.css';

import { useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from 'react';

import apiHandle, { withAuth } from './components/API_Access';
import Login from './components/Login';
import Login42 from './components/42Login';

import Template from './components/Template/template';
import Profil from './components/Profil';
import UpdateProfil from './components/UpdateProfil';
import ProfilContainer from './components/ProfilContainer';
import ChatPage from './pages/Chat';
import Game from './components/Game';
import Leader from './components/Leader';
import Home from './components/Home';

import TFATurnOn from './pages/2FATurnOn';
import TFACodeVerification from './pages/2FACodeVerification';
import { SocketContext } from './contexts/Sockets';

//Fonts
import "./assets/fonts/SuperMario256.ttf"

// import { statusLoader } from './Loader'

const router = (onLogout) => {
	return createBrowserRouter ([
		{
			path: "/",
			element: <Template />,
			// errorElement: <ErrorPage/>,
			// loader: statusLoader,
			children:[
				{
					inde: true,
					path: "/",
					element: (
						<Home />
					)
				},
				{
					index: true,
					path: "profile",
					// loader: userLoader, 
					element: (
						<Profil />
					)
				},
				{
					path: "profile/:username",
					// loader: userLoader, 
					element: (
						<ProfilContainer />
					)
				},
				{
					path: "updateProfile",
					// loader: userLoader, 
					element: (
						<UpdateProfil />
					)
				},
				{
					path: "game",
					// loader: userLoader, 
					element: (
						<Game />
					)
				},
				{
					path: "chat",
					// loader: userLoader,
					element: (
						<ChatPage onLogout={onLogout}/>
					)
				},
				{
					path: "2fa",
					element: <TFATurnOn/>
				},
				{
					path: "leader",
					element: <Leader />
				}
			]
		},
		{
			path: 'TFAVerify',
			element: <TFACodeVerification />,
		}
	])
}

function App() {

	const [ isLoggedIn, setIsLoggedIn ] = useState(false);
	const { connectSockets, disconnectSockets } = useContext(SocketContext);

	const onLoginSuccess = () => {
		setIsLoggedIn(true);
		connectSockets();
	};

	const onLogout = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
		disconnectSockets();
	};

	useEffect(() => {
		const lastTry = localStorage.getItem('lastTry');

		// If last try was less than 3 minutes ago, don't try to verify token
		// This is to avoid spamming the server with requests and helps prevent
		// re-rendering the app too often
		if (isLoggedIn && lastTry && Date.now() - lastTry < 3 * 60 * 1000)
			return;

		if (localStorage.getItem('token')) {
			apiHandle.get('/auth/verify', withAuth())
				.then((_) => {
					localStorage.setItem('lastTry', Date.now());
					onLoginSuccess();
				})
				.catch((_) => {
					console.warn("Warning: Token is invalid or has expired!")
					onLogout();
				})
		}
	})

	return (
		isLoggedIn ? (
				<RouterProvider router={router(onLogout)} />			
		) : (
			<>
				<Login onLoginSuccess={onLoginSuccess} />
				<Login42 onLoginSuccess={onLoginSuccess} />
			</>
		)
	)
}

export default App;*/

import './styles/App.css';

import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from 'react';

import Login from './components/Login';
import Login42 from './components/42Login';

import Template from './components/Template/template';
import Profil from './components/Profil';
import ProfilContainer from './components/ProfilContainer';
import UpdateProfil from './components/UpdateProfil';
import ChatPage from './pages/Chat';
import Game from './components/Game';
import Leader from './components/Leader';
import Home from './components/Home';

import TFATurnOn from './pages/2FATurnOn';
import TFACodeVerification from './pages/2FACodeVerification';

// import { statusLoader } from './Loader';389
import {useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom'
import { UserLoader } from './userLoader';
import { statusLoader } from './Loader'
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
                    element: 
					    <Check2FAForOtherRoutes>
						   <Profil />
						</Check2FAForOtherRoutes>, 
					loader: UserLoader
                },
				{
					path: 'profile/:username',
					element:
					<Check2FAForOtherRoutes>
						<ProfilContainer />
					</Check2FAForOtherRoutes>,
				},
                {
                    path: 'updateProfile',
                    loader: UserLoader,
                    element: <Check2FAForOtherRoutes><UpdateProfil /></Check2FAForOtherRoutes>,
                },
                {
                    path: 'game',
                    element: <Check2FAForOtherRoutes><Game /></Check2FAForOtherRoutes>,
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
					path: 'leader',
					element: <Check2FAForOtherRoutes><Leader /></Check2FAForOtherRoutes>

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

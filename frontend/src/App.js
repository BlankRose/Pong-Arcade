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

import { useContext, useState } from 'react';
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
import { SocketContext } from './contexts/Sockets';
import apiHandle from './components/API_Access';
import { withAuth } from './components/API_Access';
const Check2FAForSignIn = ({children}) => {
	const loggedIn = useSelector(state => state.user.status)
	const is2FANeeded = useSelector (state => state.user.is2FANeeded)
	const is2FAEnabled = useSelector (state => state.user._2FAEnabled)
	const [isLoggedIn, setIsLoggedIn] = useState('offline')

	console.log("********************Check2FAForSignIn")
	apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
			if (res.data === 'online') {
				
				setIsLoggedIn('online')
			} else {
				setIsLoggedIn('offline')
			}
		})
		.catch(err => {
			console.warn(err.response);
		});

	if (isLoggedIn === 'offline') {
		console.log("*******************************************Cas1")
		return children
	}
	else if (isLoggedIn === 'online' && is2FAEnabled && is2FANeeded) {
		console.log("*******************************************Cas2")
		return <Navigate to="/TFAVerify"/>
	}
	else if (isLoggedIn === 'online' && is2FANeeded === false ) {
		console.log("*******************************************Cas3")
		return <Navigate to="/profile"/>
	}
	else {
		console.log("*******************************************Cas7")
	    return children
	}
}

const Check2FAForOtherRoutes  = ({children}) => {
	const loggedIn = useSelector(state => state.user.status)
	const is2FANeeded = useSelector (state => state.user.is2FANeeded)
	const [isLoggedIn, setIsLoggedIn] = useState('')

	console.log("********************Check2FAForOtherRoutes")
	apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {
            console.log("res**: ", res)
			if (res.data === 'online') {
				console.log("LILILILILILILILI")
				setIsLoggedIn('online')
			} else {
				console.log("MIMIMIMIMIMIMI")
				setIsLoggedIn('offline')
			}
		})
		.catch(err => {
			console.warn(err.response);
		});

	if (loggedIn === 'offline') {
		console.log("*******************************************Cas4")
		return <Navigate to="/"/>
	}
	else if (isLoggedIn === 'online' && is2FANeeded === true) {
		console.log("*******************************************Cas5")
		return <Navigate to="/TFAVerify"/>
	}
	else {
		console.log("*******************************************Cas6")
	    return children
	}
}

function App() {

	const [/*rerenderKey*/, setRerenderKey] = useState(0);
	const handleLRerender = () => {
        setRerenderKey(prevKey => prevKey + 1);
    };

	const { connectSockets, disconnectSockets } = useContext(SocketContext);
	const dynamicLoader = async () => {
		return statusLoader({ connectSockets, disconnectSockets });
	}

	const router = createBrowserRouter([
        {
            path: '/',
            // element: isLoggedIn ? <Template /> : <main><Outlet></Outlet></main>,
			element: <Template />,
            loader: dynamicLoader,
            children: [
				{
					path: 'home',
					element: <Check2FAForOtherRoutes>
						<Home />
					</Check2FAForOtherRoutes>,
				},
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
					loader: UserLoader
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
					loader: dynamicLoader,
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

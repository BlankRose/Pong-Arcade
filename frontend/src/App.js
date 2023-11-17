import './styles/App.css';

import { useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from 'react';

import apiHandle, { withAuth } from './components/API_Access';
import Login from './components/Login';
import Login42 from './components/42Login';

import Template from './components/Template/template';
import Profil from './components/Profil';
import UpdateProfil from './components/UpdateProfil';
import ChatPage from './components/Chat';
import Game from './components/Game';

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
					index: true,
					path: "profile",
					// loader: userLoader, 
					element: (
						<Profil />
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
		if (localStorage.getItem('token')) {
			apiHandle.get('/auth/verify', withAuth())
				.then((_) => {
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

export default App;

/*
import Header from './components/Header';
import Game from './components/Game';
import apiHandle, { withAuth } from './components/API_Access';
import ProfilContainer from './components/ProfilContainer';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false); // état de la connexion

	useEffect(() => {
		if (localStorage.getItem('token')) {
			apiHandle.get('/auth/verify', withAuth())
				.then((_) => {
					setIsLoggedIn(true);
				})
				.catch((_) => {
					console.error("Warning: Token is invalid or has expired!")
					localStorage.removeItem('token');
					setIsLoggedIn(false);
				})
		}
	})

	const onLoginSuccess = () => {
		setIsLoggedIn(true);
	};

	const onLogout = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
	};

	return (
		<div className="App">
			{isLoggedIn ? (
				<>
					<BrowserRouter>
					<Header  onLogout={onLogout}/>
					<Routes>
						<Route index element={<p>tempo</p>} />
						<Route path="game" element={<Game />} />
						<Route path= "chat" element={<ChatPage onLogout={onLogout}/>} />
						<Route path= "profil" element={<Profil />}/>
						<Route path="profil/:username" element={<ProfilContainer />} />
						<Route path= "updateProfil" element={<UpdateProfil />} />
						<Route path="*" element={<p>tempo</p>} />
					</Routes>
					</BrowserRouter>
				</>
			) : (
				<>
					<Login onLoginSuccess={onLoginSuccess} />
					<Login42 onLoginSuccess={onLoginSuccess} />
				</>
			)}
		</div>
	);
}
*/


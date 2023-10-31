import './styles/App.css';

import { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Login from './components/Login';
import Login42 from './components/42Login';
import ChatPage from './components/Chat';
import Header from './components/Header';
import Profil from './components/Profil';
import Game from './components/Game';
import UpdateProfil from './components/UpdateProfil';
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

export default App;

import './styles/App.css';

import { useState } from 'react';
import ReactDom from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Login from './components/Login';
import Login42 from './components/42Login';
import ChatPage from './components/Chat';
import Header from './components/Header';
import Profil from './components/Profil';
import Game from './components/Game';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false); // état de la connexion

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
					<Header />
					<Routes>
						<Route index element={<p>tempo</p>} />
						<Route path="game" element={<Game />} />
						<Route path= "chat" element={<ChatPage onLogout={onLogout}/>} />
						<Route path= "profil" element={<Profil />}/>
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

import './styles/App.css';

import { useState } from 'react';
import ReactDom from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Login from './components/Login';
import Login42 from './components/42Login';
import ChatPage from './components/Chat';
import Nav from './components/Nav';

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
					<Routes>
					<Route path="/" element={<Nav />}>
						<Route index element={<p>tempo</p>} />
						<Route path="game" element={<p>tempo</p>} />
						<Route path= "chat" element={<ChatPage onLogout={onLogout}/>} />
						<Route path="*" element={<p>tempo</p>} />
					</Route>

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

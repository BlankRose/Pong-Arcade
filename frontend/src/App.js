import logo from './assets/logo.svg';
import './styles/App.css';

import { useState } from 'react';

import Login from './components/Login';
import Login42 from './components/42Login';
import ChatPage from './components/Chat';

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
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<div>
					Transcendence
				</div>
			</header>
			{isLoggedIn ? (
				// Ici, vous pourriez avoir votre composant de messagerie/chat
				// et vous pouvez lui passer onLogout comme props pour gérer la déconnexion
				<ChatPage onLogout={onLogout} />
			) : (
				<>
					<Login onLoginSuccess={onLoginSuccess} />
					<Login42 />
				</>
			)}
		</div>
	);
}

export default App;

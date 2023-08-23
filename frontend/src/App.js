import logo from './assets/logo.svg';
import './styles/App.css';

import apiHandle from './components/API_Access'
import { useState, useEffect } from 'react';

import Login from './components/Login';
import Login42 from './components/42Login';

function App() {
	const [response, setResponse] = useState("");

	useEffect(() => {
		apiHandle.get("/").then((res) => {
			setResponse(res.data);
		}).catch((err) => {
			setResponse("Failed to connect to API... Please retry later.")
		});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					{response}
				</p>
			</header>
			<Login />
			<Login42 />
		</div>
	);
}

export default App;

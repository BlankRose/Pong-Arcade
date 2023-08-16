import logo from './assets/logo.svg';
import './styles/App.css';

import backendHandle from './BackAccess'
import { useState, useEffect } from 'react';

function App() {
	const [response, setResponse] = useState("");

	useEffect(() => {
		backendHandle.get("/").then((res) => {
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
		</div>
	);
}

export default App;

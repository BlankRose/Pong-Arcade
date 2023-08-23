import React, { useEffect, useState } from "react";
//import apiHandle from "./API_Access";
import "../styles/Login.css";

const apiUID = process.env.REACT_APP_API_UID;

/**
 * Handles logging of an user through the API provided by the 42 network.
 */
function LoginPage() {
	const [ authenticated, setAuthenticated ] = useState(false);
	const webOrigin = `http://${window.location.host}/login`;

	useEffect(() => {
		const handleOAuthCallback = async (event) => {
			console.log('handleOAuthCallback')
			if (event.origin === webOrigin) {
				const authCode = new URLSearchParams(event.data).get('code');
				console.log(authCode);
			}
		}

		window.addEventListener('message', handleOAuthCallback);
		return () => {
			window.removeEventListener('message', handleOAuthCallback);
		}
	})

	const handleLogin = () => {
		const url = `https://api.intra.42.fr/oauth/authorize?client_id=${apiUID}&redirect_uri=${encodeURIComponent(webOrigin)}&response_type=code`;
		window.open(url, '_blank');
	}

	return (
		<div className="login">
			{authenticated ? (
				<div className="login__success">
					<h1>Success!</h1>
					<p>You are now logged in.</p>
				</div>
			) : (
				<div className="login__container">
					<h1>42 Login</h1>
					<p>Click the button below to login with your 42 account.</p>
					<button onClick={handleLogin}>Login</button>
				</div>
			)}
		</div>
	);
}

export default LoginPage;

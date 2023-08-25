import React, { useEffect, useState } from "react";
import "../styles/Login.css";

import apiHandle from "./API_Access";

const apiUID = process.env.REACT_APP_API_UID;

function LoginPage({ onLoginSuccess }) {
	const [ authenticated, setAuthenticated ] = useState(false);
	const [ newbie, setNewbie ] = useState(false);
	const [ OAuthCode, setOAuthCode ] = useState(null);
	const [ OAuthPopup, setOAuthPopup ] = useState(null);
	const webOrigin = `${window.location.protocol}//${window.location.host}/login`;

	// Attach an event listener to the window to listen on the
	// OAuth login popups events (checks every 500ms)
	useEffect(() => {
		if (!OAuthPopup) {
			return;
		}

		const timer = setInterval(() => {
			// Upon close, the popup is detached from the state
			if (!OAuthPopup || OAuthPopup.closed) {
				setOAuthPopup(null);
				clearInterval(timer);
				return;
			}

			try {
				// Cross-origin security policy prevents from accessing
				// the popup's URL if it's not on the same origin as the parent window
				const url = OAuthPopup.location.href;
				if (!url)
					return;

				// Retrieves any errors and close the popup
				const error = new URL(url).searchParams.get('error');
				if (error) {
					console.log(`Error: ${error}`);
					OAuthPopup.close();
					return;
				}

				// Retrieves the auth code from the redirect URL triggered by the 42 API
				const authCode = new URL(url).searchParams.get('code');
				if (authCode) {
					console.log(`User's Code: ${authCode}`);
					apiHandle.post('/auth/login', { code: authCode })
						.then((response) => {
							onLoginSuccess();
						})
						.catch((error) => {
							setOAuthCode(authCode);
							setNewbie(true);
						});
					setAuthenticated(true);
					OAuthPopup.close();
				}
			} catch (error) {
				return;
			}
		}, 500)
	}, [OAuthPopup])

	// Triggers the OAuth login popup by opening a new window
	// and attach it to the OAuthPopup state
	const handleLogin = () => {
		// Prevents duplicates
		if (OAuthPopup)
			OAuthPopup.close();

		// Open and attach the popup to the state
		const url = `https://api.intra.42.fr/oauth/authorize?client_id=${apiUID}&redirect_uri=${encodeURIComponent(webOrigin)}&response_type=code`;
		const popup = window.open(url, '_blank', 'width=600,height=800');
		setOAuthPopup(popup);
	}

	// Sends a request to the backend to register the user
	// with the username he entered in the form
	const handleRegister = () => {
		const username = document.getElementById('username').value;
		apiHandle.post('/auth/register', { code: OAuthCode, username: username })
			.then(() => {
				setNewbie(false);
				setOAuthCode(null);
				onLoginSuccess();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// Display either:
	//  - Logged: A success message
	//  - Logged but new user: A form to select a username
	//  - Not logged: A button to trigger the OAuth login
	return (
		<div className="login">
			{authenticated ?
				newbie ? (
					<div className="login__newbie">
						<h1>Welcome!</h1>
						<p>Please select your username before going forward.</p>
						<input type="text" placeholder="Username" id="username" />
						<button onClick={handleRegister}>Submit</button>
					</div>
				) : (
					<div className="login__success">
						<h1>Success!</h1>
						<p>You are now logged in.</p>
					</div>
			) : (
				<div className="login__container">
					<button onClick={handleLogin}>Login with 42 Account</button>
				</div>
			)}
		</div>
	);
}

export default LoginPage;

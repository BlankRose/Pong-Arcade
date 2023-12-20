import React, { useEffect, useState } from "react";
import "../styles/Login.css";

import apiHandle from "./API_Access";

const apiUID = process.env.REACT_APP_API_UID;

function LoginPage({DoRerender}) {
	const [ authenticated, setAuthenticated ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState(null);

	// 42 OAuth Login
	const [ newbie, setNewbie ] = useState(false); // Determines if the user is new or not
	const [ OAuthURI, setOAuthURI ] = useState(null);
	const [ OAuthToken, setOAuthToken ] = useState(null);
	const [ OAuthPopup, setOAuthPopup ] = useState(null);

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
					const desc = new URL(url).searchParams.get('error_description');
					if (desc)
						setErrorMessage(`Erreur: ${desc}`);
					else
						setErrorMessage(`Erreur: ${error}`);
					OAuthPopup.close();
					return;
				}

				// Retrieves the auth code from the redirect URL triggered by the 42 API
				const authCode = new URL(url).searchParams.get('code');
				if (authCode) {
					apiHandle.get(`/auth/token42?code=${authCode}&uri=${OAuthURI}`)
						.then((response) => {
							setOAuthToken(response.data);
							setAuthenticated(true);
							setErrorMessage(null);
							apiHandle.post('/auth/login42', { code: response.data })
								.then((res) => {
									localStorage.setItem('token', res.data.access_token);
									DoRerender();
								})
								.catch((error) => {
									setNewbie(true);
								});
						})
						.catch((error) => {
							const errorResponse =
								error.response && error.response.data ?
								error.response.data.message : error.message;
							setErrorMessage(`Erreur: ${errorResponse}`);
						});
					OAuthPopup.close();
				}
			} catch (error) {
				return;
			}
		}, 500)
	}, [OAuthPopup, DoRerender, OAuthURI])

	// Triggers the OAuth login popup by opening a new window
	// and attach it to the OAuthPopup state
	const handleLogin = () => {
		// Prevents duplicates
		if (OAuthPopup)
			OAuthPopup.close();

		// Open and attach the popup to the state
		const origin = encodeURIComponent(`${window.location.protocol}//${window.location.host}/login`)
		const url = `https://api.intra.42.fr/oauth/authorize?client_id=${apiUID}&redirect_uri=${origin}&response_type=code`;
		const popup = window.open(url, '_blank', 'width=600,height=800');

		// Define the states for popup events
		setOAuthURI(origin)
		setOAuthPopup(popup);
	}

	// Sends a request to the backend to register the user
	// with the username he entered in the form
	const handleRegister = () => {
		const username = document.getElementById('username').value;
		apiHandle.post('/auth/register42', { code: OAuthToken, username: username })
			.then(res => {
				localStorage.setItem('token', res.data.access_token);

				setNewbie(false);
				setOAuthToken(null);
				DoRerender();
			})
			.catch((error) => {
				const errorResponse = error.response && error.response.data ? error.response.data.message : error.message;
				setErrorMessage(`Erreur: ${errorResponse}`);
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
						{errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
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
					<h1>42 Login</h1>
					{errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
					<button onClick={handleLogin}>Login with 42 Account</button>
				</div>
			)}
		</div>
	);
}

export default LoginPage;
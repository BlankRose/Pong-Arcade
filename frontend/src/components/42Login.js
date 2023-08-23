import React, { useEffect, useState } from "react";
import "../styles/Login.css";

const apiUID = process.env.REACT_APP_API_UID;

function LoginPage() {
	const [ authenticated, setAuthenticated ] = useState(false);
	const [ OAuthPopup, setOAuthPopup ] = useState(null);
	const webOrigin = `${window.location.protocol}//${window.location.host}/login`;

	useEffect(() => {
		if (!OAuthPopup) {
			return;
		}

		const timer = setInterval(() => {
			if (!OAuthPopup || OAuthPopup.closed) {
				setOAuthPopup(null);
				clearInterval(timer);
				return;
			}

			let url;
			try {
				url = OAuthPopup.location.href;
				if (!url)
					return;

				const authCode = new URL(url).searchParams.get('code');
				if (authCode) {
					console.log(`User's Code: ${authCode}`);
					setAuthenticated(true);
					OAuthPopup.close();
				}
			} catch (error) {
				return;
			}
		}, 500)
	}, [OAuthPopup])

	const handleLogin = () => {
		const url = `https://api.intra.42.fr/oauth/authorize?client_id=${apiUID}&redirect_uri=${encodeURIComponent(webOrigin)}&response_type=code`;
		const popup = window.open(url, '_blank', 'width=600,height=800');
		setOAuthPopup(popup);
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
					<button onClick={handleLogin}>Login with 42 Account</button>
				</div>
			)}
		</div>
	);
}

export default LoginPage;

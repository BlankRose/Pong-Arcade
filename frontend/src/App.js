import './styles/App.css';

import { useState } from 'react';
// import ReactDom from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './components/Login';
import Login42 from './components/42Login';
import ChatPage from './components/Chat';
import Nav from './components/Nav';
import TFATurnOn from './pages/2FATurnOn';
import TFACodeVerification from './pages/2FACodeVerification';
import React from 'react';
import Navbar from './components/Navigation/NavigationBar';
import Template from './components/Template/template';

import { statusLoader } from './Loader'


const onLoginSuccess = () => {

};
const onLogout = () => {
	localStorage.removeItem('token');
};

const router = createBrowserRouter ([
	{
		path: "/",
		element: <Template/>,
		// errorElement: <ErrorPage/>,
		loader: statusLoader,
		children:[
			{
				index: true,
				element: (
					<>
					    <Login onLoginSuccess={onLoginSuccess} />
					    <Login42 onLoginSuccess={onLoginSuccess} />
				    </>
				)
			},
			{
				path: "profile",
				// loader: userLoader, 
				element: (
					<p>tempo</p>
				)
			},
			{
				path: "game",
				// loader: userLoader, 
				element: (
					<p>tempo</p>
				)
			},
			{
				path: "chat",
				// loader: userLoader, 
				element: (
					<ChatPage  onLogout={onLogout}/>
				)
			},
			{
				path: "2fa",
				element: <TFATurnOn/>
			}
		]
	},
	{
		path: 'TFAVerify',
        element: <TFACodeVerification />,
	}
])


// function App() {
// 	const [isLoggedIn, setIsLoggedIn] = useState(false); // état de la connexion

// 	const onLoginSuccess = () => {
// 		setIsLoggedIn(true);
// 	};

// 	const onLogout = () => {
// 		localStorage.removeItem('token');
// 		setIsLoggedIn(false);
// 	};

// 	return (
// 		<div className="App">
// 			{isLoggedIn ? (
// 				<>
// 					<BrowserRouter>
// 					<Routes>
// 					<Route path="/" element={<Template/>}>
// 						<Route index element={<p>tempo</p>} />
// 						<Route path="game" element={<p>tempo</p>} />
// 						<Route path= "chat" element={<ChatPage onLogout={onLogout}/>} />
// 						<Route path="*" element={<p>tempo</p>} />
// 						<Route path="2fa" element = {<TwoFATurnOn/>}/>
// 					</Route>

// 					</Routes>
// 					</BrowserRouter>
// 				</>
// 			) : (
// 				<>
// 					<Login onLoginSuccess={onLoginSuccess} />
// 					<Login42 onLoginSuccess={onLoginSuccess} />
// 				</>
// 			)}
// 		</div>
// 	);
// }

function App() {
    return <RouterProvider router={router} />
}

export default App

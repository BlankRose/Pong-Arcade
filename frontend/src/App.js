import './styles/App.css';

import { useContext, useState } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import React from 'react';

import Login from './components/Login';
import Login42 from './components/42Login';

import Template from './components/Template/template';
import Profil from './components/Profil';
import ProfilContainer from './components/ProfilContainer';
import UpdateProfil from './components/UpdateProfil';
import ChatPage from './pages/Chat';
import Game from './components/Game';
import Leader from './components/Leader';
import Home from './components/Home';

import TFATurnOn from './pages/2FATurnOn';
import TFACodeVerification from './pages/2FACodeVerification';

import { useSelector } from 'react-redux'
import { UserLoader } from './userLoader';
import { statusLoader } from './Loader'
import FriendsPage from './pages/FriendsPage';
import { SocketContext } from './contexts/Sockets';
import apiHandle from './components/API_Access';
import { withAuth } from './components/API_Access';
import { useEffect } from 'react';


const Check2FAForSignIn = ({ children }) => {
	const is2FANeeded = useSelector((state) => state.user.is2FANeeded);
	const is2FAEnabled = useSelector((state) => state.user._2FAEnabled);
	const navigate = useNavigate();
  
	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const res = await apiHandle.get('/auth/loginStatus', withAuth());  
		  if (res.data === 'offline') {
			navigate('/');
		  } else if (res.data === 'online' && is2FAEnabled && is2FANeeded) {
			navigate('/TFAVerify');
		  } else if (res.data === 'online' && !is2FANeeded) {
			navigate('/profile');
		  } else {
		  }
		} catch (err) {
		  console.warn(err.response);
		}
	  };
  
	  fetchData();
	}, [is2FAEnabled, is2FANeeded, navigate]);
  

	if (window.location.pathname !== '/TFAVerify') {
	  return children;
	}

	return null;
  };

  const Check2FAForOtherRoutes = ({ children }) => {
	const is2FANeeded = useSelector(state => state.user.is2FANeeded);
	const [isLoggedIn, setIsLoggedIn] = useState('');
	const navigate = useNavigate();
  
	useEffect(() => {
	  apiHandle.get('/auth/loginStatus', withAuth())
		.then(res => {		  
		  if (res.data === 'offline') {
			navigate('/');
		  } else if (res.data === 'online' && is2FANeeded) {
			navigate('/TFAVerify');
		  } else {
			setIsLoggedIn(res.data);
		  }
		})
		.catch(err => {
		  console.warn(err.response);
		});
	}, [is2FANeeded, navigate, isLoggedIn]);
  
	return (isLoggedIn === 'online' && !is2FANeeded) ? children : null;
  };


function App() {

	const [/*rerenderKey*/, setRerenderKey] = useState(0);
	const handleLRerender = () => {
        setRerenderKey(prevKey => prevKey + 1);
    };

	const { connectSockets, disconnectSockets } = useContext(SocketContext);
	const dynamicLoader = async () => {
		return statusLoader({ connectSockets, disconnectSockets });
	}

	const router = createBrowserRouter([
        {
            path: '/',
            // element: isLoggedIn ? <Template /> : <main><Outlet></Outlet></main>,
			element: <Template />,
            loader: dynamicLoader,
            children: [
                {
                    path: 'profile',
                    element: 
					    <Check2FAForOtherRoutes>
						   <Profil />
						</Check2FAForOtherRoutes>, 
					loader: UserLoader,
                },
				{
					path: 'profile/:username',
					element:
					<Check2FAForOtherRoutes>
						<ProfilContainer />
					</Check2FAForOtherRoutes>,
					loader: UserLoader
				},
                {
                    path: 'updateProfile',
                    element: <Check2FAForOtherRoutes><UpdateProfil /></Check2FAForOtherRoutes>,
                },
                {
                    path: 'game',
                    element: <Check2FAForOtherRoutes><Game /></Check2FAForOtherRoutes>,
                },
                {
                    path: 'chat',
					loader: UserLoader,
                    element: <Check2FAForOtherRoutes><ChatPage/></Check2FAForOtherRoutes>,
                },
				{
                    path: 'friends',
                    element: <Check2FAForOtherRoutes><FriendsPage/></Check2FAForOtherRoutes>,
                },
				{
					path: 'leader',
					element: <Check2FAForOtherRoutes><Leader /></Check2FAForOtherRoutes>

				},
				{
					path: '*',
					element: <Check2FAForOtherRoutes><Home /></Check2FAForOtherRoutes>
				},
                {
                    path: '2fa',
					loader: UserLoader,
                    element: <TFATurnOn />,
                },
				{
					path: '/',
					loader: dynamicLoader,
					element:
							<Check2FAForSignIn>
							   		<>
									   <Login  DoRerender={handleLRerender}/>,
	                                	<Login42  DoRerender={handleLRerender} />, 
	                                </>
							</Check2FAForSignIn>
				},
            ]
        },
        {
            path: 'TFAVerify',
			loader: UserLoader,
            element: <TFACodeVerification />,
        },

    ]);

	return (
		<RouterProvider router={router} />
	)
}

export default App;

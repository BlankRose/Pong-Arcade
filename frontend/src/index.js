import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/index'

import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';

import App from './App';
import SocketProvider from './contexts/Sockets';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<SocketProvider>
			<Provider store={store}>
		    	<App />
			</Provider>
		</SocketProvider>
	</React.StrictMode>
);

import axios from 'axios';
import { io } from 'socket.io-client';

const apiPort = process.env.REACT_APP_API_PORT;
const webPort = window.location.port;
const hostname = window.location.hostname;
const apiBaseURL = `http://${hostname}:${apiPort}`;
const webBaseURL = `http://${hostname}:${webPort}`;

const apiHandle = axios.create({
	baseURL: apiBaseURL,
	timeout: 1000
});

const withAuth = () => {
	return {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	}
}

const newSocket = (target) => {
	return io(apiBaseURL, {
		path: `/${target}`,
		upgrade: false,
		transports: ['websocket'],
		autoConnect: false,
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 5,
		auth: {
			token: localStorage.getItem('token')
		}
	})
}

export default apiHandle;
export { hostname, apiPort, webPort, apiBaseURL, webBaseURL, withAuth, newSocket };

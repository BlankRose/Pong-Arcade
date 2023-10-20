import axios from 'axios';

const apiPort = process.env.REACT_APP_API_PORT;
const hostname = window.location.hostname;
const apiBaseURL = `http://${hostname}:${apiPort}`;

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

export default apiHandle;
export { hostname, apiPort, apiBaseURL, withAuth };

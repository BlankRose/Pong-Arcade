import axios from 'axios';

const apiPort = process.env.REACT_APP_API_PORT;
const hostname = window.location.hostname;

const apiHandle = axios.create({
	baseURL: `http://${hostname}:${apiPort}/`,
	timeout: 1000
});

export default apiHandle;

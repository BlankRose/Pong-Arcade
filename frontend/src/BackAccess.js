import axios from 'axios';

const backendPort = process.env.REACT_APP_API_PORT;
const hostname = window.location.hostname;

const backendHandle = axios.create({
	baseURL: `http://${hostname}:${backendPort}/`,
	timeout: 1000
});

export default backendHandle;

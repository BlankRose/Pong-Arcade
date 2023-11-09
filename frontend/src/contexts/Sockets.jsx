import { createContext, useState } from "react";
import { newSocket } from "../components/API_Access";

export const SocketContext = createContext();

export const newSocketEvent = (socket, event, callback) => {
	socket.off(event)
	.on(event, (data) => {
		callback(data);
	})
}

const defaultGameContext = {
	inQueue: false,
	gameState: null,
	opponent: null
}

const SocketProvider = ({ children }) => {

	const [ gameSocket, setGameSocket ] = useState(null);
	const [ chatSocket, setChatSocket ] = useState(null);

	const [ gameContext, setGameContext ] = useState(defaultGameContext);
	const [ chatContext, setChatContext ] = useState({});

	const connectSockets = () => {
		if (!gameSocket) {
			setGameSocket(newSocket("game"));
		}

		if (!chatSocket) {

		}
	}

	const disconnectSockets = () => {
		if (gameSocket && gameSocket.connected)
			gameSocket.disconnect();
		setGameSocket(null);
		setGameContext(defaultGameContext);

		if (chatSocket && chatSocket.connected)
			chatSocket.disconnect();
		setChatSocket(null);
		setChatContext({});
	}

	return (
		<SocketContext.Provider value={{
			gameSocket, chatSocket,
			gameContext, chatContext,
			setGameContext, setChatContext,
			connectSockets, disconnectSockets
		}}>
			{children}
		</SocketContext.Provider>
	)
}



export default SocketProvider;

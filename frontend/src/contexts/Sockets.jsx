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
	code: null,
}

const SocketProvider = ({ children }) => {

	const [ gameSocket, setGameSocket ] = useState(null);
	const [ chatSocket, setChatSocket ] = useState(null);

	const [ gameContext, setGameContext ] = useState(defaultGameContext);
	const [ chatContext, setChatContext ] = useState({});

	const [ gamePlayer1, setPlayer1 ] = useState(null);
	const [ gamePlayer2, setPlayer2 ] = useState(null);

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

	const resetGameStates = () => {
		setGameContext({ inQueue: false, gameState: null, code: null });
		setPlayer1(null);
		setPlayer2(null);
	}

	return (
		<SocketContext.Provider value={{
			gameSocket, chatSocket,
			gameContext, chatContext,
			setGameContext, setChatContext,
			connectSockets, disconnectSockets,
			gamePlayer1, gamePlayer2,
			setPlayer1, setPlayer2,
			resetGameStates
		}}>
			{children}
		</SocketContext.Provider>
	)
}



export default SocketProvider;

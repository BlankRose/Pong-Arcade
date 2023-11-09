import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext, newSocketEvent } from '../contexts/Sockets';

function Game(props) {

	const { gameSocket, gameContext, setGameContext } = useContext(SocketContext);
	const [ lastGameContext, setLastGameContext ] = useState(null);

	// Register events
	useEffect(() => {
		if (!gameSocket || gameSocket.connected)
			return;

		newSocketEvent(gameSocket, 'connect', () => {
			console.log('Connected to game socket');
		})

		newSocketEvent(gameSocket, 'disconnect', () => {
			console.log('Disconnected from game socket');
		})

		newSocketEvent(gameSocket, 'joinQueueSuccess', () => {
			console.log('Joined queue');
			setGameContext({ ...gameContext, inQueue: true });
		})

		newSocketEvent(gameSocket, 'leaveQueueSuccess', () => {
			console.log('Left queue');
			setGameContext({ ...gameContext, inQueue: false });
		})

		newSocketEvent(gameSocket, 'gameStart', data => {
			setGameContext({ inQueue: false, onpponent: data.opponent, gameState: data.game })
		})

		newSocketEvent(gameSocket, 'gameUpdate', data => {
			setGameContext({ ...gameContext, gameState: data.game })
		})

		newSocketEvent(gameSocket, 'gameEnd', data => {
			setLastGameContext({ ...gameContext, gameState: data.game, winner: data.winner })
			setGameContext({ inQueue: false, onpponent: null, gameState: null })
		})

		gameSocket.connect();

	//  --> Only run when socket changes and on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameSocket]);

	useEffect(() => {
		console.log('Game update:', gameContext);
	}, [gameContext]);

	function Canvas() {
		const ref = useRef/*<HTMLCanvasElement>*/(null);

		useEffect(() => {
			if (ref.current) {
			//	const canvas = ref.current.getContext('2d')
			}
		}, [ref]);
		return <canvas ref={props.ref} className="canvas"/>
	}

	return(
		<div className='pGame'>
			{
			lastGameContext ? <>
				<div>Game Over</div>
				<div>Winner: {lastGameContext.winner}</div>
				<div>Score: {lastGameContext.gameState.score1} - {lastGameContext.gameState.score2}</div>
				</> : undefined
			}
			<button onClick={() => {gameSocket.emit('joinQueue')}}>Join Queue</button>
			<Canvas />
		</div>
	)
}

export default Game;

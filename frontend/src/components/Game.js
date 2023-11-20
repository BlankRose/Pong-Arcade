import { useContext, useEffect, useState, useReducer } from 'react';
import { SocketContext, newSocketEvent } from '../contexts/Sockets';
import GameCanvas from './GameCanvas';
import "../styles/Game.css"

import Solo from '../assets/icon-btn-game/mario_dancing.gif'
import apiHandle, { withAuth } from './API_Access';

function Game() {

	const themes = ['1972', 'Mario' , 'Ace Attorney' /*, 'Minecraft'*/];

	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const { gameSocket, gameContext, setGameContext } = useContext(SocketContext);
	const [ players, setPlayers ] = useState([null, null]);
	const [ theme, setTheme ] = useState(themes[0]);

	// Register events
	useEffect(() => {
		if (!gameSocket || gameSocket.connected)
			return;

		newSocketEvent(gameSocket, 'connect', () => {
			forceUpdate();
		})

		newSocketEvent(gameSocket, 'disconnect', () => {
			forceUpdate();
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
			setGameContext({ inQueue: false, gameState: data })
		})

		newSocketEvent(gameSocket, 'gameUpdate', data => {
			setGameContext({ ...gameContext, gameState: data })
		})

		newSocketEvent(gameSocket, 'gameEnd', _ => {
			setGameContext({ inQueue: false, gameState: null })
			setPlayers([null, null]);
		})

		gameSocket.connect();

	//  --> Only run when socket changes and on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameSocket]);

	useEffect(() => {
		const keyDownHandler = (e) => {
			if (e.key === 'ArrowUp')
				gameSocket?.emit('startUp');
			if (e.key === 'ArrowDown')
				gameSocket?.emit('startDown');
		}

		const keyUpHandler = (e) => {
			if (e.key === 'ArrowUp')
				gameSocket?.emit('stopUp');
			if (e.key === 'ArrowDown')
				gameSocket?.emit('stopDown');
		}

		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);
		}

	//  --> Only run on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!gameContext.gameState)
			return;

		apiHandle.get(`/users/${gameContext.gameState.player1}`, withAuth())
			.then(res => { setPlayers([res.data, players[1]]) })
			.catch(_ => { });
		apiHandle.get(`/users/${gameContext.gameState.player2}`, withAuth())
			.then(res => { setPlayers([players[0], res.data]) })
			.catch(_ => { })

	//  --> Only run when game updates
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameContext])

	return(
		<div className='pGame'>
			{
			! gameSocket.connected
				? <div>Connecting...</div>
				: <> {
					gameContext.gameState
						? <>
						<div>{players[0]?.username} VS {players[1]?.username}</div>
						<div>Score: {gameContext.gameState.score1} - {gameContext.gameState.score2}</div>
						<GameCanvas ctx={gameContext.gameState} theme={theme}/><br/>
						<button onClick={() => {gameSocket.emit('abondonGame')}}>Give Up</button>
						</>
						: gameContext.inQueue
							? <>
							<div>Waiting for opponent</div>
							<button onClick={() => {gameSocket.emit('leaveQueue')}}>Leave Queue</button>
							</>
							:
							<div className='game'>
								<div className='Title-game'>Welcome to 42_PONG !</div>
								<button className='btn-party' onClick={() => {gameSocket.emit('joinQueue')}}>
									<img src= {Solo} alt='solo' className='img-solo' />Rejoindre une partie !
								</button>
								<p className= 'hidden-text'>Rejoignez une partie contre un autre utilisateur !</p>
							</div>
				} </>
			}
			<br/>
			Theme:
			{
				themes.map(elem =>
					<button onClick={() => {setTheme(elem)}}>{elem}</button>
				)
			}
			<br/>
			Selected: {theme}
		</div>
	)
}

export default Game;
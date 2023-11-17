import { useContext, useEffect, useState } from 'react';
import { SocketContext, newSocketEvent } from '../contexts/Sockets';
import GameCanvas from './GameCanvas';
import BallSound from '../assets/ball.mp3';
import "../styles/Game.css"

import Solo from '../assets/icon-btn-game/mario_dancing.gif'

function Game() {

	const { gameSocket, gameContext, setGameContext } = useContext(SocketContext);
	const [ lastGameContext, setLastGameContext ] = useState(null);

	// Register events
	useEffect(() => {
		if (!gameSocket || gameSocket.connected)
			return;

		newSocketEvent(gameSocket, 'connect', () => {
		})

		newSocketEvent(gameSocket, 'disconnect', () => {
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
			if (data.playSound) {
				const sound = new Audio( BallSound );
				sound.play();
			}
			delete data.playSound;
			setGameContext({ ...gameContext, gameState: data })
		})

		newSocketEvent(gameSocket, 'gameEnd', data => {
			console.log('Game over:', data)
			setLastGameContext({ ...gameContext, gameState: data.game, winner: data.winner })
			setGameContext({ inQueue: false, gameState: null })
		})

		gameSocket.connect();

	//  --> Only run when socket changes and on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameSocket]);

	useEffect(() => {
		const keyDownHandler = (e) => {
			if (!gameSocket)
				return;
			if (e.key === 'ArrowUp')
				gameSocket.emit('startUp');
			if (e.key === 'ArrowDown')
				gameSocket.emit('startDown');
		}

		const keyUpHandler = (e) => {
			if (!gameSocket)
				return;
			if (e.key === 'ArrowUp')
				gameSocket.emit('stopUp');
			if (e.key === 'ArrowDown')
				gameSocket.emit('stopDown');
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

	return(
		<div className='pGame'>
			{
			! gameSocket.connected
				? <div>Connecting...</div> :
				<>
				{
				lastGameContext ? <>
					<div>Game Over</div>
					<div>Winner: {lastGameContext.winner}</div>
					<div>Score: {lastGameContext.gameState.score1} - {lastGameContext.gameState.score2}</div>
					</> : undefined
				}
				{
					gameContext.gameState
						? <>
						<div>{gameContext.gameState.player1} VS {gameContext.gameState.player2}</div>
						<div>Score: {gameContext.gameState.score1} - {gameContext.gameState.score2}</div>
						<button onClick={() => {gameSocket.emit('abondonGame')}}>Give Up</button>
						<GameCanvas ctx={gameContext.gameState}/>
						</>
						: gameContext.inQueue
							? <>
							<div>Waiting for opponent</div>
							<button onClick={() => {gameSocket.emit('leaveQueue')}}>Leave Queue</button>
							</>
							:
							<div className='game'>
								<div className='Title-game'>Welcome to 42_PONG !</div>
								<button className='btn-party' onClick={() => {gameSocket.emit('joinQueue')}}> <img src= {Solo} alt='solo' className='img-solo' />Rejoindre une partie !</button>
								
								<p className= 'hidden-text'>Rejoignez une partie contre un autre utilisateur !</p>
							</div> 
				}
				</>
			}
		</div>
	)
}

export default Game;
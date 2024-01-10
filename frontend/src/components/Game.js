import { useContext, useEffect, useState, useReducer } from 'react';
import { SocketContext, newSocketEvent } from '../contexts/Sockets';
import "../styles/Game.css"
import Solo from '../assets/icon-btn-game/mario_dancing.gif'
import Friend from '../assets/icon-btn-game/duo.gif'
import apiHandle, {webBaseURL, withAuth} from './API_Access';

import Avatar from "../assets/avatar.jpeg";
import GameCanvas from './GameCanvas';
import CanvasConstants from "../contexts/CanvasConstants";
//import PlayerDisplay from "./PlayerDisplay";

function Game() {

	const themes = ['1972', 'Ace Attorney', 'Mario', 'Minecraft', 'Street Fighter 2', 'Zelda'];
	const savedTheme = localStorage.getItem('theme');

	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const { gameSocket, gameContext, setGameContext } = useContext(SocketContext);
	const [ players, setPlayers ] = useState([null, null]);
	const [ theme, setTheme ] = useState(savedTheme || themes[0]);

	const changeTheme = (theme) => {
		localStorage.setItem('theme', theme);
		setTheme(theme);
	}

	const toggleMute = () => {
		const toggle = localStorage.getItem('mute');
		if (toggle === 'false')
			localStorage.setItem('mute', true);
		else
			localStorage.setItem('mute', false);
	}

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
			console.log("HELP A");
			setGameContext({ ...gameContext, inQueue: true, code: null });
		})

		newSocketEvent(gameSocket, 'leaveQueueSuccess', () => {
			setGameContext({ ...gameContext, inQueue: false, code: null });
		})

		newSocketEvent(gameSocket, 'joinPrivateSuccess', data => {
			console.log("HELP B");
			setGameContext({ ...gameContext, inQueue: true, code: data });
		})

		newSocketEvent(gameSocket, 'joinPrivateError', () => {
			console.warn("Failed to join private game");
		})

		newSocketEvent(gameSocket, 'gameStart', data => {
			setGameContext({ inQueue: false, gameState: data, code: null });
		})

		newSocketEvent(gameSocket, 'gameUpdate', data => {
			setGameContext({ ...gameContext, gameState: data });
		})

		newSocketEvent(gameSocket, 'gameEnd', _ => {
			setGameContext({ inQueue: false, gameState: null, code: null });
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

		const mouseMoveHandler = (e) => {
			const rect = document.getElementById('canvas')?.getBoundingClientRect();
			if (rect) {
				const y =
					(e.clientY - rect.top - rect.height / 2)                        // RELATIVE
					* (CanvasConstants.TOP - CanvasConstants.BOTTOM) / rect.height; // RATIO
				gameSocket?.emit('fastMove', y);
			}
		}

		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		document.addEventListener('mousemove', mouseMoveHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);
			document.removeEventListener('mousemove', mouseMoveHandler);
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

	const copyToClipboard = () => {
		if (gameContext?.code)
			navigator?.clipboard?.writeText(gameContext.code)
				.catch(() => {/* IGNORED */});
	}

	const joinPrivate = () => {
		console.log("hello world");
		let elem = document.getElementById('game_code')?.value
			?.replaceAll(' ', '').replaceAll('\t', '').toUpperCase()
			.replace(/[^A-Z0-9]/g, '');
		if (!elem || elem.length <= 0) return;

		console.log("Lol");
		gameSocket?.emit('joinPrivate', elem);
	}

	const enforceString = (event) => {
		const base = event?.target?.value;
		if (!base)
			return;
		event.target.value = base
			.replaceAll(' ', '').replaceAll('\t', '').toUpperCase()
			.replace(/[^A-Z0-9]/g, '');
	}

	return(
		<div className='pGame'>
			{
			 !gameSocket?.connected
				? <div>Connecting...</div>
				: <> {
					gameContext.gameState
						? <>
						<div className='players-display'>
							<img className='players-icon' src={players[0]?.avatar ? players[0].avatar : Avatar} alt='avatar'/>
							<div className='players-name'>
								{players[0]?.username} VS {players[1]?.username}<br/>
								{gameContext.gameState.score1} - {gameContext.gameState.score2}
							</div>
							<img className='players-icon' src={players[1]?.avatar ? players[1].avatar : Avatar} alt='avatar'/>
						</div>
						<div className='force-center'>
							<GameCanvas ctx={gameContext.gameState} theme={theme}/><br/>
						</div>

						<div className='btn-triggers'>
							<button
								onClick={() => gameSocket.emit('abondonGame')}>
									Give Up
							</button>
							<button style={{ color: localStorage.getItem('mute') === 'true' ? 'red' : 'green' }}
								onClick={() => toggleMute()}>
									Mute
							</button>
						</div>
						</>

						: gameContext.inQueue
							? <div className='queue force-center'>
								<div>... Waiting for opponent ...</div>
								{
									gameContext.code
										? <div>Private Code: {gameContext.code}</div>
										: undefined
								}
								<div>
									<button onClick={() => {gameSocket.emit('leaveQueue')}}>Leave Queue</button>
									{ gameContext.code ? <button onClick={copyToClipboard}>Copy Code</button> : undefined }
								</div>
							</div>
							: <div className='game'>
								<div className='Title-game'>Welcome to 42_PONG !</div>
								<div className='selector'>
									<button className='btn-party' id='btnA' onClick={() => {gameSocket.emit('joinQueue')}}>
										<img src={Solo} alt='solo' className='img-solo' />World Matchmaking
									</button>
									<button className='btn-party' id='btnB' onClick={() => {gameSocket.emit('newPrivate')}}>
										<img src={Friend} alt='friend' className='img-solo' />Create Friend Match
									</button>
									<button className='btn-party' id='btnC' onClick={joinPrivate}>
										Join Friend Match
									</button>
									<input
										type="text"
										id='game_code'
										className='form-control input-party'
										placeholder='Private Match Code'
										onChange={enforceString}/>
								</div>
								<p className= 'hidden-text'>Rejoignez une partie contre un autre utilisateur !</p>
							</div>
				}
				<div className='theme-title force-center'>Themes:</div>
				<div className='theme-selection'>
					{themes.map(elem => <button
						key={elem} className='btn-theme'
						onClick={() => changeTheme(elem)}>
							{elem}
					</button>)}
				</div>
				<div className='theme-selected force-center'>Selected: {theme}</div>
				</>
			}
		</div>
	)
}

export default Game;
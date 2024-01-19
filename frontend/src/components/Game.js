import { useContext, useEffect, useState, useReducer } from 'react';
import { useSearchParams } from "react-router-dom";
import { SocketContext, newSocketEvent } from '../contexts/Sockets';
import "../styles/Game.css"
import Solo from '../assets/icon-btn-game/mario_dancing.gif'
import Friend from '../assets/icon-btn-game/duo.gif'
import Rejoin from '../assets/icon-btn-game/Starlow.webp'
import apiHandle, { withAuth, webBaseURL } from './API_Access';

import Avatar from "../assets/avatar.jpeg";
import GameCanvas from './GameCanvas';
import CanvasConstants from "../contexts/CanvasConstants";

function Game() {
	const [searchParams, ] = useSearchParams();
	const inputCode = searchParams.get('code');

	const themes = ['1972', 'Ace Attorney', 'Mario', 'Minecraft', 'Street Fighter 2', 'Zelda'];
	const savedTheme = localStorage.getItem('theme');

	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const {
		gameSocket, gameContext, setGameContext, resetGameStates,
		gamePlayer1, gamePlayer2, setPlayer1, setPlayer2
	} = useContext(SocketContext);
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
			if (inputCode)
				gameSocket?.emit('joinPrivate', inputCode);
			else forceUpdate();
		})

		newSocketEvent(gameSocket, 'disconnect', () => {
			forceUpdate();
		})

		newSocketEvent(gameSocket, 'joinQueueSuccess', () => {
			setGameContext({ ...gameContext, inQueue: true, code: null });
		})

		newSocketEvent(gameSocket, 'leaveQueueSuccess', () => {
			setGameContext({ ...gameContext, inQueue: false, code: null });
		})

		newSocketEvent(gameSocket, 'joinPrivateSuccess', data => {
			setGameContext({ ...gameContext, inQueue: true, code: data });
		})

		newSocketEvent(gameSocket, 'joinPrivateError', () => {
			console.warn("Failed to join private game");
		})

		newSocketEvent(gameSocket, 'gameStart', data => {
			if (data?.player1 && !gamePlayer1) {
				apiHandle.get(`/users/${data.player1}`, withAuth())
					.then(res => { setPlayer1(res.data) })
					.catch(_ => { /* IGNORED */ });
			}
			if (data?.player2 && !gamePlayer2) {
				apiHandle.get(`/users/${data.player2}`, withAuth())
					.then(res => { setPlayer2(res.data) })
					.catch(_ => { /* IGNORED */ })
			}
			setGameContext({ inQueue: false, gameState: data, code: null });
		})

		newSocketEvent(gameSocket, 'gameUpdate', data => {
			setGameContext({ ...gameContext, gameState: data });
		})

		newSocketEvent(gameSocket, 'gameEnd', _ => {
			resetGameStates();
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

	const copyToClipboard = (withLink) => {
		if (gameContext?.code)
			navigator?.clipboard?.writeText(withLink
				? `${webBaseURL}/game?code=${gameContext.code}`
				: gameContext.code)
			.catch(() => {/* IGNORED */});
	}

	const joinPrivate = () => {
		let elem = document.getElementById('game_code')?.value
			?.replaceAll(' ', '').replaceAll('\t', '').toUpperCase()
			.replace(/[^A-Z0-9]/g, '');
		if (!elem || elem.length <= 0) return;

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
							<img className='players-icon' src={gamePlayer1?.avatar ? gamePlayer1.avatar : Avatar} alt='avatar'/>
							<div className='players-name'>
								{gamePlayer1?.username} VS {gamePlayer2?.username}<br/>
								{gameContext.gameState.score1} - {gameContext.gameState.score2}
							</div>
							<img className='players-icon' src={gamePlayer2?.avatar ? gamePlayer2.avatar : Avatar} alt='avatar'/>
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
									{ gameContext.code ? <>
										<button onClick={() => copyToClipboard(false)}>Copy Code</button>
										<button onClick={() => copyToClipboard(true)}>Code Link</button>
									</>: undefined }
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
									<img src={Rejoin} alt='join' className='img-solo' />Join Friend Match
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

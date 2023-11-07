import { useEffect, useRef } from 'react'
import { newSocket } from './API_Access';

function registerEvent(connection, event, callback) {
	connection.off(event)
	.on(event, (data) => {
		callback(data);
	})
}

function Game(props) {

	const conn = newSocket('game');

	useEffect(() => {
		registerEvent(conn, 'connect', () => {
			console.log('Connected to game socket');
		})

		registerEvent(conn, 'disconnect', () => {
			console.log('Disconnected from game socket');
		})

		registerEvent(conn, 'done', (data) => {
			console.log(data);
		})

		conn.connect();
	}, [conn]);

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
		<div>
			<button onClick={() => {conn.emit('joinQueue', 'random message')}}>Join Queue</button>
			<Canvas />
		</div>
	)
}

export default Game;

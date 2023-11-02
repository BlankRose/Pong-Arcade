import { useEffect, useRef } from 'react'
import { newSocket } from './API_Access';

function Game(props) {

	const connection = newSocket('game');

	useEffect(() => {
		connection.on('connect', () => {
			console.log('Connected to game socket');
		})
	
		connection.on('disconnect', () => {
			console.log('Disconnected from game socket');
		})

		connection.connect();
	}, [connection]);

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
			<Canvas />
		</div>
	)
}

export default Game;

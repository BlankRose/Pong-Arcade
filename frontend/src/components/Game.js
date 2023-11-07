//import { useEffect} from 'react'
import { apiBaseURL} from './API_Access';
import { io } from 'socket.io-client';

import '../styles/Game.css'



function Game() {

	const connection  = io(apiBaseURL);

	connection.on('connect', () => {
			console.log('user is connected');	
	})

	connection.on('disconnect', () => {
		console.log('user is disconnected');
	})



	

	return (
		<>
			<canvas className='canvas'></canvas>
		</>
		
	)
}

export default Game;

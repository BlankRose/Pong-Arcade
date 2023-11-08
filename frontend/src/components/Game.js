//import { apiBaseURL} from './API_Access';
//import { io } from 'socket.io-client';
import {useEffect, useRef} from 'react'


import '../styles/Game.css'



function Game() {

	const canvasRef =useRef(null);

	
	

	useEffect(()=> {

		var canvas;
		var ctx;
		var game;
		//var cmd;
		var player1;
		var player2;

		canvas = canvasRef.current;
		ctx = canvas.getContext("2d")

		console.log('test:')
		console.log(ctx);

		//La variable game contiendra  toutes les donnees du joueur 1 et joueur 2  ainsi que de la balle.

		player1 = {
			width : 10,
			height: 100,
			x: 0,
			y: ((canvas.height - 100) / 2),
			color: "red",
		}

		player2 = {
			width : 10,
			height: 100,
			x: canvas.width - 10,
			y: ((canvas.height - 100) / 2),
			color: "green",

		}

		game = {
			player1: player1,
			player2: player2,
			ball: {
				x : (canvas.width / 2),
				y : (canvas.height / 2),
				rad: 10,
				color: "whitesmoke",
			}
		}


		

		//Permet de dessiner les paddles du joueur 1 et joueur 2 
		function drawPaddle(posX, posY, width, height, color)
		{
			ctx.beginPath();
			ctx.rect(posX, posY, width, height);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		}

		//Permet de dessiner la balle
		function drawBall(posX, posY, rad, color)
		{
			ctx.beginPath();
			ctx.arc(posX, posY, rad, 0, Math.PI*2);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		}

		function draw()
		{
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawPaddle(game.player1.x, game.player1.y, game.player1.width, game.player1.height, game.player1.color);
			drawPaddle(game.player2.x, game.player2.y, game.player2.width, game.player2.height, game.player2.color);
			drawBall(game.ball.x, game.ball.y, game.ball.rad, game.ball.color);
		}

		function set_game()
		{
			draw();
		}

		setInterval(set_game, 1000 / 60);
	},[]);

		


	return (
		<>
			<canvas className='canvas' ref={canvasRef} height={800} width={1200}> </canvas>
		</>
		
	)
}

export default Game;
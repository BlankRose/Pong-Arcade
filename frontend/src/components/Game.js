//import { useEffect} from 'react'
import { apiBaseURL} from './API_Access';
import { io } from 'socket.io-client';
import {useEffect} from 'react'

import '../styles/Game.css'



function Game() {

	
	var canvas;
	var ctx;
	var game;
	var cmd;

	var player1;
	var player2;
	var ball;

	//La variable game contiendra  toutes les donnees du joueur 1 et joueur 2  ainsi que de la balle.

	game =  {
		 player1 : {
			width : 20,
			height :100,
			x :  0,
			y : player1.height,
			color : "blue",
			score : 0,
			scoreX : (canvas.width / 2) + 70,
			scoreY : 100,
		},
		player2 : {
			width : 20,
			height :100,
			x :  canvas.width,
			y : player2.height,
			color : "red",
			score : 0,
			scoreX: (canvas.width / 2) - 130,
			scoreY: 100,
		},
		ball : {
			x : canvas.width / 2,
			y : canvas.height / 2,
			rad: 15,
			speedX: 3,
			speedY: 3,
			accel: 0.2,
			color: "whitesmoke"
		}
	};

	useEffect(()=> {
		canvas = document.getElementById("canvas-id");
		ctx = canvas.getContext("2d");

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
			drawPaddle(player1.x, player1.y, player1.width, player1.height, player1.color);
			drawPaddle(player2.x, player2.y, player2.width, player2.height, player2.color);
			drawBall(ball.x, ball.y, ball.rad, ball.color);
		}

		function game()
		{
		draw();
		}

		setInterval(game, 1000 / 60);
	},[]);

		


	return (
		<>
			<canvas className='canvas' id = 'canvas-id'></canvas>
		</>
		
	)
}

export default Game;

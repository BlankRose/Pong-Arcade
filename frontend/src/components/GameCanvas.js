import { useEffect, useRef } from "react";

import default_bg from '../assets/traditional.png';
import mario_bg from '../assets/background.jpg';

import default_fx from '../assets/ball.mp3';
import mario_fx from '../assets/ballM.ogg';

const CanvasConstants = {
	HEIGHT: 800,
	WIDTH: 1200,

	TOP: 50,
	BOTTOM: -50,
	LEFT: 100,
	RIGHT: -100,

	PADDLE_WIDTH: 3,
	PADDLE_HEIGHT: 20,
	BALL_RADIUS: 8
}

const GameCanvas = ({ ctx, theme }) => {
	let canvasRef = useRef(null);

	useEffect(() => {
		let canvas = canvasRef.current;
		let context = canvas.getContext('2d');

		let img = new Image();
		let audio;
		switch (theme) {
			case 'Mario':
				img.src = mario_bg;
				audio = new Audio(mario_fx);
				break;
			default:
				img.src = default_bg;
				audio = new Audio(default_fx);
		}

		img.onload = () => {
			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			/*
			WIDTH / 2 & WIDTH / 2 -> middle of canvas
			paddle_ -> center height point of paddle to ref TOP | BOTTOM
			ball_ -> position of ball to ref TOP | BOTTOM and LEFT | RIGHT
			*/

			const ratio_y = CanvasConstants.HEIGHT / (CanvasConstants.TOP - CanvasConstants.BOTTOM);
			const ratio_x = CanvasConstants.WIDTH / (CanvasConstants.LEFT - CanvasConstants.RIGHT);

			const p1 = (ctx.paddle1 - CanvasConstants.BOTTOM) * ratio_y;
			const p2 = (ctx.paddle2 - CanvasConstants.BOTTOM) * ratio_y;
			const ph = CanvasConstants.PADDLE_HEIGHT * ratio_y;
			const pw = CanvasConstants.PADDLE_WIDTH * ratio_x;

			const bX = (ctx.ballX - CanvasConstants.RIGHT) * ratio_x;
			const bY = (ctx.ballY - CanvasConstants.BOTTOM) * ratio_y;

			context.fillStyle = 'white';
			context.fillRect(
				0, p1 - ph / 2,
				pw, ph
			);
			context.fillRect(
				CanvasConstants.WIDTH - pw, p2 - ph / 2,
				pw, ph
			);
			context.fillRect(
				bX - CanvasConstants.BALL_RADIUS, bY - CanvasConstants.BALL_RADIUS,
				CanvasConstants.BALL_RADIUS * 2, CanvasConstants.BALL_RADIUS * 2
			);
		}

		if (ctx.playSound)
			audio.play();
	}, [ctx, theme]);

	return (
		<canvas
			className="gameCanvas" ref={canvasRef}
			width={CanvasConstants.WIDTH} height={CanvasConstants.HEIGHT}
		/>
	)
}

export default GameCanvas;

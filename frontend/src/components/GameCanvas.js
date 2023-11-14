import { useEffect, useRef } from "react";

import bg from '../assets/traditional.png';

const CanvasConstants = {
	HEIGHT: 600,
	WIDTH: 1200,

	TOP: 50,
	BOTTOM: -50,
	LEFT: 100,
	RIGHT: -100,

	PADDLE_WIDTH: 20,
	PADDLE_HEIGHT: 100,
	BALL_RADIUS: 10
}

const GameCanvas = ({ ctx }) => {
	let canvasRef = useRef(null);

	useEffect(() => {
		let canvas = canvasRef.current;
		let context = canvas.getContext('2d');

		// Load background image
		let img = new Image();
		img.src = bg;
		img.onload = () => {
			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			/*
			WIDTH / 2 & WIDTH / 2 -> middle of canvas
			paddle_ -> center height point of paddle to ref TOP | BOTTOM
			ball_ -> position of ball to ref TOP | BOTTOM and LEFT | RIGHT

			Change ref TOP | BOTTOM to HEIGHT
			ratio_y = HEIGHT / (TOP - BOTTOM)
			ratio_x = WIDTH / (LEFT - RIGHT)

			paddle_ = (paddle_ - BOTTOM) * ratio
			ballX = (ballX - LEFT) * ratio
			ballY = (ballY - BOTTOM) * ratio
			*/

			const ratio_y = CanvasConstants.HEIGHT / (CanvasConstants.TOP - CanvasConstants.BOTTOM);
			const ratio_x = CanvasConstants.WIDTH / (CanvasConstants.LEFT - CanvasConstants.RIGHT);

			const p1 = (ctx.paddle1 - CanvasConstants.BOTTOM) * ratio_y;
			const p2 = (ctx.paddle2 - CanvasConstants.BOTTOM) * ratio_y;

			const bX = (ctx.ballX - CanvasConstants.RIGHT) * ratio_x;
			const bY = (ctx.ballY - CanvasConstants.BOTTOM) * ratio_y;

			// Draw paddles and ball
			// ctx.paddle_ = center height point of paddle
			context.fillStyle = 'white';
			context.fillRect(
				0, p1 - CanvasConstants.PADDLE_HEIGHT / 2,
				CanvasConstants.PADDLE_WIDTH, CanvasConstants.PADDLE_HEIGHT
			);
			context.fillRect(
				CanvasConstants.WIDTH - CanvasConstants.PADDLE_WIDTH, p2 - CanvasConstants.PADDLE_HEIGHT / 2,
				CanvasConstants.PADDLE_WIDTH, CanvasConstants.PADDLE_HEIGHT
			);
			context.fillRect(
				bX - CanvasConstants.BALL_RADIUS, bY - CanvasConstants.BALL_RADIUS,
				CanvasConstants.BALL_RADIUS * 2, CanvasConstants.BALL_RADIUS * 2
			);
		}
	}, [ctx]);

	return (
		<canvas
			className="gameCanvas" ref={canvasRef}
			width={CanvasConstants.WIDTH} height={CanvasConstants.HEIGHT}
		/>
	)
}

export default GameCanvas;

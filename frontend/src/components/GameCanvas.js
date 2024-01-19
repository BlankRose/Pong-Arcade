import { useEffect, useRef } from "react";

import default_bg from '../assets/themes/1972_bg.png';
import default_fx from '../assets/themes/1972_fx.mp3';

import ace_bg from '../assets/themes/ace_bg.webp';
import aceA_fx from '../assets/themes/ace_phoenix_fx.mp3';
import aceB_fx from '../assets/themes/ace_hunter_fx.mp3';

import mario_bg from '../assets/themes/mario_bg.jpg';
import mario_fx from '../assets/themes/mario_fx.ogg';

import zelda_bg from '../assets/themes/zelda.webp';
import zelda_fx from '../assets/themes/zelda.mp3';

import minecraft_bg from '../assets/themes/minecraft_bg.jpg';
import minecraft_fx from '../assets/themes/minecraft_fx.mp3';

import sf2_bg from '../assets/themes/street_fighter2.jpg';
import sf2A_fx from '../assets/themes/Ryu.mp3';
import sf2B_fx from '../assets/themes/Ken.mp3';

import CanvasConstants from "../contexts/CanvasConstants";

//  [   PADDLE 1   ,   PADDLE 2   ,   BALLZ   ]
const color_schemes = [
	['white', 'white', 'white'],                  // Default (1972)
	['cornflowerblue', 'greenyellow', 'aqua'],    // Minecraft
	['red', 'green', 'yellow'],				      // Mario
	['red', 'blue', 'black'],                     // Ace Attorney
	['red', 'white', 'aqua'],					  //Street Fighter 2
	['darkgreen', 'hotpink', 'darkred'],		  //Zelda
]

const GameCanvas = ({ ctx, theme }) => {
	let canvasRef = useRef(null);

	useEffect(() => {
		let canvas = canvasRef.current;
		let context = canvas.getContext('2d');

		let img = new Image();
		let audio, colors;

		switch (theme) {
			case 'Ace Attorney':
				img.src = ace_bg;
				audio = Math.random() <= 0.5 ? new Audio(aceA_fx) : new Audio(aceB_fx);
				colors = color_schemes[3];
				break;

			case 'Mario':
				img.src = mario_bg;
				audio = new Audio(mario_fx);
				colors = color_schemes[2];
				break;

			case 'Minecraft':
				img.src = minecraft_bg;
				audio = new Audio(minecraft_fx);
				colors = color_schemes[1];
				break;
			
			case 'Street Fighter 2':
				img.src = sf2_bg;
				audio = Math.random() <= 0.5 ? new Audio(sf2A_fx) : new Audio(sf2B_fx);
				colors = color_schemes[4];
				break;
			
			case 'Zelda':
				img.src = zelda_bg;
				audio = new Audio(zelda_fx);
				colors = color_schemes[5]
				break;

			default: // Default
				img.src = default_bg;
				audio = new Audio(default_fx);
				colors = color_schemes[0];
		}

		img.onload = () => {
			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			const ratio_y = CanvasConstants.HEIGHT / (CanvasConstants.TOP - CanvasConstants.BOTTOM);
			const ratio_x = CanvasConstants.WIDTH / (CanvasConstants.LEFT - CanvasConstants.RIGHT);

			const p1 = (ctx.paddle1 - CanvasConstants.BOTTOM) * ratio_y;
			const p2 = (ctx.paddle2 - CanvasConstants.BOTTOM) * ratio_y;
			const ph = CanvasConstants.PADDLE_HEIGHT * ratio_y;
			const pw = CanvasConstants.PADDLE_WIDTH * ratio_x;

			const bX = (ctx.ballX - CanvasConstants.RIGHT) * ratio_x;
			const bY = (ctx.ballY - CanvasConstants.BOTTOM) * ratio_y;
			const br = CanvasConstants.BALL_RADIUS;
			const bd = CanvasConstants.BALL_RADIUS * 2;

			context.fillStyle = colors[0];

			//Ajout d'ombres
			context.shadowColor = 'rgba(244, 244, 244, 0.5)';
			context.shadowOffsetX = 5;
			context.shadowOffsetY = 10;
			context.shadowBlur = 9;

			context.fillRect(0, p1 - ph / 2, pw, ph);

			context.fillStyle = colors[1];
			context.fillRect(CanvasConstants.WIDTH - pw, p2 - ph / 2, pw, ph);

			context.fillStyle = colors[2];
			context.fillRect(bX - br, bY - br, bd, bd);
		}

		if (ctx.playSound && localStorage.getItem('mute') === 'true')
			audio.play().catch(/* IGNORED: Mostly because user disabled audio perms */);
	}, [ctx, theme]);

	return <canvas className="gameCanvas" id="canvas" ref={canvasRef} width={CanvasConstants.WIDTH} height={CanvasConstants.HEIGHT} />
}

export default GameCanvas;

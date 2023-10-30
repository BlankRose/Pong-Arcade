import {useEffect, useRef} from 'react'


function Game(props) {

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

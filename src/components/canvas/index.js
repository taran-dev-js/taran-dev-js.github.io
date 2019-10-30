import React, {Component} from 'react'

export class Canvas extends Component {
	shouldComponentUpdate (nextProps, nextState, nextContext) {
		return false
	}

	render () {
		const {canvasRef, width, height} = this.props;
		console.log('canvas update')
		return (
			<canvas ref={canvasRef} id="canvas" width={width} height={height}> </canvas>
		)
	}
}
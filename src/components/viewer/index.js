import React, { useState } from 'react'
import { Button } from '../button'
import { Canvas } from '../canvas'
import './styles.scss'
import { Header } from '../header'

export const Viewer = () => {
	// const [count, setCount] = useState(0);
	const setState = (count) => {
		// console.log(count, 'setState Viewer -----')
	}

	return (
		<div className="viewer">
			<Header count={0}/>
			<Canvas setState={setState}/>
			<div className="viewer__footer">
				<Button text="run"/>
				<Button text="set"/>
			</div>
		</div>
	)
}

import React from 'react'
import { Button } from '../button'

export const Viewer = () => {
	return (
		<div className="viewer">
			<div className="viewer__inner">
				<img src="https://via.placeholder.com/700x500?text=Web+Camera"
					 alt="img"/>
			</div>
			<Button text="run"/>
			<Button text="settings"/>
		</div>
	)
}


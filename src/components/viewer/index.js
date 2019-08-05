import React, { useEffect } from 'react'
import { Button } from '../button'
import './styles.scss'

export const Viewer = () => {
	const video = React.createRef()

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(stream => {
				video.current.srcObject = stream
			})
			.catch(err => {
				console.log(err)
			})
	})

	return (
		<div className="viewer">
			<div className="viewer__inner">
				<video ref={video} id="video" autoPlay> </video>
			</div>
			<div className="viewer__footer">
				<Button text="run"/>
				<Button text="set"/>
			</div>
		</div>
	)
}

import React, { useEffect } from 'react'
import { Button } from '../button'
import './styles.scss'

export const Viewer = () => {

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(stream => {
				const video = document.getElementById('video')
				video.srcObject = stream
			})
			.catch(err => {
				console.log(err)
			})
	})

	return (
		<div className="viewer">
			<div className="viewer__inner">
				<video id="video" autoPlay> </video>
			</div>
			<div className="viewer__footer">
				<Button text="run"/>
				<Button text="set"/>
			</div>
		</div>
	)
}

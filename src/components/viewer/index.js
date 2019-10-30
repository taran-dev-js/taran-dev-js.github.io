import React, { useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
// import * as Stats from 'stats.js'
import { Header } from '../header'
import { Canvas } from '../canvas'
import {renderPredictions} from './renderPredictions'

export const Viewer = () => {
	const videoRef = React.createRef();
	const canvasRef = React.createRef();
	const viewerRef = React.createRef();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const webCamPromise = navigator.mediaDevices
				.getUserMedia({
					audio: false,
					video: { facingMode: "environment" }
				})
				.then(stream => {
					window.stream = stream;
					videoRef.current.srcObject = stream;
					return new Promise((resolve, reject) => {
						videoRef.current.onloadedmetadata = () => {
							resolve();
						};
					});
				});
			const modelPromise = cocoSsd.load();

			Promise.all([modelPromise, webCamPromise])
				.then(values => {

					detectFrame(videoRef.current, values[0]);
				})
				.catch(error => {
					console.error(error);
				});
		}
	}, [])

	const detectFrame = (video, model) => {

		model.detect(video).then(predictions => {
			const personPrediction = mapPerson(predictions)

			setCount(personPrediction.length)
			if (canvasRef.current) {
				renderPredictions(personPrediction, canvasRef);
			}
			requestAnimationFrame(() => {
				detectFrame(video, model);
			});

		});

	};

	const mapPerson = prediction =>  prediction.filter(item => item.class === 'person')

	const windowWidth = () => window.innerWidth - 20

	const styles = {width: windowWidth()}

	return (
		<div className="container-fluid">
			<Header count={count}/>
			<div className="viewer" style={styles}>
				<video ref={videoRef} id="video" width={windowWidth()} height="700" autoPlay> </video>
				<Canvas canvasRef={canvasRef} width={windowWidth()} height="700"/>
			</div>
		</div>
	)
}


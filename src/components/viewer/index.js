import React, { useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { Header } from '../header'
import { Canvas } from '../canvas'

export const Viewer = () => {
	const videoRef = React.createRef();
	const canvasRef = React.createRef();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const webCamPromise = navigator.mediaDevices
				.getUserMedia({
					audio: false,
					video: { facingMode: "user" }
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
			const modelPromise = cocoSsd.load({modelUrl: 'http://127.0.0.1:8080/model/model.json'});
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
				renderPredictions(personPrediction);
			}
			requestAnimationFrame(() => {
				detectFrame(video, model);
			});
		});
	};

	const mapPerson = prediction =>  prediction.filter(item => item.class === 'person')

	const renderPredictions = predictions => {
		const ctx = canvasRef.current.getContext("2d");
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		const font = "16px sans-serif";
		ctx.font = font;
		ctx.textBaseline = "top";
		predictions.forEach(prediction => {
			const x = prediction.bbox[0];
			const y = prediction.bbox[1];
			const width = prediction.bbox[2];
			const height = prediction.bbox[3];
			// Draw the bounding box.
			ctx.strokeStyle = "#00FFFF";
			ctx.lineWidth = 4;
			ctx.strokeRect(x, y, width, height);
			// Draw the label background.
			ctx.fillStyle = "#00FFFF";
			const textWidth = ctx.measureText(prediction.class).width;
			const textHeight = parseInt(font, 10); // base 10
			ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
		});

		predictions.forEach(prediction => {
			const x = prediction.bbox[0];
			const y = prediction.bbox[1];
			// Draw the text last to ensure it's on top.
			ctx.fillStyle = "#000000";
			ctx.fillText(prediction.class, x, y);
		});
	};

	return (
		<div>
			<Header count={count}/>
			<div className="viewer">
				<video ref={videoRef} id="video" width="300" height="300" autoPlay> </video>
				<Canvas canvasRef={canvasRef}/>
			</div>
		</div>
	)
}


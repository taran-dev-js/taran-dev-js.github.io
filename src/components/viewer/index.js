import React, { useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
// import * as Stats from 'stats.js'
import { Header } from '../header'
import { Canvas } from '../canvas'
import {renderPredictions} from './renderPredictions'
import { ReactComponent  as SettingIcon } from '../../assets/gear.svg'
import { ReactComponent  as SaveIcon } from '../../assets/floppy-disk.svg'
import './style.scss'

export const Viewer = () => {
	const videoRef = React.createRef();
	const canvasRef = React.createRef();
	const viewerRef = React.createRef();
	const [count, setCount] = useState(0);
	const videoConfig = {
		audio: false,
		video: {
			facingMode: "environment",
			width: 720,
			height: 1280
		}
	}

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const webCamPromise = navigator.mediaDevices
				.getUserMedia(videoConfig)
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

					// detectFrame(videoRef.current, values[0]);
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

	return (
		<div className="container-fluid">
			<Header count={count}/>
			<div className="viewer">
				<video ref={videoRef} id="video" width={videoConfig.video.width/2} height={videoConfig.video.height/2} autoPlay> </video>
				<Canvas canvasRef={canvasRef}  width={videoConfig.video.width/2} height={videoConfig.video.height/2} />
			</div>
			<div className="btn-container">
				<button className="btn-blue"><SettingIcon width={18} height={18} fill="#fff"/></button>
				<button className="btn-blue"><SaveIcon width={18} height={18} fill="#fff"/></button>
			</div>
		</div>
	)
}


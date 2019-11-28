import React, { useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
// import * as posenet from '@tensorflow-models/posenet'
import { Header } from '../header'
import { Canvas } from '../canvas'
import { renderPredictions } from './renderPredictions'
import { ReactComponent as SettingIcon } from '../../assets/gear.svg'
import { ReactComponent as SaveIcon } from '../../assets/floppy-disk.svg'
import WebCam from 'react-webcam'
import './style.scss'

export const Viewer = () => {
	const canvasRef = React.createRef();
	const webcamRef = React.useRef(null);
	const [count, setCount] = useState(0);
	const [loader, setLoader] = useState(false);

	const videoConfig = {
		height: 720,
		width: 420
	};
	// const posenetConfig = {
	// 	architecture: 'MobileNetV1',
	// 	outputStride: 16,
	// 	// inputResolution: 449,
	// 	multiplier: 1.0,
	// }

	const startVideo = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const modelPromise = cocoSsd.load();
			// const poseNetLoad = posenet.load(posenetConfig)
			setLoader(true)

			Promise.all([modelPromise, /*poseNetLoad*/ ])
				.then(values => {
					setLoader(false)
					detectFrame(webcamRef.current.video, values[0]);
					// startPoseNet(canvasRef.current, webcamRef.current.video, values[1]);
				})
				.catch(error => {
					console.error(error);
				});
		}
	}

	const canvasVideo = () => {}

	useEffect(() => {
		startVideo()
	}, [])

	const detectFrame = (video, model) => {
		model.detect(video).then(predictions => {
			const personPrediction = mapPerson(predictions)

			setCount(personPrediction.length)

			if (canvasRef.current) renderPredictions(personPrediction, canvasRef);

			requestAnimationFrame(() => {
				detectFrame(video, model);
			});
		});
	};

	const videoConstraints = {
		width: videoConfig.height,
		height: videoConfig.width,
		audio: false,
		className: 'video',
		facingMode: "environment",
	};

	const mapPerson = prediction =>  prediction.filter(item => item.class === 'person')

	const styles = { height: videoConfig.height }

	return (
		<div className="container-fluid">
			<Header count={count}/>
			<div className={`viewer ${loader ? 'loader' : ''}`} style={styles}>
				<WebCam videoConstraints={videoConstraints}
						audio={false}
						width={videoConfig.width}
						height={videoConfig.height}
						onUserMedia={canvasVideo}
						ref={webcamRef}/>
				<Canvas canvasRef={canvasRef} width={videoConfig.width} height={videoConfig.height}/>
			</div>
			<div className="btn-container">
				<button className="btn-blue"><SaveIcon width={18} height={18} fill="#fff"/></button>
				<button className="btn-blue"><SettingIcon width={18} height={18} fill="#fff"/></button>
			</div>
		</div>
	)
}


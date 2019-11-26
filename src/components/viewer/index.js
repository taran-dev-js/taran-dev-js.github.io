import React, { useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as posenet from '@tensorflow-models/posenet'
import { Header } from '../header'
import { Canvas } from '../canvas'
import { renderPredictions } from './renderPredictions'
// import { handDetection } from './handDetection'
// import { drawKeypoints, drawSkeleton } from './drawUtils'
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
	const posenetConfig = {
		architecture: 'MobileNetV1',
		outputStride: 16,
		// inputResolution: 449,
		multiplier: 1.0,
	}

	const startVideo = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const modelPromise = cocoSsd.load();
			const poseNetLoad = posenet.load(posenetConfig)
			setLoader(true)

			Promise.all([modelPromise, poseNetLoad ])
				.then(values => {
					setLoader(false)
					detectFrame(webcamRef.current.video, values[0]);
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

	// const startPoseNet = (video, net) => {
	//
	// 	const width = webcamRef.current.video.clientWidth
	// 	const height = webcamRef.current.video.clientHeight
	// 	const canvas = canvasRef.current
	// 	const ctx = canvas.getContext('2d')
	// 	canvas.width = width
	// 	canvas.height = height
	//
	// 	async function poseDetectionFrame () {
	// 		let color = '#30ee08'
	// 		let poses = []
	// 		let minPoseConfidence
	// 		let minPartConfidence
	// 		let all_poses = await net.estimateMultiplePoses(video, {
	// 			flipHorizontal: false,
	// 			decodingMethod: 'multi-person',
	// 			maxDetections: 3,
	// 			scoreThreshold: 0.6,
	// 		})
	//
	// 		poses = poses.concat(all_poses)
	// 		minPoseConfidence = 0.15
	// 		minPartConfidence = 0.1
	// 		// console.log(poses)
	// 		ctx.clearRect(0, 0, width, height)
	// 		ctx.save()
	// 		ctx.scale(-1, 1)
	// 		ctx.drawImage(video, 0, 0, width, height)
	// 		ctx.restore()
	// 		poses.forEach(({ score, keypoints }) => {
	// 			if (score >= minPoseConfidence) {
	// 				if (!keypoints.slice(5, 11).every(x => x.score > minPartConfidence)) {
	// 					return
	// 				}
	// 				const handTrigger = handDetection(keypoints, height, width)
	// 				// if (handTrigger) alert(handTrigger)
	// 				color = handTrigger ? '#eeee33' : '#477eff';
	// 				drawSkeleton(keypoints, minPartConfidence, ctx, 1, color)
	// 				drawKeypoints(keypoints, minPartConfidence, ctx, 1, color)
	// 			}
	// 		})
	//
	// 		// detectFrame(webcamRef.current., cocossd, color);
	//
	// 		requestAnimationFrame(poseDetectionFrame)
	// 	}
	//
	// 	poseDetectionFrame()
	// }

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


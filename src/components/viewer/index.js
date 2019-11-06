import React, { useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
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
	const [heightCanvas, setHeight] = useState(0);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		setHeight(canvasRef.current.clientHeight)
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const modelPromise = cocoSsd.load();
			setLoader(true)

			Promise.all([modelPromise ])
				.then(values => {
					setLoader(false)
					detectFrame(webcamRef.current.video, values[0]);
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

			if (canvasRef.current) renderPredictions(personPrediction, canvasRef);

			requestAnimationFrame(() => {
				detectFrame(video, model);
			});
		});
	};

	const videoConstraints = {
		width: 720,
		height: 480,
		audio: false,
		facingMode: "environment",
	};


	const mapPerson = prediction =>  prediction.filter(item => item.class === 'person')

	const styles = {
		height: heightCanvas
	}

	return (
		<div className="container-fluid">
			<Header count={count}/>
			<div className={`viewer ${loader ? 'loader' : ''}`} style={styles}>
				<WebCam videoConstraints={videoConstraints}
						audio={false}
						height="720"
						width="480"
						ref={webcamRef}/>
				<Canvas canvasRef={canvasRef} width={480} height={720}/>
			</div>
			<div className="btn-container">
				<button className="btn-blue"><SettingIcon width={18} height={18} fill="#fff"/></button>
				<button className="btn-blue"><SaveIcon width={18} height={18} fill="#fff"/></button>
			</div>
		</div>
	)
}


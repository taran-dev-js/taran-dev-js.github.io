import { handDetection } from './handDetection'
import { drawKeypoints, drawSkeleton } from './drawUtils'

export const startPoseNet = (canvas, video, net) => {

	const width = video.clientWidth
	const height = video.clientHeight
	const ctx = canvas.getContext('2d')
	canvas.width = width
	canvas.height = height

	async function poseDetectionFrame () {
		let color = '#30ee08'
		let poses = []
		let minPoseConfidence
		let minPartConfidence
		let all_poses = await net.estimateMultiplePoses(video, {
			flipHorizontal: false,
			decodingMethod: 'multi-person',
			maxDetections: 3,
			scoreThreshold: 0.6,
		})

		poses = poses.concat(all_poses)
		minPoseConfidence = 0.15
		minPartConfidence = 0.1
		// console.log(poses)
		ctx.clearRect(0, 0, width, height)
		ctx.save()
		ctx.scale(-1, 1)
		ctx.drawImage(video, 0, 0, width, height)
		ctx.restore()
		poses.forEach(({ score, keypoints }) => {
			if (score >= minPoseConfidence) {
				if (!keypoints.slice(5, 11).every(x => x.score > minPartConfidence)) {
					return
				}
				const handTrigger = handDetection(keypoints, height, width)
				// if (handTrigger) alert(handTrigger)
				color = handTrigger ? '#eeee33' : '#477eff';
				drawSkeleton(keypoints, minPartConfidence, ctx, 1, color)
				drawKeypoints(keypoints, minPartConfidence, ctx, 1, color)
			}
		})

		// detectFrame(webcamRef.current., cocossd, color);

		requestAnimationFrame(poseDetectionFrame)
	}

	poseDetectionFrame()
}
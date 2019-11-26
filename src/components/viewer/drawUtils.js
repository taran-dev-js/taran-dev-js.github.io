import * as posenet from '@tensorflow-models/posenet'


const toTuple = ({y, x}) => {
	return [y, x];
}
const drawSegment = ([ay, ax], [by, bx], color, scale, ctx) => {
	ctx.beginPath();
	ctx.moveTo(ax * scale, ay * scale);
	ctx.lineTo(bx * scale, by * scale);
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	ctx.stroke();
}
const drawSkeleton = (keypoints, minConfidence, ctx, scale = 1, color) => {
	const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

	adjacentKeyPoints.forEach((keypoints) => {
		drawSegment(
			toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
			scale, ctx);
	});
}
const drawKeypoints = (keypoints, minConfidence, ctx, scale = 1, color) => {
	for (let i = 0; i < keypoints.length; i++) {
		const keypoint = keypoints[i];

		if (keypoint.score < minConfidence) {
			continue;
		}

		const {y, x} = keypoint.position;
		drawPoint(ctx, y * scale, x * scale, 3, color);
	}
}

const drawPoint = (ctx, y, x, r, color) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

const dist = (x1, y1, x2, y2) => Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );

const findAngle = (shoulder, elbow, wrist) => {
	const x3x1 = Math.sqrt(Math.pow(wrist.x - shoulder.x, 2) + Math.pow(wrist.y - shoulder.y, 2))
	const x3x2 = Math.sqrt(Math.pow(wrist.x - elbow.x, 2) + Math.pow(wrist.y - elbow.y, 2))
	const x2x1 = Math.sqrt(Math.pow(elbow.x - shoulder.x, 2) + Math.pow(elbow.y - shoulder.y, 2))
	const angle = Math.acos((x3x2 * x3x2 - x3x1 * x3x1 + x2x1 * x2x1) / (2 * x2x1 * x3x2))
	return angle * (180 / Math.PI) // angle in degrees
}
const renderPredictions = (predictions, color, canvas)=> {
	const ctx = canvas.current.getContext("2d");
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
		ctx.strokeStyle = color;
		ctx.lineWidth = 4;
		ctx.strokeRect(x, y, width, height);
		// Draw the label background.
		ctx.fillStyle = color;
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
}

export {drawKeypoints, drawSkeleton, dist, findAngle, renderPredictions}

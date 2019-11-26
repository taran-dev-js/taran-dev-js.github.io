import { dist, findAngle } from './drawUtils'

export const handDetection = (keyPoints, height, width) => {
	const minDistCoef = 0.15;
	const handSizeCoef = 0.6;
	const heightAboveShoulderThresh = 0.2
	const minAngle = 10;
	const maxAngle = 40;
	const shoulderWristCoeff = 0.4;
	let leftHand = true;
	let rightHand = true;

	const shoulderLeft = {
		x: keyPoints[5].position.x,
		y: keyPoints[5].position.y
	}
	const shoulderRight = {
		x: keyPoints[6].position.x,
		y: keyPoints[6].position.y
	}
	const elbowLeft = {
		x: keyPoints[7].position.x,
		y: keyPoints[7].position.y
	}
	const elbowRight = {
		x: keyPoints[8].position.x,
		y: keyPoints[8].position.y
	}
	const wristLeft = {
		x: keyPoints[9].position.x,
		y: keyPoints[9].position.y
	}
	const wristRight = {
		x: keyPoints[10].position.x,
		y: keyPoints[10].position.y
	}
	// console.log(shoulderLeft, 'shoulderLeft')
	// console.log(shoulderRight, 'shoulderRight')
	// console.log(elbowLeft, 'elbowLeft')
	// console.log(elbowRight, 'elbowRight')
	// console.log(wristLeft, 'wristLeft')
	// console.log(wristRight, 'wristRight')
	const elbowWristLeftDist = dist(elbowLeft.x, elbowLeft.y, wristLeft.x, wristLeft.y)
	const elbowWristRightDist = dist(elbowRight.x, elbowRight.y, wristRight.x, wristRight.y)
	const shoulderWristLeftDist = dist(shoulderLeft.x, shoulderLeft.y, wristLeft.x, wristLeft.y);
	const shoulderWristRightDist = dist(shoulderRight.x, shoulderRight.y, wristRight.x, wristRight.y);

	const shoulderElbowLeftDist = dist(shoulderLeft.x, shoulderLeft.y, elbowLeft.x, elbowLeft.y)
	const shoulderElbowRightDist = dist(shoulderRight.x, shoulderRight.y, elbowRight.x, elbowRight.y)

	const maxDistLeft = Math.max(shoulderElbowLeftDist, elbowWristLeftDist);
	const maxDistRight = Math.max(shoulderElbowRightDist, elbowWristRightDist);

	if (maxDistLeft < Math.max(height, width) * minDistCoef || ( Math.min(shoulderElbowLeftDist, elbowWristLeftDist) / maxDistLeft) < handSizeCoef ) leftHand = false

	if (maxDistRight < Math.max(height, width) * minDistCoef || ( Math.min(shoulderElbowRightDist, elbowWristRightDist) / maxDistRight) < handSizeCoef) rightHand = false

	const angleLeft = findAngle(shoulderLeft, elbowLeft, wristLeft)
	const angleRight = findAngle(shoulderRight, elbowRight, wristRight)

	const leftHandBool = leftHand && wristLeft.y - shoulderLeft.y < -heightAboveShoulderThresh * elbowWristLeftDist;
	const rightHandBool = rightHand && wristRight.y - shoulderRight.y < -heightAboveShoulderThresh * elbowWristRightDist

	if (leftHandBool || rightHandBool) {
		return true
	}

	const wristNotToCloseToShoulderL = shoulderWristLeftDist > elbowWristLeftDist * shoulderWristCoeff
	const wristNotToCloseToShoulderR = shoulderWristRightDist > elbowWristRightDist * shoulderWristCoeff

	if (leftHand && (minAngle < angleLeft  && angleLeft < maxAngle) && wristNotToCloseToShoulderL) {
		return true
	}

	if (rightHand && (minAngle < angleRight  && angleRight < maxAngle) && wristNotToCloseToShoulderR) {
		return true
	}

	return false;
}

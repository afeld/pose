import {
  Pose,
  Keypoint,
} from "@tensorflow-models/body-segmentation/dist/body_pix/impl/types";
import * as posedetection from "@tensorflow-models/pose-detection";
import Canvas from "./canvas";

const COLOR = "black";
const LINE_WIDTH = 6;

// based on
// https://github.com/tensorflow/tfjs-models/blob/a345f0c58522af25d80153ec27c6e999e45fdd42/pose-detection/demos/live_video/src/camera.js#L216-L233

function drawSegment(
  kp1: Keypoint,
  kp2: Keypoint,
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(kp1.position.x * scale, kp1.position.y * scale);
  ctx.lineTo(kp2.position.x * scale, kp2.position.y * scale);
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(
  keypoints: Keypoint[],
  scoreThreshold: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  // TODO pull model from Detector
  const model = posedetection.SupportedModels.MoveNet;
  posedetection.util.getAdjacentPairs(model).forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];

    // If score is null, just show the keypoint.
    const score1 = kp1.score != null ? kp1.score : 1;
    const score2 = kp2.score != null ? kp2.score : 1;

    if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
      drawSegment(kp1, kp2, COLOR, scale, ctx);
    }
  });
}

export default class Skeleton {
  keypoints: Keypoint[];

  constructor(pose: Pose) {
    this.keypoints = pose.keypoints;
  }

  draw(canvas: Canvas) {
    const ctx = canvas.context();
    drawSkeleton(this.keypoints, 0.1, ctx);
  }
}

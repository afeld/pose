import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import * as posedetection from "@tensorflow-models/pose-detection";
import Canvas from "./canvas";
import { MODEL } from "./detector";

const COLOR = "black";
const LINE_WIDTH = 6;

// based on
// https://github.com/tensorflow/tfjs-models/blob/4e8fa791175b9f637cbecdbc579ab71d3f35e48c/pose-detection/demos/live_video/src/camera.js/#L203-L234

class Camera {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Draw the skeleton of a body on the video.
   */
  drawSkeleton(keypoints: Keypoint[], scoreThreshold = 0) {
    const color = COLOR;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = LINE_WIDTH;

    posedetection.util.getAdjacentPairs(MODEL).forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
      }
    });
  }
}

export default class Skeleton {
  keypoints: Keypoint[];

  constructor(pose: Pose) {
    this.keypoints = pose.keypoints;
  }

  draw(canvas: Canvas) {
    const ctx = canvas.context();
    const camera = new Camera(ctx);
    camera.drawSkeleton(this.keypoints, 0.1);
  }
}

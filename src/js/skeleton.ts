import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import * as posedetection from "@tensorflow-models/pose-detection";
import Canvas from "./canvas";
import { MODEL } from "./detector";

const params = {
  DEFAULT_LINE_WIDTH: 6,
  STATE: {
    model: MODEL,
    modelConfig: {
      scoreThreshold: 0.1,
    },
  },
};

// based on
// https://github.com/tensorflow/tfjs-models/blob/4e8fa791175b9f637cbecdbc579ab71d3f35e48c/pose-detection/demos/live_video/src/camera.js#L203-L234

class Camera {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawSkeleton(keypoints: Keypoint[], color = "black") {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

    posedetection.util
      .getAdjacentPairs(params.STATE.model)
      .forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

        // If score is null, just show the keypoint.
        const score1 = kp1.score != null ? kp1.score : 1;
        const score2 = kp2.score != null ? kp2.score : 1;
        const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

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
  color: string;

  constructor(pose: Pose, color = "black") {
    this.keypoints = pose.keypoints;
    this.color = color;
  }

  draw(canvas: Canvas) {
    const ctx = canvas.context();
    const camera = new Camera(ctx);
    camera.drawSkeleton(this.keypoints, this.color);
  }
}

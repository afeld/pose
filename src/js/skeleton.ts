import { Pose, Keypoint } from "@tensorflow-models/body-pix/dist/types";
import * as posenet from "@tensorflow-models/posenet";
import { Vector2D } from "@tensorflow-models/posenet/dist/types";
import Canvas from "./canvas";

const COLOR = "aqua";
const LINE_WIDTH = 2;

// based on
// https://github.com/tensorflow/tfjs-models/blob/af59ff3eb3350986173ac8c8ae504806b02dad39/body-pix/demo/demo_util.js/#L81-L109

/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment(
  [ay, ax]: number[],
  [by, bx]: number[],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function toTuple({ y, x }: Vector2D) {
  return [y, x];
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      COLOR,
      scale,
      ctx
    );
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

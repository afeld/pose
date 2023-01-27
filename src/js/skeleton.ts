import { Keypoint, Pose } from "@tensorflow-models/pose-detection";
import * as posedetection from "@tensorflow-models/pose-detection";
import Canvas from "./canvas";
import { MODEL } from "./detector";
import * as colors from "./colors";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";

const params = {
  STATE: {
    model: MODEL,
    modelConfig: {
      scoreThreshold: 0.1,
    },
  },
};

/**
 * uses the Pythagorean theorem to calculate the distance between keypoints in 2D, or 3D (if available)
 */
const hypotenuse = (a: Keypoint, b: Keypoint) => {
  let sides = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  if (a.z && b.z) {
    // 3D
    sides += Math.pow(a.z - b.z, 2);
  }
  return Math.sqrt(sides);
};

/**
 * @returns the shoulder width, expected to be in the 100-1000 range
 */
export const getShoulderWidth = (keypoints: Keypoint[]) => {
  const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
  const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
  if (leftShoulder && rightShoulder) {
    return hypotenuse(leftShoulder, rightShoulder);
  } else {
    return null;
  }
};

// https://stats.stackexchange.com/a/281164
const scale = (
  value: number,
  r_min: number,
  r_max: number,
  t_min: number,
  t_max: number
) => {
  return ((value - r_min) * (t_max - t_min)) / (r_max - r_min) + t_min;
};

/**
 * scale the line width to give appearance of depth
 */
const calculateLineWidth = (keypoints: Keypoint[]) => {
  const shoulderWidth = getShoulderWidth(keypoints);

  // somewhat arbitrary values

  if (!shoulderWidth) {
    return 6;
  }

  const LINE_WIDTH_MIN = 1;
  const LINE_WIDTH_MAX = 15;
  const SHOULDER_WIDTH_MIN = 50;
  const SHOULDER_WIDTH_MAX = 200;

  return scale(
    shoulderWidth,
    SHOULDER_WIDTH_MIN,
    SHOULDER_WIDTH_MAX,
    LINE_WIDTH_MIN,
    LINE_WIDTH_MAX
  );
};

// based on
// https://github.com/tensorflow/tfjs-models/blob/4e8fa791175b9f637cbecdbc579ab71d3f35e48c/pose-detection/demos/live_video/src/camera.js#L203-L234
class Camera {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawSkeleton(keypoints: Keypoint[], { color = colors.BLACK, lineWidth = 6 }) {
    const colorStr = colors.toString(color);

    this.ctx.fillStyle = colorStr;
    this.ctx.strokeStyle = colorStr;
    this.ctx.lineWidth = lineWidth;

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
  color: Color;

  constructor(pose: Pose, color = colors.BLACK) {
    this.keypoints = pose.keypoints;
    this.color = color;
  }

  draw(canvas: Canvas) {
    const ctx = canvas.context();
    const camera = new Camera(ctx);

    ctx.lineCap = "round";

    const lineWidth = calculateLineWidth(this.keypoints);
    camera.drawSkeleton(this.keypoints, {
      color: this.color,
      lineWidth,
    });
  }
}

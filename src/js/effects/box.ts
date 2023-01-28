import Effect from "./effect";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import * as colors from "../utils/colors";
import Canvas from "../display/canvas";
import { Pose } from "@tensorflow-models/pose-detection";
import { min, max } from "lodash";

export default class Box extends Effect {
  color: Color;

  constructor() {
    super();
    this.color = colors.getNext();
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    const xS = pose.keypoints.map((keypoint) => keypoint.x);
    const yS = pose.keypoints.map((keypoint) => keypoint.y);
    const minX = min(xS) as number;
    const minY = min(yS) as number;
    const maxX = max(xS) as number;
    const maxY = max(yS) as number;
    const width = maxX - minX;
    const height = maxY - minY;

    const ctx = canvas.context();
    ctx.strokeStyle = colors.toString(this.color);
    ctx.lineWidth = 15;
    ctx.strokeRect(minX, minY, width, height);
  }

  /**
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const box = new Box();
    effects.push(box);
  }
}

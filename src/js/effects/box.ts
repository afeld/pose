import Effect from "./effect";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import * as colors from "../utils/colors";
import Canvas from "../display/canvas";
import { Pose } from "@tensorflow-models/pose-detection";
import { getBoundingBox } from "../utils/math";

export default class Box extends Effect {
  color: Color;

  constructor() {
    super();
    this.color = colors.getNext();
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    const bb = getBoundingBox(pose.keypoints);

    // give some padding around the sides and top to avoid cutting off the hands and head

    const xAdjust = bb.width * 0.2;
    const adjustedMinX = bb.minX - xAdjust;
    const adjustedMaxX = bb.maxX + xAdjust;
    const adjustedWidth = adjustedMaxX - adjustedMinX;

    const adjustedMinY = bb.minY - bb.height * 0.1;
    const adjustedHeight = bb.maxY - adjustedMinY;

    const ctx = canvas.context();
    ctx.strokeStyle = colors.toString(this.color);
    ctx.lineWidth = 15;
    ctx.strokeRect(adjustedMinX, adjustedMinY, adjustedWidth, adjustedHeight);
  }

  /**
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const box = new Box();
    effects.push(box);
  }
}

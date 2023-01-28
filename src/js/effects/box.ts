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
    const ctx = canvas.context();

    ctx.strokeStyle = colors.toString(this.color);
    ctx.lineWidth = 5;
    ctx.strokeRect(bb.minX, bb.minY, bb.width, bb.height);
  }

  /**
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const box = new Box();
    effects.push(box);
  }
}

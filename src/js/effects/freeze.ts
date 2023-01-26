import { Pose } from "@tensorflow-models/pose-detection";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import { getShoulderWidth } from "../skeleton";
import Effect from "./effect";
import * as colors from "../colors";

export default class Freeze extends Effect {
  color: Color;
  frame: Pose | undefined;

  constructor() {
    super();
    this.color = colors.getNext();
  }

  sortVal(_currentPose: Pose) {
    if (!this.frame) {
      return null;
    }
    return getShoulderWidth(this.frame.keypoints);
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    if (!this.frame) {
      this.frame = pose;
    }

    drawSkeleton(this.frame, canvas, this.color);
  }

  /**
   * Adds a Freeze to the list of effects.
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const freeze = new Freeze();
    effects.push(freeze);
  }
}

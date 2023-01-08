import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import { getShoulderWidth } from "../skeleton";
import Effect from "./effect";

export default class Freeze extends Effect {
  frame: Pose | undefined;

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

    drawSkeleton(this.frame, canvas);
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

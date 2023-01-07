import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";
import { drawMask } from "../segment_helpers";
import Effect from "./effect";

export default class Shadow implements Effect {
  onAnimationFrame(pose: Pose, canvas: Canvas) {
    if (pose?.segmentation) {
      drawMask(pose.segmentation, canvas.el);
    }
  }

  /**
   * Adds the Shadow to the list of effects if there isn't one already present.
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const hasShadow = effects.some((effect) => effect instanceof Shadow);
    if (!hasShadow) {
      const effect = new Shadow();
      effects.push(effect);
    }
  }
}

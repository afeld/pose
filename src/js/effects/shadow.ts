import { Pose } from "@tensorflow-models/pose-detection";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "../canvas";
import { drawMask } from "../segment_helpers";
import { getShoulderWidth } from "../skeleton";
import Effect from "./effect";
import * as colors from "../colors";

export default class Shadow extends Effect {
  color: Color;

  constructor() {
    super();
    this.color = colors.getNext();
  }

  sortVal(currentPose: Pose) {
    return getShoulderWidth(currentPose.keypoints);
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    if (pose?.segmentation) {
      await drawMask(pose.segmentation, canvas, this.color);
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
      // the Shadow needs to be first, because otherwise it overwrites the other effects
      effects.unshift(effect);
    }
  }
}

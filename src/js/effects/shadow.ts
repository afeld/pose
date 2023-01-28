import { Pose } from "@tensorflow-models/pose-detection";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "../display/canvas";
import { drawMask } from "../utils/segment_helpers";
import Effect from "./effect";
import * as colors from "../utils/colors";

export default class Shadow extends Effect {
  color: Color;

  constructor() {
    super();
    this.color = colors.getNext();
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

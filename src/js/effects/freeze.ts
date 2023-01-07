import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Freeze extends Effect {
  strokeWidth: number;
  frame: Pose | undefined;

  constructor(strokeWidth = 6) {
    super();
    this.strokeWidth = strokeWidth;
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    if (!this.frame) {
      this.frame = pose;
    }

    drawSkeleton(this.frame, canvas, { strokeWidth: this.strokeWidth });
  }

  /**
   * Adds a Freeze to the list of effects, increasing the size with each.
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const numFreezes = effects.reduce(
      (prev, effect) => (effect instanceof Freeze ? prev + 1 : prev),
      0
    );
    const strokeWidth = 6 + Math.pow(numFreezes, 1.5);

    const effect = new Freeze(strokeWidth);
    effects.push(effect);
  }
}

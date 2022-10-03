import { SemanticPersonSegmentation } from "@tensorflow-models/body-segmentation/dist/body_pix/impl/types";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Cannon implements Effect {
  delay: number;
  segmentations: SemanticPersonSegmentation[];

  // there isn't a way to retrieve from Stats, so hard code
  FRAMES_PER_SECOND = 17;

  /** @param delay - the amount of time to wait, in seconds */
  constructor(delay = 1) {
    this.delay = delay;
    this.segmentations = [];
  }

  onAnimationFrame(segmentation: SemanticPersonSegmentation, canvas: Canvas) {
    this.segmentations.push(segmentation);

    const numSegmentations = this.segmentations.length;
    const framesToKeep = this.delay * this.FRAMES_PER_SECOND;
    if (numSegmentations > 0) {
      // display the oldest saved frame
      const oldSeg = this.segmentations[0];
      drawSkeleton(oldSeg, canvas);

      if (numSegmentations > framesToKeep) {
        // shorten to most recent frames
        const numToShift = numSegmentations - framesToKeep;
        this.segmentations = this.segmentations.slice(numToShift);
      }
    }
  }

  /**
   * Adds a Cannon to the list of effects, delaying by one more second each time.
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    // increase the delay by one for each added
    const numCannons = effects.reduce(
      (prev, effect) => (effect instanceof Cannon ? prev + 1 : prev),
      0
    );
    const delay = numCannons + 1;
    const effect = new Cannon(delay);
    effects.push(effect);
  }
}

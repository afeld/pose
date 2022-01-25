import * as bodyPix from "@tensorflow-models/body-pix";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Cannon implements Effect {
  delay: number;
  segmentations: bodyPix.SemanticPersonSegmentation[];

  // there isn't a way to retrieve from Stats, so hard code
  FRAMES_PER_SECOND = 17;

  /** @param delay - the amount of time to wait, in seconds */
  constructor(delay = 1) {
    this.delay = delay;
    this.segmentations = [];
  }

  onAnimationFrame(
    segmentation: bodyPix.SemanticPersonSegmentation,
    canvas: Canvas
  ) {
    this.segmentations.push(segmentation);

    if (this.segmentations.length > this.delay * this.FRAMES_PER_SECOND) {
      const oldSeg = this.segmentations.shift();
      if (oldSeg) {
        drawSkeleton(oldSeg, canvas);
      }
    }
  }
}

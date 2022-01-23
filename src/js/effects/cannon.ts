import * as bodyPix from "@tensorflow-models/body-pix";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";

export default class Cannon {
  segmentations: bodyPix.SemanticPersonSegmentation[];

  // in seconds
  DELAY_TIME = 1;
  // there isn't a way to retrieve from Stats, so hard code
  FRAMES_PER_SECOND = 17;

  constructor() {
    this.segmentations = [];
  }

  onAnimationFrame(
    segmentation: bodyPix.SemanticPersonSegmentation,
    canvas: Canvas
  ) {
    this.segmentations.push(segmentation);

    if (this.segmentations.length > this.DELAY_TIME * this.FRAMES_PER_SECOND) {
      const oldSeg = this.segmentations.shift();
      if (oldSeg) {
        drawSkeleton(oldSeg, canvas);
      }
    }
  }
}

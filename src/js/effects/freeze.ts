import { SemanticPersonSegmentation } from "@tensorflow-models/body-pix";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Freeze implements Effect {
  frame: SemanticPersonSegmentation | undefined;

  onAnimationFrame(segmentation: SemanticPersonSegmentation, canvas: Canvas) {
    if (!this.frame) {
      this.frame = segmentation;
    }

    drawSkeleton(this.frame, canvas);
  }
}

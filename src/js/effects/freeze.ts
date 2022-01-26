import * as bodyPix from "@tensorflow-models/body-pix";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Freeze implements Effect {
  frame: bodyPix.SemanticPersonSegmentation | undefined;

  onAnimationFrame(
    segmentation: bodyPix.SemanticPersonSegmentation,
    canvas: Canvas
  ) {
    if (!this.frame) {
      this.frame = segmentation;
    }

    drawSkeleton(this.frame, canvas);
  }
}

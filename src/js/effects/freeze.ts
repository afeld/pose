import * as bodyPix from "@tensorflow-models/body-pix";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Freeze implements Effect {
  frame: bodyPix.SemanticPersonSegmentation | undefined;
  DURATION = 1000; // in milliseconds
  awaitingCapture = false;

  constructor() {
    document.addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        this.awaitingCapture = true;
      }
    });
  }

  onAnimationFrame(
    segmentation: bodyPix.SemanticPersonSegmentation,
    canvas: Canvas
  ) {
    if (this.awaitingCapture) {
      this.frame = segmentation;

      setTimeout(() => {
        this.frame = undefined;
      }, this.DURATION);

      this.awaitingCapture = false;
    }

    if (this.frame) {
      drawSkeleton(this.frame, canvas);
    }
  }
}

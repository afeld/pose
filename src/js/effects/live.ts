import { SemanticPersonSegmentation } from "@tensorflow-models/body-pix";
import Canvas from "../canvas";
import { drawMask } from "../segment_helpers";
import Effect from "./effect";

export default class Live implements Effect {
  frame: SemanticPersonSegmentation | undefined;

  onAnimationFrame(segmentation: SemanticPersonSegmentation, canvas: Canvas) {
    drawMask(segmentation, canvas.el);
  }
}

import * as bodyPix from "@tensorflow-models/body-pix";
import Canvas from "../canvas";

export default interface Effect {
  onAnimationFrame(
    segmentation: bodyPix.SemanticPersonSegmentation,
    canvas: Canvas
  ): void;
}

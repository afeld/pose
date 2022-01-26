import { SemanticPersonSegmentation } from "@tensorflow-models/body-pix";
import Canvas from "../canvas";

export default interface Effect {
  onAnimationFrame(
    segmentation: SemanticPersonSegmentation,
    canvas: Canvas
  ): void;
}

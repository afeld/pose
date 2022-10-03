import { SemanticPersonSegmentation } from "@tensorflow-models/body-segmentation/dist/body_pix/impl/types";
import Canvas from "../canvas";

export default interface Effect {
  onAnimationFrame(
    segmentation: SemanticPersonSegmentation,
    canvas: Canvas
  ): void;
}

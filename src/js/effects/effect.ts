import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";

export default interface Effect {
  onAnimationFrame(pose: Pose, canvas: Canvas): Promise<void>;
}

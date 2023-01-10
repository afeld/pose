import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";

export default abstract class Effect {
  abstract depth(currentPose: Pose): number | null;
  abstract onAnimationFrame(pose: Pose, canvas: Canvas): Promise<void>;

  // unable to make an abstract static method
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static addTo(_effects: Effect[]) {
    throw new Error("Not implemented");
  }
}

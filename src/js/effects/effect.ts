import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";

/**
 * @param effects gets modified
 */
export const sortEfects = (currentPose: Pose, effects: Effect[]) => {
  effects.sort((a, b) => {
    const aVal = a.sortVal(currentPose);
    const bVal = b.sortVal(currentPose);

    if (aVal && bVal) {
      if (aVal < bVal) {
        return -1;
      }
      if (aVal > bVal) {
        return 1;
      }
    }
    // a must be equal to b, or one doesn't have a sortVal()
    return 0;
  });
};

export default abstract class Effect {
  abstract sortVal(currentPose: Pose): number | null;
  abstract onAnimationFrame(pose: Pose, canvas: Canvas): Promise<void>;

  // unable to make an abstract static method
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static addTo(_effects: Effect[]) {
    throw new Error("Not implemented");
  }
}

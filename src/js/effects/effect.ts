import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../display/canvas";
import { getShoulderWidth } from "../utils/math";

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
  abstract onAnimationFrame(pose: Pose, canvas: Canvas): Promise<void>;

  sortVal(currentPose: Pose) {
    return getShoulderWidth(currentPose.keypoints);
  }

  // each Effect should probably implement a `static addTo()` method; the signature can be whatever is necessary
}

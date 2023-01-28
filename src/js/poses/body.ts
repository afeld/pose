import { Pose } from "@tensorflow-models/pose-detection";

/**
 * wrapper class for the Pose object returned by the PoseDetection API
 */
export default class Body {
  pose: Pose;

  constructor(pose: Pose) {
    this.pose = pose;
  }
}

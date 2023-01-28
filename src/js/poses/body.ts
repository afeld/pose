import { Pose } from "@tensorflow-models/pose-detection";
import { getMask } from "../utils/segment_helpers";

/**
 * wrapper class for the Pose object returned by the PoseDetection API
 */
export default class Body {
  pose: Pose;
  mask?: ImageData;

  constructor(pose: Pose) {
    this.pose = pose;
  }

  getSegmentation() {
    const segmentation = this.pose.segmentation;
    if (!segmentation) {
      throw new Error("pose.segmentation is undefined");
    }
    return segmentation;
  }

  /**
   * @returns a mask in the default color
   */
  async getMask() {
    if (!this.mask) {
      const segmentation = this.getSegmentation();
      this.mask = await getMask(segmentation);
    }
    return this.mask;
  }
}
